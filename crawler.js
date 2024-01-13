import fetch from "node-fetch";
import cheerio from "cheerio";
import mongoose from "mongoose";
import Enamad from "./model/enamad.js";
import async from "async";

mongoose
  .connect(
    "mongodb://root:E3BvZsLQl3dauNVqOohDm0x5@k2.liara.cloud:34395/project-2?authSource=admin"
  )
  .then(() => {
    console.log("Connected!");
    const crawl = async ({ url }) => {
      console.log("crawling", url);
    
      const response = await fetch(url);
      const html = await response.text();
    
      const $ = cheerio.load(html);
    
      const table = $("div#Div_Content");
    
      for(const el of table.find("div.row")) {
        const row = $(el);
        const domain = row.find("a").html();
        const name = row.find("div.col-sm-12.col-md-3").html();
        const location = row
          .find("div.col-sm-12.col-md-3+div.col-sm-12.col-md-1")
          .html();
    
        const expired = row
          .find(
            "div.col-sm-12.col-md-2+div.col-sm-12.col-md-1+div.col-sm-12.col-md-1"
          )
          .html();
    
        const imgs = row
          .find(
            "div.col-sm-12.col-md-3+div.col-sm-12.col-md-1+div.col-sm-12.col-md-1+div.col-sm-12.col-md-2"
          )
          .html();
    
        const regex = /\s+<(img).+/gm;
        const str = imgs;
        let m;
        let s = 0;
        while ((m = regex.exec(str)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
    
          m.forEach((match, groupIndex) => {
            s = s + 1;
          });
        }
        const data = new Enamad({
          domain,
          name,
          location,
          expired,
          star: s / 2,
        });
        await data.save();
            console.log("Data inserted");
      };
    };


    async.mapLimit(
      urls,
      5,
      async function (url) {
        try {
        await crawl({ url });
        } catch (error) {
          console.error('fetching', url, 'failed')
          console.error(error)
        }
      },
      (err, results) => {
        if (err) {
          console.log(err);
        }
      }
    );
  })
  .catch((error) => {
    console.error("Failed to connect!", error);
  });


const urls = Array.from(Array(6400)).map(
  (item, i) => `https://enamad.ir/DomainListForMIMT/Index/${i + 1}`
);

