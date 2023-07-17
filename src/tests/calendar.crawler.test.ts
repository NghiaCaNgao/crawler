import { describe, expect, test } from "@jest/globals";
import CalendarGetter from "../core/calendar.get";
import Crawler from "../core/crawler";
import { CalendarOption, CrawlerOption } from "../types";

// Expected data
// ====================================================
import GetCalendarOutput_1 from "./server_test/data/test_get_calendar_1.json";
import GetCalendarOutput_2 from "./server_test/data/test_get_calendar_2.json";
import GetCalendarOutput_3 from "./server_test/data/test_get_calendar_3.json";

import ParseFuncInput_1 from "./server_test/data/test_parse_calendar_crawler_input_1.json";
import ParseFuncInput_2 from "./server_test/data/test_parse_calendar_crawler_input_2.json";
import ParseFuncInput_3 from "./server_test/data/test_parse_calendar_crawler_input_3.json";

import ParseFuncOutput_1 from "./server_test/data/test_parse_calendar_crawler_output_1.json";
// ====================================================

describe("Calendar Crawler testing pack", () => {
    describe("Constructor", () => {
        test("Constructor without options", () => {
            const test = new CalendarGetter();

            const result: CalendarOption = {
                host: test.host,
                keyMap: test.keyMap,
                semesterID: test.semesterID,
                subjectID: test.subjectID,
                subjectClassID: test.subjectClassID,
                subjectName: test.subjectName,
                teacherName: test.teacherName,
                amphitheater: test.amphitheater,
                day: test.day,
            }
            expect(result).toEqual(CalendarGetter.DEFAULT_OPTIONS);
        })

        test("Constructor with options", () => {
            const test = new CalendarGetter({
                semesterID: "037",
                subjectName: "1234",
                subjectClassID: "1234",
                amphitheater: "1234",
                subjectID: "1234",
                teacherName: "1234",
                day: "2"
            });

            const result: CalendarOption = {
                host: test.host,
                keyMap: test.keyMap,
                semesterID: test.semesterID,
                subjectID: test.subjectID,
                subjectClassID: test.subjectClassID,
                subjectName: test.subjectName,
                teacherName: test.teacherName,
                amphitheater: test.amphitheater,
                day: test.day,
            }

            expect(result).toEqual({
                host: CalendarGetter.DEFAULT_OPTIONS.host,
                keyMap: CalendarGetter.DEFAULT_OPTIONS.keyMap,
                ...result
            });
        });

        test("Constructor with error", () => {
            expect(() => new CalendarGetter({ subjectID: "00" }))
                .toThrowError("'00' is not a valid subject ID format. Eg. 1234")
        })
    });

    describe("Getters/ Setters", () => {
        const instance = new CalendarGetter();

        test("`semesterID` prop", () => {
            const tester = (semesterID: string) => {
                instance.semesterID = semesterID;
                return instance.semesterID;
            }

            // FIXME:
            expect(tester(undefined)).toBe(CalendarGetter.DEFAULT_OPTIONS.semesterID)
            expect(tester("78")).toBe("78");

            expect(() => tester("-1")).toThrowError("'-1' is not a valid semester ID format. Eg. 78");
        })

        test("`subjectID` prop", () => {
            const tester = (subjectID: string) => {
                instance.subjectID = subjectID;
                return instance.subjectID;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("1234")).toBe("1234");

            expect(() => tester("12345")).toThrowError("'12345' is not a valid subject ID format. Eg. 1234");
        })

        test("`subjectClassID` prop", () => {
            const tester = (subjectClassID: string) => {
                instance.subjectClassID = subjectClassID;
                return instance.subjectClassID;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("1234")).toBe("1234");

            expect(() => tester("12345")).toThrowError("'12345' is not a valid subject class ID format. Eg. 1234");
        })

        test("`subjectName` prop", () => {
            const tester = (subjectName: string) => {
                instance.subjectName = subjectName;
                return instance.subjectName;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("1234")).toBe("1234");

            expect(() => tester("12345")).toThrowError("'12345' is not a valid subject's name format. Eg. 1234");
        })

        test("`teacherName` prop", () => {
            const tester = (teacherName: string) => {
                instance.teacherName = teacherName;
                return instance.teacherName;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("1234")).toBe("1234");

            expect(() => tester("12345")).toThrowError("'12345' is not a valid teacher's name format. Eg. 1234");
        })

        test("`amphitheater` prop", () => {
            const tester = (amphitheater: string) => {
                instance.amphitheater = amphitheater;
                return instance.amphitheater;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("1234")).toBe("1234");

            expect(() => tester("12345")).toThrowError("'12345' is not a valid amphitheater format. Eg. 1234");
        })

        test("`day` prop", () => {
            const tester = (day: string) => {
                instance.day = day;
                return instance.day;
            }

            expect(tester(undefined)).toBe(undefined)
            expect(tester("CN")).toBe("CN");
            expect(tester("2")).toBe("2");

            expect(() => tester("1")).toThrowError("'1' is not a valid day. Eg. CN");
        })
    })

    describe("Utils functions", () => {
        const instance = new CalendarGetter();

        test("`parseLesson` func", () => {
            const tester = (input: string) => {
                return instance["parseLesson"](input);
            }

            expect(tester("3-4")).toStrictEqual([3, 4]);

            expect(() => tester("2-3-4")).toThrow("Too many or too few lessons. Must be 2.");
            expect(() => tester("2-")).toThrow("First lesson can not be greater than the last.");
            expect(() => tester("4-3")).toThrow("First lesson can not be greater than the last.");
            expect(() => tester("0-3")).toThrow("Lesson can not be zero.");
            expect(() => tester("3-15")).toThrow("Lesson can not be greater than 14.");
            expect(() => tester("10-a")).toThrow("Some lessons is not correct.");
        });

        test("`parse` func", () => {
            const tester = (data: string) => {
                return instance["parse"](data);
            }

            expect(tester(ParseFuncInput_1.data)).toStrictEqual(ParseFuncOutput_1); // Pass
            expect(() => tester(ParseFuncInput_2.data)).toThrow("Too many or too few fields."); // Fail
            expect(() => tester(ParseFuncInput_3.data)).toThrow("Too many or too few lessons. Must be 2."); // Fail
        })

        test("'getCalendar' func", async () => {
            const instance = new CalendarGetter(
                {
                    host: "http://localhost:5000/calendar",
                    keyMap: new Map(Object.entries({
                        is_fail: "fail_test_num"
                    }))
                });

            const tester = async (query = {}) => {
                instance.
                return await instance.getCalendar();
            }

            expect(await tester()).toStrictEqual(GetCalendarOutput_1); // Pass

            expect(await tester()).toStrictEqual(GetCalendarOutput_2); // Pass
            expect(await tester()).toStrictEqual(GetCalendarOutput_3) // Pass

        })
    })
})