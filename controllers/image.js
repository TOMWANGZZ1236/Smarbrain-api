const Clarifai = require('clarifai');
 
const apiconfiguration =  (BYTES_) => {
    const PAT = '914a9169c8744e4a84605d7accab8c11';
    const USER_ID = 'tomwangwaterloo';
    const APP_ID = 'SmartBrainTW';
    const BYTES_STRING = BYTES_;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                    //   "url": IMAGE_URL
                    "base64": BYTES_STRING
                      
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
      
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions;
  }


const handleClarifaiApi = (req, res) => {
    // console.log(req.body.input)
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", 
        apiconfiguration(req.body.input))
    .then(response => {
        // console.log(1, response)
        return response.json()} 
    )
    .then(result => {
        // console.log(2, result)
        // const regions = result.outputs[0].data.regions;
        res.json(result);
    })
}


const handleImageSubmission = (req, res, postgres) => {
    const { email, name, newAttendance } = req.body;

    // First, retrieve the current lectures and attendance
    postgres('courses')
        .where({
            email: email,
            name: name
        })
        .select('lectures', 'attendance')
        .first()
        .then(row => {
            const oldLectures = row.lectures;
            const oldAttendance = row.attendance;                                                                                          

            const newLectures = oldLectures + 1;
            const updatedAttendance = (oldAttendance * oldLectures + newAttendance) / newLectures;
            // console.log(updatedAttendance);
            // Now, update the lectures and attendance
            return postgres('courses')
                .where({
                    email: email,
                    name: name
                })
                .update({
                    lectures: newLectures,
                    attendance: updatedAttendance
                });
        })
        .then(() => {
            // Fetch the updated data to send back to the client
            return postgres('courses')
                .where({
                    email: email,
                    name: name
                })
                .select('lectures', 'attendance')
                .first();
        })
        .then(data => {
            res.json(data);  // Send the updated lectures and attendance back
        })
        .catch(error => {
            console.error(error);
            res.status(40).json({ error: 'Unable to submit' });
        });
}



module.exports = {
    handleImageSubmission: handleImageSubmission,
    handleClarifaiApi : handleClarifaiApi
  }



