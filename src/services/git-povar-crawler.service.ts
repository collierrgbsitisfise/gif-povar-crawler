import * as rp from "request-promise";
import * as cheerio from "cheerio";

class ParseGifPovarService {
  private baseParseUrl: string = "https://gif-povar.ru/";
  private cookTypes: string[] = [
    "vegetarianskie",
    "vypechka",
    "detskie-blyuda",
    "krupy",
    "kurica",
    "vegetarianskij-salat-s-nutom"
  ];
  private htmlContent: any;

  public proxyUrl: string;

  constructor() {}

  public getallTypes(): string[] {
    return this.cookTypes;
  }

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
        url: `${this.proxyUrl}/?uri=${uri}`
      });

      //@TODO  WTF - HOW PROXY NAHUI WORKS ???????
      this.htmlContent = JSON.parse(result).data.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  public getMainCookOfDay(): any[] {
    let result: any[] = [];

    const $ = cheerio.load(this.htmlContent);
    $("#post-items")
      .children()
      .each(function(i, arcticle) {
        const cookName = $(arcticle)
          .children()
          .eq(0).text();
        const postThumbnail = $(arcticle)
          .children()
          .eq(1);
        const videoWrapper = $(postThumbnail)
          .children()
          .eq(1);
        const videoTag = $(videoWrapper)
          .children()
          .eq(0);
        const sourceVideo = $(videoTag)
          .children()
          .eq(0)
          .attr("src");
        const sourceImg = $(videoTag)
          .children()
          .eq(1)
          .attr("src");

        result.push({
          sourceVideo,
          sourceImg,
          cookName
        });
      });

    return result;
  }

  public getPageHtml(): string {
    return this.htmlContent;
  }
}

export default ParseGifPovarService;
