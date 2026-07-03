"use client";

import { useEffect, useState } from "react";

export const MswProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(
    process.env.NODE_ENV !== "development",
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
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
