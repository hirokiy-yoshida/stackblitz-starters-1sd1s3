import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    shopId: string | null;
  }

  interface Session {
    user: User & {
      role: Role;
      shopId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    shopId: string | null;
  }
}