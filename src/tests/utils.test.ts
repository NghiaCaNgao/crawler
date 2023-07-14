import { describe, expect, test } from '@jest/globals';
import { isValidURL } from "../utils"

describe("Utils testing pack", () => {
    test("`isValidURL` func.", () => {
        expect(isValidURL("https://jestjs.io/docs/getting-started"))
            .toBe(true);
        expect(isValidURL("https://regexr.com/39nr7a?q=1&r=aa"))
            .toBe(true);
        expect(isValidURL("http://regexr.com/39nr7a?q=1&r=aa"))
            .toBe(true);
        expect(isValidURL("jestjs.io/docs/getting-started"))
            .toBe(true);
        expect(isValidURL("jestjs.io:5500/docs/getting-started"))
            .toBe(true);
        expect(isValidURL("http://112.137.129.115"))
            .toBe(true);
        expect(isValidURL("http://localhost:5000"))
            .toBe(true);

        expect(isValidURL("https://jestjs.io/docs/getting-started 12"))
            .toBe(false);
        expect(isValidURL("go to bar"))
            .toBe(false);
    })
})