import { signRequest } from "@worldcoin/idkit-core/signing";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rpId = process.env.WORLD_ID_RP_ID || process.env.NEXT_PUBLIC_RP_ID || "rp_013fbbe37584c9e5";
  const signingKey = process.env.WORLD_ID_SIGNING_KEY || process.env.RP_SIGNING_KEY;

  if (!rpId || !signingKey) {
    return res.status(503).json({ error: "WORLD_ID_SIGNING_KEY not configured on server" });
  }

  const action = req.query?.action || "rcol-hub-access";

  try {
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: signingKey,
      action,
      ttl: 300
    });

    return res.status(200).json({
      rp_context: {
        rp_id: rpId,
        nonce,
        created_at: createdAt,
        expires_at: expiresAt,
        signature: sig
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "signing failed" });
  }
}
