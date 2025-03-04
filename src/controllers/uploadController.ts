import { Request, Response } from 'express'
import cloudinary from '../config/cloudinaryConfig';
import fs from 'fs'

export const uploadImage = async(req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: "Файл не загружен" })
        return
    }
  
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "store",
        });

        fs.unlinkSync(req.file.path);

        res.json({
        url: result.secure_url,
        public_id: result.public_id,
        });
    } catch (error) {
        console.error("Ошибка загрузки в Cloudinary:", error);
        res.status(500).json({ message: "Ошибка при загрузке файла" });
    }
  };


  export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    const { public_id } = req.body;
  
    if (!public_id || typeof public_id !== "string") {
        res.status(400).json({ message: "Некорректный public_id" });
        return;
    }
  
    try {
      const result = await cloudinary.uploader.destroy(public_id);
  
      if (result.result !== "ok") {
        throw new Error("Cloudinary не смог удалить файл");
      }
  
      res.json({ message: "Файл успешно удален" });
    } catch (error) {
      console.error("Ошибка удаления из Cloudinary:", error);
      res.status(500).json({ message: "Ошибка при удалении файла" });
    }
  };
  