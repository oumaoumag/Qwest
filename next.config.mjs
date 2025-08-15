/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings and optimize for older Node.js versions
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: false, // Disable minification to reduce memory usage
    };
    return config;
  },
  // Disable some features that might cause issues
  swcMinify: false,
  experimental: {
    esmExternals: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.coinbase.com https://base-mainnet.g.alchemy.com https://base.blockscout.com wss://base-mainnet.g.alchemy.com; frame-src 'self' https://wallet.farcaster.xyz;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
