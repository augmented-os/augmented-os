// conditions.ts
export const evaluateCondition = (condition: string, formData: Record<string, any>): boolean => {
  try {
    // Simple condition evaluation for MVP
    // Supports: fieldName === 'value', fieldName !== 'value', uiState.property, !uiState.property
    
    if (condition.includes('===')) {
      const [field, value] = condition.split('===').map(s => s.trim());
      const fieldValue = getFieldValue(field, formData);
      const expectedValue = value.replace(/['"]/g, ''); // Remove quotes
      return fieldValue === expectedValue;
    }
    
    if (condition.includes('!==')) {
      const [field, value] = condition.split('!==').map(s => s.trim());
      const fieldValue = getFieldValue(field, formData);
      const expectedValue = value.replace(/['"]/g, '');
      return fieldValue !== expectedValue;
    }
    
    // Handle negation (e.g., !uiState.showReviewForm)
    if (condition.startsWith('!')) {
      const fieldPath = condition.substring(1).trim();
      return !getFieldValue(fieldPath, formData);
    }
    
    // Default: treat as field name, check if truthy
    return !!getFieldValue(condition, formData);
    
  } catch (error) {
    console.warn(`Condition evaluation error: ${condition}`, error);
    return false;
  }
};

const getFieldValue = (fieldPath: string, data: Record<string, any>): any => {
  // Handle nested object access (e.g., "uiState.showReviewForm")
  const keys = fieldPath.split('.');
  let value = data;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}; 