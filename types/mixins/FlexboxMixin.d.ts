/**
 * Layout helper mixin providing flexible box utilities (gap, padding, axis).
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexboxMixin(Base: typeof import("../core/CustomElement.js").default): typeof import("../core/CustomElement.js").default & import("../core/CustomElement.js").Class<{
    block: boolean;
    inline: boolean;
    row: boolean;
    x: string;
    y: string;
    gap: number;
    padding: string;
}, any[]>;
//# sourceMappingURL=FlexboxMixin.d.ts.map