import ParseGifPovarService from "./services/gif-povar-crawler.service";
import dbMongoConnector from "./db.mongo.connector";
import gifPovar from "./models/gif-povar.model";
import povarenok from "./models/povarenok.model";
import PovarenokCrawler from "./services/povarenok-crawler.service";
import * as nodeCron from "node-cron";

const totalPages = 30;
let allMainCooks: any[] = [];

// const main = async () => {
//     //run task once per 3 days
//     nodeCron.schedule(`*/${60 * 24 * 3} * * * *`, async function cronStart() {
//         const db = new dbMongoConnector('ds247330.mlab.com', 'easy-links-db', 'admin', 'vadim1');
//         await db.connect();

//         const PG = new ParseGifPovarService();
//         PG.setProxyServer('http://209.97.137.33:5555');

//         for (let i=1; i<=totalPages; i++) {
//             PG.setBaseUrl(`https://gif-povar.ru/page/${i}/`);
//             await PG.setPageHtml();
//             let data = PG.getMainCookOfDay();
//             allMainCooks = [...allMainCooks, ...data];
//         }

//         await gifPovar.remove({}).exec();
//         for (let i=0; i<allMainCooks.length; i++) {
//             const newCookGifPovar = new gifPovar(allMainCooks[i]);
//             await newCookGifPovar.save();
//         }

//         console.log('WAS SAVIED ALL');
//         db.closeConnection();
//     });
// }

const TOTAL_PAGES_POVARENOK = 328;
let ALL_LINKS: any[] = [];

const main = async () => {
  const Povarenok = new PovarenokCrawler();
  Povarenok.setProxyServer("http://209.97.137.33:5555");
  for (let j = 1; j <= TOTAL_PAGES_POVARENOK; j++) {
    console.log("parse page")
    console.log(`https://www.povarenok.ru/video/~${j}/`);
    await Povarenok.setPageHtml(`https://www.povarenok.ru/video/~${j}/`);
    let directLinks = Povarenok.getDirectLinks();
    const allLinks: any[] = [];
    for (let i = 0; i < directLinks.length; i++) {
      await Povarenok.setPageHtml(directLinks[i]);
      let cookData = await Povarenok.getVideoLink();
      allLinks.push({
        cookName: cookData.cookName,
        sourceVideo: cookData.videoSrc,
        LinkToPost: directLinks[i]
      });
    }
    console.log("all links was parsed ", allLinks.length);
    // console.log(allLinks);
    ALL_LINKS = [...ALL_LINKS, ...allLinks];
  }

  const db = new dbMongoConnector(
    "ds247330.mlab.com",
    "easy-links-db",
    "admin",
    "vadim1"
  );
  await db.connect();

  for (let i = 0; i < ALL_LINKS.length; i++) {
    const newCookPovarenok = new povarenok(ALL_LINKS[i]);
    await newCookPovarenok.save();
  }

  db.closeConnection();
  console.log("FINISHED");
  console.log(ALL_LINKS.length);
};
main();


// {cookName: 'ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ ï¿½ï¿½ï¿½ï¿½ ï¿½ï¿½ ï¿½ï¿½ï¿½ï¿½',
// sourceVideo: 'https://www.youtube.com/embed/tEyypH9MIIQ?feature=oembed',
// linkToPost: 'https://www.povarenok.ru/recipes/show/152820/' }