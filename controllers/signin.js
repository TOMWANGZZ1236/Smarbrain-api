const handleSignin = (req, res, postgres, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json("Unable to log in because you entered invalid infomation");
    }
    postgres.select("email", "hash").from('login')
    .where('email' , email)
    .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        // console.log(isValid);
        if (isValid) {
            return postgres.select('*').from('users')
            .where('email', email)
            .then((users) => {
                res.json(users[0]);
            }) 
            .catch(() => res.status(400).json("Unable the get the User"))
        } else {
            res.status(400).json("Wrong credentials");
        }

    })
    .catch(() => res.status(400).json("Unable to sign in"))

}

module.exports = {
    handleSignin: handleSignin
  }