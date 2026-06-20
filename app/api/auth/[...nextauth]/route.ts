import NextAuth from "next-auth";

export { dynamic } from "@/lib/api-dynamic";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
