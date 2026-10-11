import { testList } from "~~/server/utils/test-catalog";
import { timeFrameOf } from "~~/server/utils/test-timeframe";

export default defineEventHandler(() => {
  return {
    success: true,
    data: testList.map((t) => {
      const timeFrame = timeFrameOf(t.id);
      return timeFrame ? { ...t, timeFrame } : t;
    }),
  };
});
