
// ==UserScript==
// @name        LAOPLUS-STATS-REPORTER
// @namespace   net.mizle
// @version     1.0.0
// @author      Eai <eai@mizle.net>
// @description ブラウザ版ラストオリジンのプレイを支援する Userscript
// @homepageURL https://github.com/eai04191/laoplus
// @supportURL  https://github.com/eai04191/laoplus/issues
// @run-at      document-idle
// @match       https://adult-client.last-origin.com/
// @match       https://normal-client.last-origin.com/
// @require     https://cdn-tailwindcss.vercel.app
// @require     https://unpkg.com/lodash@4.17.21/lodash.js
// @require     https://unpkg.com/classnames@2.3.1/index.js
// @require     https://unpkg.com/react@17.0.2/umd/react.production.min.js
// @require     https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js
// @require     https://unpkg.com/react-modal@3.14.4/dist/react-modal.js
// @require     https://unpkg.com/@headlessui/react@1.4.2/dist/headlessui.umd.development.js
// @require     https://unpkg.com/react-hook-form@7.20.4/dist/index.umd.js
// @require     https://unpkg.com/chroma-js@2.1.2/chroma.js
// @require     https://unpkg.com/dayjs@1.10.7/dayjs.min.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/relativeTime.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/isSameOrBefore.js
// @require     https://unpkg.com/dayjs@1.10.7/plugin/duration.js
// @resource    TacticsManualIcon https://lo.swaytwig.com/assets/icon.png
// @grant       GM_getResourceURL
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    /* eslint-disable no-console */
    const style = "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem";
    const log = {
        debug: (moduleName, ...args) => {
            console.debug(`%c🐞LAOPLUS Stats Reporter :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        log: (moduleName, ...args) => {
            console.log(`%cLAOPLUS Stats Reporter :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        warn: (moduleName, ...args) => {
            console.warn(`%cLAOPLUS Stats Reporter :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
        error: (moduleName, ...args) => {
            console.error(`%cLAOPLUS Stats Reporter :: ${moduleName}`, style, ..._.cloneDeep(args));
        },
    };

    const defaultConfig = {
        features: {
            statsReporter: {
                enabled: false,
                endpointURL: "",
            },
        },
    };
    class Config {
        config;
        constructor() {
            this.config = _.merge(defaultConfig, GM_getValue("config", defaultConfig));
        }
        set(value) {
            _.merge(this.config, value);
            GM_setValue("config", this.config);
            log.log("Config", "Config Updated", this.config);
        }
    }

    const Icon = () => {
        return (React.createElement("link", { rel: "stylesheet", href: "https://unpkg.com/bootstrap-icons@1.7.1/font/bootstrap-icons.css" }));
    };

    const cn$2 = classNames;
    const ErrorMessage = ({ children, className }) => {
        return (React.createElement("span", { className: cn$2("text-red-600 text-xs", className) }, children));
    };

    const cn$1 = classNames;
    /**
     * ラスオリのボタンっぽいボタン
     * variantのプレビュー: https://user-images.githubusercontent.com/3516343/143912908-65956c55-b60d-4028-82d2-143b08414384.png
     */
    const SubmitButton = ({ children, variant = 1, className }) => {
        const clipStyle = (() => {
            switch (variant) {
                default:
                case 1:
                    return {
                        "--corner-size": "14px",
                        clipPath: `polygon(
                            calc(100% - var(--corner-size)) 0%,
                            100% var(--corner-size),
                            100% 100%,
                            var(--corner-size) 100%,
                            0% calc(100% - var(--corner-size)),
                            0 0
                        )`,
                    };
                case 2:
                    return {
                        "--gap-length": "8px",
                        "--outer": "calc(100% - calc(var(--gap-length) * 3))",
                        "--inner": "calc(100% - calc(var(--gap-length) * 2))",
                        "--inner2": "calc(100% - var(--gap-length))",
                        clipPath: `polygon(
                        0 0,
                        100% 0,

                        100% var(--outer),
                        var(--outer) 100%,

                        var(--inner) 100%,
                        100% var(--inner),

                        100% var(--inner2),
                        var(--inner2) 100%,

                        100% 100%,
                        0 100%
                    )`,
                    };
            }
        })();
        return (React.createElement("div", { className: "drop-shadow" },
            React.createElement("button", { type: "submit", className: cn$1("bg-amber-300 min-w-[6rem] p-3 font-bold leading-none", { rounded: variant === 1 }, className), style: clipStyle }, children)));
    };

    const cn = classNames;
    ReactModal.defaultStyles = {};
    const element = document.createElement("style");
    element.setAttribute("type", "text/tailwindcss");
    element.innerText = `
#laoplus-modal button {
    @apply hover:brightness-105;
}
.ReactModal__Overlay {
    @apply opacity-0 transition-opacity duration-150;
}
.ReactModal__Overlay--after-open {
    @apply opacity-100;
}
.ReactModal__Overlay--before-close {
    @apply opacity-0;
}
`;
    document.head.appendChild(element);
    const ConfigModal = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const { register, handleSubmit, watch, formState: { errors }, } = ReactHookForm.useForm({
            defaultValues: unsafeWindow.LAOPLUS_STATS_REPORTER.config.config,
        });
        const onSubmit = (config) => {
            log.log("Config Modal", "Config submitted", config);
            unsafeWindow.LAOPLUS_STATS_REPORTER.config.set(config);
            setIsOpen(false);
        };
        if (!_.isEmpty(errors)) {
            log.error("Config Modal", "Error", errors);
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: () => {
                    setIsOpen(true);
                }, className: "absolute bottom-0 right-0" }, "\uD83D\uDCE2"),
            React.createElement(ReactModal, { appElement: 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                document.querySelector("#laoplus-stats-reporter-root"), shouldCloseOnOverlayClick: false, 
                // .ReactModal__Overlayに指定してるduration
                closeTimeoutMS: 150, isOpen: isOpen, overlayClassName: "fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center", className: "min-w-[50%] max-w-[90%] max-h-[90%] p-4 bg-gray-50 rounded shadow overflow-auto", id: "laoplus-modal" },
                React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-2" },
                    React.createElement("header", { className: "flex items-center place-content-between" },
                        React.createElement("div", { className: "flex gap-2 items-end" },
                            React.createElement("h2", { className: "text-xl font-semibold" }, GM_info.script.name),
                            React.createElement("span", { className: "pb-0.5 text-gray-500 text-sm" }, GM_info.script.version))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("main", { className: "flex flex-col gap-1 ml-6" },
                        React.createElement("div", { className: "flex flex-col gap-1" },
                            React.createElement("label", { className: "flex gap-2 items-center" },
                                React.createElement("input", { type: "checkbox", id: "laoplus-discord-notification", className: "-ml-6 w-4 h-4", ...register("features.statsReporter.enabled") }),
                                React.createElement("span", null, "Stats Reporter"))),
                        React.createElement("div", { className: cn("flex flex-col gap-1", {
                                "opacity-50": !watch("features.statsReporter.enabled"),
                            }) },
                            React.createElement("label", { className: "flex gap-2" },
                                React.createElement("span", { className: "flex-shrink-0" }, "Endpoint URL:"),
                                React.createElement("input", { type: "text", disabled: !watch("features.statsReporter.enabled"), className: "min-w-[1rem] flex-1 px-1 border border-gray-500 rounded", ...register("features.statsReporter.endpointURL", {
                                        required: watch("features.statsReporter.enabled"),
                                        pattern: /^https:\/\//,
                                    }) })),
                            errors.features?.statsReporter?.endpointURL && (React.createElement(ErrorMessage, { className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-exclamation-triangle" }),
                                errors.features?.statsReporter?.endpointURL
                                    ?.type === "required" &&
                                    "Stats Reporterを利用するにはEndpont URLが必要です",
                                errors.features?.statsReporter?.endpointURL
                                    ?.type === "pattern" &&
                                    "有効なEndpont URLではありません")))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("div", { className: "flex flex-col gap-2 items-center" },
                        React.createElement("span", { className: "text-gray-600 text-sm" },
                            GM_info.script.name,
                            "\u306F\u4EE5\u4E0B\u306E\u30B5\u30FC\u30D3\u30B9\u304C\u63D0\u4F9B\u3059\u308B\u30B2\u30FC\u30E0\u30C7\u30FC\u30BF\u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059"),
                        React.createElement("a", { title: "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C", href: "https://lo.swaytwig.com/", target: "_blank", rel: "noopener", className: "flex gap-1 items-center p-2 px-3 bg-white rounded shadow" },
                            React.createElement("img", { src: GM_getResourceURL("TacticsManualIcon"), className: "w-12" }),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "text-lg font-semibold" }, "\u6EC5\u4EA1\u524D\u306E\u6226\u8853\u6559\u672C"),
                                React.createElement("span", { className: "text-gray-400 text-sm" }, "by WolfgangKurz")))),
                    React.createElement("div", { className: "my-2 border-t" }),
                    React.createElement("footer", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "flex gap-3 text-gray-500 text-sm" },
                            React.createElement("a", { href: "https://github.com/eai04191/laoplus", target: "_blank", rel: "noopener", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-github" }),
                                "GitHub"),
                            React.createElement("a", { href: "https://discord.gg/EGWqTuhjrE", target: "_blank", rel: "noopener", className: "flex gap-1" },
                                React.createElement("i", { className: "bi bi-discord" }),
                                "Discord")),
                        React.createElement("div", { className: "mx-2" }),
                        React.createElement(SubmitButton, null, "\u4FDD\u5B58"))))));
    };

    const App = () => {
        return (React.createElement(React.Fragment, null,
            React.createElement(Icon, null),
            React.createElement(ConfigModal, null)));
    };
    const initUi = () => {
        const root = document.createElement("div");
        root.id = "laoplus-stats-reporter-root";
        ReactDOM.render(React.createElement(App, null), root);
        document.body.appendChild(root);
    };

    /**
     * @package
     */
    const report = async (res) => {
        if (unsafeWindow.LAOPLUS_STATS_REPORTER.config.config.features.statsReporter
            .enabled) {
            if (unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave === null) {
                throw new Error("送信時Current Waveがnull");
            }
            const body = {
                StageKey: unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentStageKey,
                Wave: unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave,
                WaveClear: JSON.stringify(res),
            };
            await fetch(unsafeWindow.LAOPLUS_STATS_REPORTER.config.config.features
                .statsReporter.endpointURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(body),
            }).finally(() => {
                if (unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave === null) {
                    throw new Error("送信後Current Waveがnull");
                }
                unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave += 1;
                log.log("Stats Reporter", "Current Wave Update", unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave);
            });
            log.log("Stats Reporter", "Sent!", body);
        }
        else {
            log.debug("Stats Reporter", "設定が無効のため、StatsReportを送信しませんでした"
            // body
            );
        }
    };

    // TODO: 渡す前にキャストする
    const invoke = ({ res, url }) => {
        switch (url.pathname) {
            case "/wave_clear":
                report(res);
                return;
        }
    };

    const interceptor = (xhr) => {
        if (!xhr.responseURL)
            return;
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
            invoke(invokeProps);
        }
        catch (error) {
            log.error("Interceptor", "Error", error);
        }
    };
    const sendInterceptor = (xhr, arg) => {
        // if (!xhr.responseURL) return;
        // const url = new URL(xhr.responseURL);
        // if (url.host !== "gate.last-origin.com") {
        //     return;
        // }
        const text = arg.map((u8) => {
            return new TextDecoder().decode(u8);
        })[0];
        if (!text)
            return;
        try {
            const body = JSON.parse(text);
            log.debug("Send Interceptor", xhr, body);
            if ("StageKeyString" in body) {
                unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentStageKey =
                    body.StageKeyString;
                log.log("Send Interceptor", "Set StageKeyString", body.StageKeyString);
                unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave = 1;
                log.log("Send Interceptor", "Set CurrentWave", 1);
            }
        }
        catch (error) {
            // log.error("Send Interceptor", error);
        }
    };
    const initInterceptor = () => {
        (function (open) {
            XMLHttpRequest.prototype.open = function () {
                this.addEventListener("readystatechange", () => {
                    // 完了した通信のみ
                    if (this.readyState === 4) {
                        interceptor(this);
                    }
                }, false);
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

    // tailwindcssの拡張機能で補完を使うために、このファイルを編集する際は tailwind.config.js も同じように編集すること
    const tailwindConfig = {
        darkMode: "media",
        theme: {
            extend: {
                transitionProperty: {
                    spacing: "margin, padding",
                },
            },
        },
        variants: {
            extend: {},
        },
    };

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

})();
