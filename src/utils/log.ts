/* eslint-disable no-console */
const style =
    "padding-right:.6rem;padding-left:.6rem;background:gray;color:white;border-radius:.25rem";

export const log = {
    debug: (moduleName: string, ...args: unknown[]) => {
        console.debug(
            `%c🐞LAOPLUS Stats Reporter :: ${moduleName}`,
            style,
            ..._.cloneDeep(args)
        );
    },
    log: (moduleName: string, ...args: unknown[]) => {
        console.log(
            `%cLAOPLUS Stats Reporter :: ${moduleName}`,
            style,
            ..._.cloneDeep(args)
        );
    },
    warn: (moduleName: string, ...args: unknown[]) => {
        console.warn(
            `%cLAOPLUS Stats Reporter :: ${moduleName}`,
            style,
            ..._.cloneDeep(args)
        );
    },
    error: (moduleName: string, ...args: unknown[]) => {
        console.error(
            `%cLAOPLUS Stats Reporter :: ${moduleName}`,
            style,
            ..._.cloneDeep(args)
        );
    },
};
