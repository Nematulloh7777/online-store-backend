import ItemsModel from "../models/Items";
import { Request, Response } from 'express'
import { ItemQueryParams } from "../types/query-params";
import { ItemDto } from "../dtos/Item.dto";

// export const getAll = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const item = await ItemsModel.find().populate('user').exec()
//         res.json(item)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось получить продукты'
//         })
//     }
// }

export const getAll = async (
    req: Request<{}, {}, {}, ItemQueryParams>, 
    res: Response
): Promise<void> => {
    try {
        const { title, tags, user, sortBy, page = '1', limit = '10' } = req.query;
       
        // Фильтры
        const filters: Record<string, any> = {} = {};
        if (title) {
            const regexTitle = title.replace(/\*/g, ''); // Убираем символы `*`
            filters.title = new RegExp(regexTitle, 'i'); // Создаем регулярное выражение
        }
        if (tags) filters.tags = { $in: tags.split(',') }; // Теги в массиве
        if (user) filters.user = user; // Фильтр по user ID

        // Сортировка
        const sort: Record<string, 1 | -1> = sortBy 
            ? { [sortBy.replace('-', '')]
            : sortBy.startsWith('-') ? -1 : 1 } : {};

        // Пагинация
        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);
        const skip = (currentPage - 1) * perPage;

        const [items, totalItems] = await Promise.all([
            ItemsModel.find(filters).populate('user').sort(sort).skip(skip).limit(perPage),
            ItemsModel.countDocuments(filters),
        ]);

        res.json({
            meta: {
                total_items: totalItems,
                total_pages: Math.ceil(totalItems / perPage),
                current_page: currentPage,
                per_page: perPage,
            },
            items,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Не удалось получить продукты' });
    }
}

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        // const item = await ItemsModel.findById(id).populate('user'); // с пользователям
        const item = await ItemsModel.findById(id)

        if (!item) {
            res.status(404).json({
                message: 'Продукт не найден'
            })
            return
        }
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось получить продукт'
        });
    }
};

export const create = async (req: Request<{}, {}, ItemDto>, res: Response): Promise<void> => {
    try {
        const doc = new ItemsModel({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            user: req.userId,
        })

        const item = await doc.save()

        res.json(item)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать продукт'
        })
    }
}


export const update = async (
    req: Request<{id: string}, {}, ItemDto>,
    res: Response
): Promise<void> => {
    try {
        const itemId = req.params.id

        await ItemsModel.updateOne(
            {
                _id: itemId,
            },
            {
                title: req.body.title,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                user: req.userId,
            }
        )

        res.json({
            success: true,
            message: "Продукт успешно обновлено"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить продукт'
        })
    }
}


export const remove = async (
    req: Request<{id: string}, {}, ItemDto>,
    res: Response
): Promise<void> => {
    try {
        const itemId = req.params.id

        ItemsModel.findOneAndDelete(
            {
                _id: itemId,
            }
        )
        .then((doc) => {
            if (!doc) {
                return res.status(404).json({
                    message: "Продукт не найдена",
                });
            }

            res.json({
                success: true,
                message: "Продукт успешно удалён"
            });
        })
        .catch((err) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "не удалось удалить продукт",
                });
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить продукт'
        })
    }
}