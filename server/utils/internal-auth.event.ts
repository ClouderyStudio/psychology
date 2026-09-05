import type { H3Event } from "h3";
import { validateInternalToken } from "./internal-auth";

/** 从请求的 internal_authed cookie 校验访问令牌 */
export function isInternalAuthed(event: H3Event): boolean {
  return validateInternalToken(getCookie(event, "internal_authed"));
}
