/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
           
          },
        ],
      },
      webpack: (config, { isServer }) => {
        if (isServer) {
          // Ensure externals is defined and is an array
          if (!config.externals) {
            config.externals = [];
          }
          config.externals.push('nodemailer');
        }
        return config;
      },
      
};

export default nextConfig;
