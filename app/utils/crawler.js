import cheerio from 'cheerio-without-node-native';

export default {
  crawlGirls: (html) => {
    let girls = [];

    $ = cheerio.load(html, {
      normalizeWhitespace: true
    });

    $('article.post-photo').each( function(index, element) {
      let girl = {};
      girl.url = $(element).find('img').attr('src');
      girl.title = $(element).find('div.date > a').first().text();
      girls.push(girl);
    });

    return girls;
  }, 
  crawlGirls2: (html) => {
    let girls = [];

    $ = cheerio.load(html, {
      normalizeWhitespace: true
    });

    $('div#grid div.gridItem.gridphoto').each( function(index, element) {
      let girl = {};
      girl.url = $(element).attr('data-photo-high');
      girl.title = $(element).find('.gridTime').text();
      girls.push(girl);
    });

    return girls;
  }
}