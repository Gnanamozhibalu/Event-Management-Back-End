const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();
const http = require('http').createServer(app)

app.use(bodyParser.json());

app.use((req, res, next) => {
  //allows a web service to specify that it's OK for it to be invoked from any domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  //browser sends an OPTIONS request before sending POST
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    //graphql playground
    graphiql: true
  })
);
  mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.dh8ly.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    /* app.listen(8000); */
    http.listen(process.env.PORT || 8000,function(){
      console.log("SERVER STARTED:8000");
    })
  })
  .catch((err) => {
    console.log(err);
  });
