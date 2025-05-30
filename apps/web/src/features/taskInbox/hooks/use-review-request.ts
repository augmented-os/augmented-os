import { useState } from 'react';
import { TableDataItem } from '../types';

export interface ReviewRequestFormData {
  taskId: number | null;
  reviewerId: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  dueDate: string | null;
  taskTitle: string;
}

// Initial empty form data
const initialFormData: ReviewRequestFormData = {
  taskId: null,
  reviewerId: '',
  priority: 'Medium',
  notes: '',
  dueDate: null,
  taskTitle: 'Unknown Task',
};

/**
 * Hook for generating review request messages (universal function)
 */
export function useReviewRequest() {
  // Track if the form is visible
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Track form data
  const [formData, setFormData] = useState<ReviewRequestFormData>(initialFormData);
  
  // Track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Show the review request form for a specific task
  const showReviewRequestForm = (task: TableDataItem) => {
    setFormData({
      ...initialFormData,
      taskId: typeof task.id === 'number' ? task.id : 0,
      taskTitle: typeof task.title === 'string' ? task.title : 'Unknown Task',
    });
    setIsFormVisible(true);
  };
  
  // Hide the review request form
  const hideReviewRequestForm = () => {
    setIsFormVisible(false);
  };
  
  // Update form field values
  const updateFormField = <K extends keyof ReviewRequestFormData>(
    field: K,
    value: ReviewRequestFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
  };
  
  // Submit the review request
  const submitReviewRequest = async () => {
    try {
      setIsSubmitting(true);
      
      // In a real application, this would be an API call
      // For now, simulate a network request with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful submission, reset and hide the form
      resetForm();
      hideReviewRequestForm();
      
      return true;
    } catch (error) {
      console.error('Error submitting review request:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateReviewMessage = (data: TableDataItem): string => {
    const title = typeof data.title === 'string' ? data.title : 'Task';
    const company = typeof data.company === 'string' ? data.company : 'Unknown Company';
    
    // Count problematic items in nested data
    let problematicCount = 0;
    if (Array.isArray(data.extractedTerms)) {
      const terms = data.extractedTerms as Array<Record<string, unknown>>;
      problematicCount = terms.filter(term => {
        const status = term.status;
        return typeof status === 'string' && 
               (status === 'Non-standard' || status === 'Problematic' || status === 'Violation');
      }).length;
    }
    
    const baseMessage = `Please review the ${title} for ${company}.`;
    
    if (problematicCount > 0) {
      return `${baseMessage} There ${problematicCount === 1 ? 'is' : 'are'} ${problematicCount} item${problematicCount === 1 ? '' : 's'} that require${problematicCount === 1 ? 's' : ''} attention.`;
    }
    
    return baseMessage;
  };

  return {
    isFormVisible,
    formData,
    isSubmitting,
    showReviewRequestForm,
    hideReviewRequestForm,
    updateFormField,
    resetForm,
    submitReviewRequest,
    generateReviewMessage
  };
} 