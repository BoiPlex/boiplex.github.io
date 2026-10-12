import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["three"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
			},
			{
				protocol: "https",
				hostname: "*",
			},
		],
	},
};

export default nextConfig;
