/**
 * Created by michael-prime on 4/19/17.
 */


var unirest = require('unirest'),
    dotenv = require('dotenv'),
    q = require('q');


dotenv.load({path:'.env'});
var baseUrl = process.env.theMuse_BaseUrl;

module.exports = {

    theMuse: function (req,res,next) {
        var d = q.defer();
        console.log(req.page);
        unirest.get(baseUrl + 'jobs?page='+req.page).
            headers({
            'content-type':'application/json'
        }).end(function (response) {
                if(response.code !== '200') d.reject(response.body);
                d.resolve(response);
            });
        return d.promise;

    }
};