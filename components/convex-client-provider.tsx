"use client";

import { useMemo, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // The client must be created once. Creating it during render tore it down and
  // reconnected on every render, resetting every live subscription.
  const client = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [],
  );

  // With no deployment configured (e.g. static builds) render children directly.
  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
