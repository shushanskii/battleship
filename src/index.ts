import express from 'express';

const app = express();
const PORT = 3001;
const HOST = '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
