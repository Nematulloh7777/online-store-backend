import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel, { IUser } from '../models/User'
import ItemModel from '../models/Items'
import { Request, Response } from 'express'
import { UserDto } from '../dtos/User.dto'

export const register = async (req: Request<{}, {} , UserDto>, res: Response): Promise<void> => {
    try {

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            }, 
            'secret123',
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user.toObject()

        res.json({
            ...userData,
            token
        })
        
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req: Request<{}, {} , UserDto>, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }).populate('favorites') as IUser
        
        if (!user) {
            res.status(400).json({
                message: 'Неверный логин или пароль',
            })
            return
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash)

        if (!isValidPass) {
            res.status(400).json({
                message: 'Неверный логин или пароль',
            })
            return
        }

        const token = jwt.sign(
            {
                _id: user._id
            }, 
            'secret123',
            {
                expiresIn: '30d',
            }
        )

        const {passwordHash, ...userData} = user.toObject()

        res.json({
            ...userData,
            token
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(403).json({
                message: 'Нет доступа',
            });
            return;
        }
       
        const user: IUser | null = await UserModel.findById(req.userId).populate('favorites')
        
        if (!user) {
            res.status(404).json({
                message: 'Пользователь не найден'
            })
            return
        }

        const {passwordHash, ...userData} = user.toObject()

        res.json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}

export const updateUser = async (
    req: Request<{id: string}, {} , UserDto>, 
    res: Response
): Promise<void> => {
    try {
        const password = req.body.password
        let hash
        if (password) {
            const salt = await bcrypt.genSalt(10)
            hash = await bcrypt.hash(password, salt)
        }

        const userId = req.params.id
        await UserModel.updateOne(
            {
                _id: userId,
            },
            {
                fullName: req.body.fullName,
                email: req.body.email,
                passwordHash: hash,
                avatarUrl: req.body.avatarUrl,
            }
        )
        res.json({
            success: true,
            message: 'Данные успешно обновлены',
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить пользователя'
        })
    }
}

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const { itemId } = req.body;
  
      if (!itemId) {
        res.status(400).json({ message: 'ID товара обязателен' })
        return
      }
  
      const user = await UserModel.findById(userId).populate('favorites');
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' })
        return
      }

      const item = await ItemModel.findById(itemId);

      if (!item) {
        res.status(404).json({ message: 'Товар не найден' })
        return
      }
  
      await user.toggleFavorite(itemId);  // Вызов метода toggleFavorite
      await user.populate('favorites');
  
      res.json({ message: 'Избранное обновлено', favorites: user.favorites });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };