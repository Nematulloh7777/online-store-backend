import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export const uploadImage = (req: Request, res: Response): void => {
    const category = req.body.category || '';
    const uploadPath = category ? path.join('uploads', category) : 'uploads';

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const tempPath = req.file?.path;
    const targetPath = path.join(uploadPath, req.file?.originalname || '');

    if (!tempPath || !req.file?.originalname) {
        res.status(400).json({ message: 'Некорректный файл' });
        return
    }

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Ошибка при сохранении файла' });
        }

        const fileUrl = category
            ? `/uploads/${category}/${req.file?.originalname}`
            : `/uploads/${req.file?.originalname}`;

        res.json({ url: fileUrl });
    });
};


export const deleteImage = (req: Request, res: Response) => {
    const { category, filename } = req.params;
    const filePath = category
        ? path.join('uploads', category, filename)
        : path.join('uploads', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Файл не найден' });
        }

        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(unlinkErr);
                return res.status(500).json({ message: 'Не удалось удалить файл' });
            }

            res.json({ message: 'Файл успешно удален' });
        });
    });
};
