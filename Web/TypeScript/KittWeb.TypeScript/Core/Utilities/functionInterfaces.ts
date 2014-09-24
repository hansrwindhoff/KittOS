///<reference path='../references.ts' /> 

module KittWeb {
    export interface IArgsFunc<T> {
        (...a: T[]): any;
    }
    export interface IContainsFunc<T> {
        (a: T[], v: T): boolean;
    }
    export interface IBooleanFuncAny {
        (): boolean;
    }
    export interface IBooleanFunc<T> {
        (a: T): boolean;
    }
    export interface IFluidFunc<T> {
        (a: T): T;
    }
    export interface IFuncAny {
        ();
    }
}