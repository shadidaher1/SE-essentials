import logger from "./util/logger";
import { CakeBuilder, IdetifiableCakeBuilder } from './Model/builders/cake.builder';
import { CSVOrderMapper } from './mappers/Order.mapper';
import { CakeOrderRepository } from './repository/file/CakeOrder.repository';
import config from './config/index';
import {Database} from 'sqlite3';
import { open } from 'sqlite';
import { CakeRepository } from './repository/sqlite/Cake.order.repository';
import { OrderRepository } from './repository/sqlite/Order.Repository';
import { IdentifiableOrderItemBuilder, OrderBuilder } from './Model/builders/order.builder';
import { BookRepository } from './repository/sqlite/Book.order.repository';
import { ToyRepository } from './repository/sqlite/Toy.order.repository';
import { BookBuilder, IdetifiableBookBuilder } from './Model/builders/book.builder';
import { ToyBuilder, IdentifiableToyBuilder } from './Model/builders/toy.builder';
import { PGCakeRepository } from './repository/postgres/Cake.postgres.repository';
import { PGBookRepository } from './repository/postgres/Book.postgres.repository';
import { PGToyRepository } from './repository/postgres/Toy.postgres.repository';
import { PGOrderRepository } from './repository/postgres/Order.postgres.repository';
import { DBMode, RepositoryFactory } from "./repository/Repository.factory";
import { ItemCategory } from "./Model/IItem";
import { MapperFactory, MapperMode } from "./mappers/Mapper.factory";



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
  // const dbOrder = new OrderRepository(new CakeRepository());
  // await dbOrder.init();
  // const cake = new CakeBuilder()
  //   .setCakeType("Chocolate")
  //   .setFlavor("Vanilla")
  //   .setFilling("Cream")
  //   .setSize(10)
  //   .setLayers(2)
  //   .setFrostingType("Buttercream")
  //   .setDecorationType("Sprinkles")
  //   .setDecorationColor("Red")
  //   .setCustomMessage("Happy Birthday")
  //   .setShape("Round")
  //   .setAllergies("None")
  //   .setSpecialIngredients("None")
  //   .setPackagingType("Standard Box")
  //   .setFrostingFlavor("Vanilla")
  //   .build();
  // const orderId = Date.now().toString();
  // const cakeId = Math.random().toString(36).substring(2, 15);
  // const identifiableCake = new IdetifiableCakeBuilder().setId(cakeId).setCake(cake).build();
  // const order = new OrderBuilder().setPrice(100).setId(orderId).setQuantity(1).setItem(identifiableCake).build();
  // const identifiableOrder = new IdentifiableOrderItemBuilder().setIdentifiableItem(identifiableCake).setOrder(order).build();
  // await dbOrder.create(identifiableOrder);
  // // const fetchedOrder = await dbOrder.get(identifiableOrder.getID());
  
  // const fetchedOrders = ((await dbOrder.getAll()).length);
  // console.log("Fetched order from DBSandbox: %o", fetchedOrders);
  // await dbOrder.delete(identifiableOrder.getID());
  // await dbOrder.update(identifiableOrder);
  // await dbOrder.delete(identifiableOrder.getID());
  // console.log((await dbOrder.getAll()).length);
  // test Toy and Book repositories similarly


  // ==================== CAKE ====================
  console.log("\n===== CAKE CRUD =====");
  const dbOrder = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);

  const cakeMapper = MapperFactory.create(MapperMode.CSV, ItemCategory.CAKE);
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

  const cakeOrderId = Date.now().toString();
  const cakeId = Math.random().toString(36).substring(2, 15);
  const identifiableCake = new IdetifiableCakeBuilder().setId(cakeId).setCake(cake).build();
  const cakeOrder = new OrderBuilder().setPrice(100).setId(cakeOrderId).setQuantity(1).setItem(identifiableCake).build();
  const identifiableCakeOrder = new IdentifiableOrderItemBuilder().setIdentifiableItem(identifiableCake).setOrder(cakeOrder).build();

  await dbOrder.create(identifiableCakeOrder);
  console.log("Cake CREATE ✅");
  const fetchedCakeOrder = await dbOrder.get(identifiableCakeOrder.getID());
  console.log("Cake GET ✅ %o", fetchedCakeOrder);
  console.log("Cake GETALL ✅ count:", (await dbOrder.getAll()).length);
  await dbOrder.update(identifiableCakeOrder);
  console.log("Cake UPDATE ✅");
  await dbOrder.delete(identifiableCakeOrder.getID());
  console.log("Cake DELETE ✅");
  console.log("Cake count after delete:", (await dbOrder.getAll()).length);


  // ==================== BOOK ====================
  console.log("\n===== BOOK CRUD =====");
  const bookRepo = await RepositoryFactory.createItemRepository(DBMode.SQLITE, ItemCategory.BOOK);
  const bookMapper = MapperFactory.create(MapperMode.SQLITE, ItemCategory.BOOK);

  const book = new BookBuilder()
    .setBookTitle("Clean Code")
    .setAuthor("Robert Martin")
    .setGenre("Non-Fiction")
    .setFormat("Hardcover")
    .setLanguage("English")
    .setPublisher("Penguin Random House")
    .setSpecialEdition("None")
    .setPackaging("Standard Wrap")
    .setPrice(29.99)
    .setQuantity(1)
    .build();

  const bookId = Math.random().toString(36).substring(2, 15);
  const identifiableBook = new IdetifiableBookBuilder().setId(bookId).setBook(book).build();

  await bookRepo.create(identifiableBook);
  console.log("Book CREATE ✅");
  const fetchedBook = await bookRepo.get(bookId);
  console.log("Book GET ✅ %o", fetchedBook);
  console.log("Book GETALL ✅ count:", (await bookRepo.getAll()).length);
  await bookRepo.update(identifiableBook);
  console.log("Book UPDATE ✅");
  await bookRepo.delete(bookId);
  console.log("Book DELETE ✅");
  console.log("Book count after delete:", (await bookRepo.getAll()).length);


  // ==================== TOY ====================
  console.log("\n===== TOY CRUD =====");
  const toyRepo = await RepositoryFactory.createItemRepository(DBMode.SQLITE, ItemCategory.TOY);
  const toyMapper = MapperFactory.create(MapperMode.SQLITE, ItemCategory.TOY);

  const toy = new ToyBuilder()
    .setToyType("Action Figure")
    .setAgeGroup("4-7")
    .setBrand("FunTime")
    .setMaterial("Plastic")
    .setBatteryRequired("No")
    .setEducational("No")
    .setPrice(14.99)
    .setQuantity(2)
    .build();

  const toyId = Math.random().toString(36).substring(2, 15);
  const identifiableToy = new IdentifiableToyBuilder()
    .setID(toyId)
    .setToy(toy)
    .build();

  await toyRepo.create(identifiableToy);
  console.log("Toy CREATE ✅");
  const fetchedToy = await toyRepo.get(toyId);
  console.log("Toy GET ✅ %o", fetchedToy);
  console.log("Toy GETALL ✅ count:", (await toyRepo.getAll()).length);
  await toyRepo.update(identifiableToy);
  console.log("Toy UPDATE ✅");
  await toyRepo.delete(toyId);
  console.log("Toy DELETE ✅");
  console.log("Toy count after delete:", (await toyRepo.getAll()).length);
}

