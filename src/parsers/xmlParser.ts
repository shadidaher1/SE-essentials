import { promises as fs } from 'fs';
import * as xml2js from 'xml2js';

/**
 * Reads an XML file and returns its contents as a JavaScript object
 * @param filePath - Path to the XML file
 * @returns Promise<any> - Parsed XML object
 */
export async function readXMLFile(filePath: string): Promise<any> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const xmlData = await parser.parseStringPromise(fileContent);
    return xmlData;
  } catch (error) {
    throw new Error(`Error reading XML file: ${error}`);
  }
}

/**
 * Writes a JavaScript object to an XML file
 * @param filePath - Path where the XML file should be written
 * @param data - JavaScript object to write as XML
 * @returns Promise<void>
 */
export async function writeXMLFile(filePath: string, data: any): Promise<void> {
  try {
    const builder = new xml2js.Builder();
    const xmlContent = builder.buildObject(data);
    await fs.writeFile(filePath, xmlContent, 'utf-8');
  } catch (error) {
    throw new Error(`Error writing XML file: ${error}`);
  }
}
