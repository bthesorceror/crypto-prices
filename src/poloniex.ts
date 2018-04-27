import axios from 'axios';

interface ITickerResponse {
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
}

interface IPoloniexResponse {
  [key: string]: ITickerResponse;
}

interface ITicker {
  last: number;
  lowestAsk: number;
  highestBid: number;
  percentChange: number;
  baseVolume: number;
  quoteVolume: number;
}

interface ITickers {
  [key: string]: ITicker;
}

const BASE_URL = 'https://poloniex.com/public';

const convert = (response: IPoloniexResponse): ITickers => {
  const result: ITickers = {};
  Object.keys(response).forEach((key: string) => {
    const current = response[key];
    result[key] = {
      baseVolume: parseFloat(current.baseVolume),
      highestBid: parseFloat(current.highestBid),
      last: parseFloat(current.last),
      lowestAsk: parseFloat(current.lowestAsk),
      percentChange: parseFloat(current.percentChange),
      quoteVolume: parseFloat(current.quoteVolume),
    };
  });
  return result;
};

export class Client {
  public async getTickers(): Promise<ITickers> {
    const response = await axios.get<IPoloniexResponse>(
      `${BASE_URL}?command=returnTicker`
    );

    return convert(response.data);
  }
}
