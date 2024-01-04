import { Router } from "express";
import { registerUser,login } from "./controllers/UserController.js";
import {userValidations,loginValidations} from "./middlewares/middleware.js";


const routes = Router();

routes.post("/registerUser",userValidations, registerUser);
routes.post("/login",loginValidations, login);

export default routes;
