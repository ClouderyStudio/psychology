import { createInternalToken } from "../../utils/internal-auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}) as Record<string, unknown>);
  const { password } = body ?? {};

  const expected = process.env.NITRO_INTERNAL_TEST_PASSWORD || "yunshu";

  if (typeof password === "string" && password === expected) {
    setCookie(event, "internal_authed", createInternalToken(), {
      httpOnly: false, // 路由守卫（客户端）需要读取该 cookie
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });
    return { success: true, authed: true };
  }

  throw createError({
    statusCode: 401,
    statusMessage: "密码错误",
  });
});
