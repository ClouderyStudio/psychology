import { examPapers } from "../../../data/exam";
import { isInternalAuthed } from "../../../utils/internal-auth.event";

export default defineEventHandler((event) => {
  if (!isInternalAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "未授权访问" });
  }
  const id = (getRouterParam(event, "id") || "").toLowerCase();
  const paper = examPapers.find((p: { id: string }) => p.id.toLowerCase() === id);
  if (!paper) {
    throw createError({ statusCode: 404, statusMessage: "未找到该试卷" });
  }
  return paper;
});
