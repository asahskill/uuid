/** Generate a cryptographically random UUID version 4. */
export declare function v4(): string;
/** Generate a time-ordered UUID version 7. */
export declare function v7(): string;
/** Generate the branch's default UUID version (v7 on main and v7). */
export declare const generate: typeof v7;
export default generate;
