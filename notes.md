# Notes for (the Desmos fork of) MathQuill configuration options:


The global configuration is set through Desmos.MathQuill.config(yourConfigHere). 
yourConfigHere may look like:

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

as described at https://docs.mathquill.com/en/latest/Config/

But Desmos also provides some extra configuration options. Here are the ones that are exposed 
in their public API:

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
                                (only works if specified functions are
                                        also autoOperatorNames)
    quietEmptyDelimiters: { [id: string]: any };
    disableAutoSubstitutionInSubscripts?: boolean; <---------------------------- USEFUL
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
as taken from `src/publicapi.ts`. I've judged the options marked with USEFUL to be something 
that the extension should allow users to customize.

For the `charsThatBreakOutOfSupSub` option, after some testing, it looks like the Desmos default
is `+ - * = > <`, but it is possible there are more.

I've been able to see the full list of defualt `autoOperatorNames` by running
`Desmos.MathQuill(document.querySelector('.dcg-mq-editable-field'))` in the console, which
returns an API object for the first `MathField`. In the `__options` of this field you can
see all the `autoOperatorNames` for it, and I've been able to change them as desired. But
this is the config for only one field and is therefore not the global config that we want
to set. Unlike the other options I've looked at, `autoOperatorNames` does not seem to be set
properly when using the normal `Desmos.MathQuill.config` approach for global configuration.
This is annoying since all I want to do is allow disabling the `var` operator, which MathQuill gives
higher priority to than `varsigma` (and the like). It's possible that Desmos overrides the global
configuration when creating new `MathField`s, possibly in order to interface nicely with their
virtual keyboard.

Anyway, this is the list of defualt `autoOperatorNames`:

    IndependentTTest: "IndependentTTest"
    TScore: "t score"
    TTest: "t test"
    Tscore: "t score"
    abs: "absolute value"
    arccos: "arc cosine"
    arccosh: "hyperbolic arc cosine"
    arccot: "arc co tangent"
    arccoth: "hyperbolic arc co tangent"
    arccsc: "arc co secant"
    arccsch: "hyperbolic arc co secant"
    arcosh: "hyperbolic ar cosine"
    arcoth: "hyperbolic ar co tangent"
    arcsch: "hyperbolic ar co secant"
    arcsec: "arc secant"
    arcsech: "hyperbolic arc secant"
    arcsin: "arc sine"
    arcsinh: "hyperbolic arc sine"
    arctan: "arc tangent"
    arctanh: "hyperbolic arc co tangent"
    arsech: "hyperbolic ar secant"
    arsinh: "hyperbolic ar sine"
    artanh: "hyperbolic ar co tangent"
    binomialdist: "binomial distribution"
    boxplot: "boxplot"
    cdf: "cdf"
    ceil: "ceiling"
    corr: "correlation"
    cos: "cosine"
    cosh: "hyperbolic cosine"
    cot: "co tangent"
    coth: "hyperbolic co tangent"
    cov: "co variance"
    covp: "co variance population"
    csc: "co secant"
    csch: "hyperbolic co secant"
    det: "determinant"
    distance: "distance"
    dotplot: "dotplot"
    erf: "error function"
    exp: "exponent"
    floor: "floor"
    for: "for"
    gcd: "gcd"
    gcf: "gcf"
    height: "height"
    histogram: "histogram"
    hsv: "hsv"
    iTTest: "independent t test"
    inv: "inverse"
    inverseCdf: "inverseCdf"
    inversecdf: "inversecdf"
    ittest: "independent t test"
    join: "join"
    lcm: "lcm"
    length: "length"
    ln: "natural log"
    log: "log"
    mad: "mad"
    max: "max"
    mcd: "mcd"
    mcm: "mcm"
    mean: "mean"
    median: "median"
    midpoint: "midpoint"
    min: "min"
    mod: "mod"
    nCr: "nCr"
    nPr: "nPr"
    normaldist: "normal distribution"
    pdf: "pdf"
    poissondist: "poisson distribution"
    polygon: "polygon"
    quantile: "quantile"
    quartile: "quartile"
    random: "random"
    rgb: "rgb"
    round: "round"
    rref: "reduced row echelon form"
    sec: "secant"
    sech: "hyperbolic secant"
    sgn: "sgn"
    shuffle: "shuffle"
    sign: "signum"
    signum: "signum"
    sin: "sine"
    sinh: "hyperbolic sine"
    sort: "sort"
    spearman: "spearman"
    stats: "stats"
    stdDev: "standard deviation"
    stdDevP: "standard deviation population"
    stddev: "standard deviation"
    stddevp: "standard deviation population"
    stdev: "standard deviation"
    stdevp: "standard deviation population"
    tan: "tangent"
    tanh: "hyperbolic tangent"
    tdist: "t distribution"
    total: "total"
    trace: "trace"
    transpose: "transpose"
    tscore: "t score"
    ttest: "t test"
    uniformdist: "uniform distribution"
    unique: "unique"
    var: "variance"
    variance: "variance"
    varp: "variance population"
    width: "width"
