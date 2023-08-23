/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TypographyMixin(Base: typeof import('../core/CustomElement.js').default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    textTrim: boolean;
    textPadding: string;
    textPaddingTop: string;
    textLeading: string;
    textPaddingBottom: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _computedTextPaddingTop: string;
    _computedTextPaddingBottom: string;
    _computedTextLeading: string;
}, any[]> & import("../core/CustomElement.js").Class<{
    _beforeStyle: string;
    _afterStyle: string;
    _hostStyle: "" | ":host{margin-block:-1em}";
}, any[]>;
//# sourceMappingURL=TypographyMixin.d.ts.map