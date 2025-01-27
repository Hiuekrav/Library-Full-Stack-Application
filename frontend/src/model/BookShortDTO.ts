
export class BookShortDTO {
    id: string;
    title: string;
    author: string;
    genre: string;

    constructor(dto: any) {
        this.id = dto.id;
        this.title = dto.title;
        this.author = dto.author;
        this.genre = dto.genre;
    }
}