import Handlebars from 'handlebars';

export const renderTemplate = (template: string, data: Record<string, unknown>): string => {
  try {
    // Use Handlebars for complex template features like #each and #if
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(data);
  } catch (error) {
    console.warn('Handlebars template error:', error);
    
    // Fallback to simple regex replacement for basic templates
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      try {
        const value = evaluateExpression(expression.trim(), data);
        return value?.toString() || '';
      } catch (evalError) {
        console.warn(`Template expression error: ${expression}`, evalError);
        return match; // Return original if evaluation fails
      }
    });
  }
};

const evaluateExpression = (expression: string, data: Record<string, unknown>): unknown => {
  // Handle simple property access (e.g., "user.name", "amount")
  const keys = expression.split('.');
  let value: unknown = data;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}; 