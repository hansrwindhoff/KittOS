// Source: https://typescript.codeplex.com/SourceControl/latest#src/compiler/core/indexable.ts
///<reference path='references.ts'/>

module KittWeb {
    export interface IIndexable<T> {
        [s: string]: T;
    }
}