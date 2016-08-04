'use strict'

const db = require('../db/config');
const mongoose = require('mongoose');
const updateTruckInfo = require('./updateTruckInfo');

updateTruckInfo.foodTrucks.forEach( (foodTruck) => {
  updateTruckInfo.createTruckWithTwitterInfo(foodTruck)
  .then(function(truck) {
    updateTruckInfo.createOrUpdateDB(truck);
  });
});

module.exports = function(app) {
  app.get("/API/fetchAll", function(req,res){
    Truck.find(function(err, trucks){
      res.status(200).send(trucks);
    });
  });
  app.get("/API/fetch", function(req,res){
    //handle must be different for test and client
    let handle = req.body.params ? req.body.params.handle : req.query.handle;

    Truck.findOne({handle: handle}, function(err, truck){
        res.status(200).send(truck);
    });
  });
};
