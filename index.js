'use strict';

const line = require('@line/bot-sdk');
const key = require('./config/keys')
const express = require('express');

// create LINE SDK client
const client = new line.Client(key.lineChannelConfig);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/echo', line.middleware(key.lineChannelConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
      //console.log('req.body: ', req.body.events);
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