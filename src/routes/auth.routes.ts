import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthenticationService } from '../services/Authentication.service';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/User.service';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

// Create router
const router = express.Router();

// Initialize dependencies
const authService = new AuthenticationService();
const userService = new UserService();
const userController = new UserController(userService);
const authController = new AuthController(authService, userService);
// Define routes
router.route('/login')
    .post(asyncHandler(authController.login.bind(authController)));

router.route('/logout')
    .get(authenticate, authController.logout.bind(authController));

export default router;
