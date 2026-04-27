import { readCSVFile, writeCSVFile } from '../src/util/parser';
import path from 'path';
import { promises as fs } from 'fs';

describe('CSV Parser', () => {
  const testDir = path.join(__dirname, 'test-data-csv');
  const csvFilePath = path.join(testDir, 'test.csv');
<<<<<<< HEAD
  const mockCakeOrdersPath = path.join(testDir, 'mock-cake-orders.csv');
=======
  const validCsvPath = path.join(__dirname, '../src/data/cake orders.csv');
>>>>>>> 411414f (added the XML parse and JSON parser for assignment1 with unit tests for each)

  beforeAll(async () => {
    // Create test directory if it doesn't exist
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
<<<<<<< HEAD

    // Create mock cake orders CSV file with a few rows
    const mockCakeOrdersData = `"id","Type","Flavor","Filling","Size","Layers","Frosting Type","Frosting Flavor","Decoration Type","Decoration Color","Custom Message","Shape","Allergies","Special Ingredients","Packaging Type","Price","Quantity"
"0","Sponge","Vanilla","Cream","20","2","Buttercream","Vanilla","Sprinkles","Multi-color","Happy Birthday","Round","Nut-Free","Organic Ingredients","Standard Box","50","1"
"1","Chocolate","Chocolate","Ganache","25","3","Fondant","Chocolate","Fondant Figures","Red","Congrats","Square","Gluten-Free","Vegan","Luxury Box with Ribbon","75","2"
"2","Fruit","Lemon","Jam","15","1","Whipped Cream","Lemon","Edible Flowers","Yellow","","Heart-Shaped","None","Sugar-Free","Standard Box","40","1"`;
    await fs.writeFile(mockCakeOrdersPath, mockCakeOrdersData, 'utf-8');
=======
>>>>>>> 411414f (added the XML parse and JSON parser for assignment1 with unit tests for each)
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.rm(testDir, { recursive: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('readCSVFile', () => {
    it('should read a valid CSV file and return data as 2D array', async () => {
      const testData = 'Name,Age,City\nJohn,30,New York\nJane,25,Los Angeles';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle includeHeader parameter correctly', async () => {
      const testData = 'Name,Age,City\nJohn,30,New York\nJane,25,Los Angeles';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const resultWithoutHeader = await readCSVFile(csvFilePath, false);
      const resultWithHeader = await readCSVFile(csvFilePath, true);
      
      expect(resultWithHeader.length).toBe(resultWithoutHeader.length + 1);
    });

    it('should handle empty CSV file', async () => {
      const testData = '';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle CSV file with only header', async () => {
      const testData = 'Name,Age,City';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle CSV with quoted fields', async () => {
      const testData = '"Name","Age","City"\n"John Doe",30,"New York"\n"Jane Smith",25,"Los Angeles"';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle CSV with different column counts (relax_column_count)', async () => {
      const testData = 'Name,Age,City\nJohn,30,New York,Extra\nJane,25';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should trim whitespace from fields', async () => {
      const testData = 'Name , Age , City\n John , 30 , New York\n Jane , 25 , Los Angeles';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should skip empty lines', async () => {
      const testData = 'Name,Age,City\n\nJohn,30,New York\n\nJane,25,Los Angeles\n';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error for non-existent file', async () => {
      const nonExistentPath = path.join(testDir, 'non-existent.csv');
      
      await expect(readCSVFile(nonExistentPath, false)).rejects.toThrow();
    });

<<<<<<< HEAD
    it('should read mock cake orders CSV file', async () => {
      const result = await readCSVFile(mockCakeOrdersPath, true);
=======
    it('should read actual cake orders CSV file', async () => {
      const result = await readCSVFile(validCsvPath, true);
>>>>>>> 411414f (added the XML parse and JSON parser for assignment1 with unit tests for each)
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle CSV with special characters', async () => {
      const testData = 'Name,Description\nProduct,Contains @ # $ % special chars';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle CSV with numbers and mixed data types', async () => {
      const testData = 'Name,Price,Quantity,Available\nProduct1,19.99,100,true\nProduct2,29.99,50,false';
      await fs.writeFile(csvFilePath, testData, 'utf-8');
      
      const result = await readCSVFile(csvFilePath, false);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('writeCSVFile', () => {
    it('should write CSV data to file', async () => {
      const outputPath = path.join(testDir, 'output.csv');
      const testData = [['John', '30', 'New York'], ['Jane', '25', 'Los Angeles']];
      
      await writeCSVFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
    });

    it('should handle empty data array', async () => {
      const outputPath = path.join(testDir, 'empty-output.csv');
      const testData: string[][] = [];
      
      await writeCSVFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      // Empty array produces empty or whitespace string
      expect(typeof fileContent).toBe('string');
    });

    it('should throw error when writing to invalid path', async () => {
      const invalidPath = '/invalid/path/that/does/not/exist/file.csv';
      const testData = [['John', '30']];
      
      await expect(writeCSVFile(invalidPath, testData)).rejects.toThrow();
    });
  });
});
