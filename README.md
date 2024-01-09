<h1 align="center">
  <br>
  <img src=./img/ban1.png width="700"></a>
  <br>
  API de autenticação com JWT, Bcrypt e MongoDB
  <br>
</h1>

<h4 align="center">Um sistema de autenticação usando JWT e bcrypt feito para praticar habilidades.</h4>

<p align="center">
  
</p>

<p align="center">
  <a href="#Conexão-com-o-Banco-de-Dados">Conexão com o Banco de Dados:</a> •
  <a href="#Como-funciona">Como Funciona:</a> 
  •
  <a href="#Acessando-rotas-protegidas">Acessando rotas protegidas</a> 
  •
  <a href="#Ferramentas-usadas">Ferramentas usadas</a> 

</p>


## Conexão com o Banco de Dados   

É necessário incluir a URL do MongoDB Atlas para estabelecer a conexão com o banco de dados. A presença dessa URL é crucial para garantir a correta interação e acesso aos dados armazenados no MongoDB Atlas:
```bash

async function dbConection() {
  await mongoose.connect(process.env.MONGO_URL);
}

```
Crie um arquivo .env e personalize sua MONGO_URL:

```bash

MONGO_URL=Sua URL
SECRET=

```

## Como funciona

<h3>Criar usuário:</h3>

Este é um exemplo do Schema para um usuário em formato JSON:

```bash

{
	"name": "Theo",
	"email": "theo@gmail.com",
	"password": "senha123",
	"confirmPassword": "senha123"
}

```

Os dados, após serem submetidos à rota de criação de usuários ( /registerUser ), passam por validações simples antes de serem aprovados. 

```bash
async function userValidations(req,res,next){
if (!req.body.name) return res.status(422).json({ message: "O nome é obrigatório!" });
if (!req.body.email) return res.status(422).json({ message: "O email é obrigatório!" });
if (!req.body.password) return res.status(422).json({ message: "As senha é obrigatória!" });
if (req.body.password !== req.body.confirmPassword) return res.status(422).json({ message: "A senhas precisam ser iguais!" });

  /*Validando se o user existe */
  
const userExist = await User.findOne({ email: req.body.email });
if (userExist) return res.status(422).json({ message: "Este Email já está em uso!" });

  next();

}

```
Posteriormente, são encaminhados para o UserController, onde todo o processo de criação de usuário é executado, incluindo a persistência das informações no banco de dados.

<h3>User Controller</h3>

Após a conclusão das validações, os dados são encaminhados ao UserController, onde se desencadeia o processo de hash da senha do usuário e a subsequente criação de sua conta. Este procedimento visa garantir a segurança e integridade das informações sensíveis, como a senha do usuário, durante o processo de criação.

A função de registro de usuário, implementada no UserController, desempenha a responsabilidade de criar e armazenar informações de novos usuários no sistema:

```bash

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

```
> **Nota:**
> A fim de reforçar a segurança e viabilizar o uso do JWT, é crucial fornecer o valor de "SECRET". Isso deve ser realizado no arquivo .env, sob a chave SECRET.

Após o registro bem-sucedido, o usuário é apresentado em formato JSON, com a proteção de sua senha. Esse método assegura a confidencialidade da senha do usuário durante a transmissão e exibição dos dados.

<p align="center"><img src=./img/gif2.gif width="1000"></a>
  <br></p>

Nada de senhas desprotegidas no nosso BD! :

<p align="center"><img src=./img/gif3.gif width="1000"></a>
  <br></p>


<h3>Login:</h3>

Antes de alcançar a função final, os dados de login passam por um processo de validação, onde a funcionalidade do bcrypt é novamente empregada. 😎 

🔒:
```bash

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

```

Tentando logar com senha incorreta:

 <p align="center"><img src=./img/gif5.gif width="1000"></a>
  <br></p>

Logando com user criado:
  <p align="center"><img src=./img/gif4.gif width="1000"></a>
  <br></p>

Agora recebemos nosso Token de acesso e estamos prontos para acessar rotas protegidas ! 🔐 😲


## Acessando rotas protegidas:

A nossa rota privada é resguardada por um middleware, encarregado de verificar a validade do token associado. Esse mecanismo assegura a autenticidade e permissão de acesso por meio da verificação do token fornecido.

```bash

/*Rota privada */
routes.post("/logged/:id",checkToken, userLogged);

```

Middleware de checagem de token:


```bash
function checkToken(req,res,next){
const authHeader = req.headers['authorization']
const token = authHeader && authHeader.split(' ')[1]

if(!token) return res.status(401).json({message:"Acesso negado!"})

  try {
    const secret = process.env.SECRET
    jwt.verify(token,secret)
    next();
  } catch (error) {
  res.status(400).json({message:"Token inválido!"})
  }  
}
```

Após a verificação do token, é retornado o usuário logado, cujo ID é fornecido como parâmetro na URL:

 <p align="center"><img src=./img/gif6.gif width="1000"></a>
  <br></p>

Tentando acessar rota com token inválido 🐱‍👤🤫:

<p align="center"><img src=./img/gif7.gif width="1000"></a>
  <br></p>


## Ferramentas usadas 🔨:

-[Node](https://nodejs.org/en) 
-[Express](https://expressjs.com/pt-br/)
-[Mongo DB](https://www.mongodb.com/pt-br/atlas)
-[Mongoose](https://mongoosejs.com/)
-[JWT](https://jwt.io/)
-[Bcrypt](https://www.npmjs.com/package/bcrypt)

## License

MIT

---
