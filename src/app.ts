import ParseGifPovarService from './services/gif-povar-crawler.service';
import dbMongoConnector from './db.mongo.connector';
import gifPovar from './models/gif-povar.model';
import * as nodeCron from 'node-cron';

const totalPages = 30;
let allMainCooks: any[] = [];

const main = async () => {
    //run task once per 3 days
    nodeCron.schedule(`*/${60 * 24 * 3} * * * *`, async function cronStart() {
        const db = new dbMongoConnector('ds247330.mlab.com', 'easy-links-db', 'admin', 'vadim1');
        await db.connect();
    
        const PG = new ParseGifPovarService();
        PG.setProxyServer('http://localhost:5555');
    
        for (let i=1; i<=totalPages; i++) {
            PG.setBaseUrl(`https://gif-povar.ru/page/${i}/`);
            await PG.setPageHtml();
            let data = PG.getMainCookOfDay();
            allMainCooks = [...allMainCooks, ...data];
        }
    
        await gifPovar.remove({}).exec();
        for (let i=0; i<allMainCooks.length; i++) {
            const newCookGifPovar = new gifPovar(allMainCooks[i]);
            await newCookGifPovar.save();
        }
        
        console.log('WAS SAVIED ALL');
        db.closeConnection();
    });
}

main();