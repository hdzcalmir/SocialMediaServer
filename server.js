import express from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";


const app = express();


// getali smo route iz user route /test i kada unesemo localhost:8080/api/users/test vratit ce nam it works, res.send iz users.js
app.use('/server/users', userRoutes);

app.use('/server/posts', postRoutes);

app.use('/server/comments', commentRoutes);

app.use('/server/likes', likeRoutes);

app.use('/server/auth', authRoutes)

app.listen(8080, () => {
    console.log('Listening to port 8080');
})