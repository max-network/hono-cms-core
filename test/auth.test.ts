import { describe, expect, it } from "vitest"
import { hashPassword, verifyPassword } from "@max-network/worker-utils"
import { generateSessionId, legacyPasswordMatches } from "../src/lib/auth.js"

const STORED = "0123456789abcdef0123456789abcdef:fa90dc5f07ce8f461f7f06addaaee9fcc46d9e65ab9508b49f3e40d3d8ba7463"

describe("password hashing", () => {
  it("verifies a pre-0.11 salt:sha256 hash and asks for a rehash", async () => {
    expect(await verifyPassword("correct horse", STORED, legacyPasswordMatches)).toEqual({ ok: true, needsRehash: true })
    expect((await verifyPassword("wrong horse", STORED, legacyPasswordMatches)).ok).toBe(false)
    expect((await verifyPassword("correct horse", "no-separator", legacyPasswordMatches)).ok).toBe(false)
  })

  it("verifies a rehashed PBKDF2 password with the same legacy hook in place", async () => {
    const stored = await hashPassword("correct horse")
    expect(await verifyPassword("correct horse", stored, legacyPasswordMatches)).toEqual({ ok: true, needsRehash: false })
  })

  it("mints 64-hex session ids", () => {
    expect(generateSessionId()).toMatch(/^[0-9a-f]{64}$/)
  })
})
