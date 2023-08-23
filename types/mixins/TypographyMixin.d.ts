/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TypographyMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    textTrim: boolean;
    textPadding: string;
    textPaddingTop: string;
    textLeading: string;
    textPaddingBottom: string;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    textTrim: boolean;
    textPadding: string;
    textPaddingTop: string;
    textLeading: string;
    textPaddingBottom: string;
} & {
    _computedTextPaddingTop: string;
    _computedTextPaddingBottom: string;
    _computedTextLeading: string;
}) & (new (...args: any[]) => import("../core/CustomElement.js").default & {
    textTrim: boolean;
    textPadding: string;
    textPaddingTop: string;
    textLeading: string;
    textPaddingBottom: string;
} & {
    _computedTextPaddingTop: string;
    _computedTextPaddingBottom: string;
    _computedTextLeading: string;
} & {
    _beforeStyle: string;
    _afterStyle: string;
    _hostStyle: "" | ":host{margin-block:-1em}";
});
//# sourceMappingURL=TypographyMixin.d.ts.map