const express = require('express');
const ip = require('ip');
//const app = express();
const gatewayRoute = express.Router();


// Gateway model
let Gateway = require('../model/Gateway');
let Peripheral = require('../model/Peripheral');

// Add Gateway
gatewayRoute.route('/gateway').post((req, res, next) => {
  if(!ip.isV4Format(req.body.address)){
      //return {'error': "IP address invalid."}
      console.log("IP address invalid");
      return res.json({error:true, msg: "IP address invalid", code:1});
  }    

  Gateway.create(req.body, (error, data) => {
    if (error) {
      //return next(error)
      return res.json({error: true, msg: "The serial must be unique. Please enter other serial number."});
    } else {
      res.json(data)
    }
  })
});

// Get all gateways
gatewayRoute.route('/gateways').get((req, res) => {
  Gateway.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
  /*Gateway.find().populate('peripheral', 'vendor').exec(function(error, data){
      if(error){
        return next(error);        
      }
      else{
        res.json(data);
      }
  });*/
})

// Get single gateway
gatewayRoute.route('/gateway/:id').get((req, res) => {
  Gateway.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      Peripheral.find({owner:req.params.id}, (er,peripherals) => {        
        if(er){
          return next(er)
        }
        else{                    
          data.peripherals = peripherals;
          res.json(data)
        }
      });
      
    }
  })
})


// Update gateway
gatewayRoute.route('/gateway/:id').put((req, res, next) => {
  Gateway.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Gateway successfully updated!')
    }
  })
})

// Delete gateway
gatewayRoute.route('/gateway/:id').delete((req, res, next) => {
  Gateway.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = gatewayRoute;