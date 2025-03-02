import { Router } from "express";
import { getMe, login, register, toggleFavorite, updateUser } from "../controllers/UserController";
import checkAuth from "../utils/checkAuth";
import handleValidationErrors from "../utils/handleValidationErrors";
import { loginValidation, registerValidation, updateUserValidation } from "../validations/validations";

const router = Router()

// /api/users/login
router.post('/login', loginValidation, handleValidationErrors, login)

// /api/users/123
router.put('/:id', checkAuth, updateUserValidation, handleValidationErrors, updateUser)

// /api/users/register
router.post('/register', registerValidation, handleValidationErrors, register)

// /api/users/me
router.get('/me', checkAuth, getMe)

// /api/users/toggle-favorite
router.post('/toggle-favorite', checkAuth, toggleFavorite)

// /api/users  -allUsers
// router.get('/', (req, res) => {
//     res.status(501).json({ message: 'Маршрут еще не реализован' });
// });


export default router