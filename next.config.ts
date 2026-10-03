import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server blocks cross-origin requests to its dev-only endpoints,
  // including the hot-reload socket, unless the origin is listed. A stack serves
  // this app at <namespace>-hello-next.pub.<stack-control env>.springtest.us.
  allowedDevOrigins: ["**.springtest.us"],
};

export default nextConfig;
