import { describe, expect, test } from "@jest/globals";
import Crawler from "../core/crawler";
import { CrawlerOption, Query, Response } from "../types";

import expectedFetchValue_1 from "./server_test/data/test_fetch_1.json";
import expectedFetchValue_2 from "./server_test/data/test_fetch_2.json";
import expectedFetchValue_3 from "./server_test/data/test_fetch_3.json";
import expectedParseResponseInput_1 from "./server_test/data/test_parseResponse_input_1.json";
import expectedParseResponseInput_2 from "./server_test/data/test_parseResponse_input_2.json";
import expectedParseResponseInput_3 from "./server_test/data/test_parseResponse_input_3.json";
import expectedParseResponseInput_4 from "./server_test/data/test_parseResponse_input_4.json";
import expectedParseResponseInput_5 from "./server_test/data/test_parseResponse_input_5.json";
import expectedParseResponseOutput_1 from "./server_test/data/test_parseResponse_output_1.json";
import expectedParseResponseOutput_2 from "./server_test/data/test_parseResponse_output_2.json";
import expectedParseResponseOutput_3 from "./server_test/data/test_parseResponse_output_3.json";
import expectedParseResponseOutput_4 from "./server_test/data/test_parseResponse_output_4.json";
import expectedParseResponseOutput_5 from "./server_test/data/test_parseResponse_output_5.json";

// Fake derived class of Crawler class
class FakeDerivedClass extends Crawler {
    public constructor(option: CrawlerOption = {}) {
        super(option)
    }

    protected parse(data: string): object {
        if (data === "error")
            throw new Error("Method not implemented.");
        else return JSON.parse(data);
    }
}

const DEFAULT_VALUE = {
    host: "http://112.137.129.115/tkb/listbylist.php",
    limit: 1000,
    semesterID: "036",
    keyMap: new Map<string, string>()
}

describe("Crawler testing pack", () => {
    describe("Test constructor", () => {
        test("Test default properties when calling constructor", () => {
            let instance = new FakeDerivedClass();

            expect({
                host: instance.host,
                limit: instance.limit,
                semesterID: instance.semesterID,
                keyMap: instance.keyMap
            }).toEqual(DEFAULT_VALUE);
        })
    })

    describe("Test getter/setter", () => {
        let instance = new FakeDerivedClass();

        test("Test 'host' property", () => {
            const tester = (host_test: string) => {
                instance.host = host_test;
                return instance.host;
            }

            const test_pass = "https://jestjs.io/docs/getting-started";
            const test_fail = "chau len bar";

            expect(tester(test_pass)).toBe(test_pass);
            expect(() => tester(test_fail)).toThrow(test_fail + " is not a valid host url");
        });

        test("Test 'limit' property", () => {
            const tester = (limit_test: number) => {
                instance.limit = limit_test;
                return instance.limit;
            }

            const test_pass = 3100;
            const test_fail = -1000;

            expect(tester(test_pass)).toBe(test_pass);
            expect(() => tester(test_fail)).toThrow(test_fail + " is not in range [0, 5000]");
        });

        test("Test 'semesterID' property", () => {
            const tester = (semesterID_test: string) => {
                instance.semesterID = semesterID_test;
                return instance.semesterID;
            }

            const test_pass = "035";
            const test_fail_1 = "0356";
            const test_fail_2 = "0a3";

            expect(tester(test_pass)).toBe(test_pass);
            expect(() => tester(test_fail_1)).toThrow(test_fail_1 + " is not a valid semester ID");
            expect(() => tester(test_fail_2)).toThrow(test_fail_2 + " is not a valid semester ID");
        })

        test("Test 'keyMap' property", () => {
            const tester = (keyMap_test: Map<string, string>) => {
                instance.keyMap = keyMap_test;
                return instance.keyMap;
            }

            var test_pass = new Map<string, string>(Object.entries({
                "a": "b",
                "c": "d"
            }));

            expect(tester(test_pass)).toBe(test_pass);
        })
    })

    describe("Test functions", () => {
        test("Test 'joinParams' function", () => {
            let instance = new FakeDerivedClass({
                keyMap: new Map<string, string>(Object.entries({
                    "a": "b",
                    "c": "d"
                }))
            });

            const tester = (query: Query) => {
                return instance["joinParams"](query);
            }

            const test_pass: Query = {
                "a": 10,
                "c": "hello",
            }
            const test_fail: Query = {
                "a": 10,
                "c": "hello",
                "d": true
            }

            expect(tester(test_pass)).toBe(DEFAULT_VALUE.host + "?b=10&d=hello");
            expect(() => tester(test_fail)).toThrow("d is not in query type");
        })
    });

    test("Test 'fetch' function", async () => {
        const instance = new FakeDerivedClass({
            host: "http://localhost:5000",
            limit: 0,
            semesterID: "000",
            keyMap: new Map(Object.entries({
                "a": "b",
                "c": "d"
            }))
        });

        const tester = async (host: string, query: Query) => {
            instance.host = host;
            return await instance["fetch"](query);
        };

        expect(await tester("http://localhost:5000", { a: "12", c: 10 })).toStrictEqual(expectedFetchValue_1);
        expect(await tester("http://localhost:5001", { a: "12", c: 10 })).toStrictEqual(expectedFetchValue_2); // fail
        expect(await tester("http://localhost:5000", { a: "12", c: 11 })).toStrictEqual(expectedFetchValue_3); // fail
    });

    test("Test 'parseResponse' function", () => {
        const instance = new FakeDerivedClass();

        const tester = (value: Response<string>, handle?: (data: string) => Response<object>) => {
            return instance["parseResponse"]<object>(value, handle);
        }

        const parse_tester = (data: string): Response<object> => {
            if (data === "error") throw new Error("This method throw an error.")
            else return JSON.parse(data);
        }

        expect(tester(expectedParseResponseInput_1)).toStrictEqual(expectedParseResponseOutput_1); // fail
        expect(tester(expectedParseResponseInput_2)).toStrictEqual(expectedParseResponseOutput_2); // fail
        expect(tester(expectedParseResponseInput_3)).toStrictEqual(expectedParseResponseOutput_3); // pass
        expect(tester(expectedParseResponseInput_4, parse_tester)).toStrictEqual(expectedParseResponseOutput_4); // fail
        expect(tester(expectedParseResponseInput_5, parse_tester)).toStrictEqual(expectedParseResponseOutput_5); // pass
    })
})