interface windowConfig extends Window {
  require(s: string[], callback: Function): void;
  require(s: string): any;
  DesModder: any;
  define(
    moduleName: string,
    dependencies: string[],
    definition: Function
  ): void;
  ALMOND_OVERRIDES: { [key: string]: Function };
  Desmos: any;
}

declare let window: windowConfig;

export default window;

