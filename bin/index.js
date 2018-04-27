const { Monitor } = require("../lib/monitor");
const program = require("commander");

program
  .version("1.0.0")
  .option(
    "-u, --url <url]",
    "url to influxdb instance",
    "http://localhost:8086"
  )
  .option(
    "-d, --database <database>",
    "influxdb database to store data",
    "crypto"
  );

program.parse(process.argv);

const monitor = new Monitor(program.url, program.database);
monitor.run();

process.on("error", () => {
  monitor.stop();
});
