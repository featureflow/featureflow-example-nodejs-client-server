# featureflow-example-nodejs-client-server

> An example of using the featureflow nodejs SDK to return a list of evaluated features to a react frontend.

Typically you might use this setup if:

1. You do not need the advanced features of the featureflow Javascript client
2. You want the security of evaluating features on your own servers
3. You want the cost-benefit of using server-side feature evaluations only.

## Usage

Set your featureflow _Server Environment SDK Key_ in server.js: 
```javascript
const API_KEY = 'srv-env-685...';
```

Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time (from the root of the project)

```
yarn dev
```

## Detail
This is based on the nodejs example https://github.com/featureflow/featureflow-node-example 

1. in server.js we create a middleware to define the user - this would typically be set from your logged in user details
```javascript

let userMiddleware = function (req, res, next) {
  req.ffUser = new Featureflow.UserBuilder("jimmy@example.com")
      .withAttribute("firstName", "Jimmy")
      .withAttribute("lastName", "Hendrix")
      .withAttributes("hobbies", ["swimming", "skiing", "rowing"])
      .withAttribute("age", 32)
      .withAttribute("signupDate", new Date(2017, 10, 28))
      .withAttribute("ip", req.ip)
      .build();
  next();
};
```
2. We create the featureflow client 
```javascript
let featureflowExpress = new Featureflow.ExpressClient(config);
```
3. We create a _/features_ rest endpoint and use the featureflow.evaluateAll method to evaluate all features and pass them back as an object
```javascript
app.get('/api/features', (req, res) => {
  return res.send(req.featureflow.evaluateAll(req.ffUser));
});
```
4. On the client side (App.js) using react we call the rest endpoint in componentWillMount, set the values in the state and display
```javascript
this.callApi()
      .then(res => this.setState({ features: res }))
      .catch(err => console.log(err));
  }
```
```javascript
 <p>{
    Object.keys(this.state.features).map(key =>
        (<p>{key} : {this.state.features[key]}</p>)
    )
}</p>
```
 
For example, in an SPA you may call /features once for the anonymous user then again when a user logs in.

## Further Reading

See http://docs.featureflow.io for more information

## Additional Usage Details

Running the production build on localhost. This will create a production build, then Node will serve the app on http://localhost:5000

```
NODE_ENV=production yarn dev:server
```

## How this works

The key to use an Express backend with a project created with `create-react-app` is on using a **proxy**. We have a _proxy_ entry in `client/package.json`

```
"proxy": "http://localhost:5000/"
```

This tells Webpack development server to proxy our API requests to our API server, given that our Express server is running on **localhost:5000**



## Credit

This example is based on an initial example from the devloper below, please consider passing credit to him.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/esausilva)

-Esau
