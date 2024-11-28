const handleRegister = (req, res, postgres, bcrypt) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    if (!name || !email || !password) {
        return res.status(400).json("Unable to resgiter because you entered invalid infomation");
    }
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

}

module.exports = {
    handleRegister: handleRegister
  }