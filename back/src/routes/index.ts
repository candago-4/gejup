import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import register from './register';
import login from './login';
import grupo from './grupo';
import produto from './produto';
import prodprep from './prodprep';
import userRef from './userRef';
import UserGoal from './userGoal';
import { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/register', register);
app.use('/login', login);
app.use('/getGrupo', grupo);
app.use('/getProduto', produto);
app.use('/getProdPrep', prodprep);
app.use('/ref', userRef);
app.use('/goals', UserGoal);

app.get('/protected', (req: Request, res: Response) :void => { //funcionou
   const token:any = req.headers['authorization']?.substring(7); 
   if (!token) {
      console.log('Token nao passou');
      res.status(401).json({ message: 'Acesso negado, token não fornecido' });
   }

   try {
      const verified = jwt.verify(token, '@rl31z1nh4');

      if (typeof verified === 'object' && 'userId' in verified) {
         console.log('Autenticado');
         res.json({ message: 'Acesso concedido', userId: verified.userId });
      } else {
         res.status(401).json({ message: 'Token inválido' });
      }
   } catch (error) {
      res.status(401).json({ message: 'Token inválido ou expirado' });
   }
});

export default app