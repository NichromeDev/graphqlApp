const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const schema = require("../schema/schema");

const app = express();
const PORT = 2995;
const DB_NAME = "mongodb://localhost:27017/graphql";
const directors_name = "directors";
const movies_name = "movies";

mongoose.connect(DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const dbConnection = mongoose.connection;
dbConnection.on("error", err => console.log("connection errors: " + err));
dbConnection.once("open", () => console.log("connection successfully established"));

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.get("", (_, res) => res.send("backend is working!"));

app.listen(PORT, err =>
  err ? console.log(err) : console.log("listening on http://localhost:" + PORT)
);
