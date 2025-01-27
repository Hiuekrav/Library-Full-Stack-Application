
export class UserShortDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(dto: any) {
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.email = dto.email;
    }
}