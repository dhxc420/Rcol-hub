export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rp_id, idkitResponse } = req.body || {};
  if (!rp_id || !idkitResponse) {
    return res.status(400).json({ error: "Missing rp_id or idkitResponse" });
  }

  try {
    const response = await fetch(`https://developer.world.org/api/v4/verify/${rp_id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(idkitResponse)
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(400).json({ error: "Verification failed", detail });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "verify request failed" });
  }
}
