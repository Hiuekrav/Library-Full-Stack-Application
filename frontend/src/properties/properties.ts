
const properties = {

    protocol: "https",
    server: "localhost:8080",
    get serverAddress() {
        return `${this.protocol}://${this.server}`;
    },
}


export default properties;