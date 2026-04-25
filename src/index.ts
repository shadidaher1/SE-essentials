
import path from 'path';
import logger from "./util/logger";
import { readCSVFile } from "./util/parser";


async function main() {
  const filePath = path.resolve(__dirname, './data/Cake orders.csv');
  const data = await readCSVFile(filePath, true);
  // for each data row, log the row
  data.forEach((row) => logger.info(row));
}

main();
