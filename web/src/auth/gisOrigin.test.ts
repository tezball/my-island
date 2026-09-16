import { describe, expect, it } from "vitest"
import { gisCanonicalUrl, gisInitializeConfig, gisOriginMismatchMessage } from "./gisOrigin"

describe("gisCanonicalUrl", () => {
  it("moves 127.0.0.1:5173 to localhost keeping path and query", () => {
    expect(gisCanonicalUrl("http://127.0.0.1:5173/places/torc?view=map")).toBe(
      "http://localhost:5173/places/torc?view=map",
    )
  })

  it("leaves localhost and mock-prod origins alone", () => {
    expect(gisCanonicalUrl("http://localhost:5173/")).toBeNull()
    expect(gisCanonicalUrl("https://fishing-journals.com/")).toBeNull()
    expect(gisCanonicalUrl("https://app.fishing-journals.com/")).toBeNull()
  })
})

describe("gisInitializeConfig", () => {
  it("does not send origin or login_uri (GIS uses the page origin)", () => {
    const cfg = gisInitializeConfig("client.apps.googleusercontent.com", () => undefined, () => undefined)
    expect(cfg.ux_mode).toBe("popup")
    expect(cfg.client_id).toContain("googleusercontent.com")
    expect(cfg).not.toHaveProperty("origin")
    expect(cfg).not.toHaveProperty("login_uri")
  })
})

describe("gisOriginMismatchMessage", () => {
  it("names the Console field", () => {
    const msg = gisOriginMismatchMessage("http://127.0.0.1:5173")
    expect(msg).toContain("Authorized JavaScript origins")
    expect(msg).toContain("http://localhost:5173")
    expect(msg).not.toContain("production")
  })
})
