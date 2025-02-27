# \[Schema Name\]

## Overview

\[Brief description of the schema and its purpose in the system. Include key characteristics and design principles.\]

## Schema Structure

```json
{
  "field1": "string",  // Description of field1
  "field2": {          // Description of field2
    "subfield1": "number",
    "subfield2": "boolean"
  },
  "field3": [          // Description of field3
    {
      "arrayField1": "string",
      "arrayField2": "number"
    }
  ]
}
```

## Field Definitions

| Field | Type | Required | Description |
|----|----|----|----|
| field1 | string | Yes | \[Detailed description of field1\] |
| field2.subfield1 | number | No | \[Detailed description of subfield1\] |
| field2.subfield2 | boolean | Yes | \[Detailed description of subfield2\] |
| field3\[\].arrayField1 | string | Yes | \[Detailed description of arrayField1\] |
| field3\[\].arrayField2 | number | No | \[Detailed description of arrayField2\] |

## Validation Rules

\[Description of validation rules that apply to this schema.\]

* Rule 1: \[Description of rule 1\]
* Rule 2: \[Description of rule 2\]
* Rule 3: \[Description of rule 3\]

## Examples

### Basic Example

```json
{
  "field1": "example value",
  "field2": {
    "subfield1": 42,
    "subfield2": true
  },
  "field3": [
    {
      "arrayField1": "item 1",
      "arrayField2": 1
    }
  ]
}
```

\[Explanation of the basic example.\]

### Complex Example

```json
{
  "field1": "complex example",
  "field2": {
    "subfield1": 100,
    "subfield2": false
  },
  "field3": [
    {
      "arrayField1": "item 1",
      "arrayField2": 1
    },
    {
      "arrayField1": "item 2",
      "arrayField2": 2
    }
  ]
}
```

\[Explanation of the complex example.\]

## Database Schema

**Table: \[table_name\]**

| Column | Type | Nullable | Default | Description |
|----|----|----|----|----|
| id | UUID | No | gen_random_uuid() | Primary key |
| \[business_id\] | VARCHAR(255) | No |    | Unique business identifier |
| field1 | VARCHAR(255) | No |    | \[Description\] |
| field2 | JSONB | No | '{}' | \[Description\] |
| field3 | JSONB | Yes | NULL | \[Description\] |
| created_at | TIMESTAMP | No | NOW() | Creation timestamp |
| updated_at | TIMESTAMP | No | NOW() | Last update timestamp |
| version | VARCHAR(50) | No | '1.0.0' | Schema version |

**Indexes:**

* `[table_name]_pkey` PRIMARY KEY on `id`
* `[table_name]_business_id_idx` UNIQUE on `[business_id]`
* `[table_name]_field1_idx` on `field1` (for filtering)

## Related Components

* [Component 1](../architecture/components/component1.md) - \[Brief description of relationship\]
* [Component 2](../architecture/components/component2.md) - \[Brief description of relationship\]

## Version History

| Version | Date | Changes |
|----|----|----|
| 1.0.0 | YYYY-MM-DD | Initial version |
| 1.1.0 | YYYY-MM-DD | \[Description of changes\] |


