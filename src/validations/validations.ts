import { body } from "express-validator"

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('fullName', 'Укажите полное имя').isLength({ min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
]

export const updateUserValidation = [
    body('email', 'Неверный формат почты').optional().isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').optional().isLength({ min: 5}),
    body('fullName', 'Укажите полное имя').optional().isLength({ min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]

export const itemCreateValidation = [
    body('title', 'Введите заголовок товара').isLength({ min: 3 }).isString(),
    body('price', 'Введите цену товара').isInt(),
    // body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]