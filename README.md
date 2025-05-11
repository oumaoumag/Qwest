# Qwest

This is a [Next.js](https://nextjs.org) project built with [MiniKit](https://docs.base.org/builderkits/minikit/overview), configured with:

- [MiniKit](https://docs.base.org/builderkits/minikit/overview) - Base's UI toolkit for Farcaster Frames
- [OnchainKit](https://www.base.org/builders/onchainkit) - Base's toolkit for building onchain apps
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Next.js](https://nextjs.org/docs) - React framework for production

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Verify environment variables:

You can regenerate the FARCASTER Account Association environment variables by running `npx create-onchain --manifest` in your project directory.

```bash
# Required for Frame metadata
NEXT_PUBLIC_URL=
NEXT_PUBLIC_VERSION=
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_IMAGE_URL=
NEXT_PUBLIC_SPLASH_IMAGE_URL=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=

# Required to allow users to add your frame
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=

# Required for webhooks and background notifications
REDIS_URL=
REDIS_TOKEN=
```

3. Start the development server:
```bash
npm run dev
```

## Features

### Daily Planner
- Create and manage time blocks for your day
- Categorize activities (work, personal, health, learning, social)
- Track completion status of tasks
- Edit and delete time blocks

### Frame Configuration
- `.well-known/farcaster.json` endpoint configured for Frame metadata and account association
- Frame metadata automatically added to page headers in `layout.tsx`

### Background Notifications
- Redis-backed notification system using Upstash
- Ready-to-use notification endpoints in `api/notify` and `api/webhook`

### Theming
- Custom theme with OnchainKit variables
- Dark/light mode support through OnchainKit

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
