import mysql from "mysql";

// KONEKCIJA SA DB
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "socialmedia"
})