import express from "express";
import mongoose from "mongoose";
import Enamad from "./model/enamad.js";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import csv from "fast-csv";
import fs from "fs";

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
    getOneEnamad(name: String!): [Enamad]
    getNumberOfSubmited(city: String!): Count
    getByStars(star: Int!): [Enamad]
    downloadData(filter: [Filter]): String
  }

  type Enamad {
    name: String
    domain: String
    location: String
    expired: String
    star: Int
  }

  type Count {
    city: String
    count: Int
  }

  enum Filter {
    name
    domain
    location
    star
    expired
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
    getOneEnamad: async (_, { name }) => {
      const data = await Enamad.find({ name });
      return data;
    },
    getNumberOfSubmited: async (_, { city }) => {
      const submited = await Enamad.find({ location: city });
      const count = submited.length;
      return { city: city, count: count };
    },
    getByStars: async (_, { star }) => {
      const data = await Enamad.find({ star });
      return data;
    },

    downloadData: async (_, { filter }) => {
      const data = await Enamad.find({}).select(filter);

      const csvFilePath = "filtered_data.csv";
      const csvStream = fs.createWriteStream(csvFilePath);
      const csvWriter = csv.format({ headers: true });

      csvWriter.pipe(csvStream);
      data.forEach((item) => csvWriter.write(item.toObject()));
      csvWriter.end();
      
      return csvFilePath;
    },
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
