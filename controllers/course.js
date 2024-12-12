const handleCourseDisplay = (req, res, postgres) => {
    
    const {email} = req.body;
    postgres.select("name", "time", "students", "attendance", "lectures").from('courses')
    .where('email' , email)
    .then((data) => { 
        res.json(data);
    })
    .catch((e) => res.status(400).json("Unable to display the courses"))

}

const handleCourseCreate = (req, res, postgres) => {
    const {email, name, time, students} = req.body;
    if (!email || !name || !time || !students) {
        return res.status(400).json("Unable to resgiter the course");
    }
    postgres('courses').insert({email: email, name: name, time: time, students: students })
    .then(result => res.json('successful!'))
    .catch((e) => res.status(400).json(e))

}

const handleCourseDelete = (req, res, postgres) => {
    const {email, name} = req.body;
    if (!email || !name ) {
        return res.status(400).json("Unable to delete the course");
    }
    postgres('courses')
    .where({
        email: email,
        name: name
    })
    .del()
    .then(result => res.json('successful!'))
    .catch((e) => res.status(400).json(e))

}

const handleCourseUpdate = (req, res, postgres) => {

    const {email, oldName, name, time, students} = req.body;
    if (!name || !time || !students ) {
        return res.status(400).json("Unable to update the course");
    }
    postgres('courses')
    .where({
        email: email,
        name: oldName
    })
    .update(
        {
          name: name,
          time: time, 
          students : students
        }
      )
    .then(result => res.json('successful!'))
    .catch((e) => res.status(400).json(e))

}


module.exports = {
    handleCourseDisplay: handleCourseDisplay,
    handleCourseCreate: handleCourseCreate,
    handleCourseDelete: handleCourseDelete,
    handleCourseUpdate: handleCourseUpdate
  }


