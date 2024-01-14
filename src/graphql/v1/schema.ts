
import { gql } from "apollo-server-express";

export const typeDefs = gql`
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

export {Filter}