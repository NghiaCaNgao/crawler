import { Calendar, ResponseCalendar, Response, CalendarOption, CrawlerOption } from "../types";
import Crawler from "./crawler";

export default class CalendarCrawler extends Crawler {
    private _semesterID: string;
    private _subjectID: string;
    private _subjectClassID: string;
    private _subjectName: string;
    private _teacherName: string;
    private _amphitheater: string;
    private _day: string;

    public static readonly DEFAULT_VALUE: CalendarOption = {
        host: "http://112.137.129.115/tkb/listbylist.php",
        semesterID: "",
        subjectID: "",
        subjectClassID: "",
        subjectName: "",
        teacherName: "",
        amphitheater: "",
        day: "",
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

    public set semesterID(semesterID: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, semesterID)) {
            this._semesterID = semesterID;
        } else throw new Error("semesterID must be a number value");
    }

    public get semesterID(): string {
        return this._semesterID;
    }

    public set subjectID(subjectID: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, subjectID)) {
            this._subjectID = subjectID;
        } else throw new Error("subjectID must be a number value");
    }

    public get subjectID(): string {
        return this._subjectID;
    }

    public set subjectClassID(subjectClassID: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, subjectClassID)) {
            this._subjectClassID = subjectClassID;
        } else throw new Error("subjectClassID must be a number value");
    }

    public get subjectClassID(): string {
        return this._subjectClassID;
    }

    public set subjectName(subjectName: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, subjectName)) {
            this._subjectName = subjectName;
        } else throw new Error("subjectName must be a number value");
    }

    public get subjectName(): string {
        return this._subjectName;
    }

    public set teacherName(teacherName: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, teacherName)) {
            this._teacherName = teacherName;
        } else throw new Error("teacherName must be a number value");
    }

    public get teacherName(): string {
        return this._teacherName;
    }

    public set amphitheater(amphitheater: string) {
        const regex = /\d{4}/;
        if (isExactMatch(regex, amphitheater)) {
            this._amphitheater = amphitheater;
        } else throw new Error("amphitheater must be a number value");
    }

    public get amphitheater(): string {
        return this._amphitheater;
    }

    public set day(day: string) {
        const regex = /[2-7]|CN/;
        if (isExactMatch(regex, day)) {
            this._day = day;
        } else throw new Error("invalid value");
    }

    public get day(): string {
        return this._day;
    }

    constructor(option: CalendarOption = {}) {
        super(option || {
            host: CalendarCrawler.DEFAULT_VALUE.host,
            keyMap: CalendarCrawler.DEFAULT_VALUE.keyMap,
        });

        this.semesterID = option.semesterID || CalendarCrawler.DEFAULT_VALUE.semesterID;
        this.subjectID = option.subjectID || CalendarCrawler.DEFAULT_VALUE.subjectID;
        this.subjectClassID = option.subjectClassID || CalendarCrawler.DEFAULT_VALUE.subjectClassID;
        this.subjectName = option.subjectName || CalendarCrawler.DEFAULT_VALUE.subjectName;
        this.teacherName = option.teacherName || CalendarCrawler.DEFAULT_VALUE.teacherName;
        this.amphitheater = option.amphitheater || CalendarCrawler.DEFAULT_VALUE.amphitheater;
        this.day = option.day || CalendarCrawler.DEFAULT_VALUE.day;
    }

    /**
     * Convert lesson from "n-m" format to [n,m].
     * 
     * @param data input
     * @returns Array<number>
     */
    private parseLesson(data: string): Array<number> {
        const ans: Array<number> = data.split("-").map(item => Number(item));

        if (ans.length != 2) throw new Error("Too many or too few lessons. Must be 2")
        else if (ans[0] > ans[1]) throw new Error("First lesson can not be greater than the last");

        if (ans.some(item => item == 0)) throw new Error("Lesson can not be zero");
        if (ans.some(item => item > 14)) throw new Error("Lesson can not greater than 14");
        if (ans.some(item => isNaN(item))) throw new Error("Some lessons is not correct");
        return ans;
    }

    /**
     * @override
     * Parse data to correct form.
     * 
     * @param data 
     * @returns 
     */
    protected parse(data: string): ResponseCalendar {
        // Find all text matches with pattern <tr><td>....</td></tr>
        const rowContents: string[] = data.match(/<tr>(<td(.|\n)*?<\/td>)*<\/tr>/g)?.slice(2) || [];
        const rowData: Calendar[] = rowContents.map(item => {
            // Find all fields in given text. Each field places in <td></td>
            const colContents: string[] = item.match(/<td(.|\n)*?td>/g);
            const data: string[] = colContents.map(content =>
                content.match(/>(.|\n)*?</g)![0].slice(1, -1));

            // Convert
            if (data.length == 12) {
                return {
                    index: Number(data[0]),
                    courseSubjectID: data[1],
                    courseSubjectName: data[2],
                    courseCredits: Number(data[3]),
                    courseSubjectClassID: data[4],
                    teacherName: data[5],
                    studentCount: Number(data[6]),
                    lessonOfDay: data[7],
                    day: data[8],
                    lessons: this.parseLesson(data[9]),
                    amphitheater: data[10],
                    courseGroup: data[11],
                }
            } else throw new Error("Too many or too few fields.");
        });

        return {
            length: rowData.length,
            data: rowData
        }
    }

    /**
    * Endpoint model.
    * @returns {Promise<Response<ResponseCalendar>>}
    */

    public async getCalendar(query: CrawlerOption = {}): Promise<Response<ResponseCalendar>> {
        return this.parseResponse<ResponseCalendar>
            (await this.fetch(query)) as Response<ResponseCalendar>;
    }
}