module mcl {
    "use strict";

    export class Helpers {
        static nullApply(func: Function, ...args: any[]): any { return func.apply(null, args); }
    }

    export interface IIdentity<T> { value: T }
    export class Identity<T> implements IIdentity<T> {
        private m_value: T;

        get value() { return this.m_value; }

        constructor(value: T) { this.m_value = value; }

        bind<T, U>(func: (w: T) => Identity<U>): Identity<U> {
            return Helpers.nullApply(func, this.value);
        }

        static bind<T, U>(wrapper: Identity<T>, func: (w: T) => Identity<U>): Identity<U> {
            return Helpers.nullApply(func, wrapper.value);
        }
        static unit<T>(value: T) { return new Identity(value); }
    }
}

var k = (x) => { return new mcl.Identity(x * x * x); };
var h = (x) => { return new mcl.Identity(x / 2); };
var e = 42;

// Left Identity
var a1 = k(e);
var b1 = mcl.Identity.bind(mcl.Identity.unit(e), k);

console.log("Left Identity Pass: " + (a1.value === b1.value));
console.log(a1);
console.log(b1);

// Right Identity
var m = k(e);
var a2 = m;
var b2 = mcl.Identity.bind(m, mcl.Identity.unit);

console.log("Right Identity Pass: " + (a2.value === b2.value));
console.log(a2);
console.log(b2);

// Associative
var m = new mcl.Identity(e);
var a3 = mcl.Identity.bind(m, (x) => { return mcl.Identity.bind(k(x), (y) => h(y)); });
var b3 = mcl.Identity.bind(mcl.Identity.bind(m, (x) => { return k(x); }), (y) => { return h(y); });

console.log("Associative Pass: " + (a3.value === b3.value));
console.log(a3);
console.log(b3);