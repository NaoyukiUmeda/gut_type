/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export" は削除（API Routes / Server Components を使うため）
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
