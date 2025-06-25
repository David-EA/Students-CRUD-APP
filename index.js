const express = require('express');
const dotEnv = require('dotenv');
const connectDB = require('./src/config/db');
const studentRouter = require('./src/routes/student.routes')

dotEnv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.send('Welcome To My Home Page')
})

app.use('/api/v1', studentRouter)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
