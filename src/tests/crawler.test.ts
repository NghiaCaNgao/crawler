import { describe, expect, test } from "@jest/globals";
import { CrawlerOption, Response } from "../types";
import Crawler, { MethodType } from "../core/crawler";

// Expected data
// ====================================================
import FetchValueOutput_1 from "./server_test/data/test_fetch_1.json";
import FetchValueOutput_2 from "./server_test/data/test_fetch_2.json";
import FetchValueOutput_3 from "./server_test/data/test_fetch_3.json";
import FetchValueOutput_4 from "./server_test/data/test_fetch_4.json";

import ParseResponseInput_1 from "./server_test/data/test_parseResponse_input_1.json";
import ParseResponseInput_2 from "./server_test/data/test_parseResponse_input_2.json";
import ParseResponseInput_3 from "./server_test/data/test_parseResponse_input_3.json";
import ParseResponseInput_4 from "./server_test/data/test_parseResponse_input_4.json";
import ParseResponseInput_5 from "./server_test/data/test_parseResponse_input_5.json";

import ParseResponseOutput_1 from "./server_test/data/test_parseResponse_output_1.json";
import ParseResponseOutput_2 from "./server_test/data/test_parseResponse_output_2.json";
import ParseResponseOutput_3 from "./server_test/data/test_parseResponse_output_3.json";
import ParseResponseOutput_4 from "./server_test/data/test_parseResponse_output_4.json";
import ParseResponseOutput_5 from "./server_test/data/test_parseResponse_output_5.json";
// ====================================================

// Fake derived class of Crawler class and interface
interface FakeOption extends CrawlerOption {
    a?: number,
    c?: string,
    d?: boolean
}

class FakeDerivedClass extends Crawler {
    public constructor(option: FakeOption = {}) {
        super(option)
    }

    protected parse(data: string): object {
        if (data === "error")
            throw new Error("Have some errors occurred during parsing.");
        else return JSON.parse(data);
    }
}

const DEFAULT_OPTIONS: CrawlerOption = Crawler.DEFAULT_OPTIONS;

describe("Crawler abstract class testing pack.", () => {
    describe("Constructor", () => {
        test("Default properties without options", () => {
            let instance = new FakeDerivedClass();

            expect({
                host: instance.host,
                keyMap: instance.keyMap
            }).toEqual(DEFAULT_OPTIONS);
        });

        test("Default properties with options", () => {
            const FEED_VALUE: FakeOption = {
                host: "http://localhost:5000",
                keyMap: new Map<string, string>(Object.entries({
                    a: "b",
                    c: "d",
                    d: "e",
                })),
            }

            let instance = new FakeDerivedClass({
                host: FEED_VALUE.host,
                keyMap: FEED_VALUE.keyMap,
            });

            expect({
                host: instance.host,
                keyMap: instance.keyMap
            }).toEqual(FEED_VALUE);


            expect(() => {
                new FakeDerivedClass({
                    host: "Example url",
                    keyMap: new Map<string, string>()
                })
            }).toThrowError("'Example url' is not a valid host.")
        });
    })

    describe("getters/setters", () => {
        let instance = new FakeDerivedClass();

        test("'host' property", () => {
            const tester = (host: string) => {
                instance.host = host;
                return instance.host;
            }

            const test_pass = "https://jestjs.io/docs/getting-started";
            const test_fail = "you len bar";

            expect(tester(undefined)).toBe(Crawler.DEFAULT_OPTIONS.host)
            expect(tester(test_pass)).toBe(test_pass);
            expect(() => tester(test_fail)).toThrowError("'" + test_fail + "' is not a valid host.");
        });

        test("'keyMap' property", () => {
            const tester = (keyMap_test: Map<string, string>) => {
                instance.keyMap = keyMap_test;
                return instance.keyMap;
            }

            var test_pass = new Map<string, string>(Object.entries({
                "a": "b",
                "c": "d"
            }));

            expect(tester(undefined)).toBe(Crawler.DEFAULT_OPTIONS.keyMap)
            expect(tester(test_pass)).toBe(test_pass);
        });
    })

    describe("Utils functions", () => {
        let instance = new FakeDerivedClass({
            keyMap: new Map<string, string>(Object.entries({
                "a": "b",
                "c": "d"
            }))
        });

        test("`isValidKey` func", () => {
            const tester = (key: string) => {
                return instance["isValidKey"](key);
            }

            expect(tester("host")).toBe(false);
            expect(tester("keyMap")).toBe(false);
            expect(tester("a")).toBe(true);
            expect(tester("m")).toBe(false);
        });

        test("`renameKey` func", () => {
            const tester = (query: FakeOption) => {
                return instance["renameKey"](query);
            }

            const test_pass: FakeOption = {
                a: 10,
                c: "hello",
            }
            const test_fail: FakeOption = {
                "a": 10,
                "c": "hello",
                "d": true
            }

            expect(tester(test_pass)).toStrictEqual({
                b: 10,
                d: "hello"
            });
            expect(() => tester(test_fail)).toThrowError("'d' is not in key map.")

        })
    });

    test("`fetch` func", async () => {
        const instance = new FakeDerivedClass({
            host: "http://localhost:5000",
            keyMap: new Map(Object.entries({
                "a": "d",
                "c": "b"
            }))
        });

        const tester = async (host: string, query: FakeOption, method?: MethodType) => {
            instance.host = host;
            return await instance["fetch"](query, method);
        };

        // Pass
        expect(await tester("http://localhost:5000", { c: "12", a: 10 })).toStrictEqual(FetchValueOutput_1);
        // Pass
        expect(await tester("http://localhost:5000", { c: "12", a: 10 }, "POST_URL_ENCODED"))
            .toStrictEqual(FetchValueOutput_1);
        // failed to connect
        expect(await tester("http://localhost:5001", { c: "12", a: 10 })).toStrictEqual(FetchValueOutput_2);
        // failed to resolve params
        expect(await tester("http://localhost:5000", { c: "12", a: 11 })).toStrictEqual(FetchValueOutput_3);
        // Failed to resolve params
        expect(await tester("http://localhost:5000", { c: "12", a: 11 })).toStrictEqual(FetchValueOutput_4);

    });

    test("`parseResponse` func", () => {
        const instance = new FakeDerivedClass();

        const tester = (value: Response<string>, handle?: (data: string) => Response<object>) => {
            return instance["parseResponse"]<object>(value, handle);
        }

        const parse_tester = (data: string): Response<object> => {
            if (data === "error") throw new Error("This method throw an error.")
            else return JSON.parse(data);
        }

        // Failed due to incorrect status code
        expect(tester(ParseResponseInput_1)).toStrictEqual(ParseResponseOutput_1);
        // Failed due to have some errors in parsing function
        expect(tester(ParseResponseInput_2)).toStrictEqual(ParseResponseOutput_2);
        // Passed
        expect(tester(ParseResponseInput_3)).toStrictEqual(ParseResponseOutput_3);
        // Failed due to have some errors in parsing function
        expect(tester(ParseResponseInput_4, parse_tester)).toStrictEqual(ParseResponseOutput_4); // fail
        // Passed
        expect(tester(ParseResponseInput_5, parse_tester)).toStrictEqual(ParseResponseOutput_5); // pass
    })
});