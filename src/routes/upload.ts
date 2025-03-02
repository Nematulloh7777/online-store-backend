import express from 'express';
import multer from 'multer';
import checkAuth from '../utils/checkAuth';
import { deleteImage, uploadImage } from '../controllers/uploadController';


const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });

// /api/upload
router.post('/upload', checkAuth, upload.single('image'), uploadImage);

// /api/upload/:category?/:filename
router.delete('/upload/:category?/:filename', checkAuth, deleteImage);

export default router;
