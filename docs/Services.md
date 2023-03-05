# Current available services
* ### Here is a list of our current services.
* ### Some are builtin mandatory services tht handles main app features.
* ### Others are triggers and action providers that needs a form of connection such as OAuth2 or API Key to be used.

## User Service (Builtin):
 The user service is a microservice which set up everything related to the authentication process. It includes a jwt verification and crsf_token verification. It's on the route /public/verify that traefik forward all the requests that he receive first to it.
## Starton Service (Provider): 
is a microservice to interact with the starton api, currently it can has a trigger event when a address receives a native transaction
* twitter: is a microservice to interact with the twitter api using the official twitter sdk and that have currently one aciton to post a new tweet with a variable content
* plugs: is a microservice with the core logic of how does the microservices interact with each other