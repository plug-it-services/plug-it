# Add a service to the architecture
## To add a new service to the architecture there is some step to make sure you follow. There is some connectors and endpoints you need to query to make your service considered as part of the infrastructure. Checkout this tutorial to learn how to do it.



# Steps

## 1) At the service start up, it should register itself to plugs microservice

When the microservice starts, it should make a post request to the plugs microservice with its config (each supported events/actions).

The url is formatted like this :

```
http://{plugsHost}/service/initialize
```

The body should be formatted like this :

```json
export default {
  name: 'SERVICE_NAME',
  authType: 'apiKey OR oauth2 OR clientSecrets',
  icon: '/images/SERVICE_ICON.png',
  events: [
    {
      id: 'EVENT_ID',
      name: 'EXAMPLE: Address received native tokens',
      description: 'EXAMPLE: Trigger when an address receive some native tokens',
      variables: [
        {
          key: 'VARIABLE_KEY',
          type: 'string OR number OR date',
          displayName: 'VARIABLE_DISPLAY_NAME',
          description: 'VARIABLE_DESCRIPTION',
        },
      ],
      fields: [
        {
          key: 'FIELD_KEY',
          type: 'string OR number OR date',
          displayName: 'FIELD_DISPLAY_NAME',
          description: 'FIELD_DESCRIPTION',
          required: true OR false,
        },
      ],
    },
  ],
  actions: [
    {
      id: 'EVENT_ID',
      name: 'EXAMPLE: Tweet',
      description: 'EXAMPLE: Post a tweet',
      variables: [
        {
          key: 'VARIABLE_KEY',
          type: 'string OR number OR date',
          displayName: 'VARIABLE_DISPLAY_NAME',
          description: 'VARIABLE_DESCRIPTION',
        },
      ],
      fields: [
        {
          key: 'FIELD_KEY',
          type: 'string OR number OR date',
          displayName: 'FIELD_DISPLAY_NAME',
          description: 'FIELD_DESCRIPTION',
          required: true OR false,
        },
      ],
    },
  ],
};
```

## 2) At the service start up, it should create its queues on rabbit

There is two queues each service should create and listen to. Their names are `plug_event_{SERVICE_NAME}_initialize` and `plug_action_{SERVICE_NAME}_triggers` Their should be bound to the `amq.direct` default exchange with their name as routing key.

Additionally, these queues will receive different types of events based on the initialiazed events and actions.

For exemple you could receive in your subscribed queue a event of type `VARIABLE_KEY`.

## 3) You can now develop your service.

To do it successfully, you need to know that every routes that you wants users to access needs to be in a route called `/public`. You must also know that in every request that are forwarded from the gateway, the user is in the request.

Then, you are going to need to implement a few routes for the good wealth of your service to be able to set up the authentification process required by the api.

### 3.1) If you are setting up a service that requires an apiKey authentification, you should implement the following routes :
- POST `/service/SERVICE_NAME/apiKey` : This route should take a apiKey inside its body and register the user.
- POST `/service/SERVICE_NAME/disconnect` : This route should disconnect the user.

### 3.2) If you are setting up a service that requires a clientSecrets authentification, you should implement the following routes :
- POST `/service/SERVICE_NAME/clientSecrets` : This route should take a clientSecrets inside its body and register the user.
- POST `/service/SERVICE_NAME/disconnect` : This route should disconnect the user.

### 3.3) If you are setting up a service that requires an oauth2 authentification, you should implement the following routes :
- GET `/service/SERVICE_NAME/oauth2` : This route should start the oauth process and redirect the user to the oauth provider.
- GET `/service/SERVICE_NAME/callback` : This route should be the callback of the oauth process.
- POST `/service/SERVICE_NAME/disconnect` : This route should disconnect the user.

## 4) Connect your service to the docker-compose file.

To do this you should first create a Dockerfile that will run your service.

Now, you should create a new container in the docker-compose file with the following config :

```yaml
  SERVICE_NAME:
    build: ./api/SERVICE_NAME
    networks:
      - rabbit_network
      - traefik_network
    labels:
      - traefik.http.routers.SERVICE_NAME.rule=PathPrefix(`/service/SERVICE_NAME`)
      - traefik.http.middlewares.SERVICE_NAME-replacepathregex.replacepathregex.regex=^/service/SERVICE_NAME/(.*)
      - traefik.http.middlewares.SERVICE_NAME-replacepathregex.replacepathregex.replacement=/public/$$1
      - traefik.http.middlewares.test-auth.forwardauth.address=http://user/verify
      - traefik.http.middlewares.test-auth.forwardauth.authResponseHeaders=user
      - traefik.http.routers.SERVICE_NAME.middlewares=SERVICE_NAME-replacepathregex, test-auth
      - traefik.enable=true
    ports:
      - ${SERVICE_NAME_PORT}:80
    depends_on:
      - rabbitmq
      - elk
      - SERVICE_NAME-postgres
    logging:
      driver: gelf
      options:
        gelf-address: udp://localhost:${LOGSTASH_INGEST_PORT}
        tag: "SERVICE_NAME"
```

If you need additional containers to run your service, you can add them in the docker-compose file and connect it using the SERVICE_NAME_servie.

By adding all these labels, the gateway will automaticly redirect the routes to your service.