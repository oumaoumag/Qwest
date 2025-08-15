import './theme.css';
import '@coinbase/onchainkit/styles.css';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://qwest-topaz.vercel.app";
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Qwest";
  const version = process.env.NEXT_PUBLIC_VERSION || "1.0.0";
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || `${URL}/logo.png`;
  const splashImageUrl = process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL || `${URL}/logo.png`;
  const splashBackgroundColor = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "7c3aed";

  // Ensure hex color is properly formatted (remove # if present, then add it)
  const formattedColor = splashBackgroundColor.replace('#', '');
  const validHexColor = /^[0-9A-Fa-f]{6}$/.test(formattedColor) ? `#${formattedColor}` : "#7c3aed";

  return {
    title: projectName,
    description: "A gamified productivity app built on Base with MiniKit - Transform your goals into quests and level up your life!",
    other: {
      "fc:frame": JSON.stringify({
        version,
        imageUrl,
        button: {
          title: `Launch ${projectName}`,
          action: {
            type: "launch_frame",
            name: projectName,
            url: URL,
            splashImageUrl,
            splashBackgroundColor: validHexColor,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
