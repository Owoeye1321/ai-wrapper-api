import express, { Request, Response } from 'express'
import { errorConverter, errorHandler } from './middleware/error-handler.middleware'
import httpStatus from 'http-status'
import { APP_PREFIX_PATH } from './config/environment-variable.config'

import ApiError from './utility/errors/api.error'
import logger from './config/logger'
import routes from './routes/routes'
import cors from 'cors'

const app = express()

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    service: `AI Wrapper`,
    message: `Welcome to the AI Wrapper. User magic happens here!`
  })
})

app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

app.use(APP_PREFIX_PATH, routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorHandler)
app.use(errorConverter)

app.listen(4000, async () => {
  logger.info('Server is running on port 4000')
})
