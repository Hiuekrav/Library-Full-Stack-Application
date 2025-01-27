
const properties = {

    protocol: "http",
    server: "192.168.137.1:8080",
    get serverAddress() {
        return `${this.protocol}://${this.server}`;
    },
}


export default properties;