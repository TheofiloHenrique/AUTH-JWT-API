import { Router } from "express";
import { registerUser,login, userLogged } from "./controllers/UserController.js";
import {userValidations,loginValidations, checkToken} from "./middlewares/middleware.js";


const routes = Router();

routes.post("/registerUser",userValidations, registerUser);
routes.post("/login",loginValidations, login);

/*Rota privada */
routes.post("/logged/:id",checkToken, userLogged);

export default routes;
