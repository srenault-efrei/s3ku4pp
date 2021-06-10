import express, { Express } from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import https from 'https'
import fs from 'fs'
import morgan from 'morgan'

import redis from 'redis'

import { mlog } from '@/core/libs/utils'
import Database from '@/core/models/Database'

import '@/core/middlewares/passport'

import api from '@/routes/api'

const { allowOnlyIfAuthorized } = require("./services/RoutesHelper")
const { rateLimiter } = require("./services/RoutesHelper")


export default class Server {
  private _port: number
  private _app: Express | null = null

  public constructor(port: number) {

    this._port = port
  }

  private async _initialize(): Promise<void> {
    const db = Database.getInstance()
    let client: unknown
    try {
      await db.authenticate()
    } catch (err) {
      mlog(err.message, 'error')
      process.exit(-1)
    }

    try {
      // Create connection Redis to determinate rateLimiter
      client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT) || 6379 })
    } catch (err) {
      client = redis.createClient({ host: "localhost", port: 6379 })
      mlog(err.message, 'error')
      process.exit(-1)

    }

    mlog('🖖 Postgres && Redis successfully authenticated', 'success')
    this._app = express()
    this._app.use(morgan("dev"));

    // Check if there is an authorization token and rateLimiter for each routes 
    this._app.use("*", allowOnlyIfAuthorized(), rateLimiter(client))

    this._app.use(passport.initialize())
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: false }))

    this._app.use('/api', api)
  }

  public async run(): Promise<void> {

    await this._initialize()

    // Credentials for https
    const options = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }

    const httpsServer = https.createServer(options, this._app!)
    httpsServer.listen(this._port, () => {
      mlog(`✨ Server is listening on port ${this._port}`)
    })
  }
}
