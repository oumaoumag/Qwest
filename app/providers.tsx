"use client";

import { type ReactNode } from "react";
import { base } from "viem/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { RewardsProvider } from "./components/context/RewardsContext";
import { ToastProvider } from "./components/context/ToastContext";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <RewardsProvider>
        <ToastProvider>
        {props.children}
        </ToastProvider>
      </RewardsProvider>
    </MiniKitProvider>
  );
}
