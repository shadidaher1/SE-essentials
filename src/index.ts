
import path from 'path';
import logger from "./util/logger";
import { readCSVFile } from "./util/parser";
import { CakeBuilder } from './Model/builders/cake.builder';
import { BookBuilder } from './Model/builders/book.builder';
import { ToyBuilder } from './Model/builders/toy.builder';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { log } from 'console';
import { CSVOrderMapper } from './mappers/Order.mapper';


async function main() {
  // const filePath = path.resolve(__dirname, './data/cake orders.csv');
  // const data = await readCSVFile(filePath);
  // // for each data row, log the row
  // data.forEach((row) => logger.info(row));

  // Demonstrate CakeBuilder
  const data = await readCSVFile(path.resolve(__dirname, './data/cake orders.csv'));
  const cakeMapper = new CSVCakeMapper();
  const orderMapper = new CSVOrderMapper(cakeMapper);
  const orders = data.map(row => orderMapper.map(row));
  logger.info("List of Orders: \n %o", orders);

  // Demonstrate BookBuilder
  // const book = new BookBuilder()
  //   .setOrderId("B001")
  //   .setBookTitle("The Great Gatsby")
  //   .setAuthor("F. Scott Fitzgerald")
  //   .setGenre("Historical Fiction")
  //   .setFormat("Paperback")
  //   .setLanguage("English")
  //   .setPublisher("Penguin Random House")
  //   .setSpecialEdition("None")
  //   .setPackaging("Standard Wrap")
  //   .setPrice(15.99)
  //   .setQuantity(1)
  //   .build();
  // console.log("Book:", book);

  // // Demonstrate ToyBuilder
  // const toy = new ToyBuilder()
  //   .setOrderId("T001")
  //   .setToyType("Action Figure")
  //   .setAgeGroup("8-12")
  //   .setBrand("Adventure Co.")
  //   .setMaterial("Plastic")
  //   .setBatteryRequired("No")
  //   .setEducational("No")
  //   .setPrice(25.50)
  //   .setQuantity(1)
  //   .build();
  // console.log("Toy:", toy);
}

main();
