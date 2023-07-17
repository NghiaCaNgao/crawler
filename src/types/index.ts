export interface CrawlerOption {
    readonly host?: string,
    readonly keyMap?: Map<string, string>
}

export interface CalendarOption {
    semesterID?: string,
    subjectID?: string,
    subjectClassID?: string,
    subjectName?: string,
    teacherName?: string,
    amphitheater?: string,
    day?: string
}

export interface SubjectOption {
    limit?: number,
    semesterID?: string,
    studentID?: string,
    studentName?: string,
    studentDateBirth?: string,
    studentOfficialClass?: string,
    subjectClassID?: string,
    subjectClassName?: string,
    subjectGroup?: string,
    subjectCreditNumber?: number,
    subjectNote?: string,
    page?: number
}

export interface Calendar {
    index: number,
    courseSubjectID: string,
    courseSubjectName: string,
    courseCredits: number,
    courseSubjectClassID: string,
    teacherName: string,
    studentCount: number,
    lessonOfDay: string,
    day: string,
    lessons: Array<Number>,
    amphitheater: string,
    courseGroup: string,
}

export interface Response<T = any> {
    status: number;
    data: T;
    message: string;
}

export interface CalendarResponse {
    length: number
    data: Calendar[]
}

export interface SubjectResponse {

}