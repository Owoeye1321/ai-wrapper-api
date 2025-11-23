import { Router, Router as ExpressRoutter } from 'express'
import AIWrapperController from '../controller/ai-wrapper.controller'
const router: Router = ExpressRoutter()
router.post('/prompt', AIWrapperController.handlePromptRequest)
export default router
