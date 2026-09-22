import { describe, expect, it } from "vitest"
import { isSignupPassword } from "./auth"

describe("isSignupPassword", () => {
  it("requires 8 to 72 characters", () => {
    expect(isSignupPassword("short")).toBe(false)
    expect(isSignupPassword("password1")).toBe(true)
  })
})
