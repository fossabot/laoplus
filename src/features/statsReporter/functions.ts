import { log } from "~/utils/log";

type WaveClearResponse = {
    ClearRewardInfo: ClearRewardInfo;
};

type ClearRewardInfo = {
    PCRewardList: RewardPC[];
    ItemRewardList: RewardItem[];
};
type RewardPC = {
    Grade: number;
    Level: number;
    PCKeyString: string;
};
type RewardItem = {
    ItemKeyString: string;
};

/**
 * @package
 */
export const report = async (res: WaveClearResponse) => {
    if (
        unsafeWindow.LAOPLUS_STATS_REPORTER.config.config.features.statsReporter
            .enabled
    ) {
        if (unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave === null) {
            throw new Error("送信時Current Waveがnull");
        }

        const body = {
            StageKey: unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentStageKey,
            Wave: unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave,
            WaveClear: JSON.stringify(res),
        };
        await fetch(
            unsafeWindow.LAOPLUS_STATS_REPORTER.config.config.features
                .statsReporter.endpointURL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(body),
            }
        ).finally(() => {
            if (
                unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave === null
            ) {
                throw new Error("送信後Current Waveがnull");
            }
            unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave += 1;
            log.log(
                "Stats Reporter",
                "Current Wave Update",
                unsafeWindow.LAOPLUS_STATS_REPORTER.state.CurrentWave
            );
        });

        log.log("Stats Reporter", "Sent!", body);
    } else {
        log.debug(
            "Stats Reporter",
            "設定が無効のため、StatsReportを送信しませんでした"
            // body
        );
    }
};
