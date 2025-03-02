import { Router } from "express";
import { create, getAll, getOne, remove, update } from "../controllers/ItemController";
import checkAuth from "../utils/checkAuth";
import { itemCreateValidation } from "../validations/validations";
import handleValidationErrors from "../utils/handleValidationErrors";

const router = Router()

// /api/items
router.get('/', getAll)

// /api/items
router.post('/', checkAuth, itemCreateValidation, handleValidationErrors, create)

// /api/items/123
router.put('/:id', checkAuth, handleValidationErrors, update)

// /api/items/123
router.get('/:id', getOne)


// /api/items/123
router.delete('/:id', checkAuth, remove)

export default router