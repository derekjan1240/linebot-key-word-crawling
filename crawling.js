module.exports = function (site, resolve, reject) {

  const request = require("request");
  const cheerio = require('cheerio');
  const key = require('./config/keys');

  console.log('site:', site);

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

  }else if(site === '北部'){
    siteUrl = key.sites.airpm_North.url;
    siteKeyWord = '.TABLE_G tbody tr';
    state = 'AIR';

  }else if(site === '中部'){
    siteUrl = key.sites.airpm_Central.url;
    siteKeyWord = '.TABLE_G tbody tr';
    state = 'AIR';

  }else if(site === '南部'){
    siteUrl = key.sites.airpm_Southern.url;
    siteKeyWord = '.TABLE_G tbody tr';
    state = 'AIR';

  }else if(site === '東部及離島'){
    siteUrl = key.sites.airpm_East.url;
    siteKeyWord = '.TABLE_G tbody tr';
    state = 'AIR';

  }else{

  }

  console.log('siteUrl: ',siteUrl)

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
      
      //console.log('title: ', title)
      
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
          result.push(title[j][28].toString().replace(/\s+/g, "") + '\n --------------------------- \n');
        }

      }
      


      // pm2.5
      // for(j =1;j<title.length;j++){
      //   result[j] = title[j][2].toString().replace(/\s+/g, "") + ':' +
      //   title[j][4].toString().replace(/\s+/g, "") +' \n \n';
      // }


      console.log('result:' , result)

      if(result.toString()){
        console.log(result.toString())
        return resolve(result);
      }else{
        return reject('undefinded!');
      }
       

    });

}