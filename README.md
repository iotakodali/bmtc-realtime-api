Expected Time of Arrival (ETA) API's for Bangalore City Buses

##Warning:

If you ever use the following data, API's. Be warned you may be voilating parts of the Indian IT act. Better consult a lawyer if you are unsure. This is an un-official fan's documentaion of a new implementation, take it with a pinch of salt.

Is there any another way to source data?  
I feel the only way to source reliable transit information is through the agency. 


##Background:

BMTC has recently implemented Intelligent Transportation Systems for it's entire bus fleet. The real-time arrival information (ETA) is displayed on LED sign boards at few bus-stops. At the same time they publish the information through an android app https://play.google.com/store/apps/details?id=com.bmtc.mybmtc

##API:

There are 2-3 API's to get bus information by route/stop etc. I use the API which gives me ETA's by route. It is a simple POST request with a route_id & direction in the query params. A sample implementation in python is shown below. But the main crawler is a node script & mysql db.

```
import requests

def call(direction, route_id):
  url="http://bmtcmob.hostg.in/api/itsroutewise/details"
  headers = {'Content-Type':'application/json','Host':'bmtcmob.hostg.in','Connection':'Keep-Alive','User-Agent':'Apache-HttpClient/UNAVAILABLE (java 1.4)','Content-Length':'37'}
  data = {"direction":direction,"routeNO":route_id}
  response = requests.post(url=url,headers=headers,data=json.dumps(data))
  if response.status_code == 200:
          print route
  else:
          print response.content+";"+str(response.status_code)

f = open("route.csv")

for line in f.readlines():
        data = line.split(";")
        call(data[1].split("\n")[0],data[0])

```

The response is an array & poorly structured. See the response you will understand what I mean. 



##Data & FAQ's:

You will need all the stop_id's & route_id's & the position of stops in the route. All the information is supplied in the respective folders. You can have a look at all the bus stops on a [map](http://bl.ocks.org/d/5e7b92f97c52d937d10d91436ec2826d) or in this [gist](https://gist.github.com/iotakodali/5ee8d50c4f57c1ff9028bf9d6e87a63a) 

* Hey, but wait a minute. Isn't the implementation available on all routes & buses?
> Nope. So far it is not available in more than 700 routes out of 3000 (it could increase over next few weeks)

* Looks like the android app is not so user-friendly?
> Yes. The contractor seem to have chosen the least time-taking process to just finish up the work. Be optimistic and use the API's to write an app for yourself.

* So, I need to constantly hit the URL to get the latest information?
> Yes, But I recommend you be responsible and don't do a million requests/sec. It could break the server and all of us could loose access.

* Can't bmtc provide a better API with API key for me alone?
> Yes. They can and should. Un-fortunately I am not them. 

* Can't bmtc use GTFS and share data in that format?
> Ideally one should adopt these International Standards. It is not that simple to create GTFS & GTFS-RT & a report says firms charge $400/route to create them abroad. But, if the agency is willing, there are open-source enthusiats who can probably help them. 

* Is the ETA really accurate?
> No. Most of the time it is null. I assume they simply used an avg. speed, distance time formula to tell you when the bus might arrive. ETA constantly changes. For example at 1.00 p.m the API may suggest bus arriving at 1.20 p.m at 1.15 p.m it might say the same bus will come at 1.40 p.m due to traffic.

* What. That is simply fooling me?
> Traffic is a serious issue. On the bright side, they already have GPS units in the buses and if they share that data on a google map with traffic that will be a real help for all commuters. 

* Can I help you on this further?
> Yes, Please join the [datameet](http://datameet.org/) mailing lists to ask questions or to improve stuff further.

* Can I buzz you for any further help?
> Please do. My details are available on my [webpage](www.lostprogrammer.com)

##License:

The code & data is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
