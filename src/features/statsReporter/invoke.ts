import { report } from "./functions";
import { InvokeProps } from "../types";

// TODO: 渡す前にキャストする
export const invoke = ({ res, url }: InvokeProps) => {
    switch (url.pathname) {
        case "/wave_clear":
            report(res as any);
            return;
    }
};
