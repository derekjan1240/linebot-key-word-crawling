'use strict';

const line = require('@line/bot-sdk');
const key = require('./config/keys');

//crawling function
const crawling = require('./crawling');

const express = require('express');

// create Express app
const app = express();

// set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// create home route
app.get('/', (req, res) => {

  let promise = new Promise((resolve, reject) => {
    //crawling and return result to home page 
    crawling(key.site.url, key.site.cookies, resolve, reject)
    
  }).then((result) => {
    res.render('home', { result: result });
  });

});

// create LINE SDK client
const client = new line.Client(key.lineChannelConfig);

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/echo', line.middleware(key.lineChannelConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      console.log('result: ', result);
      res.json(result);
      console.log('event: ', req.body.events[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  let echo = { type: 'text', text: event.message.text };
  
  //key word set
  if(event.message.text === '1'){
    echo = { type: 'text', text: 'event.message.text' };
  }
  

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});