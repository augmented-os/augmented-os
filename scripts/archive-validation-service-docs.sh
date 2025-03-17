#!/bin/bash

# Script to archive original Validation Service documentation
# Usage: ./archive-validation-service-docs.sh

# Variables
ARCHIVE_DIR="docs/archive/validation_service"
ORIGINAL_FILE="docs/architecture/components/validation_service.md"
MIGRATION_DATE=$(date +"%Y-%m-%d")
ARCHIVE_NOTICE="# ARCHIVED: Validation Service Documentation\n\nThis document has been migrated to the standardized component documentation structure.\n\nArchive Date: $MIGRATION_DATE\n\nPlease refer to the new documentation at: docs/architecture/components/validation_service/\n\n---\n\n"

# Create archive directory if it doesn't exist
mkdir -p "$ARCHIVE_DIR"

# Check if original file exists
if [ ! -f "$ORIGINAL_FILE" ]; then
  echo "Error: Original file $ORIGINAL_FILE does not exist!"
  exit 1
fi

# Create archive file with notice
echo -e "$ARCHIVE_NOTICE" > "$ARCHIVE_DIR/validation_service.md"
cat "$ORIGINAL_FILE" >> "$ARCHIVE_DIR/validation_service.md"

# Create a placeholder in the original location
echo -e "$ARCHIVE_NOTICE\nThis file has been archived. Please see the new documentation structure at: docs/architecture/components/validation_service/" > "$ORIGINAL_FILE.archived"

echo "Original file archived at: $ARCHIVE_DIR/validation_service.md"
echo "Placeholder created at: $ORIGINAL_FILE.archived"
echo "To complete the archiving process, rename $ORIGINAL_FILE.archived to $ORIGINAL_FILE after verification"

exit 0 