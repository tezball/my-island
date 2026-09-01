# Mobile Testing & Network Access Guide

How to run the full My Island stack and access it from phones on your home network and share it with a friend over the internet.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Find Your Local IP](#2-find-your-local-ip)
3. [Configuration Changes](#3-configuration-changes)
4. [Start the Stack](#4-start-the-stack)
5. [Access From Your Phone (LAN)](#5-access-from-your-phone-lan)
6. [Share With a Friend (Internet)](#6-share-with-a-friend-internet)
7. [Reverting Changes](#7-reverting-changes)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

- Docker and Docker Compose installed
- All project source code checked out
- Your machine and phone on the same WiFi network (for LAN testing)
- ~4GB free RAM for all containers (Postgres, Kafka, Zookeeper, LocalStack, API, Web, etc.)

## 2. Find Your Local IP

Your local IP is the address other devices on your home network will use to reach your machine.

```bash
# Linux
hostname -I | awk '{print $1}'

# macOS
ipconfig getifaddr en0

# Windows (PowerShell)
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi").IPAddress
```

It will look something like `192.168.1.42` or `192.168.0.15`. We'll refer to this as `YOUR_LAN_IP` throughout.

## 3. Configuration Changes

Three things need to change to allow non-localhost access:

### 3a. Create a Docker Compose override file

Create `docker-compose.override.yml` in the project root. This file automatically merges with `docker-compose.yml` without modifying it.

```yaml
# docker-compose.override.yml
# Overrides for LAN / mobile testing — do NOT commit this file
services:
  api:
    environment:
      # Allow the frontend to call the API from any origin (LAN IPs, tunnels, etc.)
      CORS_ALLOWED_ORIGINS: "*"
      # Tell Stripe callbacks / email links to use the LAN-accessible frontend
      FRONTEND_URL: "http://YOUR_LAN_IP:5173"

  web:
    environment:
      # The browser on your phone needs to reach the API directly
      # (Vite proxy only works for the dev server process, not for the browser)
      VITE_API_BASE_URL: "http://YOUR_LAN_IP:8080/api"
```

> Replace `YOUR_LAN_IP` with the actual IP from step 2.

### 3b. Update CORS to accept a configurable origin

The backend currently hardcodes CORS to `localhost:5173` and `localhost:3000`. Update `SecurityConfig.java` to read from an environment variable:

In `my-island-api/src/main/java/com/myisland/api/config/SecurityConfig.java`, change the `corsConfigurationSource()` method:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Read from env, fall back to localhost for normal dev
    String corsOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
    if (corsOrigins != null && corsOrigins.equals("*")) {
        configuration.setAllowedOriginPatterns(List.of("*"));
    } else if (corsOrigins != null) {
        configuration.setAllowedOrigins(
            Arrays.asList(corsOrigins.split(","))
        );
    } else {
        configuration.setAllowedOrigins(
            List.of("http://localhost:5173", "http://localhost:3000")
        );
    }

    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
    configuration.setExposedHeaders(List.of("Authorization"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

> **Why**: When your phone's browser loads the app from `http://192.168.x.x:5173`, it makes API calls to `http://192.168.x.x:8080`. The browser enforces CORS and will block these requests unless the API explicitly allows that origin.

### 3c. Vite `allowedHosts`

The Vite dev server already has `host: true` in `vite.config.ts`, which binds to `0.0.0.0`. You also need to ensure the LAN IP is allowed. The simplest fix is to add `allowedHosts: true` to accept any host header (fine for dev):

In `my-island-web/vite.config.ts`:

```ts
server: {
  host: true,
  allowedHosts: true,   // <-- add this line (allows any host header)
  proxy: { ... }
}
```

## 4. Start the Stack

```bash
# Rebuild the API image to pick up the CORS change
docker compose build api

# Start everything
docker compose up -d

# Verify all containers are healthy
docker compose ps
```

Wait ~60 seconds for the API to pass its health check (it has a `start_period: 60s`).

Confirm it's working from your machine:

```bash
# Frontend
curl -s http://YOUR_LAN_IP:5173 | head -5

# API health
curl -s http://YOUR_LAN_IP:8080/api/actuator/health
```

## 5. Access From Your Phone (LAN)

1. Make sure your phone is on the **same WiFi network** as your dev machine
2. Open your phone browser and go to: `http://YOUR_LAN_IP:5173`
3. You should see the My Island app
4. Test login with: `family@example.com` / `password`

### Image uploads

Images are stored in LocalStack S3 (port 4566). The image URLs returned by the API will contain `localhost:4566` by default. If images appear broken, you may need to set the S3 endpoint env var in the override:

```yaml
# Add to the api service in docker-compose.override.yml
AWS_S3_ENDPOINT: "http://YOUR_LAN_IP:4566"
```

## 6. Share With a Friend (Internet)

Your friend's phone is **not** on your home network, so they can't reach `192.168.x.x`. You have two options:

### Option A: Cloudflare Tunnel (Recommended — no router config needed)

Cloudflare Tunnel creates a secure tunnel from your machine to a public URL. No ports need to be opened on your router.

```bash
# Install cloudflared
# Linux (Debian/Ubuntu)
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# macOS
brew install cloudflared
```

You need **two tunnels** — one for the frontend, one for the API:

```bash
# Terminal 1 — Frontend tunnel
cloudflared tunnel --url http://localhost:5173

# Terminal 2 — API tunnel
cloudflared tunnel --url http://localhost:8080
```

Each command prints a public URL like `https://random-words.trycloudflare.com`.

Then update the environment so the frontend knows the API's public URL:

1. Note the API tunnel URL (e.g. `https://abc-def.trycloudflare.com`)
2. Stop the web container, update the override, restart:

```yaml
# docker-compose.override.yml — update for tunnel access
services:
  api:
    environment:
      CORS_ALLOWED_ORIGINS: "*"
      FRONTEND_URL: "https://FRONTEND_TUNNEL_URL"

  web:
    environment:
      VITE_API_BASE_URL: "https://API_TUNNEL_URL/api"
```

```bash
docker compose up -d web
```

3. Share the **frontend tunnel URL** with your friend

> Cloudflare quick tunnels are ephemeral — the URL changes each time you restart `cloudflared`. For persistent URLs, create a free Cloudflare account and set up a named tunnel.

### Option B: ngrok

Similar to Cloudflare Tunnel but requires a free account at [ngrok.com](https://ngrok.com).

```bash
# Install
# Linux
snap install ngrok
# macOS
brew install ngrok

# Authenticate (one-time)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start tunnels
ngrok http 5173  # Frontend
ngrok http 8080  # API (in another terminal, or use ngrok's config file)
```

Then update `docker-compose.override.yml` the same way as Option A with the ngrok URLs.

### Option C: Router Port Forwarding

If you want to use your actual public IP:

1. **Find your public IP**: Visit https://whatismyipaddress.com or run `curl -s ifconfig.me`
2. **Open your router admin** (usually `192.168.1.1` or `192.168.0.1`)
3. **Add port forwarding rules**:

   | External Port | Internal IP   | Internal Port | Protocol |
   |---------------|---------------|---------------|----------|
   | 5173          | YOUR_LAN_IP   | 5173          | TCP      |
   | 8080          | YOUR_LAN_IP   | 8080          | TCP      |

4. Update the override:

```yaml
services:
  api:
    environment:
      CORS_ALLOWED_ORIGINS: "*"
  web:
    environment:
      VITE_API_BASE_URL: "http://YOUR_PUBLIC_IP:8080/api"
```

5. Rebuild: `docker compose up -d web`
6. Share `http://YOUR_PUBLIC_IP:5173` with your friend

> **Security warning**: This exposes your dev machine's ports to the entire internet. Only keep port forwarding active while testing. Remove the rules when done.

> **ISP limitations**: Some ISPs block inbound connections or use CGNAT (Carrier-Grade NAT), which prevents port forwarding from working. If your public IP starts with `100.64.x.x` or port forwarding doesn't work, use Option A or B instead.

## 7. Reverting Changes

When you're done testing:

```bash
# Remove the override file
rm docker-compose.override.yml

# Stop tunnels (Ctrl+C in their terminals)

# Remove router port forwarding rules if you added any

# Rebuild API with original CORS settings
docker compose build api
docker compose up -d
```

The `SecurityConfig.java` change is safe to keep — it only activates when `CORS_ALLOWED_ORIGINS` is set, and falls back to the original localhost behaviour otherwise.

The `allowedHosts: true` in `vite.config.ts` is also safe to keep for dev.

## 8. Troubleshooting

### "CORS error" in phone browser console

- Verify `CORS_ALLOWED_ORIGINS` is set in the API container: `docker compose exec api env | grep CORS`
- Rebuild the API image if you changed `SecurityConfig.java`: `docker compose build api && docker compose up -d api`

### Phone can't reach the app at all

- Confirm your phone and machine are on the same WiFi
- Check your machine's firewall allows inbound on ports 5173, 8080:
  ```bash
  # Linux (ufw)
  sudo ufw allow 5173/tcp
  sudo ufw allow 8080/tcp

  # Or temporarily disable
  sudo ufw disable
  ```
- Try pinging your machine from another device

### API health check fails

- Wait 60+ seconds after `docker compose up` (the API has a slow start period)
- Check logs: `docker compose logs -f api`

### Images not loading

- LocalStack S3 URLs may reference `localhost`. Set `AWS_S3_ENDPOINT` to your LAN IP in the override
- Also forward port 4566 if your friend needs to see images

### Cloudflare tunnel HTTPS + HTTP API mismatch

- Cloudflare tunnels serve HTTPS. If the frontend tunnel is HTTPS but tries to call an HTTP API, the browser blocks it as mixed content
- Solution: Use tunnels for **both** frontend and API — both will be HTTPS

### Friend sees "connection refused"

- If using port forwarding: verify the rules are active, check your public IP hasn't changed, confirm your ISP doesn't block inbound traffic
- If using tunnels: make sure the tunnel processes are still running
