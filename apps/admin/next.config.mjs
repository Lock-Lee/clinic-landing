/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db", "clinic-starter-demo", "clinic-demo", "clinic-full-demo"],
};
export default nextConfig;
