import { Request, Response } from 'express'
import knex from '../db/connect'

 class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*')

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                // img_url: `http://localhost:3333/uploads/${item.img}`,
                img_url: `http://192.168.1.64:3333/uploads/${item.img}`,
            }
        })

        return res.json(serializedItems)
    }

}

export default ItemsController