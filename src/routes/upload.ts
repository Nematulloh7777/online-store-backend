import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import checkAuth from "../utils/checkAuth";
import { deleteImage, uploadImage } from "../controllers/uploadController";
import cloudinary from "../config/cloudinaryConfig";

const router = Router();

// Настройка Cloudinary Storage для Multer
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "store_uploads", // Папка, куда загружаются файлы
//       format: async () => ["jpeg", "jpg", "png", "webp", "gif"], // Можно указать ["jpeg", "png", "webp"]
//       public_id: (req, file) => file.originalname.split(".")[0], // Используем имя файла без расширения
//     } as Options["params"], // Исправляем ошибку TS
//   });
const storage = multer.diskStorage({
    destination: "uploads/", // Временная папка
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
const upload = multer({ storage });

router.post("/upload", checkAuth, upload.single("image"), uploadImage);

router.delete("/upload", checkAuth, deleteImage);

export default router;
