export interface Query { }

export interface CrawlerOption {
    host?: string,
    limit?: number,
    semesterID?: string,
    keyMap?: Map<string, string>
}

export interface Response<T = any> {
    status: number;
    data: T;
    message: string;
}

export interface ResponseCalendar {
    length: number
    data: Calendar[]
}

export interface Calendar {
    index?: number,
    courseSubjectID?: string,
    courseSubjectName?: string,
    courseCredits?: number,
    courseSubjectClassID?: string,
    teacherName?: string,
    studentCount?: number,
    lessonOfDay?: string,
    day?: string,
    lessons?: Array<Number>,
    amphitheater?: string,
    courseGroup?: string,
}