import { readJSONFile, writeJSONFile } from '../src/parsers/jsonParser';
import path from 'path';
import { promises as fs } from 'fs';

describe('JSON Parser', () => {
  const testDir = path.join(__dirname, 'test-data-json');
  const jsonFilePath = path.join(testDir, 'test.json');
  const validJsonPath = path.join(__dirname, '../src/data/book orders.json');

  beforeAll(async () => {
    // Create test directory if it doesn't exist
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.rm(testDir, { recursive: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('readJSONFile', () => {
    it('should read a valid JSON file and return parsed object', async () => {
      const testData = { name: 'John', age: 30, city: 'New York' };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result).toEqual(testData);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should read JSON array', async () => {
      const testData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
    });

    it('should handle JSON with nested objects', async () => {
      const testData = {
        user: {
          name: 'John',
          address: {
            city: 'New York',
            zip: '10001'
          }
        }
      };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.user.address.city).toBe('New York');
      expect(result.user.address.zip).toBe('10001');
    });

    it('should handle JSON with various data types', async () => {
      const testData = {
        string: 'text',
        number: 42,
        float: 3.14,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: { key: 'value' }
      };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.float).toBe(3.14);
      expect(result.boolean).toBe(true);
      expect(result.null).toBeNull();
      expect(Array.isArray(result.array)).toBe(true);
      expect(typeof result.object).toBe('object');
    });

    it('should handle empty JSON object', async () => {
      const testData = {};
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(0);
    });

    it('should handle empty JSON array', async () => {
      const testData: any[] = [];
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle JSON with special characters', async () => {
      const testData = {
        text: 'Contains special chars: @ # $ % & * ( ) ! ~ ` ^ |',
        unicode: 'Unicode: 你好世界 🌍'
      };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.text).toContain('@');
      expect(result.unicode).toContain('🌍');
    });

    it('should throw error for invalid JSON', async () => {
      const invalidJson = '{ "name": "John", invalid json }';
      await fs.writeFile(jsonFilePath, invalidJson, 'utf-8');
      
      await expect(readJSONFile(jsonFilePath)).rejects.toThrow();
    });

    it('should throw error for malformed JSON', async () => {
      const malformedJson = '{ "name": "John" '; // Missing closing brace
      await fs.writeFile(jsonFilePath, malformedJson, 'utf-8');
      
      await expect(readJSONFile(jsonFilePath)).rejects.toThrow();
    });

    it('should throw error for non-existent file', async () => {
      const nonExistentPath = path.join(testDir, 'non-existent.json');
      
      await expect(readJSONFile(nonExistentPath)).rejects.toThrow();
    });

    it('should read actual book orders JSON file', async () => {
      const result = await readJSONFile(validJsonPath);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('Order ID');
      expect(result[0]).toHaveProperty('Book Title');
    });

    it('should handle JSON with deeply nested structures', async () => {
      const testData = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep value'
              }
            }
          }
        }
      };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.level1.level2.level3.level4.value).toBe('deep value');
    });

    it('should handle JSON with arrays of objects', async () => {
      const testData = {
        items: [
          { id: 1, name: 'Item 1', tags: ['tag1', 'tag2'] },
          { id: 2, name: 'Item 2', tags: ['tag3', 'tag4'] }
        ]
      };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.items.length).toBe(2);
      expect(result.items[0].tags).toContain('tag1');
    });

    it('should throw error for empty file', async () => {
      await fs.writeFile(jsonFilePath, '', 'utf-8');
      
      await expect(readJSONFile(jsonFilePath)).rejects.toThrow();
    });

    it('should handle JSON with escaped characters', async () => {
      const testData = { text: 'Line 1\nLine 2\tTabbed', quote: 'Contains "quotes"' };
      await fs.writeFile(jsonFilePath, JSON.stringify(testData), 'utf-8');
      
      const result = await readJSONFile(jsonFilePath);
      
      expect(result.text).toContain('Line 1');
      expect(result.quote).toContain('"quotes"');
    });
  });

  describe('writeJSONFile', () => {
    it('should write JSON data to file', async () => {
      const outputPath = path.join(testDir, 'output.json');
      const testData = { name: 'John', age: 30 };
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(readData).toEqual(testData);
    });

    it('should write JSON array to file', async () => {
      const outputPath = path.join(testDir, 'array-output.json');
      const testData = [{ id: 1 }, { id: 2 }];
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(Array.isArray(readData)).toBe(true);
      expect(readData.length).toBe(2);
    });

    it('should format JSON with proper indentation', async () => {
      const outputPath = path.join(testDir, 'formatted.json');
      const testData = { name: 'John', age: 30 };
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      
      // Check that file has proper formatting (indentation)
      expect(fileContent).toContain('\n');
      expect(fileContent).toContain('  '); // Should have indentation
    });

    it('should handle writing empty object', async () => {
      const outputPath = path.join(testDir, 'empty-object.json');
      const testData = {};
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(typeof readData).toBe('object');
      expect(Object.keys(readData).length).toBe(0);
    });

    it('should handle writing empty array', async () => {
      const outputPath = path.join(testDir, 'empty-array.json');
      const testData: any[] = [];
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(Array.isArray(readData)).toBe(true);
      expect(readData.length).toBe(0);
    });

    it('should throw error when writing to invalid path', async () => {
      const invalidPath = '/invalid/path/that/does/not/exist/file.json';
      const testData = { name: 'John' };
      
      await expect(writeJSONFile(invalidPath, testData)).rejects.toThrow();
    });

    it('should overwrite existing file', async () => {
      const outputPath = path.join(testDir, 'overwrite.json');
      const testData1 = { name: 'John' };
      const testData2 = { name: 'Jane', age: 25 };
      
      await writeJSONFile(outputPath, testData1);
      await writeJSONFile(outputPath, testData2);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(readData.name).toBe('Jane');
      expect(readData.age).toBe(25);
    });

    it('should handle complex nested structures', async () => {
      const outputPath = path.join(testDir, 'complex.json');
      const testData = {
        users: [
          { id: 1, name: 'John', roles: ['admin', 'user'] },
          { id: 2, name: 'Jane', roles: ['user'] }
        ],
        metadata: { created: '2023-01-01', version: 1 }
      };
      
      await writeJSONFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      const readData = JSON.parse(fileContent);
      
      expect(readData.users.length).toBe(2);
      expect(readData.metadata.version).toBe(1);
    });
  });
});
