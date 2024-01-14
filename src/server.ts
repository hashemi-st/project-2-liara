import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {resolvers } from './graphql/v1/resolver'
import {typeDefs} from './graphql/v1/schema'

mongoose
  .connect(
    "mongodb://root:E3BvZsLQl3dauNVqOohDm0x5@k2.liara.cloud:34395/project-2?authSource=admin"
  )
  .then(() => {
    console.log("Connected!");
    const serverV1 = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    const app = express();
    serverV1.start().then(() => {
      serverV1.applyMiddleware({ app, path:'/v1/graphql' });
    });
    
    app.listen({ port: 3000 }, () => {
      console.log("server is runnig on port 3000");
    });
    
  })
  .catch((error) => {
    console.error("Failed to connect!", error);
  });
