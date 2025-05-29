import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { SchemaColumnType } from '@/features/schemaEditor/types';
import * as schemaService from './schemaService';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
}));

const mockSchema = {
  id: 'schema1',
  name: 'Test Schema',
  description: 'A test schema',
  tables: [
    {
      name: 'users',
      displayName: 'Users',
      description: 'User accounts',
      columns: [
        { 
          name: 'id', 
          type: SchemaColumnType.ID, 
          required: true, 
          isPrimary: true, 
          comment: 'Primary key' 
        },
        { 
          name: 'username', 
          type: SchemaColumnType.TEXT, 
          required: true, 
          comment: 'Unique username' 
        }
      ]
    }
  ],
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
};

describe('Schema Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchSchemas', () => {
    it('should fetch all schemas successfully', async () => {
      const mockResponse = {
        data: [mockSchema],
        error: null
      };

      // Set up the mock implementation for this specific test
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue(mockResponse)
        })
      } as any);

      const result = await schemaService.fetchSchemas();
      
      expect(supabase.from).toHaveBeenCalledWith('poc_schemas');
      expect(result).toEqual([mockSchema]);
    });

    it('should throw an error if the fetch fails', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Database error' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue(mockResponse)
        })
      } as any);

      await expect(schemaService.fetchSchemas()).rejects.toEqual({ message: 'Database error' });
    });
  });

  describe('fetchSchemaById', () => {
    it('should fetch a schema by ID successfully', async () => {
      const mockResponse = {
        data: mockSchema,
        error: null
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(mockResponse)
          })
        })
      } as any);

      const result = await schemaService.fetchSchemaById('schema1');
      
      expect(supabase.from).toHaveBeenCalledWith('poc_schemas');
      expect(result).toEqual(mockSchema);
    });

    it('should return null if the schema is not found', async () => {
      const mockResponse = {
        data: null,
        error: { code: 'PGRST116', message: 'Not found' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(mockResponse)
          })
        })
      } as any);

      const result = await schemaService.fetchSchemaById('nonexistent');
      
      expect(result).toBeNull();
    });

    it('should throw other errors', async () => {
      const mockResponse = {
        data: null,
        error: { code: 'OTHER_ERROR', message: 'Database error' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(mockResponse)
          })
        })
      } as any);

      await expect(schemaService.fetchSchemaById('schema1')).rejects.toEqual({
        code: 'OTHER_ERROR',
        message: 'Database error'
      });
    });
  });

  describe('createSchema', () => {
    it('should create a schema successfully', async () => {
      const mockResponse = {
        data: mockSchema,
        error: null
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(mockResponse)
          })
        })
      } as any);

      const result = await schemaService.createSchema('Test Schema', 'A test schema', []);
      
      expect(supabase.from).toHaveBeenCalledWith('poc_schemas');
      expect(result).toEqual(mockSchema);
    });

    it('should throw an error if creation fails', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Database error' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(mockResponse)
          })
        })
      } as any);

      await expect(schemaService.createSchema('Test Schema')).rejects.toEqual({
        message: 'Database error'
      });
    });
  });

  describe('updateSchema', () => {
    it('should update a schema successfully', async () => {
      const mockResponse = {
        data: mockSchema,
        error: null
      };

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockReturnValue(mockResponse)
            })
          })
        })
      } as any);

      const result = await schemaService.updateSchema('schema1', {
        name: 'Updated Schema Name'
      });
      
      expect(supabase.from).toHaveBeenCalledWith('poc_schemas');
      expect(result).toEqual(mockSchema);
    });

    it('should throw an error if update fails', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Database error' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockReturnValue(mockResponse)
            })
          })
        })
      } as any);

      await expect(schemaService.updateSchema('schema1', { name: 'Updated Schema' })).rejects.toEqual({
        message: 'Database error'
      });
    });
  });

  describe('deleteSchema', () => {
    it('should delete a schema successfully', async () => {
      const mockResponse = {
        error: null
      };

      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockResponse)
        })
      } as any);

      const result = await schemaService.deleteSchema('schema1');
      
      expect(supabase.from).toHaveBeenCalledWith('poc_schemas');
      expect(result).toBe(true);
    });

    it('should throw an error if deletion fails', async () => {
      const mockResponse = {
        error: { message: 'Database error' }
      };

      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(mockResponse)
        })
      } as any);

      await expect(schemaService.deleteSchema('schema1')).rejects.toEqual({
        message: 'Database error'
      });
    });
  });

  describe('Table Operations', () => {
    beforeEach(() => {
      // Mock fetchSchemaById for table operations
      vi.spyOn(schemaService, 'fetchSchemaById').mockResolvedValue(mockSchema);
      vi.spyOn(schemaService, 'updateSchema').mockResolvedValue(mockSchema);
    });

    it('should add a table successfully', async () => {
      const newTable = {
        name: 'orders',
        displayName: 'Orders',
        columns: []
      };

      const result = await schemaService.addTable('schema1', newTable);
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalledWith('schema1', {
        tables: [...mockSchema.tables, newTable]
      });
      expect(result).toEqual(mockSchema);
    });
    
    it('should update a table successfully', async () => {
      const tableUpdates = {
        displayName: 'Updated Users',
        description: 'Updated description'
      };

      const result = await schemaService.updateTable('schema1', 'users', tableUpdates);
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });

    it('should throw error when updating non-existent table', async () => {
      await expect(schemaService.updateTable('schema1', 'nonexistent', {}))
        .rejects.toThrow('Table nonexistent not found in schema schema1');
    });

    it('should remove a table successfully', async () => {
      const result = await schemaService.removeTable('schema1', 'users');
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });
  });

  describe('Column Operations', () => {
    beforeEach(() => {
      // Mock fetchSchemaById for column operations
      vi.spyOn(schemaService, 'fetchSchemaById').mockResolvedValue(mockSchema);
      vi.spyOn(schemaService, 'updateSchema').mockResolvedValue(mockSchema);
    });

    it('should add a column successfully', async () => {
      const newColumn = {
        name: 'email',
        type: SchemaColumnType.TEXT,
        required: true
      };

      const result = await schemaService.addColumn('schema1', 'users', newColumn);
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });

    it('should throw error when adding column to non-existent table', async () => {
      await expect(schemaService.addColumn('schema1', 'nonexistent', {
        name: 'test',
        type: SchemaColumnType.TEXT,
        required: false
      })).rejects.toThrow('Table nonexistent not found in schema schema1');
    });
    
    it('should update a column successfully', async () => {
      const columnUpdates = {
        required: false,
        comment: 'Updated comment'
      };

      const result = await schemaService.updateColumn('schema1', 'users', 'username', columnUpdates);
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });

    it('should throw error when updating non-existent column', async () => {
      await expect(schemaService.updateColumn('schema1', 'users', 'nonexistent', {}))
        .rejects.toThrow('Column nonexistent not found in table users');
    });

    it('should remove a column successfully', async () => {
      const result = await schemaService.removeColumn('schema1', 'users', 'username');
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(schemaService.updateSchema).toHaveBeenCalled();
      expect(result).toEqual(mockSchema);
    });
  });

  describe('Import/Export', () => {
    it('should import JSON schema successfully', async () => {
      vi.spyOn(schemaService, 'createSchema').mockResolvedValue(mockSchema);
      
      const jsonData = JSON.stringify(mockSchema.tables);
      const result = await schemaService.importSchema('Test Import', 'Imported schema', jsonData, 'json');
      
      expect(schemaService.createSchema).toHaveBeenCalledWith('Test Import', 'Imported schema', mockSchema.tables);
      expect(result).toEqual(mockSchema);
    });

    it('should throw error on invalid JSON import', async () => {
      await expect(schemaService.importSchema('Test Import', 'Imported schema', 'invalid json', 'json'))
        .rejects.toThrow('Invalid JSON format for schema import');
    });

    it('should export to JSON format successfully', async () => {
      vi.spyOn(schemaService, 'fetchSchemaById').mockResolvedValue(mockSchema);
      
      const result = await schemaService.exportSchema('schema1', 'json');
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(result).toBe(JSON.stringify(mockSchema.tables, null, 2));
    });

    it('should export to SQL format successfully', async () => {
      vi.spyOn(schemaService, 'fetchSchemaById').mockResolvedValue(mockSchema);
      
      const result = await schemaService.exportSchema('schema1', 'sql');
      
      expect(schemaService.fetchSchemaById).toHaveBeenCalledWith('schema1');
      expect(result).toContain('CREATE TABLE "users"');
      expect(result).toContain('"id" UUID NOT NULL PRIMARY KEY');
    });

    it('should throw error for unsupported export format', async () => {
      vi.spyOn(schemaService, 'fetchSchemaById').mockResolvedValue(mockSchema);
      
      // @ts-expect-error - deliberate invalid format for test
      await expect(schemaService.exportSchema('schema1', 'invalid'))
        .rejects.toThrow('Unsupported export format: invalid');
    });
  });
}); 