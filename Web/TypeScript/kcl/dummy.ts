//export enum ModuleStatus {
//    Pending = 0,
//    Loaded = 1
//}
//export class Module {
//    private m_id: string;
//    private m_dependencies: Array<string>;
//    private m_exportValue: any;

//    get id() { return this.m_id; }
//    get dependencies() { return this.m_dependencies; }
//    get exportValue() { return this.exportValue; }

//    constructor(id?: string, dependencies?: Array<string>, exportValue?: any) {
//        this.m_id = id;
//        this.m_dependencies = dependencies;
//        this.m_exportValue = exportValue;
//    }
//}
//export class Loader {
//    private static m_defined: Array<Module> = [];
//    private static m_pending: Array<Module> = [];
//    private static m_ready: Array<Module> = [
//        new Module("exports"),
//        new Module("require")
//    ];

//    static define(dependencies: Array<string>, factoryFunc: any) {
//        Loader.m_defined.push(new Module(undefined, dependencies, factoryFunc));
//    }
//    static importModule(id: string, success?: EventListener, failure?: EventListener) {
//        var sw = (event: Event) => {
//            var mod = Loader.m_defined.pop();
//            Loader.m_pending.push(new Module(id, mod.dependencies, mod.exportValue));

//            Helpers.nullApply(success, event);
//        };

//        Loader.importScript(id + ".js", success, failure);
//    }
//    static importScript(source: string, success?: EventListener, failure?: EventListener): Function {
//        var script = Loader.createScriptElement(source);

//        var bomb = () => { // set us up the bomb
//            Helpers.nullApply(rEv); // remove error event listener
//            Helpers.nullApply(rlV); // remove load event listener
//        };
//        var fw = (event: Event) => {
//            Helpers.nullApply(bomb); // detonate bomb
//            Helpers.nullApply((failure || Helpers.noOp), event); // call failure or no-op
//        };
//        var sw = (event: Event) => {
//            Helpers.nullApply(bomb); // detonate bomb
//            Helpers.nullApply((success || Helpers.noOp), event); // call success or no-op
//        };

//        var rEv = Loader.addEventHandler(script, "error", fw); // add error event listener, return function that removes it
//        var rlV = Loader.addEventHandler(script, "load", sw); // add load event listener, return function that removes it

//        document.head.appendChild(script); // append script to header

//        return () => { document.head.removeChild(script); }; // return function that removes script
//    }

//    private static addEventHandler(element: HTMLElement, eventName: string, handler: EventListener): Function {
//        var event = element.addEventListener(eventName, handler);

//        return () => { element.removeEventListener(eventName, handler); };
//    }
//    private static checkDependencies() {

//    }
//    private static createScriptElement(scriptName: string): HTMLScriptElement {
//        var script: HTMLScriptElement = document.createElement("script");
//        script.async = true;
//        script.src = scriptName;

//        return script;
//    }
//}