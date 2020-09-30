const express = require('express');
const ip = require('ip');
//const app = express();
const peripheralRoute = express.Router();


// Peripheral model
let Peripheral = require('../model/Peripheral');

// Add Peripheral
peripheralRoute.route('/peripheral').post((req, res, next) => {  
  var uid = generateUID();
  req.body.uid = uid;
  req.body.createdAt = new Date();   
  Peripheral.find({owner: req.body.owner},(er,peripherals)=>{
    if(er){
      return next(er)
    }
    else{      
      if(peripherals.length > 10){
        return res.json({error: true, msg: "The system only permit 10 peripherals per gateway."});
      }
      else{
              
          Peripheral.create(req.body, (error, data) => {
            if (error) {
              return next(error)
            } else {
              res.json(data)
            }
          });
        
        
          
        
      }
    }
  })
});

// Get all Peripherals
peripheralRoute.route('/peripherals').get((req, res) => {
  Peripheral.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Peripheral
peripheralRoute.route('/peripheral/:id').get((req, res) => {
  Peripheral.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update peripheral
peripheralRoute.route('/peripheral/:id').put((req, res, next) => {
  Peripheral.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Peripheral successfully updated!')
    }
  })
})

// Delete peripheral
peripheralRoute.route('/peripheral/:id').delete((req, res, next) => {
  Peripheral.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

//Create a UID
function generateUID(){
  let randomN = rand(1,9999)
  let uid = new Date().getTime()+randomN;
  return uid;
}

function rand(min, max) {   
  let randomNum = Math.random() * (max - min) + min;   
  return Math.round(randomNum);
}

module.exports = peripheralRoute;