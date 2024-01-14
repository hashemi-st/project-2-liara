import * as csv from "fast-csv";
import * as fs from "fs";
import Enamad from "../../model/enamad";
import { Filter } from "./schema";

export const resolvers = {
    Query: {
      getAllEnamad: async (_:any, { page, limit }:{ page:number, limit:number }) => {
        const p = page || 1;
        const l = limit || 10;
        const data = await Enamad.find({})
          .skip((p - 1) * l)
          .limit(l);
        return data;
      },
      getOneEnamad: async (_:any, { name }:{ name:string }) => {
        const data = await Enamad.find({ name });
        return data;
      },
      getNumberOfSubmited: async (_:any, { city }:{ city:string }) => {
        const submited = await Enamad.find({ location: city });
        const count = submited.length;
        return { city: city, count: count };
      },
      getByStars: async (_:any, { star }:{ star:number }) => {
        const data = await Enamad.find({ star });
        return data;
      },
  
      downloadData: async (_:any, { filter }:{ filter :Filter}) => {
        const data = await Enamad.find({}).select(filter);
        const csvFilePath = "./src/filtered_data.csv";
        const csvStream = fs.createWriteStream(csvFilePath);
        const csvWriter = csv.format({ headers: true });
  
        csvWriter.pipe(csvStream);
        data.forEach((item) => csvWriter.write(item.toObject()));
        csvWriter.end();
        
        return csvFilePath;
      },
    },
  };
  
