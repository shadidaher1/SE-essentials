import { Router } from "express";
import { UserService } from "../services/User.service";
import { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const userService = new UserService();
const userController = new UserController(userService);

const routes = Router();

// Initialize the user service (create tables if needed)
userService.init().catch(error => {
    console.error("Failed to initialize user service", error);
});

// Routes
routes.route("/")
    .get(asyncHandler(userController.getAllUsers.bind(userController)))
    .post(asyncHandler(userController.createUser.bind(userController)));

routes.route("/:id")
    .get(asyncHandler(userController.getUserById.bind(userController)))
    .put(asyncHandler(userController.updateUser.bind(userController)))
    .delete(asyncHandler(userController.deleteUser.bind(userController)));

routes.route("/email/:email")
    .get(asyncHandler(userController.getUserByEmail.bind(userController)));

export default routes;
