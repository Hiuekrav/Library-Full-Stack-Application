import {UserShortDTO} from "@/model/UserShortDTO.ts";
import {BookShortDTO} from "@/model/BookShortDTO.ts";


export class RentDTO {
    id: string;
    userOutputDTO: UserShortDTO;
    bookOutputDTO: BookShortDTO;
    beginTime: Date;
    endTime: Date;

    constructor(dto: any) {
        this.id = dto.id;
        this.userOutputDTO = new UserShortDTO(dto.userOutputDTO);
        this.bookOutputDTO = new BookShortDTO(dto.bookOutputDTO);
        this.beginTime = new Date(dto.beginTime);
        this.endTime = new Date(dto.endTime);
    }
}