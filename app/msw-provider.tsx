"use client";

import { useEffect, useState } from "react";

// The MSW worker is this app's backend: it serves every /api/* route in both
// development and production builds. Set NEXT_PUBLIC_API_MOCKING=disabled at
// build time once a real backend owns those routes.
const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING !== "disabled";

export const MswProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) {
      return;
    }

    const enableMocking = async () => {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      setIsReady(true);
    };

    enableMocking();
  }, []);

  if (!isReady) {
    return null;
  }

  return children;
};
