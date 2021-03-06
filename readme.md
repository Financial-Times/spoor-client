spoor-client [![Build Status](https://travis-ci.org/Financial-Times/spoor-client.svg?branch=master)](https://travis-ci.org/Financial-Times/spoor-client)
==============

Node client to send events to [Spoor](https://spoor-docs.herokuapp.com/)

```shell
npm install -S @financial-times/spoor-client
```

Usage
-----

```js
import SpoorClient from '@financial-times/spoor-client';

function expressRoute(req, res) {
  const spoor = new SpoorClient({req});
  spoor.submit({
    category: 'foo-bar',
    action: 'baz',
    context: {
      quux: 'frob'
    }
  }).then(
    () => console.log('event successfully logged'),
    ({payload, status, request}) => console.log(`submission failed, status ${status}`)
  );
}
```

API
---

### `new SpoorClient(options)`

Initialize a Spoor client with options:

| Option       | Description                                                                            |
|--------------|----------------------------------------------------------------------------------------|
| `source`     | String to tell Spoor where the event came from. *Required in constructor or `submit`*. |
| `category`   | String for Spoor event categorisation. *Required in constructor or `submit`*.          |
| `req`        | The default Express request for all events. *You must set either `req` or both `cookies` and `ua` either in constructor or `submit`*.     |
| `cookies`    | Optional explicit `Cookie` HTTP header. Defaults to `req.get('ft-cookie-original')`.                              |
| `ua`    | Optional explicit `User-Agent` HTTP header. Defaults to `req.get('user-agent')`.                              |
| `product`    | String for Spoor `context.product`. Defaults to `"next"`.                              |
| `apiKey`     | Defaults to `process.env.SPOOR_API_KEY`                                                |
| `submitIf`   | Boolean. If false, the client will not submit events.                                  |
| `inTestMode` | Boolean. Sets a context flag to tell Spoor the event is a test event.                  |

### `client.submit(event)`

Send an event to Spoor. Returns a promise which resolves when the event is successfully sent to Spoor, or rejects with a status object when submission fails. The event should be an object with keys:

| Option       | Description                                                                                                                      |
|--------------|----------------------------------------------------------------------------------------------------------------------------------|
| `source`     | String to tell Spoor where the event came from. *Required in constructor or `submit`*.                                           |
| `category`   | String for Spoor event categorisation. *Required in constructor or `submit`*.                                                    |
| `req`        | The default Express request for all events. *You must set either `req` or both `cookies` and `ua` either in constructor or `submit`*.     |
| `cookies`    | Optional explicit `Cookie` HTTP header. Defaults to `req.get('ft-cookie-original')`.                              |
| `ua`    | Optional explicit `User-Agent` HTTP header. Defaults to `req.get('user-agent')`.                              |
| `action`     | String name of the event action.                                                                                                 |
| `context`    | Object containing metadata pertaining to the event. *Required*.                                                                  |
| `apiKey`     | Defaults to `process.env.SPOOR_API_KEY`                                                                                          |
| `product`    | String for Spoor `context.product`. Defaults to the SpoorClient constructor `product` value, which in turn defaults to `"next"`. |
---

Originally part of [next-signup](https://github.com/Financial-Times/next-signup).
