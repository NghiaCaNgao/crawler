import { CalendarOption, CrawlerOption, SubjectOption } from "../types";
import Crawler from "./crawler";

export default class SubjectCrawler extends Crawler {
    private _query: SubjectOption;
    
    public static readonly DEFAULT_OPTIONS: SubjectOption = {
        host: "http://112.137.129.87/qldt/",
        limit: 1000,
        semesterID: "037",
        page: 1,
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

    public get limit(): number {
        return this._limit;
    }

    public set limit(limit: number) {
        if (limit === undefined) return;

        if (limit >= 0 && limit <= 5000) this._limit = limit
        else throw new Error("'" + limit + "' is not in range [0, 5000].");
    }

    public get semesterID(): string {
        return this._semesterID;
    }

    public set semesterID(semesterID: string) {
        const regex = /^\d{3}$/;

        if (semesterID === undefined) return;

        if (semesterID.search(regex) >= 0) this._semesterID = semesterID
        else throw new Error("'" + semesterID + "' is not a valid semester ID format. Eg. 036");
    }

    public get studentID(): string {
        return this._studentID;
    }

    public set studentID(studentID: string | undefined) {
        const regex = /^\d{8}$/;

        if (studentID === undefined) return;

        if (studentID.search(regex) >= 0) this._studentID = studentID
        else throw new Error("'" + studentID + "' is not a valid student ID format. Eg. 21020366");
    }

    public get studentName(): string {
        return this._studentName;
    }

    public set studentName(studentName: string | undefined) {
        if (studentName === undefined) return;

        if (studentName.trim() != "") this._studentName = studentName.trim();
        else throw new Error("Student's name could not be empty.");
    }

    public get studentDateBirth(): string {
        return this._studentDateBirth;
    }

    public set studentDateBirth(studentDateBirth: string | undefined) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/g

        if (studentDateBirth === undefined) return;

        if (studentDateBirth.search(regex) >= 0) this._studentDateBirth = studentDateBirth;
        else throw new Error("'" + studentDateBirth + "' is not a valid date format. Eg. dd/mm/yyyy");
    }

    public get studentOfficialClass(): string {
        return this._studentOfficialClass;
    }

    public set studentOfficialClass(studentOfficialClass: string | undefined) {
        const regex = /^QH-20\d{2}-I\/CQ-([A-ZÂĂĐÊÔƠƯ]\d?\-?)*$/g

        if (studentOfficialClass === undefined) return;

        if (studentOfficialClass.search(regex) >= 0) this._studentOfficialClass = studentOfficialClass;
        else throw new Error("'" + studentOfficialClass + "' is not a valid official class format. Eg. QH-2019-I/CQ-M-CLC1");
    }

    public get subjectClassID(): string {
        return this._subjectClassID;
    }

    public set subjectClassID(subjectClassID: string | undefined) {
        let regex = /^[A-Z]{3}\d{4} \d{1,2}$/g;

        if (subjectClassID === undefined) return;

        if (subjectClassID.search(regex) >= 0) this._subjectClassID = subjectClassID;
        else throw new Error("'" + subjectClassID + "' is not a valid subject class ID format. Eg: HIS1001 1");
    }

    public get subjectClassName(): string {
        return this._subjectClassName;
    }

    public set subjectClassName(subjectClassName: string | undefined) {
        if (subjectClassName === undefined) return;

        if (subjectClassName.trim() != "") this._subjectClassName = subjectClassName;
        else throw new Error("Subject class's name could not be empty.");
    }

    public get subjectGroup(): string {
        return this._subjectGroup;
    }

    public set subjectGroup(subjectGroup: string | undefined) {
        let regex = /^\d{1}|CL$/g;

        if (subjectGroup === undefined) return;

        if (subjectGroup.search(regex) >= 0) this._subjectGroup = subjectGroup;
        else throw new Error("'" + subjectGroup + "' is not a valid subject group format. Eg. 1 or CL");

    }

    public get subjectCreditNumber(): number {
        return this._subjectCreditNumber;
    }

    public set subjectCreditNumber(subjectCredit: number | undefined) {
        if (subjectCredit === undefined) return;

        if (subjectCredit > 0 && subjectCredit < 20) this._subjectCreditNumber = subjectCredit;
        else throw new Error("Subject credit number must be in range [1,19].");

    }

    // TODO: should be typed
    public get subjectNote(): string {
        return this._subjectNote;
    }

    public set subjectNote(subjectNote: string | undefined) {
        if (subjectNote === undefined) return;

        this._subjectNote = subjectNote.trim();
    }

    public get page(): number {
        return this._page;
    }

    public set page(page: number) {
        if (page === undefined) return;

        if (page >= 1) this._page = page
        else throw new Error("Page number must be greater than 0.");
    }

    //TODO: Implement
    protected parse(data: string): unknown {
        throw new Error("Method not implemented.");
    }

    constructor(option: SubjectOption = {}) {
        // TODO: check if host and keymap, limit is undefined
        super({
            host: option.host || SubjectCrawler.DEFAULT_OPTIONS.host,
            keyMap: option.keyMap || SubjectCrawler.DEFAULT_OPTIONS.keyMap,
        });

        // TODO: auto determine
        this.semesterID = SubjectCrawler.DEFAULT_OPTIONS.semesterID;

        this.limit = option.limit || SubjectCrawler.DEFAULT_OPTIONS.limit;
        this.page = option.page || SubjectCrawler.DEFAULT_OPTIONS.page;
        this.studentID = option.studentID;
        this.studentName = option.studentName;
        this.studentDateBirth = option.studentDateBirth;
        this.studentOfficialClass = option.studentOfficialClass;
        this.subjectClassID = option.subjectClassID;
        this.subjectClassName = option.subjectClassName;
        this.subjectGroup = option.subjectGroup;
        this.subjectCreditNumber = option.subjectCreditNumber;
        this.subjectNote = option.subjectNote;
    }
}