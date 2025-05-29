import { useState, useEffect, useCallback } from 'react';
import { useWorkflowUIMode } from './use-workflow-ui-mode';

/**
 * A hook for config panel sections to interact with the global UI state machine.
 * Handles section-level editing state and coordinates with other sections.
 * 
 * @param sectionId Unique identifier for this section (e.g., 'generalProperties', 'dataStoreConfig')
 * @param elementId ID of the currently selected element this section is editing
 * @returns Object with editing state and functions to control it
 */
export function useConfigSection(sectionId: string, elementId: string) {
  const {
    uiMode,
    startEditingSection,
    finishEditingSection,
    // Remove dependency on these potentially unstable function references
    // isSectionBeingEdited,
    // isAnySectionBeingEdited
  } = useWorkflowUIMode();
  
  // Derive state DIRECTLY from uiMode state object
  const isEditing = uiMode.type === 'CONFIGURING' && 
                  uiMode.section === sectionId && 
                  uiMode.elementId === elementId; // Also check elementId for safety
                  
  const isDisabled = uiMode.type === 'CONFIGURING' && 
                   !!uiMode.section && // A section is being edited
                   uiMode.section !== sectionId; // But it's not this section

  // Log the derived values
  console.log(`[useConfigSection - ${sectionId}] elementId: ${elementId}, Direct uiMode check: isEditing=${isEditing}, isDisabled=${isDisabled}`);

  // Start editing this section (Keep existing useCallback)
  const startEditing = useCallback(() => {
    startEditingSection(elementId, sectionId);
  }, [elementId, sectionId, startEditingSection]);
  
  // Stop editing this section (Keep existing useCallback)
  const stopEditing = useCallback(() => {
    finishEditingSection();
  }, [finishEditingSection]);
  
  // Remove previous calculation using potentially unstable function references
  // const calculatedIsDisabled = isAnySectionBeingEdited(sectionId);
  // const calculatedIsEditing = isSectionBeingEdited(sectionId);
  // console.log(`[useConfigSection - ${sectionId}] elementId: ${elementId}, isEditing: ${calculatedIsEditing}, calculatedIsDisabled: ${calculatedIsDisabled}`);
  
  return {
    isEditing, // Return directly derived value
    isDisabled, // Return directly derived value
    startEditing,
    stopEditing,
    // Remove exposing potentially unstable functions
    // isSectionBeingEdited,
    // isAnySectionBeingEdited
  };
} 