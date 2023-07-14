import { describe, expect, test } from "@jest/globals";
import SubjectCrawler from "../core/subject.crawler";
import { SubjectOption } from "../types";

describe("Subject Crawler testing pack", () => {
    describe("Tests constructor.", () => {
        test("Constructor without options", () => {
            const test = new SubjectCrawler();

            const result: SubjectOption = {
                host: test.host,
                keyMap: test.keyMap,
                semesterID: test.semesterID,
                limit: test.limit,
                page: test.page,
                studentID: test.studentID,
                studentName: test.studentName,
                studentDateBirth: test.studentDateBirth,
                studentOfficialClass: test.studentOfficialClass,
                subjectClassID: test.subjectClassID,
                subjectClassName: test.subjectClassName,
                subjectGroup: test.subjectGroup,
                subjectCreditNumber: test.subjectCreditNumber,
                subjectNote: test.subjectNote
            }
            expect(result).toEqual(SubjectCrawler.DEFAULT_OPTIONS);
        })

        test("Constructor with options", () => {
            const test = new SubjectCrawler({
                semesterID: "037",
                limit: 2000,
                page: 2,
                studentID: "21020000",
                studentName: "Kaka",
                studentDateBirth: "01/01/2000",
                studentOfficialClass: "QH-2021-I/CQ-C-B",
                subjectClassID: "HIS1001 1",
                subjectClassName: "Hello",
                subjectGroup: "CL",
                subjectCreditNumber: 2,
                subjectNote: "Học cải thiện"
            });

            const result: SubjectOption = {
                host: test.host,
                keyMap: test.keyMap,
                semesterID: test.semesterID,
                limit: test.limit,
                page: test.page,
                studentID: test.studentID,
                studentName: test.studentName,
                studentDateBirth: test.studentDateBirth,
                studentOfficialClass: test.studentOfficialClass,
                subjectClassID: test.subjectClassID,
                subjectClassName: test.subjectClassName,
                subjectGroup: test.subjectGroup,
                subjectCreditNumber: test.subjectCreditNumber,
                subjectNote: test.subjectNote
            }

            expect(result).toEqual({
                host: SubjectCrawler.DEFAULT_OPTIONS.host,
                keyMap: SubjectCrawler.DEFAULT_OPTIONS.keyMap,
                ...result
            });
        })
    });

    describe("getters/setters", () => {
        const testSubjectCrawler = new SubjectCrawler();

        test("`limit` prop", () => {
            const tester = (limit: number) => {
                testSubjectCrawler.limit = limit;
                return testSubjectCrawler.limit;
            }

            expect(tester(0)).toBe(0);
            expect(tester(5000)).toBe(5000);
            expect(tester(2000)).toBe(2000);

            expect(() => tester(-1)).toThrowError("'-1' is not in range [0, 5000].");
            expect(() => tester(6000)).toThrowError("'6000' is not in range [0, 5000].");
        });

        test("`semesterID` prop", () => {
            const tester = (semesterID: string) => {
                testSubjectCrawler.semesterID = semesterID;
                return testSubjectCrawler.semesterID;
            }

            expect(tester("036")).toBe("036");
            expect(tester("000")).toBe("000");

            expect(() => tester("0367")).toThrowError("'0367' is not a valid semester ID format. Eg. 036");
            expect(() => tester("abc")).toThrowError("'abc' is not a valid semester ID format. Eg. 036");
            expect(() => tester("012abc")).toThrowError("'012abc' is not a valid semester ID format. Eg. 036");
        })

        test("`studentID` prop", () => {
            const tester = (studentID: string) => {
                testSubjectCrawler.studentID = studentID;
                return testSubjectCrawler.studentID;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("21020365")).toBe("21020365");
            expect(tester("00000000")).toBe("00000000");

            expect(() => tester("2102036")).toThrowError("'2102036' is not a valid student ID format. Eg. 21020366");
            expect(() => tester("2102036a")).toThrowError("'2102036a' is not a valid student ID format. Eg. 21020366");
            expect(() => tester("2102a123")).toThrowError("'2102a123' is not a valid student ID format. Eg. 21020366");
        })

        test("`studentName` prop", () => {
            const tester = (studentName: string) => {
                testSubjectCrawler.studentName = studentName;
                return testSubjectCrawler.studentName;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("do tuan nghia")).toBe("do tuan nghia");
            expect(tester("  do  ")).toBe("do");

            expect(() => tester("  ")).toThrowError("Student's name could not be empty.");
        })

        test("`studentDateBirth` prop", () => {
            const tester = (studentDateBirth: string) => {
                testSubjectCrawler.studentDateBirth = studentDateBirth;
                return testSubjectCrawler.studentDateBirth;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("19/12/2002")).toBe("19/12/2002");
            expect(tester("12/19/2002")).toBe("12/19/2002");

            expect(() => tester("19.12.2002")).toThrowError("'19.12.2002' is not a valid date format. Eg. dd/mm/yyyy");
            expect(() => tester("2/1/2002")).toThrowError("'2/1/2002' is not a valid date format. Eg. dd/mm/yyyy");
            expect(() => tester("2/1/02  ")).toThrowError("'2/1/02  ' is not a valid date format. Eg. dd/mm/yyyy");
        })

        test("`studentOfficialClass` prop", () => {
            const tester = (studentOfficialClass: string) => {
                testSubjectCrawler.studentOfficialClass = studentOfficialClass;
                return testSubjectCrawler.studentOfficialClass;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("QH-2022-I/CQ-A-E")).toBe("QH-2022-I/CQ-A-E");
            expect(tester("QH-2018-I/CQ-Đ-A-CLC1")).toBe("QH-2018-I/CQ-Đ-A-CLC1");
            expect(tester("QH-2019-I/CQ-K1")).toBe("QH-2019-I/CQ-K1");

            expect(() => tester("QH-2019-I/CQ-K1     "))
                .toThrowError("'QH-2019-I/CQ-K1     ' is not a valid official class format. Eg. QH-2019-I/CQ-M-CLC1");
            expect(() => tester("QH- 2019-I/CQ-K1"))
                .toThrowError("'QH- 2019-I/CQ-K1' is not a valid official class format. Eg. QH-2019-I/CQ-M-CLC1");
        })

        test("`subjectClassID` prop", () => {
            const tester = (subjectClassID: string) => {
                testSubjectCrawler.subjectClassID = subjectClassID;
                return testSubjectCrawler.subjectClassID;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("INT1004 2")).toBe("INT1004 2");
            expect(tester("INT1004 23")).toBe("INT1004 23");

            expect(() => tester("INT1004 23     "))
                .toThrowError("'INT1004 23     ' is not a valid subject class ID format. Eg: HIS1001 1");
            expect(() => tester("INT103"))
                .toThrowError("'INT103' is not a valid subject class ID format. Eg: HIS1001 1");
        })

        test("`subjectClassName` prop", () => {
            const tester = (subjectClassName: string) => {
                testSubjectCrawler.subjectClassName = subjectClassName;
                return testSubjectCrawler.subjectClassName;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("Mạng máy tính")).toBe("Mạng máy tính");

            expect(() => tester("     ")).toThrowError("Subject class's name could not be empty.");
        })

        test("`subjectGroup` prop", () => {
            const tester = (subjectGroup: string) => {
                testSubjectCrawler.subjectGroup = subjectGroup;
                return testSubjectCrawler.subjectGroup;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("1")).toBe("1");
            expect(tester("CL")).toBe("CL");

            expect(() => tester("CLa")).toThrowError("'CLa' is not a valid subject group format. Eg. 1 or CL");
            expect(() => tester("a1")).toThrowError("'a1' is not a valid subject group format. Eg. 1 or CL");
        })

        test("`subjectCreditNumber` prop", () => {
            const tester = (subjectCredit: number) => {
                testSubjectCrawler.subjectCreditNumber = subjectCredit;
                return testSubjectCrawler.subjectCreditNumber;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester(1)).toBe(1);
            expect(tester(19)).toBe(19);

            expect(() => tester(-1)).toThrowError("Subject credit number must be in range [1,19].");
            expect(() => tester(20)).toThrowError("Subject credit number must be in range [1,19].");
            expect(() => tester(0)).toThrowError("Subject credit number must be in range [1,19].");
        })

        test("`subjectNote` prop", () => {
            const tester = (subjectNote: string) => {
                testSubjectCrawler.subjectNote = subjectNote;
                return testSubjectCrawler.subjectNote;
            }

            expect(tester(undefined)).toBe(undefined);
            expect(tester("a")).toBe("a");
            expect(tester("a   ")).toBe("a");
        })

        test("`page` prop", () => {
            const tester = (page: number) => {
                testSubjectCrawler.page = page;
                return testSubjectCrawler.page;
            }

            expect(tester(1)).toBe(1);
            expect(() => tester(0)).toThrowError("Page number must be greater than 0.");
        })
    });


});