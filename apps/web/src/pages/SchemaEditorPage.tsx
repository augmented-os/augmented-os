import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SchemaEditor } from '@/features/schemaEditor/components/SchemaEditor';
import * as schemaService from '@/data/schemaService';
import { SchemaTable, SchemaSummary } from '@/features/schemaEditor/types';
import { FIELD_TYPES } from '@/features/schemaEditor/hooks/use-field-types';

export default function SchemaEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schemas, setSchemas] = useState<SchemaSummary[]>([]);
  const [loadingSchemas, setLoadingSchemas] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Schema Editor | Data Model Builder';
    
    // Restore original title on unmount
    return () => {
      document.title = 'Workflow Visual Builder';
    };
  }, []);

  // Load schemas for selector - now unconditionally
  useEffect(() => {
    const loadSchemas = async () => {
      setLoadingSchemas(true);
      try {
        const schemas = await schemaService.fetchSchemas();
        setSchemas(schemas);
      } catch (err) {
        console.error('Error fetching schemas:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch schemas'));
      } finally {
        setLoadingSchemas(false);
      }
    };
    
    loadSchemas();
  }, []);

  // Handle auto-navigation to first schema when no ID is present
  useEffect(() => {
    if (!loadingSchemas && !id && schemas.length > 0) {
      try {
        navigate(`/build/data/${schemas[0].id}`, { replace: true });
      } catch (err) {
        console.error('Navigation error:', err);
        setError(err instanceof Error ? err : new Error('Failed to navigate to schema'));
      }
    }
  }, [schemas, id, loadingSchemas, navigate]);

  // Handle save completion
  const handleSaveComplete = () => {
    // Could show a success toast or notification here
    console.log('Schema saved successfully');
  };

  // Handle cancel action
  const handleCancel = () => {
    // Navigate back to previous page or to a specific route
    navigate(-1);
  };

  // Handle schema selection
  const handleSelectSchema = (schemaId: string) => {
    navigate(`/build/data/${schemaId}`);
  };

  // Create a test schema
  const handleCreateTestSchema = async () => {
    try {
      setIsLoading(true);
      const testTables: SchemaTable[] = [
        {
          name: 'users',
          displayName: 'Users',
          description: 'User accounts',
          columns: [
            { 
              name: 'id', 
              displayName: 'ID',
              type: FIELD_TYPES.UUID, 
              nullable: false,
              isPrimary: true,
              comment: 'Unique identifier',
              default: 'gen_random_uuid()',
              required: true
            },
            { 
              name: 'username', 
              displayName: 'Username',
              type: FIELD_TYPES.TEXT, 
              nullable: false,
              comment: 'User login name',
              required: true
            },
            { 
              name: 'email', 
              displayName: 'Email Address',
              type: FIELD_TYPES.TEXT, 
              nullable: false,
              comment: 'Email address',
              required: true
            },
            { 
              name: 'created_at', 
              displayName: 'Created At',
              type: FIELD_TYPES.TIMESTAMP_TZ, 
              nullable: false,
              comment: 'Creation timestamp',
              default: 'NOW()',
              required: true
            }
          ],
          primaryKey: ['id']
        },
        {
          name: 'posts',
          displayName: 'Blog Posts',
          description: 'User blog posts',
          columns: [
            { 
              name: 'id', 
              displayName: 'ID',
              type: FIELD_TYPES.UUID, 
              nullable: false,
              isPrimary: true,
              comment: 'Unique identifier',
              default: 'gen_random_uuid()',
              required: true
            },
            { 
              name: 'title', 
              displayName: 'Title',
              type: FIELD_TYPES.TEXT, 
              nullable: false,
              comment: 'Post title',
              required: true
            },
            { 
              name: 'content', 
              displayName: 'Content',
              type: FIELD_TYPES.TEXT, 
              nullable: true,
              comment: 'Post content',
              required: false
            },
            { 
              name: 'user_id', 
              displayName: 'Author',
              type: FIELD_TYPES.REFERENCE, 
              nullable: false,
              reference: 'users',
              comment: 'Author reference',
              required: true
            },
            { 
              name: 'published', 
              displayName: 'Published',
              type: FIELD_TYPES.BOOLEAN, 
              nullable: false,
              comment: 'Publication status',
              default: 'false',
              required: true
            },
            { 
              name: 'created_at', 
              displayName: 'Created At',
              type: FIELD_TYPES.TIMESTAMP_TZ, 
              nullable: false,
              comment: 'Creation timestamp',
              default: 'NOW()',
              required: true
            }
          ],
          primaryKey: ['id'],
          foreignKeys: [
            {
              columns: ['user_id'],
              references: {
                table: 'users',
                columns: ['id']
              }
            }
          ]
        }
      ];
      
      const newSchema = await schemaService.createSchema('Test Schema', 'A schema for testing purposes', testTables);
      navigate(`/build/data/${newSchema.id}`);
    } catch (err) {
      console.error('Error creating test schema:', err);
      setError(err instanceof Error ? err : new Error('Failed to create test schema'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show error UI if we encountered an error
  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Schema</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <button 
          onClick={() => navigate('/build/data')}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Return to Data Model List
        </button>
      </div>
    );
  }

  // Show loading UI while schema is loading
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-gray-500">Loading Schema...</p>
        </div>
      </div>
    );
  }

  // If no schema ID is provided, show schema selector
  if (!id) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Data Model Schemas</h1>
        
        {loadingSchemas ? (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-500">Loading Schemas...</p>
          </div>
        ) : schemas.length > 0 ? (
          <div className="w-full max-w-md">
            <h2 className="mb-3 text-lg font-semibold text-gray-700">Select a Schema</h2>
            <ul className="mb-6 divide-y divide-gray-200 rounded-md border border-gray-200">
              {schemas.map(schema => (
                <li 
                  key={schema.id} 
                  className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                  onClick={() => handleSelectSchema(schema.id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{schema.name}</h3>
                    {schema.description && (
                      <p className="text-sm text-gray-500">{schema.description}</p>
                    )}
                  </div>
                  <span className="text-blue-500">→</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-gray-600">No schemas found. Create a test schema to get started.</p>
          </div>
        )}
        
        <button
          onClick={handleCreateTestSchema}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          disabled={isLoading}
        >
          Create Test Schema
        </button>
      </div>
    );
  }

  // Render schema editor with the specified ID
  return (
    <SchemaEditor 
      schemaId={id}
      allSchemas={schemas}
      onSave={handleSaveComplete}
      onCancel={handleCancel}
    />
  );
} 