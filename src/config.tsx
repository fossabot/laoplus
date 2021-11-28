// https://stackoverflow.com/questions/61132262/typescript-deep-partial
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

const defaultConfig = {
    features: {
        discordNotification: {
            enabled: false,
            webhookURL: "",
        },
    },
};

export class Config {
    config: typeof defaultConfig;

    constructor() {
        this.config = GM_getValue("config", defaultConfig);
    }

    set(value: DeepPartial<Config["config"]>) {
        _.merge(this.config, value);
        GM_setValue("config", this.config);
    }
}
