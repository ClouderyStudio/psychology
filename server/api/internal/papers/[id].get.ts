import { isInternalAuthed } from "../../../utils/internal-auth.event";
import axios from "axios";
import { Agent } from "node:https";

// 开发环境：ClouderyApi 使用自签 HTTPS 证书，放行以便本服务端代理访问
const devTlsAgent = new Agent({ rejectUnauthorized: false });

export default defineEventHandler(async (event) => {
  if (!isInternalAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "未授权访问" });
  }
  const id = (getRouterParam(event, "id") || "").toLowerCase();
  const { clouderyApiBase } = useRuntimeConfig();
  try {
    const { data } = await axios.get(`${clouderyApiBase}/exam/ExamPapers/${encodeURIComponent(id)}`, {
      httpsAgent: devTlsAgent,
      timeout: 10000,
    });
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) throw createError({ statusCode: 404, statusMessage: "未找到该试卷" });
    throw createError({ statusCode: 502, statusMessage: "试卷服务暂不可用" });
  }
});