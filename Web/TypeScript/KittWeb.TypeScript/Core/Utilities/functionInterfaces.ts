module TypeScript {
    export interface IContainsFunc<T> {
        (a: T[], v: T): boolean;
    }
}