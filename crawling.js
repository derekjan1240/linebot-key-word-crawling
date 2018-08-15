module.exports = function (url, Cookie, resolve) {

  const request = require("request");
  const cheerio = require('cheerio');

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
      let title = [], result = [];

      $('.r-ent .title').each(function(i, elem) {
          title.push($(this).text().split('\n'))
      })  


      for(j =0;j<title.length;j++){
        result[j] = title[j][2].toString().replace(/\s+/g, "");
      }

       //console.log('result', result);

       resolve(result); // Yay！非常順利！

    });

}