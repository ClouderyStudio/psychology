import { examPapers } from "../../data/exam";
import { isInternalAuthed } from "../../utils/internal-auth.event";

export default defineEventHandler((event) => {
  if (!isInternalAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "未授权访问" });
  }
  return examPapers;
});
