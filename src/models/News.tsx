import IObjectKeys from './IObjectKeys';

interface News extends IObjectKeys {
  symbol: string;
  title: string;
  text: string;
  site: string;
  publishedDate: Date;
  url: string;
}

export default News;
