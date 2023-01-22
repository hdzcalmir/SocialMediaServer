import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
    // TODO
    // res.send('Dohvatamo lajkove');
    const q = 'SELECT userId FROM likes WHERE postId = ?';

    // preko query a getamo postId koji saljemo iz
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        // console.log(data.map(like => like.userId));
        // putem mape smo direktno uzeli userId tako da ukoliko želimo prikazati da je slika lajkovana od strane prijavljene osobe
        // koristit cemo includes nad arrayem lajkova nad specificnom slikom te ukoliko je lajkovana ispisat ce nam ispunjeno srce sto znaci
        // da jest a u suprotnom ispisat ce nam prazno srce
        return res.status(200).json(data.map(like => like.userId));
    });

};

export const addLike = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");


        // preko jsonweb tokena dohvatamo userId

        const q = 'INSERT INTO likes (`userId`, `postId`) VALUES (?)';

        // moment biblioteka jest biblioteka za datume

        const values = [
            userInfo.id, // userId koji insertamo da znamo koji je user lajkovao koju objavu
            req.body.postId // te id objave koju je lajkovao
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been liked!");

        });

    });
}

export const deleteLike = (req, res) => {

    // console.log('works');

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = 'DELETE FROM likes WHERE `userId` = ? AND `postId` = ?';

        // moment biblioteka jest biblioteka za datume

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post is not liked anymore!");

        });

    });
}
