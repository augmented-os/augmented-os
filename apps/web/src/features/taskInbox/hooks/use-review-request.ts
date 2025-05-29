import { useState } from 'react';
import { Task } from '../types';

export interface ReviewRequestFormData {
  taskId: number | null;
  reviewerId: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  dueDate: string | null;
}

// Initial empty form data
const initialFormData: ReviewRequestFormData = {
  taskId: null,
  reviewerId: '',
  priority: 'Medium',
  notes: '',
  dueDate: null,
};

export function useReviewRequest() {
  // Track if the form is visible
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Track form data
  const [formData, setFormData] = useState<ReviewRequestFormData>(initialFormData);
  
  // Track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Show the review request form for a specific task
  const showReviewRequestForm = (task: Task) => {
    setFormData({
      ...initialFormData,
      taskId: task.id,
      // Default due date to task's due date if available
      dueDate: task.dueDate || null,
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
  
  return {
    isFormVisible,
    formData,
    isSubmitting,
    showReviewRequestForm,
    hideReviewRequestForm,
    updateFormField,
    resetForm,
    submitReviewRequest,
  };
} 