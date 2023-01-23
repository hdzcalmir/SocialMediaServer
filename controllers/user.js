import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// sve operacije vezane za usera ce se desiti u ovom 

// ovo je endpoint koji poziva funkciju koja izvrsava nesto u user controller
export const getUser = (req, res) => {
    //TODO
    // res.send('useri rade!');
    // getamo id iz linka
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        // za ispis errora
        if (err) return res.status(json).json();

        const { password, ...info } = data[0];
        return res.json(info);

    })
}