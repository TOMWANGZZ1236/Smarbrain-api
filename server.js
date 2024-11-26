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

const app = express();
app.use(express.json()); //parsing the incoming json data
app.use(cors());


app.get('/', (req, res) => {
    console.log('this is working')
})

app.post('/signin', (req, res) => {
    postgres.select("email", "hash").from('login')
    .where('email' , req.body.email)
    .then((data) => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid);
        if (isValid) {
            return postgres.select('*').from('users')
            .where('email', req.body.email)
            .then((users) => {
                res.json(users[0]);
            }) 
            .catch(() => res.status(400).json("Unable the get the User"))
        } else {
            res.status(400).json("Wrong credentials");
        }

    })
    .catch(() => res.status(400).json("Wrong credentials"))

})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    postgres.transaction((trx) => 
        trx('login')
        .returning('id')
        .insert({hash: hash, email: email})
        .then(id => {
            console.log(id);
            trx('users')
            .returning('*')
            .insert({name : name, email: email, joined: new Date()})
            .then(user => res.json(user[0]))
        })
    )
    .catch(() => res.status(400).json("Unable to register, user exists alraedy"))

})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params; 
    postgres
    .select('*')
    .from('users')
    .where('id', id)
    .then((user) => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json("Error getting user")
        }
    })
    .catch(() => res.status(404).json("Can't find user"))

})

app.put('/image', (req, res) => {
    const {id} = req.body; 
    postgres('users').where('id', '=', id)
    .returning('entries')
    .increment(
        {'entries' : 1}
    )
    .then((data)=> {
        res.json(data[0].entries);
    })
    
})

app.listen(3001, () => {
    console.log('app is listening on port 3001');
})






