import { Calendar, ResponseCalendar, Response, Query, CalendarOption } from "../types";
import Crawler from "./crawler";

export default class CalendarCrawler extends Crawler {
    private static readonly HostName: string = "http://112.137.129.115/tkb/listbylist.php";

    constructor(option: CalendarOption = {}) {
        super(option || {
            host: CalendarCrawler.HostName
        });
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

    public async getCalendar(query: Query = {}): Promise<Response<ResponseCalendar>> {
        return this.parseResponse<ResponseCalendar>
            (await this.fetch(query)) as Response<ResponseCalendar>;
    }
}