import { Request, Response, NextFunction } from 'express'
import AIFactory from '../../../factory/ai.factory'
import ApiError from '../../../utility/errors/api.error'
import httpStatus from 'http-status'

export default class AIWrapperController {
  public static async handlePromptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { question } = req.body || {}
      if (!question) throw new ApiError(httpStatus.BAD_REQUEST, 'question is required')
      const aiWrapper = AIFactory.getWrapper()
      const response = await aiWrapper.prompt(question)
      res.status(200).json({ message: 'success', data: response })
    } catch (error) {
      next(error)
    }
  }
}
