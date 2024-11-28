const Clarifai = require('clarifai');
 
const apiconfiguration =  (imageUrl) => {
    const PAT = '914a9169c8744e4a84605d7accab8c11';
    const USER_ID = 'tomwangwaterloo';
    const APP_ID = 'SmartBrainTW';
    const IMAGE_URL = imageUrl;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
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
    console.log(req.body.input)
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", 
        apiconfiguration(req.body.input))
    .then(response => {
        console.log(1, response)
        return response.json()}
    )
    .then(result => {
        console.log(2, result)
        // const regions = result.outputs[0].data.regions;
        res.json(result);
    })
}


const handleImage = (req, res, postgres) => {
    const {id} = req.body; 
    postgres('users').where('id', '=', id)
    .returning('entries')
    .increment(
        {'entries' : 1}
    )
    .then((data)=> {
        res.json(data[0].entries);
    })
}

module.exports = {
    handleImage: handleImage,
    handleClarifaiApi : handleClarifaiApi
  }



