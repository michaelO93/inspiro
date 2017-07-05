
var services = require('../services/services.js');


module.exports = {

    theMuse:function (req,res,next) {
         var data  = {
             descending: req.body.descending,
             page : req.body.page,
             api_key : process.env.themuseAPI_Key
    };
         // console.log(data);

         services.theMuse(data).then(function (response) {
             if (response) console.log(response);
             return res.send(response);
         }).catch(function (err) {
             if (err)  console.log(err.error);
             return res.send(err)
         })
    }
};