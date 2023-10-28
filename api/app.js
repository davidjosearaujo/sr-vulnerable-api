const express = require('express')
var { expressjwt: jwt } = require("express-jwt");
const DB = require('./DB');

const {verifyToken, generateToken} = require('./security')
const app = express();
app.use(express.json());
const port = 3000

const database = new DB();

app.post('/login', async(req,res) => {

  const { username, password } = req.body;
  
  try{

    const user = await database.getUser(username,password);

    const token = generateToken({username: user.username, id: user.id});

    res.json({token});


  } catch(error) {

    res.status(401).send('Authentication failed');
  }


})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})


//tokens
//professores podem ver turmas 
//sv verifica mal a data do token
//quando pesquisa por um id da turma invalido o sv cai