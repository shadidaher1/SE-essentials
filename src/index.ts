
import path from 'path';
import logger from "./util/logger";
import { readCSVFile } from "./util/parser";
import { CakeBuilder, IdetifiableCakeBuilder } from './Model/builders/cake.builder';
import { BookBuilder } from './Model/builders/book.builder';
import { ToyBuilder } from './Model/builders/toy.builder';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { log } from 'console';
import { CSVOrderMapper } from './mappers/Order.mapper';
import { CakeOrderRepository } from './repository/file/CakeOrder.repository';
import config from './config/index';
import {Database} from 'sqlite3';
import { open } from 'sqlite';
import { CakeRepository } from './repository/sqlite/Cake.order.repository';
import { OrderRepository } from './repository/sqlite/Order.Repository';
import { IdentifiableOrderItemBuilder, OrderBuilder } from './Model/builders/order.builder';

async function main() {
  // const filePath = path.resolve(__dirname, './data/cake orders.csv');
  // const data = await readCSVFile(filePath);
  // // for each data row, log the row
  // data.forEach((row) => logger.info(row));

  // Demonstrate CakeBuilder
  const filePath = config.storagePath.csv.cake;
  const repository = new CakeOrderRepository(filePath);
  const data = await repository.getAll();
  logger.info("List of Orders: \n %o", data);

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

async function DBSandbox() {
  const dbOrder = new OrderRepository(new CakeRepository());
  await dbOrder.init();
  const cake = new CakeBuilder()
    .setCakeType("Chocolate")
    .setFlavor("Vanilla")
    .setFilling("Cream")
    .setSize(10)
    .setLayers(2)
    .setFrostingType("Buttercream")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Red")
    .setCustomMessage("Happy Birthday")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Standard Box")
    .setFrostingFlavor("Vanilla")
    .build();
  const orderId = Date.now().toString();
  const cakeId = Math.random().toString(36).substring(2, 15);
  const identifiableCake = new IdetifiableCakeBuilder().setId(cakeId).setCake(cake).build();
  const order = new OrderBuilder().setPrice(100).setId(orderId).setQuantity(1).setItem(identifiableCake).build();
  const identifiableOrder = new IdentifiableOrderItemBuilder().setIdentifiableItem(identifiableCake).setOrder(order).build();
  await dbOrder.create(identifiableOrder);
  // const fetchedOrder = await dbOrder.get(identifiableOrder.getID());
  
  const fetchedOrders = ((await dbOrder.getAll()).length);
  console.log("Fetched order from DBSandbox: %o", fetchedOrders);
  await dbOrder.delete(identifiableOrder.getID());
  await dbOrder.update(identifiableOrder);
  await dbOrder.delete(identifiableOrder.getID());
  console.log((await dbOrder.getAll()).length);


  
}

// main();
DBSandbox();
