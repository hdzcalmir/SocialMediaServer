import { db } from "../connect.js";
// konekcija sa db
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
    // TODO
    // res.send('Dohvatamo komentare');

    // dohvatamo postove specificnog usera
    const q = `SELECT c.*, u.id AS userId, name, profilePhoto FROM comments AS c JOIN users AS u ON (u.id = c.userId) 
    WHERE c.postId = ? ORDER BY c.createdDate DESC`;

    // console.log(userInfo.id);
    // console.log(err); da vidimo error sql-a

    // getamo postId koji smo poslali u query-u
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);

    })

}

export const addComment = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = 'INSERT INTO comments (`description`, `createdDate`, `userId`, `postId`) VALUES (?)';

        // moment biblioteka jest biblioteka za datume

        const values = [
            req.body.description,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Comment has been successfully created!");

        });

    });
}
