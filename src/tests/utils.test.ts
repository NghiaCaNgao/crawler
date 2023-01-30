import { describe, expect, test } from '@jest/globals';
import { isExactMatch, isValidURL } from "../utils"

describe("Utils testing", () => {
    test("Test isExactMatch", () => {
        var regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig; // URL checker

        expect(isExactMatch(regex, "https://jestjs.io/docs/getting-started"))
            .toBe(true);
        expect(isExactMatch(regex, "jestjs.io/docs/getting-started"))
            .toBe(true);
        expect(isExactMatch(regex, "chau len bar"))
            .toBe(false);
        expect(isExactMatch(regex, "https://jestjs.io/docs/getting-started 12"))
            .toBe(false);
    });

    test("Test isValid URL", () => {
        expect(isValidURL("https://jestjs.io/docs/getting-started"))
            .toBe(true);
        expect(isValidURL("jestjs.io/docs/getting-started"))
            .toBe(false);
        expect(isValidURL("https://jestjs.io/docs/getting-started 12"))
            .toBe(false);
        expect(isValidURL("chau len bar"))
            .toBe(false);
    })
})