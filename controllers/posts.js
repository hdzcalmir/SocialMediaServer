import { db } from '../connect.js';
// konekcija sa db

import jwt from "jsonwebtoken";
import moment from 'moment';


export const getPosts = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");


    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");


        // TODO, dohvati postove
        // p je skracenica od posts tabele, tako vazi i za u

        // dohvatamo sve iz posts tabele, u.id je users id i vracamo ga kao vrijednost od userID u tabeli posts 
        // a koristili smo u.id da ne bi doslo do konflikta jer i posts ima id kolonu u tabeli

        // u biti ovaj query nam vraca sve iz postova s tim da nam na osnovu userId iz tabele posts vraca i detalje usera 
        // const q = `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        // JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)`;
        // vraca nam samo postove od korisnika koji se medjusobno prate, a id getamo iz tokena prijavljenog korisnika te ga prosljeđujemo kao
        // argument u query, na osnovu kojeg ce nam vratiti te specificne postove

        // SKONTATI BOLJE OVAJ QUERY
        const q = `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
        ORDER BY p.createdDate DESC`;

        // console.log(userInfo.id);
        // console.log(err); da vidimo error sql-a

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json(data);

        })

    })
}


export const addPost = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    // provjera da li smo prijavljeni preko tokena

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = 'INSERT INTO posts (`description`, `img`, `createdDate`, `userId`) VALUES (?)';

        // moment biblioteka jest biblioteka za datume

        const values = [
            req.body.description,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been successfully created!");

        });

    });
}


