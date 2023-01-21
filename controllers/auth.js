import { db } from "../connect.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // CHECK USER IF EXISTS
    // res.send('registracija');
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) res.status(500).send(err);
        if (data.length) return res.status(409).json("Username already exists!");
        // CREATE NEW USER IF NOT
        // Hash password
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE(?)";

        const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

        db.query(q, [values], (err, data) => {
            if (err) res.status(500).json(err);
            return res.status(200).json('User has been registered successfully!');

        });
    });


}

export const login = (req, res) => {
    // TODO
    // res.send('prijava');
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) res.status(500).json(err); // ako postoji error vrati nam ga 
        // data.length nam vraca broj redova korisnika sa tim username - om 
        if (data.length === 0) return res.status(404).json('User not found!');

        // data nam vraca array sa jednim userom zato koristimo data[0]
        const checkPassword = bcryptjs.compareSync(req.body.password, data[0].password)

        if (!checkPassword) return res.status(400).json("Wrong password or username");

        // hashovani token koji predstavlja nas user id
        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];
        console.log(others);

        // kada prodje uspjesno, kada se korisnik registruje vraca token i vraca sve podatke od korisnika sem passworda
        // a cookie nam je najbitnija stavka, preko njega cemo znati da li korisnik smije brisati post, koji su njegovi postovi i sve 
        res
            .cookie('accessToken', token, {
                httpOnly: true
            })
            .status(200)
            .json(others);

    });
}


export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        // jer smo ovdje stavili sameSite none u mogucnosti smo ocistiti nas cookie
        sameSite: "none"
    }).status(200).json("User has been logged out!")
    // res.send('odjava');
}