
export class UserRent{
    title: string;
    beginTime: Date;
    endTime: Date;

    constructor(
        title: string,
        beginTime: Date,
        endTime: Date) {

        this.title = title
        this.beginTime = beginTime
        this.endTime = endTime
    }
}