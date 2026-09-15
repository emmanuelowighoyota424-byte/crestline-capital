"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // When no Convex URL is configured (e.g. static builds), render children directly
  if (!convexUrl) {
    return <>{children}</>;
  }

  const client = new ConvexReactClient(convexUrl);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
