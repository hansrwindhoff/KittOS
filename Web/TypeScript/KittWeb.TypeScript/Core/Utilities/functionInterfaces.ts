///<reference path='../references.ts' /> 

module TypeScript {
    export interface IContainsFunc<T> {
        (a: T[], v: T): boolean;
    }
    export interface IBooleanFunc<T> {
        (a: T): boolean;
    }
    export interface IFluidFunc<T> {
        (a: T): T;
    }
    export interface IStringFunc<T> {
        (a: T): boolean;
    }
}