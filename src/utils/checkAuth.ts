import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (!token) {
        res.status(401).json({ message: 'Нет токена' })
        return
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123') as { _id: string }
            
            req.userId = decoded._id
            next()
        } catch (err) {
            res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        res.status(403).json({
            message: 'Нет доступа'
        })
    }
}