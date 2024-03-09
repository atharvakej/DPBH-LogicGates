const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;
const axios = require("axios");

app.use(bodyParser.json({ limit: '100mb' }));

app.post('/extension/body' , (req,res)=>{
  const reqData = req.body;
  const bodytext = reqData.bodyText;
  const screenshot = reqData.screenshot;
  const URL = reqData.URL;

  textrun(bodytext).then(text =>{
      res.send(text);
  }).catch(error => {
      console.error("Error generating text:", error);
      res.status(500).send("Error generating text");
  });

})

app.post('/extension/ss' , (req,res)=>{
    const requestData = req.body;
    const screenshot = requestData.screenshot;
    console.log(screenshot);
    run(screenshot).then(text => {
      res.send(text);
    }).catch(error => {
        console.error("Error generating text:", error);
        res.status(500).send("Error generating text");
    });
  })
  
app.post('/extension/url' , (req,res)=>{
    const requestData = req.body;
    const URL = requestData.URL;
    const screenshot = requestData.screenshotUrl;

    res.send({url: URL , ss:screenshot });
})



var options = {
  method: 'POST',
  url: 'http://localhost:8080/v1/chat/completions',
  headers: {
    Accept: '/',
    'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    'Content-Type': 'application/json',
    Authorization: 'Bearer no-key'
  },
  data: {
    model: 'LLaMA_CPP',
    n_preict: 256 , 
    messages: [
      {
        role: 'system',
        content: 'You are LLAMAfile, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests.'
      }
    ]
  }
};

axios.request(options).then(function (response) {
  console.log(response.data.choices[0].message);
}).catch(function (error) {
  console.error(error);
});

app.listen(PORT , ()=>{
  console.log('Server started');
})