import { Config } from "config";
import { initUi } from "ui/index";
import { initInterceptor } from "features/interceptor";
import { tailwindConfig } from "./ui/tailwind";

type State = {
    CurrentStageKey: string | null;
    CurrentWave: number | null;
};
declare global {
    // 露出させるLAOPLUSオブジェクトのinterface
    interface Window {
        LAOPLUS_STATS_REPORTER: {
            config: Config;
            state: State;
        };
    }
}

// 'return' outside of functionでビルドがコケるのを防ぐ即時実行関数
(function () {
    const config = new Config();

    // LAOPLUSオブジェクトを露出させる
    unsafeWindow.LAOPLUS_STATS_REPORTER = {
        config: config,
        state: {
            CurrentStageKey: null,
            CurrentWave: null,
        },
    };

    // @ts-ignore
    tailwind.config = tailwindConfig;

    initUi();
    initInterceptor();
})();
