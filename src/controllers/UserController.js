import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

async function registerUser(req, res) {
  const { name, email, password} = req.body;
  /*Proteção de senha */
  const salt = await bcrypt.genSalt(12);
  const passwordhash = await bcrypt.hash(password, salt);

  try {
    /*Cria usuário*/
    const user = new User({ name, email, password: passwordhash });
    const newUser = await User.create(user);
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Erro ao criar usuário", error);
    res.status(500).json({ message: "Aconteceu um erro no servidor!" });
  }
}

async function login(req,res){
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET;
    const token = jwt.sign({id: user._id,},secret);

    res.status(200).json({ message: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    console.log("Aconteceu um erro no login: ", error);
    res.status(500).json({message:"Ocorreu um erro no servidor"})
  }
}

async function userLogged(req,res){
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });
 
  res.status(200).json({ user });
}

export { registerUser,login, userLogged};
