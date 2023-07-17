import { CrawlerOption, SubjectOption, SubjectResponse, Response } from "../types";
import SubjectGetter from "./subject.get";

type SOC = SubjectOption & CrawlerOption;

export default class SubjectCrawler<
    T extends CrawlerOption = CrawlerOption,
    Q extends SubjectOption = SubjectOption> extends SubjectGetter<T, Q> {

    private _sQuery: Q = {} as Q;

    public static readonly DEFAULT_OPTIONS: SOC = {
        semesterID: "037",
        limit: 1000,
        page: 1,
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

    constructor(query?: Q, host?: string) {
        super({
            keyMap: SubjectCrawler.DEFAULT_OPTIONS.keyMap,
            host: host || SubjectCrawler.DEFAULT_OPTIONS.host
        } as T);

        this.sQuery = query || {} as Q // set query
    }

    public set sQuery(query: Q) {
        this.query = this._sQuery = this.verifyQuery(query);
    }

    public get sQuery(): Q {
        return this._sQuery;
    }

    private verifyLimit(limit: number) {
        if (limit === undefined) return;

        if (limit >= 0 && limit <= 5000) return limit;
        else throw new Error("'" + limit + "' is not in range [0, 5000].");
    }

    private verifySemesterID(semesterID: string) {
        const regex = /^\d{3}$/;

        if (semesterID === undefined) return;

        if (semesterID.search(regex) >= 0) return semesterID
        else throw new Error("'" + semesterID + "' is not a valid semester ID format. Eg. 036");
    }

    private verifyStudentID(studentID: string) {
        const regex = /^\d{8}$/;

        if (studentID === undefined) return;

        if (studentID.search(regex) >= 0) return studentID
        else throw new Error("'" + studentID + "' is not a valid student ID format. Eg. 21020366");
    }

    private verifyStudentName(studentName: string) {
        if (studentName === undefined) return;

        if (studentName.trim() != "") return studentName.trim();
        else throw new Error("Student's name could not be empty.");
    }

    private verifyStudentDateBirth(studentDateBirth: string) {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/g

        if (studentDateBirth === undefined) return;

        if (studentDateBirth.search(regex) >= 0) return studentDateBirth;
        else throw new Error("'" + studentDateBirth + "' is not a valid date format. Eg. dd/mm/yyyy");
    }

    private verifyStudentOfficialClass(studentOfficialClass: string | undefined) {
        const regex = /^QH-20\d{2}-I\/CQ-([A-ZÂĂĐÊÔƠƯ]\d?\-?)*$/g

        if (studentOfficialClass === undefined) return;

        if (studentOfficialClass.search(regex) >= 0) return studentOfficialClass;
        else throw new Error("'" + studentOfficialClass + "' is not a valid official class format. Eg. QH-2019-I/CQ-M-CLC1");
    }

    private verifySubjectClassID(subjectClassID: string) {
        let regex = /^[A-Z]{3}\d{4} \d{1,2}$/g;

        if (subjectClassID === undefined) return;

        if (subjectClassID.search(regex) >= 0) return subjectClassID;
        else throw new Error("'" + subjectClassID + "' is not a valid subject class ID format. Eg: HIS1001 1");
    }

    private verifySubjectClassName(subjectClassName: string) {
        if (subjectClassName === undefined) return;

        if (subjectClassName.trim() != "") return subjectClassName;
        else throw new Error("Subject class's name could not be empty.");
    }

    private verifySubjectGroup(subjectGroup: string) {
        let regex = /^\d{1}|CL$/g;

        if (subjectGroup === undefined) return;

        if (subjectGroup.search(regex) >= 0) return subjectGroup;
        else throw new Error("'" + subjectGroup + "' is not a valid subject group format. Eg. 1 or CL");
    }

    private verifySubjectCreditNumber(subjectCredit: number) {
        if (subjectCredit === undefined) return;

        if (subjectCredit > 0 && subjectCredit < 20) return subjectCredit;
        else throw new Error("Subject credit number must be in range [1,19].");
    }

    private verifySubjectNote(subjectNote: string) {
        if (subjectNote === undefined) return;

        return subjectNote.trim();
    }

    private verifyPage(page: number) {
        if (page === undefined) return;

        if (page >= 1) return page
        else throw new Error("Page number must be greater than 0.");
    }

    private verifyQuery(query: Q): Q {
        const { semesterID, studentDateBirth, studentName, subjectClassID,
            subjectNote, subjectGroup, subjectCreditNumber, subjectClassName,
            studentOfficialClass, studentID, limit, page, ...rest
        } = query;

        return {
            limit: this.verifyLimit(limit),
            semesterID: this.verifySemesterID(semesterID),
            studentID: this.verifyStudentID(studentID),
            studentName: this.verifyStudentName(studentName),
            studentDateBirth: this.verifyStudentDateBirth(studentDateBirth),
            studentOfficialClass: this.verifyStudentOfficialClass(studentOfficialClass),
            subjectClassID: this.verifySubjectClassID(subjectClassID),
            subjectClassName: this.verifySubjectClassName(subjectClassName),
            subjectGroup: this.verifySubjectGroup(subjectGroup),
            subjectCreditNumber: this.verifySubjectCreditNumber(subjectCreditNumber),
            subjectNote: this.verifySubjectNote(subjectNote),
            page: this.verifyPage(page),
            ...rest
        } as Q;
    }

    public override async getSubject(query?: Q): Promise<Response<SubjectResponse>> {
        return await super.getSubject(this.verifyQuery(query)) as Response<SubjectResponse>;
    }
}