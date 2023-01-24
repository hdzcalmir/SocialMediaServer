import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
    // TODO
    // res.send('Dohvatamo followere');
    const q = 'SELECT followerUserId FROM relationships WHERE followedUserId = ?';

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        // console.log(data.map(like => like.userId));
        // putem mape smo direktno uzeli userId tako da ukoliko želimo prikazati da je slika lajkovana od strane prijavljene osobe
        // koristit cemo includes nad arrayem lajkova nad specificnom slikom te ukoliko je lajkovana ispisat ce nam ispunjeno srce sto znaci
        // da jest a u suprotnom ispisat ce nam prazno srce
        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    });

};

export const addRelationships = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");


        // preko jsonweb tokena dohvatamo userId

        const q = 'INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)';

        // moment biblioteka jest biblioteka za datume

        const values = [
            userInfo.id, // userId koji insertamo da znamo koji je user lajkovao koju objavu
            req.body.userId // te id objave koju je lajkovao
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("User has been unfollowed!");

        });

    });
}

export const deleteRelationships = (req, res) => {

    // console.log('works');

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = 'DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?';

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("User has been unfollowed!");

        });

    });
}
