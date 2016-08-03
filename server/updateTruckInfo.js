const Truck = require('../db/truckSchema');
const Twitter = require('twitter');
let secretKeys = null;
if(!process.env['TWITTERINFO_CONSUMER_KEY']) {
  secretKeys = require('../env/config');
}
const twitterInfo = secretKeys.twitterInfo || {
  consumer_key: process.env['TWITTERINFO_CONSUMER_KEY'],
  consumer_secret: process.env['TWITTERINFO_CONSUMER_SECRET'],
  bearer_token: process.env['TWITTERINFO_BEARER_TOKEN']
};

const twitterClient = new Twitter(twitterInfo);

module.exports = {};

module.exports.foodTrucks = ['curryupnow', 'chairmantruck'];

//post tweets to DB
//perform this function periodically

// Create a new Truck with Twitter's status info

module.exports.createTruckWithTwitterInfo = function (foodTruck){
  return new Promise((resolve, reject) => {
    let truck;
    let searchParams = { 
        screen_name: foodTruck, 
        exclude_replies: true, 
        include_rts: true
    };
    // search parameters according to https://dev.twitter.com/rest/reference/get/statuses/user_timeline
    twitterClient.get('statuses/user_timeline', searchParams, function(error, tweets, response){
      if(error) { 
        console.log("error ", error); 
        reject(error); // return error;
      }
      
      // truck = new Truck({ 
      truck = new Truck({ 
        name: tweets[0].user.name,
        handle: '@'+foodTruck,
        description: tweets[0].user.description,
        message: tweets[0].text,
        timeStamp: tweets[0].created_at,
        imageUrl: tweets[0].user.profile_image_url
      });
      resolve(truck);
    });
  });
};

module.exports.createOrUpdateDB = function (foodTruck){
  // Truck.find will return an array of all the trucks in the db that match the search criteria that is given in the first argument
  return new Promise ((resolve,reject) => {
    Truck.find({handle: foodTruck.handle}, function(err, trucks) {
      if(trucks.length===0){  //  if no matches are found, it will return an empty array
        // and then we create a new document in the db for that truck
        Truck.findOneAndUpdate({handle: foodTruck.handle}, foodTruck, {upsert: true}, function(err, response) {
          if(err){
            console.error(err);
            reject(err);
          }
          else {
            console.log("truck "+foodTruck.name+" created");
            resolve(trucks);
          }
        });
      } else {
        trucks[0].remove(); // removes the old truck document
        foodTruck.save(function(err, returnedTruck) {  // creates a new truck document
          if(err){
            console.error(err);
            reject(err);
          }
          else {
            console.log("truck "+foodTruck.name+" updated");
            resolve(trucks);
          }
        });
      }
    });
  });
}


