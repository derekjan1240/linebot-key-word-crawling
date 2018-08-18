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

  res.render('home', { result: '' });

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

    // h 功能選單
    if(event.message.text === 'h' || event.message.text === 'H'){
      //選項表單
      let echo = {
          type: "template",
          altText: "Input Key word: [Gossip][Baseball][CPBL][北部][中部][南部][東部及離島]",
          template: {
            type: "buttons",
            text: "選擇查詢目標",
            actions: [
              {
                type: "message",
                label: "ptt最新標題",
                text: "ptt"
              },
              {
                type: "message",
                label: "pm2.5濃度",
                text: "pm2.5"
              },
              {
                type: "message",
                label: "CPBL個人榜",
                text: "CPBL"
              }
            ]
          } 
        }
      

      return client.replyMessage(event.replyToken, echo);
    }

    // ptt ptt爬蟲選單
    if(event.message.text === 'ptt'){
      //選項表單
      let echo = {
          type: "template",
          altText: "在不支援顯示樣板的地方顯示的文字",
          template: {
            type: "confirm",
            text: "PTT 看板選擇",
            actions: [
              {
                type: "message",
                label: "Gossip",
                text: "Gossip" 
              },
              {
                type: "message",
                label: "Baseball",
                text: "Baseball"
              }
            ]
          }
        }

      return client.replyMessage(event.replyToken, echo);
    }

    // air pm2.5爬蟲選單
    if(event.message.text === 'pm2.5'){
      //選項表單
      let echo = {
          type: "template",
          altText: "在不支援顯示樣板的地方顯示的文字",
          template: {
            type: "buttons",
            text: "量測區域選擇",
            actions: [
              {
                type: "message",
                label: "北部",
                text: "北部"
              },
              {
                type: "message",
                label: "中部",
                text: "中部"
              },
              {
                type: "message",
                label: "南部",
                text: "南部"
              },
              {
                type: "message",
                label: "東部及離島",
                text: "東部及離島"
              }
            ]
          }
        }

      return client.replyMessage(event.replyToken, echo);
    }


    // 爬蟲 -----------

    if(event.message.text === 'Gossip' || event.message.text === 'Baseball'){

      let promise = new Promise((resolve, reject) => {
          //crawling and return result to home page 
        crawling(event.message.text, resolve, reject)
        
      }).then((result) => {
        //send the crawling result to user
        let msg = { type: 'text', text: result.toString().replace(/,/g, "")};
        return client.replyMessage(event.replyToken, msg);

      }, (reason) => {
        //erro handling
        //send error msg to user
        let errorMsg = { type: 'text', text: 'crawling error!' };
        return client.replyMessage(event.replyToken, errorMsg);
      });
    }

    else if(event.message.text === 'CPBL'){
      let promise = new Promise((resolve, reject) => {
          //crawling and return result to home page 
        crawling(event.message.text, resolve, reject)
        
      }).then((result) => {
        //send the crawling result to user
        let msg = { type: 'text', text: result.toString().replace(/,/g, "")};
        console.log('msg:',msg)
        return client.replyMessage(event.replyToken, msg);

      }, (reason) => {
        //erro handling
        //send error msg to user
        let errorMsg = { type: 'text', text: 'crawling error!' };
        return client.replyMessage(event.replyToken, errorMsg);
      });
    }

    else if(event.message.text === '北部' || event.message.text === '中部' || event.message.text === '南部' || event.message.text === '東部及離島'){
      handleCrawling(event);
    }

    


    //echo message
    else{
      //echo
      // create a echoing text message
      let echo = { type: 'text', text: event.message.text };
      //use reply API
      return client.replyMessage(event.replyToken, echo);
    }
  }
  
}

function handleCrawling(){
  let promise = new Promise((resolve, reject) => {
    //crawling and return result to home page 
    crawling(event.message.text, resolve, reject)
    
  }).then((result) => {
    //send the crawling result to user
    let msg = { type: 'text', text: result.toString().replace(/,/g, "")};
    return client.replyMessage(event.replyToken, msg);

  }, (reason) => {
    //erro handling
    //send error msg to user
    let errorMsg = { type: 'text', text: 'crawling error!' };
    return client.replyMessage(event.replyToken, errorMsg);
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});