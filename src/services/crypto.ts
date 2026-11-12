// ==============================================================================
// SYLLABUSSYNC SECURITY & CRYPTO UTILITIES
// Standard SHA-256 password hashing & verification for student account protection
// ==============================================================================

const SALT = 'syllabussync_salt_2026_ktu';

/**
 * Computes a standard SHA-256 hash of the password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if plain text password matches the stored SHA-256 hash
 */
export async function verifyPasswordHash(password: string, storedHash?: string | null): Promise<boolean> {
  if (!storedHash) {
    // If account was created before passwords or empty password
    return true;
  }
  const computed = await hashPassword(password);
  return computed === storedHash;
}