async function PGSandbox() {

  // ==================== CAKE ====================
  console.log("\n===== PG CAKE CRUD =====");
  const pgCakeOrder = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);

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

  const cakeOrderId = Date.now().toString();
  const cakeId = Math.random().toString(36).substring(2, 15);
  const identifiableCake = new IdetifiableCakeBuilder().setId(cakeId).setCake(cake).build();
  const cakeOrder = new OrderBuilder().setPrice(100).setId(cakeOrderId).setQuantity(1).setItem(identifiableCake).build();
  const identifiableCakeOrder = new IdentifiableOrderItemBuilder().setIdentifiableItem(identifiableCake).setOrder(cakeOrder).build();

  await pgCakeOrder.create(identifiableCakeOrder);
  console.log("PG Cake CREATE ✅");
  const fetchedCake = await pgCakeOrder.get(identifiableCakeOrder.getID());
  console.log("PG Cake GET ✅ %o", fetchedCake);
  console.log("PG Cake GETALL ✅ count:", (await pgCakeOrder.getAll()).length);
  await pgCakeOrder.update(identifiableCakeOrder);
  console.log("PG Cake UPDATE ✅");
  await pgCakeOrder.delete(identifiableCakeOrder.getID());
  console.log("PG Cake DELETE ✅");
  console.log("PG Cake count after delete:", (await pgCakeOrder.getAll()).length);

  // ==================== BOOK ====================
  console.log("\n===== PG BOOK CRUD =====");
  const pgBookRepo = await RepositoryFactory.createItemRepository(DBMode.POSTGRES, ItemCategory.BOOK);

  const book = new BookBuilder()
    .setBookTitle("Clean Code")
    .setAuthor("Robert Martin")
    .setGenre("Non-Fiction")
    .setFormat("Hardcover")
    .setLanguage("English")
    .setPublisher("Penguin Random House")
    .setSpecialEdition("None")
    .setPackaging("Standard Wrap")
    .setPrice(29.99)
    .setQuantity(1)
    .build();

  const bookId = Math.random().toString(36).substring(2, 15);
  const identifiableBook = new IdetifiableBookBuilder().setId(bookId).setBook(book).build();

  await pgBookRepo.create(identifiableBook);
  console.log("PG Book CREATE ✅");
  const fetchedBook = await pgBookRepo.get(bookId);
  console.log("PG Book GET ✅ %o", fetchedBook);
  console.log("PG Book GETALL ✅ count:", (await pgBookRepo.getAll()).length);
  await pgBookRepo.update(identifiableBook);
  console.log("PG Book UPDATE ✅");
  await pgBookRepo.delete(bookId);
  console.log("PG Book DELETE ✅");
  console.log("PG Book count after delete:", (await pgBookRepo.getAll()).length);

  // ==================== TOY ====================
  console.log("\n===== PG TOY CRUD =====");
  const pgToyRepo = await RepositoryFactory.createItemRepository(DBMode.POSTGRES, ItemCategory.TOY);

  const toy = new ToyBuilder()
    .setToyType("Action Figure")
    .setAgeGroup("4-7")
    .setBrand("FunTime")
    .setMaterial("Plastic")
    .setBatteryRequired("No")
    .setEducational("No")
    .setPrice(14.99)
    .setQuantity(2)
    .build();

  const toyId = Math.random().toString(36).substring(2, 15);
  const identifiableToy = new IdentifiableToyBuilder().setID(toyId).setToy(toy).build();

  await pgToyRepo.create(identifiableToy);
  console.log("PG Toy CREATE ✅");
  const fetchedToy = await pgToyRepo.get(toyId);
  console.log("PG Toy GET ✅ %o", fetchedToy);
  console.log("PG Toy GETALL ✅ count:", (await pgToyRepo.getAll()).length);
  await pgToyRepo.update(identifiableToy);
  console.log("PG Toy UPDATE ✅");
  await pgToyRepo.delete(toyId);
  console.log("PG Toy DELETE ✅");
  console.log("PG Toy count after delete:", (await pgToyRepo.getAll()).length);
}
// PGSandbox();

// main();
DBSandbox();
