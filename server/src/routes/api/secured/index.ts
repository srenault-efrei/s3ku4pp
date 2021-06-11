import { Router } from 'express'
import phone from './phone'

const api = Router()

api.use("/phones", phone)

export default api