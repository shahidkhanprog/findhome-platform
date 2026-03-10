import express from 'express';
import authRoute from './routes/auth.route.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/auth', authRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});