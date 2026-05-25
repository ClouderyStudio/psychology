import { createVNode, render } from "vue";
import Toast from "~/components/Toast.vue";

let toastInstance: any = null;
let container: HTMLDivElement | null = null;

export function useToast() {
  // 初始化 Toast 组件
  const initToast = () => {
    if (!container) {
      container = document.createElement("div");
      document.body.appendChild(container);

      const vnode = createVNode(Toast);
      render(vnode, container);
      toastInstance = vnode.component?.exposed;
    }
  };

  const success = (
    message: string,
    title: string = "成功",
    duration: number = 3000,
  ) => {
    initToast();
    toastInstance?.success(message, title, duration);
  };

  const error = (
    message: string,
    title: string = "错误",
    duration: number = 3000,
  ) => {
    initToast();
    toastInstance?.error(message, title, duration);
  };

  const warning = (
    message: string,
    title: string = "警告",
    duration: number = 3000,
  ) => {
    initToast();
    toastInstance?.warning(message, title, duration);
  };

  const info = (
    message: string,
    title: string = "提示",
    duration: number = 3000,
  ) => {
    initToast();
    toastInstance?.info(message, title, duration);
  };

  return {
    success,
    error,
    warning,
    info,
  };
}
