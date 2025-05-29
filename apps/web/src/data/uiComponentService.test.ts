import { describe, expect, it, beforeEach, vi } from 'vitest';
import { 
  getUIComponentSchema, 
  listUIComponentSchemas, 
  createUIComponentSchema, 
  updateUIComponentSchema, 
  deleteUIComponentSchema,
  clearUIComponentSchemaCache 
} from './uiComponentService';
import { supabase } from '@/integrations/supabase/client';
import { UIComponentSchema } from '@/features/dynamicUI/types/schemas';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        })),
        order: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

const mockSupabase = supabase as any;

describe('uiComponentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearUIComponentSchemaCache();
  });

  const mockUIComponentSchema: UIComponentSchema = {
    componentId: 'test-form',
    name: 'Test Form',
    description: 'A test form component',
    componentType: 'Form',
    title: 'Test Form Title',
    fields: [
      {
        fieldKey: 'name',
        label: 'Name',
        type: 'text',
        required: true
      }
    ],
    actions: [
      {
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }
    ],
    version: '1.0.0'
  };

  const mockDatabaseRecord = {
    id: 'uuid-123',
    component_id: 'test-form',
    name: 'Test Form',
    description: 'A test form component',
    component_type: 'Form',
    title: 'Test Form Title',
    fields: [
      {
        fieldKey: 'name',
        label: 'Name',
        type: 'text',
        required: true
      }
    ],
    actions: [
      {
        actionKey: 'submit',
        label: 'Submit',
        style: 'primary'
      }
    ],
    display_template: null,
    layout: null,
    custom_props: null,
    version: '1.0.0',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  describe('getUIComponentSchema', () => {
    it('should fetch a UI component schema successfully', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockDatabaseRecord,
            error: null
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      const result = await getUIComponentSchema('test-form');

      expect(mockSupabase.from).toHaveBeenCalledWith('ui_components');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockUIComponentSchema);
    });

    it('should return null when schema not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      const result = await getUIComponentSchema('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      await expect(getUIComponentSchema('test-form')).rejects.toThrow('Failed to fetch UI component schema: Database error');
    });

    it('should use cache for subsequent requests', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockDatabaseRecord,
            error: null
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      // First call
      await getUIComponentSchema('test-form');
      
      // Second call should use cache
      const result = await getUIComponentSchema('test-form');

      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUIComponentSchema);
    });
  });

  describe('listUIComponentSchemas', () => {
    it('should fetch all UI component schemas successfully', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [mockDatabaseRecord],
          error: null
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      const result = await listUIComponentSchemas();

      expect(mockSupabase.from).toHaveBeenCalledWith('ui_components');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual([mockUIComponentSchema]);
    });

    it('should throw error on database error', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      await expect(listUIComponentSchemas()).rejects.toThrow('Failed to list UI component schemas: Database error');
    });
  });

  describe('createUIComponentSchema', () => {
    it('should create a UI component schema successfully', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockDatabaseRecord,
            error: null
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert
      });

      const result = await createUIComponentSchema(mockUIComponentSchema);

      expect(mockSupabase.from).toHaveBeenCalledWith('ui_components');
      expect(mockInsert).toHaveBeenCalled();
      expect(result).toEqual(mockUIComponentSchema);
    });

    it('should throw error for invalid schema structure', async () => {
      const invalidSchema = {
        ...mockUIComponentSchema,
        componentId: '' // Invalid - missing componentId
      };

      await expect(createUIComponentSchema(invalidSchema as UIComponentSchema)).rejects.toThrow('Invalid UI component schema structure');
    });

    it('should throw error on database error', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert
      });

      await expect(createUIComponentSchema(mockUIComponentSchema)).rejects.toThrow('Failed to create UI component schema: Database error');
    });
  });

  describe('updateUIComponentSchema', () => {
    it('should update a UI component schema successfully', async () => {
      // Mock getUIComponentSchema call first
      const mockSelectForGet = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockDatabaseRecord,
            error: null
          })
        })
      });

      // Mock update call
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { ...mockDatabaseRecord, name: 'Updated Test Form' },
              error: null
            })
          })
        })
      });

      mockSupabase.from.mockReturnValueOnce({
        select: mockSelectForGet
      }).mockReturnValueOnce({
        update: mockUpdate
      });

      const updates = { name: 'Updated Test Form' };
      const result = await updateUIComponentSchema('test-form', updates);

      expect(result.name).toBe('Updated Test Form');
    });

    it('should throw error when schema not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect
      });

      await expect(updateUIComponentSchema('non-existent', { name: 'New Name' })).rejects.toThrow('UI component schema with component_id non-existent not found');
    });
  });

  describe('deleteUIComponentSchema', () => {
    it('should delete a UI component schema successfully', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null
        })
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete
      });

      await deleteUIComponentSchema('test-form');

      expect(mockSupabase.from).toHaveBeenCalledWith('ui_components');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should throw error on database error', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: { message: 'Database error' }
        })
      });

      mockSupabase.from.mockReturnValue({
        delete: mockDelete
      });

      await expect(deleteUIComponentSchema('test-form')).rejects.toThrow('Failed to delete UI component schema: Database error');
    });
  });
}); 