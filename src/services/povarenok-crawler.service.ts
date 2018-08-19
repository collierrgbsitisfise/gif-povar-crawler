import * as rp from "request-promise";
import * as cheerio from "cheerio";
import * as utf8 from "utf8";
import * as iconv from "iconv-lite";
import * as entities from "entities";
import * as fs from "fs";

class PovarenokCrawler {
  // https://www.povarenok.ru/video/~2/
  private baseParseUrl: string = "https://www.povarenok.ru/video/";
  private proxyUrl: string = null;
  private htmlContent: string = null;

  constructor() {}

  public getBaseUrl(): string {
    return this.baseParseUrl;
  }

  public setBaseUrl(bUrl: string) {
    this.baseParseUrl = bUrl;
  }

  public setProxyServer(proxyServer: string): void {
    this.proxyUrl = proxyServer;
  }

  public async setPageHtml(uri: string = this.getBaseUrl()): Promise<any> {
    try {
      const result = await rp.get({
        url: `${this.proxyUrl}/?uri=${uri}`,
        encoding: "utf-8"
      });

      //@TODO  WTF - HOW PROXY NAHUI WORKS ???????
      // fs.writeFileSync('huilo.html', JSON.parse(result).data.data);
      this.htmlContent = JSON.parse(
        iconv.decode(new Buffer(result), "ISO-8859-1")
      ).data.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  public getHtmlContent() {
    return this.htmlContent;
  }

  public getVideoLink(): any {
    const $ = cheerio.load(this.htmlContent);
    const cookName = $(".item-bl")
      .children()
      .eq(0)
      .children()
      .eq(1)
      .text();
    const videoSrc = $(".video-bl")
      .children()
      .eq(0)
      .children()
      .eq(0)
      .attr("src");

    return {
      videoSrc,
      cookName
    };
  }

  public getDirectLinks(): string[] {
    let result: string[] = [];

    const $ = cheerio.load(this.htmlContent);

    $(".item-bl").each(function(i, item) {
      result.push(
        $(item)
          .children()
          .eq(2)
          .children()
          .eq(0)
          .attr("href")
      );
    });

    return result;
  }
}

export default PovarenokCrawler;
