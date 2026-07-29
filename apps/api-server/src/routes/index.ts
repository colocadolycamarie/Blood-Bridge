import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import requestsRouter from "./requests";
import donationsRouter from "./donations";
import inventoryRouter from "./inventory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(requestsRouter);
router.use(donationsRouter);
router.use(inventoryRouter);

export default router;
