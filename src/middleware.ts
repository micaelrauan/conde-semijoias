import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MAINTENANCE_PATH = "/manutencao";
const MAINTENANCE_ALLOWLIST = ["/api/webhooks/nuvemshop", MAINTENANCE_PATH];

function isMaintenanceEnabled(): boolean {
  const value = process.env.MAINTENANCE_MODE?.toLowerCase();
  return value === "1" || value === "true" || value === "on";
}

function shouldBypassMaintenance(pathname: string): boolean {
  return MAINTENANCE_ALLOWLIST.some((path) => pathname.startsWith(path));
}

function handleMaintenance(request: Request): NextResponse | null {
  if (!isMaintenanceEnabled()) {
    return null;
  }

  const url = new URL(request.url);
  if (shouldBypassMaintenance(url.pathname)) {
    return null;
  }

  return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
}

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

const middleware = hasClerkEnv
  ? clerkMiddleware((auth, request) => {
      const maintenance = handleMaintenance(request);
      if (maintenance) return maintenance;
      return NextResponse.next();
    })
  : (request: Request) => {
      const maintenance = handleMaintenance(request);
      if (maintenance) return maintenance;
      return NextResponse.next();
    };

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
