import { createVNode, render } from "vue";
import Alert from "~/components/Alert.vue";

let alertContainer: HTMLDivElement | null = null;

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function removeAlert() {
  if (alertContainer) {
    render(null, alertContainer);
    if (alertContainer.parentNode) {
      alertContainer.parentNode.removeChild(alertContainer);
    }
    alertContainer = null;
  }
}

export function useAlert() {
  const confirm = (options: ConfirmOptions) => {
    removeAlert();

    alertContainer = document.createElement("div");
    document.body.appendChild(alertContainer);

    const vnode = createVNode(Alert, {
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onConfirm: () => {
        if (options.onConfirm) options.onConfirm();
        removeAlert();
      },
      onCancel: () => {
        if (options.onCancel) options.onCancel();
        removeAlert();
      },
    });

    render(vnode, alertContainer);
  };

  return { confirm };
}
