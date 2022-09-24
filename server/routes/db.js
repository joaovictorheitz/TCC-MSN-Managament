const mysql = require("mysql2/promise")

async function connect() {
    const connection = mysql.createConnection("mysql://root:root@localhost:3306/sabor_nordeste_dev")

    if (global.connection && global.connection.state !== "disconnected") {
        return global.connection
    }

    console.log("Conectou!")
    global.connection = connection
    return connect
}

async function selectUser() {
    const conn = await connect()
    const [rows] = await conn.query("select * from world.user;")
    return rows
}

connect()

module.exports = {selectUser}