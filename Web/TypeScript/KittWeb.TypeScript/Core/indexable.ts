// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/indexable.ts

module KittWeb {
    export interface IIndexable<T> {
        [s: string]: T;
    }
}