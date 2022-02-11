import { rankColor } from "~/constants";
import { BattleStats as TBattleStats } from "~/features/types";
import { Icon } from "./Icon";
const cn = classNames;

function jsonEqual(a: unknown, b: unknown) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function resetRecoder() {
    const status = unsafeWindow.LAOPLUS.status;
    status.set({
        battleStats: {
            startTime: undefined,
            waveTime: undefined,
            endTime: undefined,
            totalWaitTime: 0,
            totalRoundTime: 0,
            rounds: 0,
            Metal: 0,
            Nutrient: 0,
            Power: 0,
            Normal_Module: 0,
            Advanced_Module: 0,
            Special_Module: 0,
        },
    });
}

const ResourceCounter: React.VFC<{
    type: React.ComponentProps<typeof Icon>["type"] | "B" | "A" | "S" | "SS";
    amount: number;
}> = ({ type, amount }) => {
    return (
        <div className="flex gap-2 items-center">
            {type === "B" || type === "A" || type === "S" || type === "SS" ? (
                <div
                    className={cn(
                        "flex-shrink-0 px-2 rounded-md font-bold ring-1 ring-gray-900/5",
                        `bg-[${rankColor[type].hex()}]`,
                        type === "SS" ? "text-black" : "text-white"
                    )}
                >
                    {type}
                </div>
            ) : (
                <div className="flex-shrink-0 w-6 h-6">
                    <Icon type={type} />
                </div>
            )}

            <hr className="h-[2px] w-full bg-gray-200 border-0 rounded-full" />
            <span className="text-gray-900 font-bold">
                {amount.toLocaleString()}
            </span>
        </div>
    );
};

export const BattleStats: React.VFC = () => {
    const status = unsafeWindow.LAOPLUS.status;
    const [recorder, setRecorder] = React.useState<TBattleStats>({
        ...status.status.battleStats,
    });
    status.events.on("changed", (e) => {
        setRecorder((old) => {
            if (!jsonEqual(old, e.battleStats)) return { ...e.battleStats };
            return old;
        });
    });

    const totalTime = recorder.totalRoundTime + recorder.totalWaitTime;
    const [Research] = React.useState<string>("2.5");
    const numResearch = parseFloat(Research);

    const [showPanel, setShowPanel] = React.useState(false);
    const handleButtonClick = () => {
        setShowPanel((v) => !v);
    };

    const lapAverage = (totalTime / recorder.rounds).toFixed(1) || "0.0";

    return (
        <div className="relative">
            <button
                onClick={handleButtonClick}
                title="周回情報パネルを表示する"
                className="h-6 text-white drop-shadow-featureIcon"
            >
                <i className="bi bi-recycle"></i>
            </button>
            {showPanel && (
                <div className="w-[420px] ring-gray-900/5 absolute bottom-6 left-0 mb-1 rounded-lg shadow-xl overflow-hidden ring-1">
                    <header className="from-slate-800 to-slate-700 flex items-center p-2 pl-3 text-white bg-gradient-to-r">
                        <h1 className="flex gap-2 items-center mr-auto">
                            <i className="bi bi-info-circle text-lg"></i>
                            周回情報
                        </h1>
                        <div className="flex gap-2 items-center">
                            <button
                                className="bg-amber-300 flex gap-1 items-center px-2 py-1 text-gray-900 rounded shadow"
                                onClick={resetRecoder}
                            >
                                <i className="bi bi-stopwatch inline w-4"></i>
                                リセット
                            </button>
                        </div>
                    </header>

                    <main className="flex flex-col gap-4 px-4 py-5 bg-white">
                        <div className="grid gap-4 grid-cols-2">
                            <dl className="flex">
                                <dt className="mr-auto">平均周回時間</dt>
                                <dd>
                                    <p className="text-gray-900 font-bold">
                                        <span>{lapAverage}</span>
                                        <span className="text-gray-500 text-xs font-bold">
                                            秒
                                        </span>
                                    </p>
                                </dd>
                            </dl>
                            <dl className="flex">
                                <dt className="mr-auto">完了した周回数</dt>
                                <dd>
                                    <p className="text-gray-900 font-bold">
                                        {recorder.rounds.toLocaleString()}
                                    </p>
                                </dd>
                            </dl>
                        </div>

                        <hr />

                        <div className="flex gap-3">
                            <h2 className="font-bold">取得資源</h2>
                            <div className="flex gap-1 items-center ml-auto">
                                <span>時給</span>
                                <div className="flex items-center px-1 w-10 h-5 bg-gray-300 rounded-full">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-4"></div>
                                </div>
                                <span>合計</span>
                            </div>
                        </div>

                        <div className="grid gap-3 grid-cols-3">
                            <ResourceCounter
                                type="metal"
                                amount={recorder.Metal}
                            />
                            <ResourceCounter
                                type="nutrient"
                                amount={recorder.Nutrient}
                            />
                            <ResourceCounter
                                type="power"
                                amount={recorder.Power}
                            />
                        </div>
                        <div className="grid gap-3 grid-cols-3">
                            <ResourceCounter
                                type="basic_module"
                                amount={recorder.Normal_Module}
                            />
                            <ResourceCounter
                                type="advanced_module"
                                amount={recorder.Advanced_Module}
                            />
                            <ResourceCounter
                                type="special_module"
                                amount={recorder.Special_Module}
                            />
                        </div>

                        <div className="flex gap-3">
                            <h2 className="font-bold">ドロップ詳細</h2>
                        </div>

                        <div className="flex gap-2">
                            <i
                                className="bi bi-person-fill text-xl"
                                title="戦闘員"
                            ></i>
                            <div className="grid flex-1 gap-3 grid-cols-4">
                                <ResourceCounter type="B" amount={0} />
                                <ResourceCounter type="A" amount={0} />
                                <ResourceCounter type="S" amount={0} />
                                <ResourceCounter type="SS" amount={0} />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <i className="bi bi-cpu text-xl" title="装備"></i>
                            <div className="grid flex-1 gap-3 grid-cols-4">
                                <ResourceCounter type="B" amount={0} />
                                <ResourceCounter type="A" amount={0} />
                                <ResourceCounter type="S" amount={0} />
                                <ResourceCounter type="SS" amount={0} />
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};
