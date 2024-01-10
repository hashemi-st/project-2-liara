import express from "express";
import mongoose from "mongoose";
import Enamad from "./model/enamad.js";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

mongoose
  .connect(
    "mongodb://root:E3BvZsLQl3dauNVqOohDm0x5@k2.liara.cloud:34395/project-2?authSource=admin"
  )
  .then(() => {
    console.log("Connected!");
  })
  .catch((error) => {
    console.error("Failed to connect!", error);
  });

const typeDefs = gql`
  type Query {
    getAllEnamad(page: Int, limit: Int): [Enamad]
    getOneEnamad(name:String) : [Enamad]
  }

  type Enamad {
    name: String
    domain: String
    location: String
    expired: String
    star: Int
  }
`;

const resolvers = {
  Query: {
    getAllEnamad: async (_, { page, limit }) => {
      const p = page || 1;
      const l = limit || 10;
      const data = await Enamad.find({})
        .skip((p - 1) * l)
        .limit(l);
      return data;
    },
    getOneEnamad: async (_,{ name }) => {
        const data = await Enamad.find({ name });
        return data;
    
      }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
const app = express();
server.start().then(() => {
  server.applyMiddleware({ app });
});

app.listen({ port: 3000 }, () => {
  console.log("server is runnig on port 3000");
});
