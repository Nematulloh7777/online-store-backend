import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express';


export default (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json(errors.array())
        return
    }

    next()
}