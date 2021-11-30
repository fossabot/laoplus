import { injection } from "injection";
import { initResizeObserver } from "features/resizeObserver";

// 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
(function () {
    const isGameWindow = injection();
    if (!isGameWindow) return;

    initResizeObserver();
})();
