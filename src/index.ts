import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'
/* eslint-disable no-unused-vars */
import express, { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'
/* eslint-enable no-unused-vars */

const port = 3000
const app:Express = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.set('port', port)
routes(app)

app.all('*', (req: Request, res: Response) => {
  console.log('# 💢 Not Found!')
  res.status(404).send({ message: 'Request not found.' })
})

app.listen(port, () => {
  console.log(`# 🎧 App listening on port ${port}!`)
})

export default app
