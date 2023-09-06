import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(5019, () => {
    console.log('Server listening on port 5019');
});

