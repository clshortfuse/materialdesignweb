export const CIRCLE_PATH: "M0 12A12 12 0 1012 0 12 12 0 000 12Z";
export const DIAMOND_PATH: "M 0 12 12 0 24 12 12 24 Z";
export const SQUIRCLE_PATH: "M12 24C17.2583 24 20.1815 24 22.0908 22.0908 24 20.1815 24 17.2583 24 12 24 6.7417 24 3.8185 22.0908 1.9092 20.1815-0 17.2583-0 12-0 6.7417-0 3.8185-0 1.9092 1.9092-0 3.8185-0 6.7417-0 12-0 17.2583-0 20.1815 1.9092 22.0908 3.8185 24 6.7417 24 12 24Z";
export const HALF_NOTCH_PATH: "M0 6H6V0H18V6H24V18H18V24H6V18H0Z";
export namespace SHAPE_ROUNDED_DEFAULT {
    export namespace size {
        let extraSmall: string;
        let small: string;
        let medium: string;
        let large: string;
        let extraLarge: string;
        let full: string;
    }
    export { CIRCLE_PATH as mask };
    export let convex: boolean;
}
export namespace SHAPE_CUT_DEFAULT {
    export namespace size_1 {
        let extraSmall_1: string;
        export { extraSmall_1 as extraSmall };
        let small_1: string;
        export { small_1 as small };
        let medium_1: string;
        export { medium_1 as medium };
        let large_1: string;
        export { large_1 as large };
        let extraLarge_1: string;
        export { extraLarge_1 as extraLarge };
        let full_1: string;
        export { full_1 as full };
    }
    export { size_1 as size };
    export { DIAMOND_PATH as mask };
}
export namespace SHAPE_SQUIRCLE_DEFAULT {
    export { SQUIRCLE_PATH as mask };
}
//# sourceMappingURL=shapes.d.ts.map