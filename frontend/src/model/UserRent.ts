
export class UserRent{
    id: string;
    title: string;
    beginTime: Date;
    endTime: Date;

    constructor(
        id: string,
        title: string,
        beginTime: Date,
        endTime: Date) {

        this.id = id
        this.title = title
        this.beginTime = beginTime
        this.endTime = endTime
    }
}