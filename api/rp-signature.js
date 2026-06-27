import { signRequest } from "@worldcoin/idkit-core/signing";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signingKeyHex = process.env.WORLD_ID_SIGNING_KEY || process.env.RP_SIGNING_KEY;
  if (!signingKeyHex) {
    return res.status(503).json({ error: "WORLD_ID_SIGNING_KEY not configured on server" });
  }

  const action = req.body?.action || "rcol-hub-access";

  try {
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex,
      action
    });

    return res.status(200).json({
      sig,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "signing failed" });
  }
}
