import { Router, Request, Response } from 'express'
import { BAD_REQUEST, CREATED, OK } from '@/core/constants/api'
import { error, success } from '@/core/helpers/response'
import Phone from '@/core/models/Phone'
import { isEmpty } from 'lodash'


const api = Router()

api.post('/create', async (req: Request, res: Response) => {

    const fields = ['name', 'price']

    try {
        const missings = fields.filter((field: string) => !req.body[field])

        if (!isEmpty(missings)) {
            const isPlural = missings.length > 1
            throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
        }
        const { name, price } = req.body

        const phone = new Phone()
        phone.name = name
        phone.price = price

        await phone.save()
        res.status(CREATED.status).json(success(phone))

    } catch (err) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
})


api.get('/', async (req: Request, res: Response) => {
    try {
        const phones = await Phone.find();
        res.status(OK.status).json(success(phones))
    }
    catch (err) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))

    }
})

api.put('/:id', async (req: Request, res: Response) => {
    const fields = ['name', 'price']

    try {
        const id = parseInt(req.params.id)
        const missings = fields.filter((field: string) => !req.body[field])

        if (!isEmpty(missings)) {
            const isPlural = missings.length > 1
            throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
        }
        const { name, price } = req.body

        const phone = await Phone.findOne(id)
        if (phone) {
            phone.name = name
            phone.price = price
            await phone.save()
            res.status(CREATED.status).json(success(phone))
        }

    } catch (err) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
})

api.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id)
        const phone = await Phone.findOne(id)
        if (phone) {
            await phone.remove()
            res.status(OK.status).json(success(phone))
        }
    }
    catch (err) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))

    }
})




export default api
