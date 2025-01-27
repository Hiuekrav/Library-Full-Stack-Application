
export class User {
    id: string
    firstName: string
    lastName: string
    role: string
    email: string
    active: boolean
    cityName: string
    streetName: string
    streetNumber: number

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        role: string,
        email: string,
        active: boolean,
        cityName: string,
        streetName: string,
        streetNumber: number) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.role = role
        this.email = email
        this.active = active
        this.cityName = cityName
        this.streetName = streetName
        this.streetNumber = streetNumber
    }
}