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

    //// 選單部分 ---
    // h 功能選單
    if(event.message.text === 'C' || event.message.text === 'c'){
      //選項表單
      let menu = {
          type: "template",
          altText: "Input Key word: [Gossip][Baseball][CPBL][北宜][桃竹苗][中部][雲嘉南][高屏][東部及離島]",
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
                label: "pm2.5及時濃度",
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
      

      return client.replyMessage(event.replyToken, menu);
    }

    // ptt >ptt爬蟲選單
    else if(event.message.text === 'ptt'){
      //選項表單
      let menu = {
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

      return client.replyMessage(event.replyToken, menu);
    }

    // air >pm2.5爬蟲選單
    else if(event.message.text === 'pm2.5'){
      //選項表單
      let menu = {
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

      return client.replyMessage(event.replyToken, menu);
    }


    //北部與南部區域多細分選項
    else if(event.message.text === '北部'){
      let echo = {
          type: "template",
          altText: "在不支援顯示樣板的地方顯示的文字",
          template: {
            type: "buttons",
            text: "量測區域選擇",
            actions: [
              {
                type: "message",
                label: "北宜",
                text: "北宜"
              },
              {
                type: "message",
                label: "桃竹苗",
                text: "桃竹苗"
              }
            ]
          }
        }

      return client.replyMessage(event.replyToken, echo);
    }

    else if(event.message.text === '南部'){
      let echo = {
          type: "template",
          altText: "在不支援顯示樣板的地方顯示的文字",
          template: {
            type: "buttons",
            text: "量測區域選擇",
            actions: [
              {
                type: "message",
                label: "雲嘉南",
                text: "雲嘉南"
              },
              {
                type: "message",
                label: "高屏",
                text: "高屏"
              }
            ]
          }
        }

      return client.replyMessage(event.replyToken, echo);
    }

    //// 爬蟲部分 -- 
    //ptt爬蟲
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
        let errorMsg = { type: 'text', text: reason.toString() };
        return client.replyMessage(event.replyToken, errorMsg);
      });
    }
    //cpbl爬蟲
    else if(event.message.text === 'CPBL'){
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
        let errorMsg = { type: 'text', text: reason.toString() };
        return client.replyMessage(event.replyToken, errorMsg);
      });
    }
    //空汙爬蟲
    else if(event.message.text === '北宜' || event.message.text === '桃竹苗' ||  event.message.text === '中部'  || event.message.text === '雲嘉南' || event.message.text === '高屏' || event.message.text === '東部及離島'){
      let promise = new Promise((resolve, reject) => {
          //crawling and return result to home page 
        crawling(event.message.text, resolve, reject)
        
      }).then((result) => {
        //send the crawling result to user
        let msg = { type: 'text', text: '空格：通訊異常，ND：未檢出\n (表示數據低於偵測極限 2 微克/立方公尺) \n \n' + result.toString().replace(/,/g, "")};
        return client.replyMessage(event.replyToken, msg);

      }, (reason) => {
        //erro handling
        //send error msg to user
        let errorMsg = { type: 'text', text: reason.toString() };
        return client.replyMessage(event.replyToken, errorMsg);
      });
    }

    ////若輸入非 Key word 則 echo message
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

