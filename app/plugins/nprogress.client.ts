import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  easing: "ease",
  speed: 200,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.4,
  parent: "body",
});

export default defineNuxtPlugin(() => {
  useRouter().beforeEach(() => {
    NProgress.start();
  });

  useRouter().afterEach(() => {
    NProgress.done();
  });
});
