import { describe, expect, it } from "vitest"
import { generateSessionId, hashPassword, verifyPassword } from "../src/lib/auth.js"

const STORED = "0123456789abcdef0123456789abcdef:fa90dc5f07ce8f461f7f06addaaee9fcc46d9e65ab9508b49f3e40d3d8ba7463"

describe("password hashing", () => {
  it("still verifies a hash stored in the salt:sha256(salt + password) format", async () => {
    expect(await verifyPassword("correct horse", STORED)).toBe(true)
    expect(await verifyPassword("wrong horse", STORED)).toBe(false)
    expect(await verifyPassword("correct horse", "no-separator")).toBe(false)
  })

  it("round-trips a fresh hash with a 32-hex salt", async () => {
    const stored = await hashPassword("s3cret")
    expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{64}$/)
    expect(await verifyPassword("s3cret", stored)).toBe(true)
  })

  it("mints 64-hex session ids", () => {
    expect(generateSessionId()).toMatch(/^[0-9a-f]{64}$/)
  })
})
