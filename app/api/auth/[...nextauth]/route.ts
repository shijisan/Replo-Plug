import { handlers } from "@/lib/auth";

export const runtime = "nodejs"; // 🧠 This is the key line

export const { GET, POST } = handlers;
