
export class Book{
    id: string
    title: string
    author: string
    numberOfPages: number
    genre: string
    publishedDate: Date
    archive: boolean
    rented: boolean

    constructor(
        id: string,
        title: string,
        author: string,
        numberOfPages: number,
        genre: string,
        publishedDate: Date,
        archive: boolean,
        rented: boolean) {

        this.id = id
        this.title = title
        this.author = author
        this.numberOfPages = numberOfPages
        this.genre = genre
        this.publishedDate = publishedDate
        this.archive = archive
        this.rented = rented
    }
}