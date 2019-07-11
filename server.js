const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Featureflow = require('featureflow-node-sdk');
const API_KEY = 'srv-env-685e066d234567890';

const app = express();
const port = process.env.PORT || 5000;

const config = {
  apiKey: API_KEY,
  withFeatures: [
    {
      key: 'node-demo-feature',
      failoverVariant:'off'
    }
  ]
};

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
app.use(userMiddleware);

let featureflowExpress = new Featureflow.ExpressClient(config);
app.use(featureflowExpress);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/features', (req, res) => {
  return res.send(req.featureflow.evaluateAll(req.ffUser));
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
