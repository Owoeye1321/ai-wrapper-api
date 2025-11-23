import { Router, Router as ExpressRoutter } from 'express'
import aiRoutes from '../modules/ai-wrapper/routes/ai-wrapper.route'
const router: Router = ExpressRoutter()
router.use('/ai-wrapper', aiRoutes)
export default router
