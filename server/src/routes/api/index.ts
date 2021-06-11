import { Router, Request, Response } from 'express'
import secured from './secured'
import auth from './authenticate'
import passport from 'passport'
import cors from 'cors'

const api = Router()
api.use(cors())


api.get('/', async (req: Request, res: Response) => {

  res.json({
    hello: 'From dlmvp Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

api.use('/authenticate', auth)
api.use('/', passport.authenticate('jwt', { session: false }), secured)


export default api
