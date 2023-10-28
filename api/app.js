const express = require('express')
var { expressjwt: jwt } = require("express-jwt");
const DB = require('./DB');
const app = express()
const port = 3000

const database = new DB();

app.post('/login', (req,res) => {

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//tokens
//professores podem ver turmas 
//sv verifica mal a data do token
//quando pesquisa por um id da turma invalido o sv cai