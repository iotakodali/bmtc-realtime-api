var fs = require('fs');
var request = require('request');
var stream = require('stream');
var readline = require('readline');
var mysql =  require('mysql');
var async = require('async');
var qs = require('querystring');


var routes=[];

var connection =  mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "watercube"
});

connection.connect();
connection.query("use transit");

function get(route,next){

    data = route.split(";")

	var url = "http://bmtcmob.hostg.in/api/itsroutewise/details"
	var form = {'direction':data[1],'routeNO':data[0]}
	var headers = {'Content-Type':'application/json','Host':'bmtcmob.hostg.in','Connection':'Keep-Alive','User-Agent':'Apache-HttpClient/UNAVAILABLE (java 1.4)','Content-Length':'37'}
    
    try{
	    request({ url: url,form:form,headers:headers,method:"POST" }, function(error, response, html){
            var json,lat,lng,route_name,vehicleNo,eta,fare,type = ""
            var now = new Date().getTime()
    		
            if(!error){

                try{
                    json = JSON.parse(response.body)
                    
                    if(json.length>0){

                        for(var i =0;i<json.length;i++){

                            lat =json[i][2].split(":")[1]
                            lng  = json[i][3].split(":")[1]
                            type  = json[i][5].split(":")[1]
                            vehicleNo = json[i][0].split(":")[1]
                            route_name = json[i][1].split(":")[1]
                            eta = json[i][10].split(":")[1]
                            fare = json[i][11].split(":")[1]
                            console.log(vehicleNo)
                            if (vehicleNo != "NULL"){

	                            var insQuery = 'INSERT INTO bus(`route`,`lat`,`lng`,`vehicle_no`,`eta`,`fare`,`type`,`time_crawl`) VALUES ('+mysql.escape(route_name)+','+mysql.escape(lat)+ ','+mysql.escape(lng)+ ','+mysql.escape(vehicleNo)+','+mysql.escape(eta)+','+mysql.escape(fare)+','+mysql.escape(type)+','+mysql.escape(now)+')';   
	                              
	                                connection.query( insQuery, function(err, result){
	                                    if(err) {
	                                        throw err;
	                                    }
	                            });
	                        }
                        }
                    }
                }
                catch(e){
                    json = {};
                }
            }
            
            if(error){
                console.log(error);
            }
            next(error);
	   }
    )}
    catch(e){
        console.log(e);
    }
}

function read(){
	var instream = fs.createReadStream('route.csv');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    rl.on('line', function(line) {
        line = line.split("\n")
        routes.push(line[0]);
    });

    rl.on('close', function() {
      startCrawl();
    });
}

read();

function startCrawl(){
    async.forEachLimit(routes,100, function(route,next) {
        get(route,next);
    },
    function(err){
        if (err) throw err;
    });
}