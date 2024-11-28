const handleProfileGet = (req, res, postgres) => {
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
}

module.exports = {
    handleProfileGet: handleProfileGet
  }