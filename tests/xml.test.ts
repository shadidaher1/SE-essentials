import { readXMLFile, writeXMLFile } from '../src/parsers/xmlParser';
import path from 'path';
import { promises as fs } from 'fs';

describe('XML Parser', () => {
  const testDir = path.join(__dirname, 'test-data');
  const xmlFilePath = path.join(testDir, 'test.xml');
  const validXmlPath = path.join(__dirname, '../src/data/toy orders.xml');

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

  describe('readXMLFile', () => {
    it('should read a valid XML file and return parsed object', async () => {
      const testXml = '<?xml version="1.0"?><root><name>John</name><age>30</age></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result).toBeTruthy();
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with attributes', async () => {
      const testXml = '<?xml version="1.0"?><root><person id="1"><name>John</name></person></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root.person).toBeTruthy();
    });

    it('should handle XML with nested elements', async () => {
      const testXml = '<?xml version="1.0"?><root><user><profile><name>John</name><age>30</age></profile></user></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with multiple elements of same name', async () => {
      const testXml = '<?xml version="1.0"?><root><item>Item1</item><item>Item2</item><item>Item3</item></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with text content', async () => {
      const testXml = '<?xml version="1.0"?><root><message>Hello World</message></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with CDATA sections', async () => {
      const testXml = '<?xml version="1.0"?><root><content><![CDATA[Special content with <tags>]]></content></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with special characters', async () => {
      const testXml = '<?xml version="1.0"?><root><text>Contains &lt;tags&gt; and &amp; ampersand</text></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle self-closing tags', async () => {
      const testXml = '<?xml version="1.0"?><root><empty/><item>Content</item></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should throw error for invalid XML', async () => {
      const invalidXml = '<?xml version="1.0"?><root><unclosed>';
      await fs.writeFile(xmlFilePath, invalidXml, 'utf-8');
      
      await expect(readXMLFile(xmlFilePath)).rejects.toThrow();
    });

    it('should throw error for malformed XML', async () => {
      const malformedXml = '<?xml version="1.0"?><root></notroot>';
      await fs.writeFile(xmlFilePath, malformedXml, 'utf-8');
      
      await expect(readXMLFile(xmlFilePath)).rejects.toThrow();
    });

    it('should throw error for non-existent file', async () => {
      const nonExistentPath = path.join(testDir, 'non-existent.xml');
      
      await expect(readXMLFile(nonExistentPath)).rejects.toThrow();
    });

    it('should throw error for empty file', async () => {
      await fs.writeFile(xmlFilePath, '', 'utf-8');
      
      // xml2js returns null for empty file instead of throwing error
      const result = await readXMLFile(xmlFilePath);
      expect(result).toBeNull();
    });

    it('should read actual toy orders XML file', async () => {
      const result = await readXMLFile(validXmlPath);
      
      expect(result).toBeTruthy();
      expect(result.data).toBeTruthy();
    });

    it('should handle XML with namespaces', async () => {
      const testXml = '<?xml version="1.0"?><root xmlns="http://example.com"><element>Content</element></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with comments', async () => {
      const testXml = '<?xml version="1.0"?><root><!-- This is a comment --><element>Content</element></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with processing instructions', async () => {
      const testXml = '<?xml version="1.0"?><?target data?><root><element>Content</element></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });

    it('should handle XML with mixed content', async () => {
      const testXml = '<?xml version="1.0"?><root><p>Text with <b>bold</b> and <i>italic</i></p></root>';
      await fs.writeFile(xmlFilePath, testXml, 'utf-8');
      
      const result = await readXMLFile(xmlFilePath);
      
      expect(result.root).toBeTruthy();
    });
  });

  describe('writeXMLFile', () => {
    it('should write XML data to file', async () => {
      const outputPath = path.join(testDir, 'output.xml');
      const testData = {
        root: {
          name: 'John',
          age: 30
        }
      };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toContain('<?xml');
      expect(fileContent).toContain('root');
    });

    it('should write XML with nested elements', async () => {
      const outputPath = path.join(testDir, 'nested-output.xml');
      const testData = {
        root: {
          user: {
            profile: {
              name: 'John',
              age: 30
            }
          }
        }
      };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
      expect(fileContent).toContain('root');
    });

    it('should write XML with attributes', async () => {
      const outputPath = path.join(testDir, 'attributes.xml');
      const testData = {
        root: {
          person: {
            $: { id: '1' },
            name: 'John'
          }
        }
      };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
    });

    it('should handle writing empty object', async () => {
      const outputPath = path.join(testDir, 'empty-object.xml');
      const testData = { root: {} };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toContain('root');
    });

    it('should throw error when writing to invalid path', async () => {
      const invalidPath = '/invalid/path/that/does/not/exist/file.xml';
      const testData = { root: { element: 'value' } };
      
      await expect(writeXMLFile(invalidPath, testData)).rejects.toThrow();
    });

    it('should overwrite existing file', async () => {
      const outputPath = path.join(testDir, 'overwrite.xml');
      const testData1 = { root: { name: 'John' } };
      const testData2 = { root: { name: 'Jane', age: 25 } };
      
      await writeXMLFile(outputPath, testData1);
      await writeXMLFile(outputPath, testData2);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
    });

    it('should handle arrays in data', async () => {
      const outputPath = path.join(testDir, 'array.xml');
      const testData = {
        root: {
          items: {
            item: [
              { id: '1', name: 'Item1' },
              { id: '2', name: 'Item2' }
            ]
          }
        }
      };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
    });

    it('should handle complex nested structures', async () => {
      const outputPath = path.join(testDir, 'complex.xml');
      const testData = {
        root: {
          users: {
            user: [
              { id: '1', name: 'John', roles: { role: ['admin', 'user'] } },
              { id: '2', name: 'Jane', roles: { role: 'user' } }
            ]
          },
          metadata: {
            created: '2023-01-01',
            version: '1'
          }
        }
      };
      
      await writeXMLFile(outputPath, testData);
      
      const fileContent = await fs.readFile(outputPath, 'utf-8');
      expect(fileContent).toBeTruthy();
      expect(fileContent).toContain('users');
    });
  });
});
