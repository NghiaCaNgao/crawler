import { CalendarOption, CalendarResponse, CrawlerOption, Response } from "../types";
import CalendarGetter from "./calendar.get";

type DOC = CalendarOption & CrawlerOption;

export class CalendarCrawler<
    T extends CrawlerOption = CrawlerOption,
    Q extends CalendarOption = CalendarOption> extends CalendarGetter<T, Q> {

    private _cQuery: Q;

    public static readonly DEFAULT_OPTIONS: DOC = {
        semesterID: "78",
        host: "http://112.137.129.115/tkb/listbylist.php",
        keyMap: new Map<string, string>(Object.entries({
            semesterID: "slt_namhoc",
            subjectID: "slt_mamonhoc_filter",
            subjectClassID: "slt_malopmonhoc_filter",
            subjectName: "slt_monhoc_filter",
            teacherName: "slt_giaovien_filter",
            day: "slt_thu_filter",
            amphitheater: "slt_giangduong_filter"
        }))
    }

    constructor(query?: Q, host?: string) {
        super({
            keyMap: CalendarCrawler.DEFAULT_OPTIONS.keyMap,
            host: host || CalendarCrawler.DEFAULT_OPTIONS.host
        } as T);

        this._cQuery = {} as Q; // initialize
        this.cQuery = query || {} as Q // set query
    }

    public set cQuery(query: Q) {
        this.query = this._cQuery = this.verifyQuery(query);
    }

    public get cQuery(): Q {
        return this._cQuery;
    }

    private verifySemesterID(semesterID: string): string {
        const regex = /^\d{2,3}$/g;

        if (semesterID === undefined) return;

        if (semesterID.search(regex) >= 0) {
            return semesterID;
        } else throw new Error("'" + semesterID + "' is not a valid semester ID format. Eg. 78")
    }

    private verifySubjectID(subjectID: string): string {
        const regex = /^\d{4}$/g;

        if (subjectID === undefined) return;

        if (subjectID.search(regex) >= 0) {
            return subjectID;
        } else throw new Error("'" + subjectID + "' is not a valid subject ID format. Eg. 1234")
    }

    private verifySubjectClassID(subjectClassID: string) {
        const regex = /^\d{4}$/;

        if (subjectClassID === undefined) return;

        if (subjectClassID.search(regex) >= 0) {
            return subjectClassID;
        } else throw new Error("'" + subjectClassID + "' is not a valid subject class ID format. Eg. 1234");
    }

    private verifySubjectName(subjectName: string) {
        const regex = /^\d{4}$/;

        if (subjectName === undefined) return;

        if (subjectName.search(regex) >= 0) {
            return subjectName;
        } else throw new Error("'" + subjectName + "' is not a valid subject's name format. Eg. 1234");
    }

    private verifyTeacherName(teacherName: string) {
        const regex = /^\d{4}$/;

        if (teacherName === undefined) return;

        if (teacherName.search(regex) >= 0) {
            return teacherName;
        } else throw new Error("'" + teacherName + "' is not a valid teacher's name format. Eg. 1234");
    }

    private verifyAmphitheater(amphitheater: string) {
        const regex = /^\d{4}$/;

        if (amphitheater === undefined) return;

        if (amphitheater.search(regex) >= 0) {
            return amphitheater;
        } else throw new Error("'" + amphitheater + "' is not a valid amphitheater format. Eg. 1234");
    }

    private verifyDay(day: string) {
        const regex = /[2-7]|CN/;

        if (day === undefined) return;

        if (day.search(regex) >= 0) {
            return day;
        } else throw new Error("'" + day + "' is not a valid day. Eg. CN");
    }

    private verifyQuery(query: Q): Q {
        const { semesterID, subjectID, subjectClassID, subjectName,
            teacherName, amphitheater, day, ...rest } = query;

        return {
            semesterID: this.verifySemesterID(semesterID || CalendarCrawler.DEFAULT_OPTIONS.semesterID),
            amphitheater: this.verifyAmphitheater(amphitheater),
            subjectID: this.verifySubjectID(subjectID),
            subjectClassID: this.verifySubjectClassID(subjectClassID),
            subjectName: this.verifySubjectName(subjectName),
            teacherName: this.verifyTeacherName(teacherName),
            day: this.verifyDay(day),
            ...rest
        } as Q;
    }

    public override async getCalendar(query?: Q): Promise<Response<CalendarResponse>> {
        return await super.getCalendar(this.verifyQuery(query))
    }
}