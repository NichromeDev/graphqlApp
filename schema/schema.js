const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

// const moviesJSON = [
//   { "name": "mov1", "genre": "genre1", "directorId": ""},
//   { "name": "mov2", "genre": "genre2", "directorId": ""},
//   { "name": "mov3", "genre": "genre3", "directorId": ""},
//   { "name": "mov4", "genre": "genre4", "directorId": ""},
//   { "name": "mov5", "genre": "genre5", "directorId": ""}
// ];

// const directorsJSON = [
//   { "name": "name1", "age": 1 }, //5e767f2b0e3e8251c4b3e93e
//   { "name": "name2", "age": 2 }, //5e767f390e3e8251c4b3e93f
//   { "name": "name3", "age": 3 }, //5e767f480e3e8251c4b3e940
//   { "name": "name4", "age": 4 } //5e767f500e3e8251c4b3e941
// ];

// const movies = [
//   { id: "1", name: "req1", genre: "genre1", directorId: "2" },
//   { id: 2, name: "req2", genre: "genre2", directorId: "1" },
//   { id: 3, name: "req3", genre: "genre3", directorId: "4" },
//   { id: "4", name: "req4", genre: "genre4", directorId: "3" },
//   { id: "5", name: "req5", genre: "genre5", directorId: "3" }
// ];

// const directors = [
//   { id: "1", name: "name1", age: 1 },
//   { id: 2, name: "name2", age: 2 },
//   { id: 3, name: "name3", age: 3 },
//   { id: "4", name: "name4", age: 4 }
// ];

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    director: {
      type: DirectorType,
      resolve(parent, _) {
        return Directors.findById(parent.directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, _) {
        return movies.find({ directorId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(_, args) {
        const director = new Directors({
          name: args.name,
          age: args.age
        });
        return director.save();
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLString }
      },
      resolve(_, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        });
        return movie.save();
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(_, args) {
        return Directors.findByIdAndRemove(args.id);
      }
    },
    removeMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(_, args) {
        return Movies.findByIdAndRemove(args.id);
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(_, args) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true }
        );
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID }
      },
      resolve(_, args) {
        return movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId
            }
          },
          { new: true }
        );
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Movies.findById(args.id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Directors.findById(args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(_, __) {
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(_, __) {
        return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
