module.exports = function (url, Cookie) {

  const request = require("request");
  const cheerio = require('cheerio');
  console.log('url',url);

  var options = { 
      method: 'GET',
      url: url,
      headers: {
        'Cookie': Cookie
       }
    };

    request(options,function (error, response, body) {
      //console.log(body);

      //開始分析
      const $ = cheerio.load(body) 
      let title = [];

      $('.r-ent .title').each(function(i, elem) {
          title.push($(this).text().split('\n'))
      })  

      for(j =0;j<title.length;j++){
        let result = title[j][2].toString().replace(/\s+/g, "");
        console.log( result + '\n');
      }

    });

}