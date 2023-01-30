import { describe, expect, test } from "@jest/globals";
import CalendarCrawler from "../core/calendar.crawler";
import Crawler from "../core/crawler";
import { CrawlerOption, Query } from "../types";

import GetCalendarOutput_1 from "./server_test/data/test_get_calendar_1.json";
import GetCalendarOutput_2 from "./server_test/data/test_get_calendar_2.json";
import GetCalendarOutput_3 from "./server_test/data/test_get_calendar_3.json";
import ParseFuncInput_1 from "./server_test/data/test_parse_calendar_crawler_input_1.json";
import ParseFuncInput_2 from "./server_test/data/test_parse_calendar_crawler_input_2.json";
import ParseFuncInput_3 from "./server_test/data/test_parse_calendar_crawler_input_3.json";
import ParseFuncOutput_1 from "./server_test/data/test_parse_calendar_crawler_output_1.json";

describe("Calendar Crawler Testing", () => {
    describe("Constructor testing", () => {
        test("Test default constructor", () => {
            const instance_1 = new CalendarCrawler();
            const instance_2 = new CalendarCrawler({
                host: "http://localhost:5000/calendar",
                keyMap: new Map<string, string>(Object.entries({ a: "b", c: "d" }))
            });

            const DEFAULT_VALUE: CrawlerOption = {
                host: "http://112.137.129.115/tkb/listbylist.php",
                limit: Crawler.DEFAULT_VALUE.limit,
                semesterID: Crawler.DEFAULT_VALUE.semesterID,
                keyMap: Crawler.DEFAULT_VALUE.keyMap
            }

            const CUSTOM_VALUE: CrawlerOption = {
                host: "http://localhost:5000/calendar",
                limit: Crawler.DEFAULT_VALUE.limit,
                semesterID: Crawler.DEFAULT_VALUE.semesterID,
                keyMap: new Map<string, string>(Object.entries({ a: "b", c: "d" }))
            }

            expect({
                host: instance_1.host,
                limit: instance_1.limit,
                semesterID: instance_1.semesterID,
                keyMap: instance_1.keyMap
            }).toEqual(DEFAULT_VALUE);

            expect({
                host: instance_2.host,
                limit: instance_2.limit,
                semesterID: instance_2.semesterID,
                keyMap: instance_2.keyMap
            }).toEqual(CUSTOM_VALUE);
        })
    });

    describe("Test function", () => {
        const instance = new CalendarCrawler();

        test("Test 'parseLesson' function", () => {
            const tester = (input: string) => {
                return instance["parseLesson"](input);
            }

            expect(() => tester("2-3-4")).toThrow("Too many or too few lessons. Must be 2");
            expect(() => tester("4-3")).toThrow("First lesson can not be greater than the last");
            expect(() => tester("0-3")).toThrow("Lesson can not be zero");
            expect(() => tester("3-15")).toThrow("Lesson can not greater than 14");
            expect(() => tester("10-a")).toThrow("Some lessons is not correct");
            expect(tester("3-4")).toStrictEqual([3, 4]);
        });

        test("Test 'parse' function", () => {
            const tester = (data: string) => {
                return instance["parse"](data);
            }

            expect(tester(ParseFuncInput_1.data)).toStrictEqual(ParseFuncOutput_1); // Pass
            expect(() => tester(ParseFuncInput_2.data)).toThrow("Too many or too few fields."); // Fail
            expect(() => tester(ParseFuncInput_3.data)).toThrow("Too many or too few lessons. Must be 2"); // Fail
        })

        test("Test 'getCalendar' function", async () => {
            const instance = new CalendarCrawler(
                {
                    host: "http://localhost:5000/calendar",
                    keyMap: new Map(Object.entries({
                        is_fail: "fail_test_num"
                    }))
                });

            const tester = async (query?: Query) => {
                return await instance.getCalendar(query);
            }
            // await tester()
            expect(await tester()).toStrictEqual(GetCalendarOutput_1); // Pass
            expect(await tester({ is_fail: 2 })).toStrictEqual(GetCalendarOutput_2); // Pass
            expect(await tester({ is_fail: 3 })).toStrictEqual(GetCalendarOutput_3) // Pass

        })
    })
})