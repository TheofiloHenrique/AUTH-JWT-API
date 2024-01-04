import User from "../models/User.js";
import bcrypt from "bcrypt";

async function userValidations(req,res,next){
  if (!req.body.name) return res.status(422).json({ message: "O nome é obrigatório!" });
  if (!req.body.email) return res.status(422).json({ message: "O email é obrigatório!" });
  if (!req.body.password) return res.status(422).json({ message: "A senha é obrigatória!" });
  if (req.body.password !== req.body.confirmPassword) return res.status(422).json({ message: "A senhas precisam ser iguais!" });
  
  /*Validando se o user existe */
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(422).json({ message: "Este Email já está em uso!" });

  next();

}

async function loginValidations(req,res,next){
  
  if (!req.body.email) return res.status(422).json({ message: "O Email é obrigatório!" });
  if (!req.body.password) return res.status(422).json({ message: "A Senha é obrigatória!" });
    
  /*Validando se o user existe */
  const user = await User.findOne({ email: req.body.email });
    
  if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });
      
  /*Validando se a senha é correta */
  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  if (!checkPassword) return res.status(422).json({ message: "Senha inválida" });

  next();
    
}

export {userValidations, loginValidations}