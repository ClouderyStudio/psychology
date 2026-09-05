export default defineEventHandler((event) => {
  deleteCookie(event, "internal_authed", { path: "/" });
  return { success: true, authed: false };
});
