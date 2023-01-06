import express from 'express';
import { getComments } from '../controllers/comment.js';

const router = express.Router();

router.get('/comment', getComments);

export default router;