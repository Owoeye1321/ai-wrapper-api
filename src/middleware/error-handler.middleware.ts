import ApiError from '../utility/errors/api.error'
import httpStatus from 'http-status'
export const errorConverter = (err: any, req: any, res: any, next: any) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message as string, true, err.stack)
  }
  next(error)
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let { statusCode, message } = err
  if (!err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message
  }

  res.status(statusCode).send(response)
}
