import { Router } from "express";
import OrderRoutes from "./order.route";
import AnalyticsRoutes from "./analytics.route";
import UserRoutes from "./user.route";
import AuthRoutes from "./auth.routes";
import { authenticate } from "../middleware/auth";
import { hasRole } from "../middleware/authorize";
import { ROLE } from "../config/roles";
const routes = Router();

routes.get("/", (req, res) => {
    res.json({ message: 'Hello, World!' });
});

routes.use("/orders", authenticate, OrderRoutes);
routes.use("/analytics",authenticate, AnalyticsRoutes);
routes.use("/users", UserRoutes);
routes.use("/auth", AuthRoutes);



export default routes;