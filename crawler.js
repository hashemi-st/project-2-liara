import fetch from "node-fetch";
import cheerio from "cheerio";
import mongoose from "mongoose";
import Enamad from "./model/enamad.js";

mongoose      
  .connect(
    "mongodb://root:E3BvZsLQl3dauNVqOohDm0x5@k2.liara.cloud:34395/project-1?authSource=admin"
  )
  .then(() => {
    console.log("Connected!");
  })
  .catch((error) => {
    console.error("Failed to connect!", error);
  });

const crawl = async ({ url }) => {
  console.log("crawling", url);

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const table = $("div#Div_Content");

  table.find("div.row").each(async (index, el) => {
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
    await data.save().then(function () {
        console.log("Data inserted");
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

let urls = [];
for (let i = 1; i <= 300; i++) {
  urls.push(`https://enamad.ir/DomainListForMIMT/Index/${i}`);
}

urls.map(
  async (url) =>
    await crawl({
      url,
    })
);