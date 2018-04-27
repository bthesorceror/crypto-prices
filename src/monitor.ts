import { InfluxDB } from 'influx';
import * as util from 'util';
import { Client } from './poloniex';

export class Monitor {
  private client: InfluxDB;
  private interval: NodeJS.Timer | null;
  private poloniex: Client;

  constructor(url: string, database: string) {
    this.client = new InfluxDB(`${url}/${database}`);
    this.interval = null;
    this.poloniex = new Client();
  }

  public run() {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(this.collect, 10000);
  }

  public stop() {
    if (!this.interval) {
      return;
    }

    clearInterval(this.interval);
  }

  private collect = async () => {
    try {
      const tickers = await this.poloniex.getTickers();
      Object.keys(tickers).forEach(symbol => {
        this.client
          .writeMeasurement('prices', [
            {
              fields: tickers[symbol],
              tags: { exchange: 'poloniex', symbol },
            },
          ])
          .then(() => {
            console.info(`Measurement for ${symbol}`);
          })
          .catch(ex => {
            console.error(ex);
          });
      });
    } catch (ex) {
      console.error(ex);
    }
  };
}
