/** GIS checks window.location.origin. Google treats localhost and 127.0.0.1 as different. */

export function gisInitializeConfig<TCallback, TError>(
  clientId: string,
  callback: TCallback,
  errorCallback?: TError,
): {
  client_id: string
  callback: TCallback
  error_callback?: TError
  ux_mode: "popup"
} {
  return {
    client_id: clientId,
    callback,
    error_callback: errorCallback,
    ux_mode: "popup",
  }
}

/** Return a localhost URL when the page is on 127.0.0.1; otherwise null (no redirect). */
export function gisCanonicalUrl(href: string): string | null {
  const url = new URL(href)
  if (url.hostname !== "127.0.0.1") return null
  url.hostname = "localhost"
  return url.toString()
}

export function gisOriginMismatchMessage(origin: string): string {
  return `Google Sign-In origin ${origin} is not on the Web client. Use http://localhost:5173 or https://fishing-journals.com. Developer: Google Auth Platform → Clients → Web application → Authorized JavaScript origins.`
}
