import { useToast } from "~/composables/useToast";
import { useAlert } from "~/composables/useAlert";

export default defineNuxtPlugin(() => {
  const toast = useToast();
  const { confirm } = useAlert();

  return {
    provide: {
      toast: {
        success: toast.success,
        error: toast.error,
        warning: toast.warning,
        info: toast.info,
      },
      confirm,
    },
  };
});
