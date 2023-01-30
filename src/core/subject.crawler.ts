import { isExactMatch } from "../utils";
import Crawler from "./crawler";

export default class SubjectCrawler extends Crawler {
    private _limit: number;
    private _semesterID: string;

    public get limit(): number {
        return this._limit;
    }

    public set limit(limit: number) {
        if (limit >= 0 && limit <= 5000) this._limit = limit
        else throw new Error(limit + " is not in range [0, 5000]");
    }

    public get semesterID(): string {
        return this._semesterID;
    }

    public set semesterID(semesterID: string) {
        let regex = /\d{3}/;
        if (isExactMatch(regex, semesterID)) this._semesterID = semesterID
        else throw new Error(semesterID + " is not a valid semester ID");
    }

    protected parse(data: string): unknown {
        throw new Error("Method not implemented.");
    }

    constructor() {
        super({});
    }
}