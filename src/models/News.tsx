import IObjectKeys from "./IObjectKeys";

interface News extends IObjectKeys {
  title: string;
  text: string;
  site: string;
  publishedDate: Date;
  url: string;
  mentionedSymbols: string[];
}

export default News;
