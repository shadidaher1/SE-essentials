
import path from 'path';
import logger from "./util/logger";
import { readCSVFile } from "./util/parser";
import { CakeBuilder } from './Model/builders/cake.builder';


async function main() {
  // const filePath = path.resolve(__dirname, './data/cake orders.csv');
  // const data = await readCSVFile(filePath);
  // // for each data row, log the row
  // data.forEach((row) => logger.info(row));
  const cake = new CakeBuilder()
    .setCakeType("Sponge")
    .setFlavor("Vanilla")
    .setFilling("Cream")
    .setSize(20)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Vanilla")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Multi-color")
    .setCustomMessage("")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Standard Box")
    .build();
  console.log(cake);
}

main();
