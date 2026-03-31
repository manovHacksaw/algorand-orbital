import type { NextConfig } from "next";
import { docsRedirectAliases } from "./lib/docs-config";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return docsRedirectAliases.map((redirect) => ({
      ...redirect,
      permanent: false,
    }));
  },
};

export default nextConfig;
