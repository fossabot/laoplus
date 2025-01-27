import { Spinner } from "./Spinner";
import { Timer } from "./Timer";

const cn = classNames;

export const AutorunStatus: React.VFC = () => {
    const config = unsafeWindow.LAOPLUS.config;
    const status = unsafeWindow.LAOPLUS.status;

    const [shown, setShown] = React.useState(
        config.config.features.autorunDetection.enabled &&
            !config.config.features.autorunDetection.hideTimer
    );
    const [enterDate, setEnterDate] = React.useState<Date | null>(null);

    config.events.on("changed", (e) => {
        setShown(
            e.features.autorunDetection.enabled &&
                !e.features.autorunDetection.hideTimer
        );
    });

    status.events.on("changed", (e) => {
        setEnterDate(e.autorunDetection.latestEnterTime);
    });

    if (!shown) {
        return <></>;
    }

    return (
        <div
            className={cn(
                "-translate-x-[50%] absolute inset-y-0 left-0 flex items-center text-white pointer-events-none select-none drop-shadow-lg",
                enterDate === null ? "opacity-50" : "opacity-90"
            )}
        >
            <Spinner
                className="text-[70vh] leading-zero animate-spin"
                style={{ animationDuration: "12s" }}
            />
            <div className="pl-[50%] absolute inset-0 flex items-center justify-center">
                <Timer targetDate={enterDate} className="pt-[60%] rotate-90" />
            </div>
        </div>
    );
};
