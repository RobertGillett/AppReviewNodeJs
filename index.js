const fs = require('fs');

const appStoreReviews =  require('./appStore.js')


getApps();

function getApps() {
  fs.readFile('./json/mBenzApps.json', (err, data) => {
    if (err) throw err;
    let apps = JSON.parse(data);
    console.log(apps);
    apps.forEach(app => {
      appStoreReviews(app);
    })
});
}
