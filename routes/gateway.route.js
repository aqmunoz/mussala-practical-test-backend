const express = require('express');
const ip = require('ip');
const gatewayRoute = express.Router();
const host = process.env.host + ':' + process.env.PORT;
const ENDPOINT = host + '/' + process.env.ENDPOINT_NAME;

let hypertext = [
  { rel: "create", method: "POST", title: 'Create a Gateway', href: ENDPOINT + '/gateway' },
  { rel: "list", method: "GET", title: 'List Gateways', href: ENDPOINT + '/gateways' },
  { rel: "update", method: "PUT", title: 'Update a Gateway', href: ENDPOINT + '/gateway/{ID}' },
  { rel: "get", method: "GET", title: 'Get a Gateway', href: ENDPOINT + '/gateway/{ID}' },
  { rel: "delete", method: "DELETE", title: 'Delete a Gateway', href: ENDPOINT + '/gateway/{ID}' },
]

// Gateway model
let Gateway = require('../model/Gateway');
let Peripheral = require('../model/Peripheral');

// Add Gateway
gatewayRoute.route('/gateway').post((req, res, next) => {
  if(!ip.isV4Format(req.body.address)){
      console.log("IP address invalid");
      return res.json({error:true, msg: "IP address invalid", code:1});
  }    

  Gateway.create(req.body, (error, data) => {
    if (error) {
      return res.json({error: true, msg: "The serial must be unique. Please enter other serial number."});
    } else {
      hypertext.unshift({ rel: "self", method: "POST", href: ENDPOINT + '/gateway' });
      hypertext.splice(1, 1);
      hypertext.push({ rel: "create", method: "POST", title: 'Create Peripheral', href: ENDPOINT + '/peripheral' });
      res.json(data, hypertext)
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
          hypertext.unshift({ rel: "self", method: "GET", href: ENDPOINT + '/gateway/{ID}' });
          hypertext.splice(4, 1);
          res.json(data, hypertext)
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
    } else {
      hypertext.unshift({ rel: "self", method: "PUT", href: ENDPOINT + '/gateway/{ID}' });
      hypertext.splice(3, 1);
      res.json(data, hypertext)
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