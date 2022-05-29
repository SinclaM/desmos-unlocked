# Notes for (the Desmos fork of) MathQuill configuration options:


The global configuration is set through Desmos.MathQuill.config(__yourConfigHere__). 
__yourConfigHere__ may look like:
    ```
          spaceBehavesLikeTab: true,
          leftRightIntoCmdGoes: 'up',
          restrictMismatchedBrackets: true,
          sumStartsWithNEquals: true,
          supSubsRequireOperand: true,
          charsThatBreakOutOfSupSub: '+-=<>',
          autoSubscriptNumerals: true,
          autoCommands: 'pi theta sqrt sum',
          autoOperatorNames: 'sin cos',
          maxDepth: 10,
          substituteTextarea: function() {
            return document.createElement('textarea');
          },
          handlers: {
            edit: function(mathField) { ... },
            upOutOf: function(mathField) { ... },
            moveOutOf: function(dir, mathField) { if (dir === MQ.L) ... else ... }
          }
        }
    ```
as described at https://docs.mathquill.com/en/latest/Config/

But Desmos also provides some extra configuration options. Here are the ones that are exposed 
in their public API:
    ```
      ignoreNextMousedown: (_el: MouseEvent) => boolean;
      substituteTextarea: () => HTMLElement;
      /** Only used in interface versions 1 and 2. */
      substituteKeyboardEvents: SubstituteKeyboardEvents;

      restrictMismatchedBrackets?: boolean;
      typingSlashCreatesNewFraction?: boolean;
      charsThatBreakOutOfSupSub: string;  <---------------------------------------- USEFUL
      sumStartsWithNEquals?: boolean;
      autoSubscriptNumerals?: boolean;
      supSubsRequireOperand?: boolean;
      spaceBehavesLikeTab?: boolean;
      typingAsteriskWritesTimesSymbol?: boolean;
      typingSlashWritesDivisionSymbol: boolean;
      typingPercentWritesPercentOf?: boolean;
      resetCursorOnBlur?: boolean | undefined;
      leftRightIntoCmdGoes?: 'up' | 'down';
      enableDigitGrouping?: boolean;
      mouseEvents?: boolean;
      maxDepth?: number;
      disableCopyPaste?: boolean;
      statelessClipboard?: boolean;
      onPaste?: () => void;
      onCut?: () => void;
      overrideTypedText?: (text: string) => void;
      overrideKeystroke: (key: string, event: KeyboardEvent) => void;
      autoOperatorNames: AutoDict;    <------------------------------------------- USEFUL 
                                                                    (but I can't figure out how to use it)
      autoCommands: AutoDict;    <------------------------------------------------ USEFUL
      autoParenthesizedFunctions: AutoDict;  <------------------------------------ USEFUL
      quietEmptyDelimiters: { [id: string]: any };
      disableAutoSubstitutionInSubscripts?: boolean;
      interpretTildeAsSim: boolean;
      handlers?: {
        fns: HandlerOptions;
        APIClasses: APIClasses;
      };
      scrollAnimationDuration?: number;

      jQuery: $ | undefined;
      assertJquery() {
        pray('Interface versions > 2 do not depend on JQuery', this.version <= 2);
        pray('JQuery is set for interface v < 3', this.jQuery);
        return this.jQuery;
      }
    ```
as taken from src/publicapi.ts. I've judged the options marked with USEFUL to be something 
that the extension should allow users to customize.
