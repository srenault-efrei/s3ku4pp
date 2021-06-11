
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { isEmpty } from 'lodash'
import { error, success } from '../../core/helpers/response'
import { BAD_REQUEST, CREATED, OK } from '../../core/constants/api'
import jwt from 'jsonwebtoken'
import User from '@/core/models/User'

const api = Router()


api.post('/signUp', async (req: Request, res: Response) => {
    const fields = ['email', 'name', 'password', 'passwordConfirmation']

    try {
        const missings = fields.filter((field: string) => !req.body[field])

        if (!isEmpty(missings)) {
            const isPlural = missings.length > 1
            throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
        }
        const { name, email, password, passwordConfirmation } = req.body
        if (password !== passwordConfirmation) {
            throw new Error("Password doesn't match")
        }

        const user = new User()
        user.email = email
        user.name = name
        user.password = password
        await user.save()

        const payload = { id: user.id, name: user.name }
        const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

        res.status(CREATED.status).json(success(user, { token }))
    } catch (err) {
        res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, err))
    }
})


api.post('/signIn', async (req: Request, res: Response) => {

    const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
        if (errorMessage) {
            res.status(BAD_REQUEST.status).json(error(BAD_REQUEST, new Error(errorMessage)))
            return
        }
        const playload = { id: user.id, name: user.name }
        const token = jwt.sign(playload, process.env.JWT_ENCRYPTION as string)
        res.status(OK.status).json(success(user, { token }))

    })
    authenticate(req, res)
})

export default api