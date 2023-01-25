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

export const updateUser = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");


    jwt.verify(token, "secretkey", (err, userInfo) => {
        console.log(err);
        if (err) return res.status(403).json("Token is not valid!");

        const q = "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `profilePhoto` = ?, `coverPhoto` = ? WHERE id = ?";

        db.query(q, [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.coverPhoto,
            req.body.profilePhoto,
            userInfo.id
        ], (err, data) => {
            if (err) res.status(500).json(err);
            if (data.affectedRows > 0) return res.json("Updated!");
            return res.status(403).json("You can update only your profile");
        })

    })

};