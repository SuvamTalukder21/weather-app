// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// module.exports = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'openweathermap.org',
//         //   port: '',
//         //   pathname: '/account123/**',
//         },
//       ],
//     },
//   }

export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
    ],
  },
};
