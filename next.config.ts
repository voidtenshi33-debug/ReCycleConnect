
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.offerup.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.genoxtech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.rs-online.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rukminim2.flixcart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "3dwombat.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.bhphotovideo.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dlcdnwebimgs.asus.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mos.cms.futurecdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.lenovoservicecenterinhyderabad.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sm.mashable.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.insider.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "telecomtalk.info",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dotpe.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.notebookcheck.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.cnet.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.redd.it",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.digit.in",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d57avc95tvxyg.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "akm-img-a-in.tosshub.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
