const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json()); //parsing the incoming json data
app.use(cors());

let database = {
    users : [
        {
            id : 123,
            name : "Tom",
            email : 'tomwang@gmail.com',
            password : "1234",
            entries : 0,
            joined : new Date(),
        },
        {
            id : 124,
            name : "Kevin",
            email : 'Kevin@gmail.com',
            password : "12345",
            entries : 0,
            joined : new Date(),
        }
    ]
}


app.get('/', (req, res) => {
    console.log('this is working')
})

app.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let found = false;
    database.users.forEach((item, index) => {
        if (item.password === password && item.email === email) {
            res.json('success');
            found =  true;
        }
    });
    if (!found) {
        res.status(400).json('Error logging in');
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    database.users.push({
        id : 125,
        name : "Jason",
        email : 'Jason@gmail.com',
        password : "1234",
        entries : 0,
        joined : new Date(),
    },)
    res.json('Successfully registered')
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params; 
    database.users.forEach((user, index) => {
        if (user.id === id) {
            res.json('User found');
            found =  true;
        }
    })
    if (!found) {
        res.status(404).json('User not found')
    }

})

app.put('/image', (req, res) => {
    const {id} = req.params; 
    database.users.forEach((user, index) => {
        if (user.id === id) {
            user.entries ++;
            res.json(user.entries);
            found =  true;
        }
    })
    if (!found) {
        res.status(404).json('User not found')
    }
})

app.listen(3001, () => {
    console.log('app is listening on port 3001');
})
