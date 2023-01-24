import express from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

// middlware, s ovima mozemo slati podatke u json objektu
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json());
// cors je zastita da samo korisnici sa localhost mogu pristupiti backendu
app.use(
    cors
        ({
            origin: "http://localhost:3000",
        })
);
app.use(cookieParser());

// multer sluzi za upload slika na server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage });

// na ovaj nacin se izvrsava upload , koristimo post metodu i uploadamo samo jednu sliku
app.post('/server/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

// getali smo route iz user route /test i kada unesemo localhost:8080/api/users/test vratit ce nam it works, res.send iz users.js
app.use('/server/users', userRoutes);

app.use('/server/posts', postRoutes);

app.use('/server/comments', commentRoutes);

app.use('/server/likes', likeRoutes);

app.use('/server/relationships', relationshipRoutes);

app.use('/server/auth', authRoutes)

app.listen(8080, () => {
    console.log('Listening to port 8080');
})