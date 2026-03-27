import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Vimperaci", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  if (!BASIC_AUTH_USERNAME || !BASIC_AUTH_PASSWORD) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  try {
    const encodedCredentials = authHeader.slice(6);
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return unauthorizedResponse();
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    if (username !== BASIC_AUTH_USERNAME || password !== BASIC_AUTH_PASSWORD) {
      return unauthorizedResponse();
    }

    return NextResponse.next();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
