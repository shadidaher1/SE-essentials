import { promises as fs } from 'fs';

/**
 * Reads a JSON file and returns its contents as a JavaScript object
 * @param filePath - Path to the JSON file
 * @returns Promise<any> - Parsed JSON object
 */
export async function readJSONFile(filePath: string): Promise<any> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return jsonData;
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error}`);
  }
}

/**
 * Writes a JavaScript object to a JSON file
 * @param filePath - Path where the JSON file should be written
 * @param data - JavaScript object to write
 * @returns Promise<void>
 */
export async function writeJSONFile(filePath: string, data: any): Promise<void> {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');
  } catch (error) {
    throw new Error(`Error writing JSON file: ${error}`);
  }
}
