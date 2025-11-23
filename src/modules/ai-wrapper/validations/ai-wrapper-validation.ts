import Joi from 'joi'
const promptSchema = Joi.object({
  prompt: Joi.string().required().messages({
    'string.base': 'prompt must be a string',
    'any.required': 'prompt is a required field'
  })
}).required()

export default promptSchema
