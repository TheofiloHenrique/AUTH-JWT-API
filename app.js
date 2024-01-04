import express from "express";
import "dotenv/config";
import connectDb from "./src/database/db.js";
import routes from "./src/routes.js";

const app = express();
app.use(express.json());

app.use(routes);

connectDb()
  .then(() =>
    app.listen(3000, () => console.log("Conectado ao Banco de dados!"))
  )
  .catch((error) => console.log("Erro ao conectar ao Banco de dados!", error));
