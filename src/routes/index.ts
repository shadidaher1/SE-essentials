import { Router } from "express";
import OrderRoutes from "./order.route";
import AnalyticsRoutes from "./analytics.route";
import UserRoutes from "./user.route";
const routes = Router();

routes.get("/", (req, res) => {
    res.json({ message: 'Hello, World!' });
});

routes.use("/orders", OrderRoutes);
routes.use("/analytics", AnalyticsRoutes);
routes.use("/users", UserRoutes);

export default routes;