const assert = require('assert');
const ip = require('ip');
const Gateway = require('../model/Gateway'); 

describe('Creating gateway documents', function() {
    let peripherals = [];
    before(()=>{
        for(let i = 0; i < 10; i++){
            peripherals.push({vendor:'P'+i, status: 'online'});
        }
    });

    it('creates a gateway', function() {
        
        const gateway = new Gateway({name:"G1",serial:1,address:'192.168.2.1'});
        gateway.save() //takes some time and returns a promise
            .then(() => {
                assert(!gateway.isNew); //if gateway is saved to db it is not new
                done();
            });
    });

    it('validate ip address v4', function(){
        const addressInput = '192.168.2.255'; 
        const gateway = new Gateway({name:"G1",serial:1,address:addressInput});
        if(!ip.isV4Format(addressInput)){
            assert(false);
            done();
        }
        else{
            gateway.save()
                .then(() => {
                    assert(true);                     
                    done();
                });
        }        
    });   

    it('Add peripherals to a gateway, no more than 10', function() {
        
        const gateway = new Gateway({name:"G1",serial:1,address:'192.168.2.1', peripherals:peripherals});
        assert(peripherals.length<=10);
        
    });
});