export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rpId = process.env.WORLD_ID_RP_ID || process.env.NEXT_PUBLIC_RP_ID || "rp_013fbbe37584c9e5";
  if (!rpId) {
    return res.status(503).json({ error: "RP no configurado" });
  }

  let proof = req.body;
  if (typeof proof === "string") {
    try {
      proof = JSON.parse(proof);
    } catch {
      return res.status(400).json({ error: "Cuerpo invalido" });
    }
  }
  if (!proof || typeof proof !== "object") {
    return res.status(400).json({ error: "Cuerpo invalido" });
  }

  try {
    const worldRes = await fetch(`https://developer.world.org/api/v4/verify/${rpId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proof)
    });

    const data = await worldRes.json();

    if (!worldRes.ok || !data.success) {
      return res.status(worldRes.ok ? 400 : worldRes.status).json({
        error: data.code ?? "verification_failed",
        detail: data.detail
      });
    }

    const nullifiers = (data.results ?? [])
      .filter((r) => r.success !== false && r.nullifier)
      .map((r) => r.nullifier);

    if (nullifiers.length === 0 && data.nullifier) {
      nullifiers.push(data.nullifier);
    }

    return res.status(200).json({ success: true, nullifiers });
  } catch (error) {
    return res.status(502).json({ error: error.message || "Error de red al contactar World" });
  }
}
