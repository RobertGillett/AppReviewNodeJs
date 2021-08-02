const https = require('https');
const fs = require('fs');

const baseURL = 'https://itunes.apple.com/us/rss/customerreviews';
var maxPages = 10;

module.exports = function appStoreReviews(app) {
  var allData = [];
  handleFetch(1);
  function handleFetch(page) {
    https.get(`${baseURL}/page=${page}/id=${app.id}/json`, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log(JSON.parse(data));
      var feed = JSON.parse(data).feed.entry;
      var parsedFeed = parseReviewData(feed)
      allData = allData.concat(parsedFeed)
        if (page >= maxPages) {
          saveJSON();
        } else {
          handleFetch(page + 1)
        }
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  }

  function parseReviewData(data) {
    function parse(d) {
      var o = new Object();
      o.id = d.id.label.toString();
      o.version = d["im:version"].label.toString();
      o.date = new Date(d.updated.label);
      o.authorName = d.author.name.label;
      o.rating = Number(d["im:rating"].label);
      o.title = d.title.label;
      o.body = d.content.label;
      o.voteCount = Number(d["im:voteCount"].label);
      o.voteSum = Number(d["im:voteSum"].label);
      o.platform = "iOS";
      o.appID = app.id;
      o.appName = app.name;
      return o;
    }
    var reviews = [];
    if (data) {
    data.forEach(d => {
      reviews.push(parse(d));
    });
  }
    return reviews;
  }

  function saveJSON() {
    let data = JSON.stringify(allData);
    fs.writeFile(`./json/${app.name}.json`, data, (err) => {
      // fs.writeFile(`test.json`, data, (err) => {

      if (err) throw err;
      console.log('Data written to file');
    });
  }
}
