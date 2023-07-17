import { CrawlerOption, Response, SubjectOption, SubjectResponse } from "../types";
import Crawler from "./crawler";

export default class SubjectGetter<
    T extends CrawlerOption = CrawlerOption,
    Q extends object = SubjectOption> extends Crawler {

    private _query: Q;

    public static readonly DEFAULT_OPTIONS: CrawlerOption = {
        host: "http://112.137.129.87/qldt/",
        keyMap: new Map<string, string>(Object.entries({
            studentID: "SinhvienLmh[masvTitle]",
            studentName: "SinhvienLmh[hotenTitle]",
            studentDateBirth: "SinhvienLmh[ngaysinhTitle]",
            studentOfficialClass: "SinhvienLmh[lopkhoahocTitle]",
            subjectClassID: "SinhvienLmh[tenlopmonhocTitle]",
            subjectClassName: "SinhvienLmh[tenmonhocTitle]",
            subjectGroup: "SinhvienLmh[nhom]",
            subjectCredit: "SinhvienLmh[sotinchiTitle]",
            subjectNote: "SinhvienLmh[ghichu]",
            page: "SinhvienLmh_page"
        }))
    };

    public get query(): Q {
        return this._query;
    }

    public set query(query: Q) {
        this._query = query;
    }

    //TODO: Implement
    protected parse(data: string): unknown {
        throw new Error("Method not implemented.");
    }

    constructor(option?: T) {
        super({
            host: option.host || SubjectGetter.DEFAULT_OPTIONS.host,
            keyMap: option.keyMap || SubjectGetter.DEFAULT_OPTIONS.keyMap,
        });
    }

    public async getSubject(query?: Q): Promise<Response<SubjectResponse>> {
        return this.parseResponse<SubjectResponse>
            (await this.fetch(query ? query : this._query, "GET")) as Response<SubjectResponse>;
    }
}