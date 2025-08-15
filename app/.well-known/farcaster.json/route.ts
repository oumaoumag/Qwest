export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://qwest-topaz.vercel.app";
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Qwest";
  const version = process.env.NEXT_PUBLIC_VERSION || "1.0.0";
  const iconUrl = process.env.NEXT_PUBLIC_ICON_URL || `${URL}/logo.png`;
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || `${URL}/logo.png`;
  const splashImageUrl = process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL || `${URL}/logo.png`;
  const splashBackgroundColor = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "7c3aed";

  // Ensure hex color is properly formatted (remove # if present, then add it)
  const formattedColor = splashBackgroundColor.replace('#', '');
  const validHexColor = /^[0-9A-Fa-f]{6}$/.test(formattedColor) ? `#${formattedColor}` : "#7c3aed";

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    frame: {
      version,
      name: projectName,
      homeUrl: URL,
      iconUrl,
      imageUrl,
      buttonTitle: `Launch ${projectName}`,
      splashImageUrl,
      splashBackgroundColor: validHexColor,
      webhookUrl: `${URL}/api/webhook`,
    },
  });
}
