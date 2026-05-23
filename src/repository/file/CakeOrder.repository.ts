import { CSVCakeMapper } from "../../mappers/Cake.mapper";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { IOrder } from "../../Model/IOrder";
import { Order } from "../../Model/Order.Model";
import { readCSVFile, writeCSVFile } from "../../util/parser";
import { ID } from "../IRepository";
import { OrderRepository } from "./Orderrepositoy";



export class CakeOrderRepository extends OrderRepository {

    constructor(private readonly filePath: string) {
        super();
    }
      private mapper = new CSVOrderMapper(new CSVCakeMapper());
    protected async load(): Promise<(IOrder & ID)[]> {
        // Implement file reading logic here
        const csv = await readCSVFile(this.filePath);
        // Convert CSV data to Order objects and return as a promise
      
        return csv.map(row => this.mapper.map(row)) as (IOrder & ID)[];


    }
    protected async save(orders: (IOrder & ID)[]): Promise<void> {
        // generate the list of heaaders
        // conver the orders to 2d string
        // write the csv file
        const headers = ['Type','Flavor','Filling','Size','Layers','Frosting Type','Frosting Flavor','Decoration Type','Decoration Color','Custom Message','Shape','Allergies','Special Ingredients','Packaging Type','Price','Quantity'];
        const rawData = orders.map(order => {
            return this.mapper.reverseMap(order);
        });
        // write the csv file
        await writeCSVFile(this.filePath, [headers, ...rawData]);
    }
}