import connect from "../models/connection";
import app from '../routes/index';
import dotenv from "dotenv";

connect();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Servidor rodando na porta ${PORT}`);
});

