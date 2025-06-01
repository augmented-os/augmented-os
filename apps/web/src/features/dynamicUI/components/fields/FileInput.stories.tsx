import type { Meta, StoryObj } from '@storybook/react';
import { FileInput } from './FileInput';

const meta: Meta<typeof FileInput> = {
  title: 'DynamicUI/Fields/FileInput',
  component: FileInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A drag-and-drop file input component with support for file type restrictions, multiple file selection, and visual upload feedback. Features accessible keyboard navigation and file validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the file input field',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the file input',
    },
    value: {
      control: false, // FileList is not easily controllable
      description: 'Current FileList value',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function called when files are selected',
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types or extensions)',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helpText: {
      control: 'text',
      description: 'Help text to guide the user',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock FileList for demonstration purposes
const createMockFileList = (files: Array<{ name: string; size: number; type: string }>): FileList => {
  const fileList = files.map(file => {
    const mockFile = new File(['mock content'], file.name, { type: file.type });
    Object.defineProperty(mockFile, 'size', { value: file.size });
    return mockFile;
  });
  
  const mockFileList = {
    length: fileList.length,
    item: (index: number) => fileList[index] || null,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < fileList.length; i++) {
        yield fileList[i];
      }
    }
  } as FileList;
  
  // Add array-like indexing
  fileList.forEach((file, index) => {
    Object.defineProperty(mockFileList, index, { value: file, enumerable: true });
  });
  
  return mockFileList;
};

export const Default: Story = {
  args: {
    id: 'document-upload',
    label: 'Upload Document',
    value: null,
  },
};

export const WithSingleFile: Story = {
  args: {
    id: 'avatar-upload',
    label: 'Profile Picture',
    value: createMockFileList([{ name: 'profile.jpg', size: 245760, type: 'image/jpeg' }]),
    accept: 'image/*',
    helpText: 'Upload a profile picture (JPG, PNG, or GIF)',
  },
};

export const WithMultipleFiles: Story = {
  args: {
    id: 'gallery-upload',
    label: 'Photo Gallery',
    value: createMockFileList([
      { name: 'vacation1.jpg', size: 1024000, type: 'image/jpeg' },
      { name: 'vacation2.png', size: 2048000, type: 'image/png' },
      { name: 'vacation3.gif', size: 512000, type: 'image/gif' },
    ]),
    accept: 'image/*',
    multiple: true,
    helpText: 'Upload multiple photos for your gallery',
  },
};

export const ImageOnly: Story = {
  args: {
    id: 'image-upload',
    label: 'Image Upload',
    value: null,
    accept: 'image/*',
    helpText: 'Only image files are accepted (JPG, PNG, GIF, WebP)',
  },
};

export const DocumentsOnly: Story = {
  args: {
    id: 'document-upload-pdf',
    label: 'Document Upload',
    value: null,
    accept: '.pdf,.doc,.docx,.txt',
    helpText: 'Upload documents (PDF, Word, or Text files)',
  },
};

export const WithError: Story = {
  args: {
    id: 'required-upload',
    label: 'Required File',
    value: null,
    required: true,
    error: 'Please select a file to upload',
  },
};

export const Required: Story = {
  args: {
    id: 'resume-upload',
    label: 'Resume Upload',
    value: null,
    accept: '.pdf,.doc,.docx',
    required: true,
    helpText: 'Upload your resume (PDF or Word document required)',
  },
};

export const MultipleRequired: Story = {
  args: {
    id: 'portfolio-upload',
    label: 'Portfolio Files',
    value: null,
    accept: 'image/*,.pdf',
    multiple: true,
    required: true,
    helpText: 'Upload your portfolio files (images and PDFs)',
  },
};

export const LargeFiles: Story = {
  args: {
    id: 'video-upload',
    label: 'Video Upload',
    value: createMockFileList([
      { name: 'presentation.mp4', size: 157286400, type: 'video/mp4' }, // ~150MB
    ]),
    accept: 'video/*',
    helpText: 'Upload video files (MP4, AVI, MOV)',
  },
};

export const ValidationError: Story = {
  args: {
    id: 'upload-validation-error',
    label: 'File Upload',
    value: createMockFileList([
      { name: 'large-file.zip', size: 52428800, type: 'application/zip' }, // 50MB
    ]),
    accept: 'image/*',
    error: 'File type not allowed. Please upload an image file.',
    helpText: 'Only image files under 10MB are allowed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of validation error when wrong file type is selected.',
      },
    },
  },
};

export const FileSizeVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <FileInput
        id="small-files"
        label="Small Files"
        value={createMockFileList([
          { name: 'small1.txt', size: 1024, type: 'text/plain' },
          { name: 'small2.txt', size: 2048, type: 'text/plain' },
        ])}
        onChange={() => {}}
        multiple
        helpText="Multiple small text files"
      />
      <FileInput
        id="medium-files"
        label="Medium Files"
        value={createMockFileList([
          { name: 'document.pdf', size: 1048576, type: 'application/pdf' }, // 1MB
        ])}
        onChange={() => {}}
        helpText="Medium-sized PDF document"
      />
      <FileInput
        id="large-files"
        label="Large Files"
        value={createMockFileList([
          { name: 'presentation.pptx', size: 20971520, type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }, // 20MB
        ])}
        onChange={() => {}}
        helpText="Large presentation file"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples showing different file sizes and how they are displayed.',
      },
    },
  },
};

export const FileTypeExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <FileInput
        id="images"
        label="Images"
        value={createMockFileList([
          { name: 'photo.jpg', size: 512000, type: 'image/jpeg' },
          { name: 'screenshot.png', size: 1024000, type: 'image/png' },
        ])}
        onChange={() => {}}
        accept="image/*"
        multiple
        helpText="Image files"
      />
      <FileInput
        id="documents"
        label="Documents"
        value={createMockFileList([
          { name: 'report.pdf', size: 2048000, type: 'application/pdf' },
        ])}
        onChange={() => {}}
        accept=".pdf"
        helpText="PDF documents only"
      />
      <FileInput
        id="spreadsheets"
        label="Spreadsheets"
        value={createMockFileList([
          { name: 'data.xlsx', size: 1536000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        ])}
        onChange={() => {}}
        accept=".xlsx,.xls,.csv"
        helpText="Excel or CSV files"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different file type restrictions and how they appear.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    id: 'empty-upload',
    label: 'File Upload',
    value: null,
    helpText: 'Drag and drop files here or click to browse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state showing drag and drop area.',
      },
    },
  },
}; 