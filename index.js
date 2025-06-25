const express = require('express');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.send('Welcome To My Home Page')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
