/* eslint-disable react/jsx-no-undef */
import { Config } from "config";
import { log } from "utils/log";
import { ErrorMessage } from "./ErrorMessage";
import { HelpIcon } from "./HelpIcon";
import { SubmitButton } from "./SumitButton";

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

export const ConfigModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = ReactHookForm.useForm<Config["config"]>({
        defaultValues: unsafeWindow.LAOPLUS.config.config,
    });

    const onSubmit = (config: Config["config"]) => {
        log("Config Modal", "Config submitted", config);
        unsafeWindow.LAOPLUS.config.set(config);
        setIsOpen(false);
    };

    if (!_.isEmpty(errors)) {
        log("Config Modal", "Error!", errors);
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="absolute bottom-0 left-0"
            >
                ➕
            </button>

            <ReactModal
                appElement={
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    document.querySelector<HTMLDivElement>("#laoplus-root")!
                }
                shouldCloseOnOverlayClick={false}
                // .ReactModal__Overlayに指定してるduration
                closeTimeoutMS={150}
                isOpen={isOpen}
                overlayClassName="fixed inset-0 backdrop-blur backdrop-saturate-[0.75] flex items-center justify-center"
                className="min-w-[50%] max-w-[90%] max-h-[90%] p-4 bg-gray-50 rounded shadow overflow-auto"
                id="laoplus-modal"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    <header className="flex items-center place-content-between">
                        <div className="flex gap-2 items-end">
                            <h2 className="text-xl font-semibold">
                                {GM_info.script.name}
                            </h2>
                            <span className="pb-0.5 text-gray-500 text-sm">
                                {GM_info.script.version}
                            </span>
                        </div>
                    </header>

                    <div className="my-2 border-t"></div>

                    <main className="flex flex-col gap-1 ml-6">
                        <div className="flex flex-col gap-1">
                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    id="laoplus-discord-notification"
                                    className="-ml-6 w-4 h-4"
                                    {...register(
                                        "features.discordNotification.enabled"
                                    )}
                                />
                                <span>Discord通知</span>
                                <HelpIcon href="https://github.com/eai04191/laoplus/wiki/features-discordNotification" />
                            </label>
                        </div>

                        <div
                            className={cn("flex flex-col gap-1", {
                                "opacity-50": !watch(
                                    "features.discordNotification.enabled"
                                ),
                            })}
                        >
                            <label className="flex gap-2">
                                <span className="flex-shrink-0">
                                    Discord Webhook URL:
                                </span>
                                <input
                                    type="text"
                                    disabled={
                                        !watch(
                                            "features.discordNotification.enabled"
                                        )
                                    }
                                    className="min-w-[1rem] flex-1 px-1 border border-gray-500 rounded"
                                    {...register(
                                        "features.discordNotification.webhookURL",
                                        {
                                            required: watch(
                                                "features.discordNotification.enabled"
                                            ),
                                            pattern:
                                                /^https:\/\/discord\.com\/api\/webhooks\//,
                                        }
                                    )}
                                />
                            </label>
                            {errors.features?.discordNotification
                                ?.webhookURL && (
                                <ErrorMessage className="flex gap-1">
                                    <i className="bi bi-exclamation-triangle"></i>
                                    {errors.features?.discordNotification
                                        ?.webhookURL?.type === "required" &&
                                        "Discord通知を利用するにはWebhook URLが必要です"}
                                    {errors.features?.discordNotification
                                        ?.webhookURL?.type === "pattern" &&
                                        "有効なDiscordのWebhook URLではありません"}
                                </ErrorMessage>
                            )}
                        </div>
                    </main>

                    <div className="my-2 border-t"></div>

                    <footer className="flex items-center justify-between">
                        <div className="flex gap-3 text-gray-500 text-sm">
                            <a
                                href="https://github.com/eai04191/laoplus"
                                target="_blank"
                                rel="noreferrer"
                                className="flex gap-1"
                            >
                                <i className="bi bi-github"></i>
                                GitHub
                            </a>
                            <a
                                href="https://discord.gg/EGWqTuhjrE"
                                target="_blank"
                                rel="noreferrer"
                                className="flex gap-1"
                            >
                                <i className="bi bi-discord"></i>
                                Discord
                            </a>
                        </div>
                        <div className="mx-2" />
                        <SubmitButton>保存</SubmitButton>
                    </footer>
                </form>
            </ReactModal>
        </>
    );
};