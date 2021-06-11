import dotenv from 'dotenv'
import { createConnection, Connection } from 'typeorm'
import Phone from './Phone'

import User from './User'

export default class Database {
  private static _instance: Database | null = null
  private _connection: Connection | null = null

  private constructor() { }

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database()
    }

    return Database._instance
  }


  public async authenticate(): Promise<Connection | never> {

    dotenv.config()

    const founded = (process.env.DATABASE_URL as string).match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/)
    if (!founded) {
      throw new Error('Please check your DATABASE_URL value')
    }

    const [, , username, password, host, port, database] = founded

    this._connection = await createConnection({
      type: 'postgres',
      host,
      port: parseInt(port),
      username,
      password,
      database,
      entities: [User, Phone],
      dropSchema: true,
      synchronize: true,
      logging: false,
    })
    return this._connection
  }
}
