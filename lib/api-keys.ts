import { createHash, randomBytes } from "node:crypto";

// API keys are issued as `sk_live_<40 hex chars>`. We persist only the SHA-256 hash;
// the plaintext is returned to the user exactly once at creation time.

const PREFIX = "sk_live";

export function generateApiKey() {
  const secret = randomBytes(20).toString("hex"); // 40 hex chars
  const key = `${PREFIX}_${secret}`;
  return {
    key, // show once
    keyHash: hashApiKey(key),
    keyPrefix: PREFIX,
    last4: secret.slice(-4),
  };
}

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

// Display label for a stored key, e.g. "sk_live_••••…a1b2"
export function maskedLabel(keyPrefix: string, last4: string) {
  return `${keyPrefix}_••••…${last4}`;
}
