import ParseGifPovarService from './services/git-povar-crawler.service';

const main = async () => {
    const PG = new ParseGifPovarService();
    PG.setProxyServer('http://localhost:5555');
    await PG.setPageHtml();
    let data = PG.getMainCookOfDay();
    console.log(data);
}

main();