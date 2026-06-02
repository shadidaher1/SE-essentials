import { Router } from "express";
import { UserService } from "../services/User.service";
import { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { authenticate } from "../middleware/auth";

const userService = new UserService();
const userController = new UserController(userService);

const routes = Router();

// Initialize the user service (create tables if needed)
userService.init().catch(error => {
    console.error("Failed to initialize user service", error);
});

// Routes
routes.route("/")
    .get(authenticate, asyncHandler(userController.getAllUsers.bind(userController)))
    .post(asyncHandler(userController.createUser.bind(userController)));

routes.route("/:id")
    .get(authenticate, asyncHandler(userController.getUserById.bind(userController)))
    .put(authenticate, asyncHandler(userController.updateUser.bind(userController)))
    .delete(authenticate, asyncHandler(userController.deleteUser.bind(userController)));

routes.route("/email/:email")
    .get(authenticate, asyncHandler(userController.getUserByEmail.bind(userController)));

export default routes;
