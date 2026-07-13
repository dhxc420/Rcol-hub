/**
 * World ID via IDKitRequestWidget (mismo flujo que Vuela RCOL).
 * Carga React + @worldcoin/idkit bajo demanda al pulsar Aprobar.
 */
import React, { useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { IDKitRequestWidget, orbLegacy } from "https://esm.sh/@worldcoin/idkit@4.2.0?deps=react@18.3.1,react-dom@18.3.1";

let root = null;

function getHost() {
  return document.getElementById("worldIdWidgetHost");
}

function WorldIdRunner({ appId, action, rpContext, signal, resolve, reject }) {
  const [open, setOpen] = useState(true);
  const nullifierRef = useRef("");

  async function handleVerify(result) {
    const res = await fetch("/api/world-id/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || data.detail || "verification_failed");
    }
    nullifierRef.current = data.nullifiers?.[0] || "verified";
  }

  function cleanup() {
    const host = getHost();
    if (host) host.hidden = true;
    root?.render(null);
  }

  return React.createElement(IDKitRequestWidget, {
    open,
    onOpenChange(next) {
      setOpen(next);
      if (!next) cleanup();
    },
    app_id: appId,
    action,
    rp_context: rpContext,
    allow_legacy_proofs: true,
    preset: orbLegacy({ signal }),
    handleVerify,
    onSuccess() {
      setOpen(false);
      cleanup();
      resolve(nullifierRef.current || "verified");
    },
    onError(code) {
      setOpen(false);
      cleanup();
      const err = String(code || "verification_failed");
      if (err === "user_rejected") reject(new Error("user_rejected"));
      else reject(new Error(err));
    },
    autoClose: true,
    language: "es"
  });
}

export function runWorldIdVerify({ appId, action, rpContext, signal = "" }) {
  return new Promise((resolve, reject) => {
    const host = getHost();
    if (!host) {
      reject(new Error("widget_host_missing"));
      return;
    }

    host.hidden = false;
    if (!root) root = createRoot(host);

    root.render(
      React.createElement(WorldIdRunner, {
        appId,
        action,
        rpContext,
        signal,
        resolve,
        reject
      })
    );
  });
}
