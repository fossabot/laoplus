import { log } from "~/utils";
import { invoke as invokeStatsReporter } from "../statsReporter/invoke";

const interceptor = (xhr: XMLHttpRequest): void => {
    if (!xhr.responseURL) return;

    const url = new URL(xhr.responseURL);
    if (url.host !== "gate.last-origin.com") {
        return;
    }

    const responseText = new TextDecoder("utf-8").decode(xhr.response);
    // JSONが不正なことがあるのでtry-catch
    try {
        const res = JSON.parse(responseText);
        log.debug("Interceptor", url.pathname, res);

        const invokeProps = { xhr, res, url };

        // TODO: このような処理をここに書くのではなく、各種機能がここを購読しに来るように分離したい
        invokeStatsReporter(invokeProps);
    } catch (error) {
        log.error("Interceptor", "Error", error);
    }
};

const sendInterceptor = (xhr: XMLHttpRequest, arg: Uint8Array[]) => {
    // if (!xhr.responseURL) return;

    // const url = new URL(xhr.responseURL);
    // if (url.host !== "gate.last-origin.com") {
    //     return;
    // }

    const text = arg.map((u8) => {
        return new TextDecoder().decode(u8);
    })[0];
    if (!text) return;

    try {
        const body = JSON.parse(text);
        log.debug("Send Interceptor", xhr, body);

        if ("StageKeyString" in body) {
            unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentStageKey =
                body.StageKeyString;
            log.log(
                "Send Interceptor",
                "Set StageKeyString",
                body.StageKeyString
            );

            unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave = 1;
            log.log("Send Interceptor", "Set CurrentWave", 1);
        }
    } catch (error) {
        // log.error("Send Interceptor", error);
    }
};

export const initInterceptor = () => {
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener(
                "readystatechange",
                () => {
                    // 完了した通信のみ
                    if (this.readyState === 4) {
                        interceptor(this);
                    }
                },
                false
            );
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    (function (send) {
        XMLHttpRequest.prototype.send = function () {
            // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
            sendInterceptor(this, [...arguments]);

            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            send.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.send);
};
