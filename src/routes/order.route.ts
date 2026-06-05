import { Router } from "express";
import { orderManagementService } from "../services/OrderManagment.service";
import { OrderController } from "../controllers/order.controller";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/roles";

const orderController = new OrderController(new orderManagementService());    

const routes = Router();

// From: src/middleware/asyncHandler.ts

// Wraps an async function and catches any rejected promises, passing the error to next()

routes.route("/")
    .get(asyncHandler(orderController.getAllOrders.bind(orderController)))
    .post(asyncHandler(orderController.createOrder.bind(orderController)));
routes.route("/:id")
    .get(hasPermission(Permission.READ_ORDER), asyncHandler(orderController.getOrder.bind(orderController)))
    .put(hasPermission(Permission.UPDATE_ORDER), asyncHandler(orderController.updateOrder.bind(orderController)))
    .delete(hasPermission(Permission.DELETE_ORDER), asyncHandler(orderController.deleteOrder.bind(orderController)));


// setup paths and methods 

export default routes;