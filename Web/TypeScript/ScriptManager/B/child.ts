import parent = require("../A/dummy");

class Child {
    static init() {
        console.log(parent.Hello);
    }
}

export = Child;