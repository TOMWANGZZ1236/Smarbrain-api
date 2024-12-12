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
const course = require('./controllers/course');

  
const app = express();
app.use(express.json({ extended: true, parameterLimit:50000, limit: '200mb' })); //parsing the incoming json data
app.use(cors());



app.get('/', (req, res) => {
    console.log('this is working')
})

app.post('/handleClarifaiApi', (req,res) => image.handleClarifaiApi(req,res))

app.post('/signin', (req, res) => signin.handleSignin(req, res, postgres, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, postgres, bcrypt))

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, postgres))

app.post('/courseDisplay', (req, res) => course.handleCourseDisplay(req, res, postgres))

app.post('/courseCreate', (req, res) => course.handleCourseCreate(req, res, postgres))

app.delete('/courseDelete', (req, res) => course.handleCourseDelete(req, res, postgres))

app.put('/courseUpdate', (req, res) => course.handleCourseUpdate(req, res, postgres))

app.put('/imageSubmission', (req, res) => image.handleImageSubmission(req, res, postgres));

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is listening on port 3001 ${process.env.PORT}`);
})






