// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  // Configure webpack for MongoDB
  webpack: (config, { isServer }) => {
    // Handle MongoDB OIDC auth
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        timers: false,
        async_hooks: false,
        'mongodb-client-encryption': false,
        'aws4': false,
        'snappy': false,
        'gcp-metadata': false,
        'kerberos': false,
        '@mongodb-js/zstd': false,
        'supports-color': false,
        'socks': false,
        'http2': false,
        'mongodb': false
      };
    }

    // Add a rule to handle the problematic MongoDB OIDC files
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/mongodb/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    });

    return config;
  },
  // Configure experimental features
  experimental: {
    // Use serverComponentsExternalPackages for MongoDB
    serverComponentsExternalPackages: ['mongodb', 'mongodb-client-encryption']
  }
};

module.exports = nextConfig;
