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
      res.json(result);
      console.log('ok2');
      //console.log('event: ', req.body.events[0]);
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

  }else{

    if(event.message.text === 'h' || event.message.text === 'H'){
      //選項表單
      let echo = {
          type: "template",
          altText: "在不支援顯示樣板的地方顯示的文字",
          template: {
            type: "confirm",
            text: "標題文字",
            actions: [
              {
                type: "message",
                label: "ptt",
                text: "ptt"
              },
              {
                type: "message",
                label: "2",
                text: "2"
              }
            ]
          }
        }

      return client.replyMessage(event.replyToken, echo);
    }

    if(event.message.text === '2'){
      let echo = { type: 'text', text: 'number \n 2' };
      return client.replyMessage(event.replyToken, echo);
    }

    if(event.message.text === '9'){

      let promise = new Promise((resolve, reject) => {
        //crawling and return result to home page 
        crawling(key.site.url, key.site.cookies, resolve, reject)
        
      }).then((result) => {
        
        //send the crawling result to user

        let msg = { type: 'text', text: result.toString().replace(/,/g, "")};
        return client.replyMessage(event.replyToken, msg);

      }, (reason) => {
        //send error msg to user
        let errorMsg = { type: 'text', text: 'crawling error!' };
        return client.replyMessage(event.replyToken, errorMsg);
      });

      console.log('waiting');
      
    }

    else{
      //echo
      // create a echoing text message
      let echo = { type: 'text', text: event.message.text };
      //use reply API
      return client.replyMessage(event.replyToken, echo);
    }
  }
  
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});