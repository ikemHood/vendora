import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { env } from "~/env";

const JWT_SECRET = env.JWT_SECRET || "your-secret-key";

export async function middleware(request: NextRequest) {
    // Check if the request is for a dashboard route
    if (request.nextUrl.pathname.startsWith("/(dashboard)")) {
        const token = request.cookies.get("access_token")?.value;

        if (!token) {
            // Redirect to login if no token is present
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            // Verify the token
            verify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            // If token is invalid, redirect to login
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/(dashboard)/:path*"],
}; 