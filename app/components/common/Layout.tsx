"use client";

import { ReactNode, useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/button";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  showWallet?: boolean;
  showSaveFrame?: boolean;
};

export default function Layout({
  children,
  title = "Qwest",
  showWallet = true,
  showSaveFrame = true
}: LayoutProps) {
  const miniKit = useMiniKit();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  // Use the showWallet and showSaveFrame props to conditionally render elements
  const shouldShowWalletInfo = showWallet && miniKit;
  const shouldShowSaveFrame = showSaveFrame;

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-foreground)]">
      <div className="max-w-md mx-auto">
        <header className="sticky top-0 z-40 bg-[var(--app-background)]/80 backdrop-blur-sm border-b border-[var(--app-card-border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            {shouldShowWalletInfo && (
              <div className="text-xs text-[var(--app-foreground-muted)]">
                MiniKit Ready
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4">
          {children}
        </main>

        {shouldShowSaveFrame && (
          <footer className="mt-8 pt-4 pb-6 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--ock-text-foreground-muted)] text-xs"
              onClick={() => window.open("https://base.org/builders/minikit", "_blank")}
            >
              Built on Base with MiniKit
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
}
