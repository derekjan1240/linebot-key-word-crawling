module.exports = function (site, resolve, reject) {

  const request = require("request");
  const cheerio = require('cheerio');
  const key = require('./config/keys');

  console.log('Key word:', site);

  let siteUrl,
      siteKeyWord,
      state;

  if(site === 'Baseball'){
    siteUrl = key.sites.pttBaseball.url;
    siteKeyWord = '.r-ent .title';
    state = 'PTT';

  }else if(site === 'Gossip'){
    siteUrl = key.sites.pttGossip.url;
    siteKeyWord = '.r-ent .title';
    state = 'PTT';

  }else if(site === 'CPBL'){
    siteUrl = key.sites.cpbl.url;
    siteKeyWord = '.cont_single .statstoplist_box';
    state = 'CPBL';

  }
  else{
    siteUrl = key.sites.taqm.url;
    siteKeyWord = '.TABLE_G tbody tr';
    state = 'AIR';
  }

  let options = { 
      method: 'GET',
       url: siteUrl,
      headers: {
        'Cookie': key.sites.pttGossip.Cookie
       }
    };

    request(options,function (error, response, body) {
      // console.log(body);

      //開始分析
      const $ = cheerio.load(body) 
      let title = [], result = [];

      $(siteKeyWord).each(function(i, elem) {
          title.push($(this).text().split('\n'))
      }) 
      
      //未整理的資料 title
      //console.log('title: ', title)
      

      //整理資料 
      if(state === 'PTT'){
        for(j =0;j<title.length;j++){
          result.push(title[j][2].toString().replace(/\s+/g, "") + ' \n \n');
        }

      }else if(state === 'CPBL'){

        for(j =0;j<title.length;j++){

          if(j == 0){
            result.push(title[j][4].toString().replace(/\s+/g, "") + '\n');
          }else{
            result.push(title[j][3].toString().replace(/\s+/g, "") + '\n');
          }

          result.push(title[j][6].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][7].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][8].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][9].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][10].toString().replace(/\s+/g, "") + '\n');

          result.push(title[j][12].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][13].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][14].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][15].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][16].toString().replace(/\s+/g, "") + '\n');

          result.push(title[j][18].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][19].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][20].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][21].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][22].toString().replace(/\s+/g, "") + '\n');

          result.push(title[j][24].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][25].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][26].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][27].toString().replace(/\s+/g, "") + ' ');
          result.push(title[j][28].toString().replace(/\s+/g, "") + '\n ------------------------------------------------------ \n');
        }

      }else if(state === 'AIR'){

        if(site === '北宜'){

          for(j =1;j<=16;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          for(j =63;j<=66;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[69][2].toString().replace(/\s+/g, "") + ':' + title[69][4].toString().replace(/\s+/g, "") +' \n \n');
          result.push(title[77][2].toString().replace(/\s+/g, "") + ':' + title[77][4].toString().replace(/\s+/g, "") );

        }else if(site === '桃竹苗'){

          for(j =17;j<=27;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[67][2].toString().replace(/\s+/g, "") + ':' + title[67][4].toString().replace(/\s+/g, "") +' \n \n');
          result.push(title[68][2].toString().replace(/\s+/g, "") + ':' + title[68][4].toString().replace(/\s+/g, ""));

        }else if(site === '中部'){

          for(j =28;j<=36;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[71][2].toString().replace(/\s+/g, "") + ':' + title[71][4].toString().replace(/\s+/g, ""));

        }else if(site === '雲嘉南'){

          for(j =37;j<=46;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[76][2].toString().replace(/\s+/g, "") + ':' + title[76][4].toString().replace(/\s+/g, ""));

        }else if(site === '高屏'){

          for(j =47;j<=60;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[70][2].toString().replace(/\s+/g, "") + ':' + title[70][4].toString().replace(/\s+/g, ""));

        }else if(site === '東部及離島'){

          result.push(title[61][2].toString().replace(/\s+/g, "") + ':' + title[61][4].toString().replace(/\s+/g, "") +' \n \n');
          result.push(title[62][2].toString().replace(/\s+/g, "") + ':' + title[62][4].toString().replace(/\s+/g, "") +' \n \n');
          for(j =72;j<=75;j++){
            result.push(title[j][2].toString().replace(/\s+/g, "") + ':' + title[j][4].toString().replace(/\s+/g, "") +' \n \n');
          }
          result.push(title[78][2].toString().replace(/\s+/g, "") + ':' + title[78][4].toString().replace(/\s+/g, ""));

        }

        

        console.log('result:' , result);

      }else{
        //None this state
        return reject('Crawling Target Error!'); 
      }
      

      //回傳結果 result
      if(result.toString()){
        console.log(result.toString())
        return resolve(result);
      }else{
        return reject('Undefinded Error!');
      }
       
    });

}