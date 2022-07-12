interface windowConfig extends Window {
  require(s: string[], callback: Function): void;
  require(s: string): any;
  Calc: any;
  DesModder: any;
  define(
    moduleName: string,
    dependencies: string[],
    definition: Function
  ): void;
  ALMOND_OVERRIDES: any;
  Desmos: any;
}

declare let window: windowConfig;

export default window;

