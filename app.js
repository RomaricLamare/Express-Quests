require("dotenv").config();
const express = require("express");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

const app = express();

app.use(express.json())

const port = process.env.APP_PORT ?? 5001;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

// const welcome = (req, res) => {
//   res.send("Welcome to my users list");
// };

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers")

// the public routes

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword)
app.get("/api/users", userHandlers.getUsers)
app.get("/api/users/:id", userHandlers.getUsersById)
app.post("/api/users", hashPassword, userHandlers.postUser)

app.use(verifyToken); // permet de créer un mur d'authentification

app.delete("/api/movies/:id", movieHandlers.deleteMovie)
app.put("/api/movies/:id", movieHandlers.updateMovie)
app.post("/api/movies", verifyToken, movieHandlers.postMovie)

app.delete("/api/users/:id", userHandlers.deleteUser)
app.put("/api/users/:id", hashPassword, userHandlers.updateUser)


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
