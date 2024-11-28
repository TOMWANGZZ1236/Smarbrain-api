const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const postgres = require('knex')({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: '',
      password: '',
      database: 'tomwangm',
    },
  });
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

  
const app = express();
app.use(express.json()); //parsing the incoming json data
app.use(cors());



app.get('/', (req, res) => {
    console.log('this is working')
})

app.post('/handleClarifaiApi', (req,res) => image.handleClarifaiApi(req,res))

app.post('/signin', (req, res) => signin.handleSignin(req, res, postgres, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, postgres, bcrypt))

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, postgres))

app.put('/image', (req, res) => image.handleImage(req, res, postgres));

app.listen(3001, () => {
    console.log('app is listening on port 3001');
})






