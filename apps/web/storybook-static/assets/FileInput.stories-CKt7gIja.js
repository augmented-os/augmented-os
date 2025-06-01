import{j as a}from"./jsx-runtime-BT65X5dW.js";import{F as t}from"./FileInput-ltJkPhXW.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./utils-CytzSlOG.js";import"./button-DTZ1A7rA.js";const fe={title:"Dynamic UI/Atomic Components/Form Fields/File Input",component:t,parameters:{layout:"centered",docs:{description:{component:"A drag-and-drop file input component with support for file type restrictions, multiple file selection, and visual upload feedback. Features accessible keyboard navigation and file validation."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the file input field"},label:{control:"text",description:"Label text displayed above the file input"},value:{control:!1,description:"Current FileList value"},onChange:{action:"changed",description:"Callback function called when files are selected"},accept:{control:"text",description:"Accepted file types (MIME types or extensions)"},multiple:{control:"boolean",description:"Allow multiple file selection"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[v=>a.jsx("div",{className:"max-w-md",children:a.jsx(v,{})})]},l=v=>{const r=v.map(e=>{const o=new File(["mock content"],e.name,{type:e.type});return Object.defineProperty(o,"size",{value:e.size}),o}),F={length:r.length,item:e=>r[e]||null,[Symbol.iterator]:function*(){for(let e=0;e<r.length;e++)yield r[e]}};return r.forEach((e,o)=>{Object.defineProperty(F,o,{value:e,enumerable:!0})}),F},i={args:{id:"document-upload",label:"Upload Document",value:null}},n={args:{id:"avatar-upload",label:"Profile Picture",value:l([{name:"profile.jpg",size:245760,type:"image/jpeg"}]),accept:"image/*",helpText:"Upload a profile picture (JPG, PNG, or GIF)"}},s={args:{id:"gallery-upload",label:"Photo Gallery",value:l([{name:"vacation1.jpg",size:1024e3,type:"image/jpeg"},{name:"vacation2.png",size:2048e3,type:"image/png"},{name:"vacation3.gif",size:512e3,type:"image/gif"}]),accept:"image/*",multiple:!0,helpText:"Upload multiple photos for your gallery"}},p={args:{id:"image-upload",label:"Image Upload",value:null,accept:"image/*",helpText:"Only image files are accepted (JPG, PNG, GIF, WebP)"}},d={args:{id:"document-upload-pdf",label:"Document Upload",value:null,accept:".pdf,.doc,.docx,.txt",helpText:"Upload documents (PDF, Word, or Text files)"}},c={args:{id:"required-upload",label:"Required File",value:null,required:!0,error:"Please select a file to upload"}},m={args:{id:"resume-upload",label:"Resume Upload",value:null,accept:".pdf,.doc,.docx",required:!0,helpText:"Upload your resume (PDF or Word document required)"}},u={args:{id:"portfolio-upload",label:"Portfolio Files",value:null,accept:"image/*,.pdf",multiple:!0,required:!0,helpText:"Upload your portfolio files (images and PDFs)"}},g={args:{id:"video-upload",label:"Video Upload",value:l([{name:"presentation.mp4",size:157286400,type:"video/mp4"}]),accept:"video/*",helpText:"Upload video files (MP4, AVI, MOV)"}},f={args:{id:"upload-validation-error",label:"File Upload",value:l([{name:"large-file.zip",size:52428800,type:"application/zip"}]),accept:"image/*",error:"File type not allowed. Please upload an image file.",helpText:"Only image files under 10MB are allowed"},parameters:{docs:{description:{story:"Example of validation error when wrong file type is selected."}}}},h={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsx(t,{id:"small-files",label:"Small Files",value:l([{name:"small1.txt",size:1024,type:"text/plain"},{name:"small2.txt",size:2048,type:"text/plain"}]),onChange:()=>{},multiple:!0,helpText:"Multiple small text files"}),a.jsx(t,{id:"medium-files",label:"Medium Files",value:l([{name:"document.pdf",size:1048576,type:"application/pdf"}]),onChange:()=>{},helpText:"Medium-sized PDF document"}),a.jsx(t,{id:"large-files",label:"Large Files",value:l([{name:"presentation.pptx",size:20971520,type:"application/vnd.openxmlformats-officedocument.presentationml.presentation"}]),onChange:()=>{},helpText:"Large presentation file"})]}),parameters:{docs:{description:{story:"Examples showing different file sizes and how they are displayed."}}}},x={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsx(t,{id:"images",label:"Images",value:l([{name:"photo.jpg",size:512e3,type:"image/jpeg"},{name:"screenshot.png",size:1024e3,type:"image/png"}]),onChange:()=>{},accept:"image/*",multiple:!0,helpText:"Image files"}),a.jsx(t,{id:"documents",label:"Documents",value:l([{name:"report.pdf",size:2048e3,type:"application/pdf"}]),onChange:()=>{},accept:".pdf",helpText:"PDF documents only"}),a.jsx(t,{id:"spreadsheets",label:"Spreadsheets",value:l([{name:"data.xlsx",size:1536e3,type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}]),onChange:()=>{},accept:".xlsx,.xls,.csv",helpText:"Excel or CSV files"})]}),parameters:{docs:{description:{story:"Examples of different file type restrictions and how they appear."}}}},y={args:{id:"empty-upload",label:"File Upload",value:null,helpText:"Drag and drop files here or click to browse"},parameters:{docs:{description:{story:"Default empty state showing drag and drop area."}}}};var b,z,P;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'document-upload',
    label: 'Upload Document',
    value: null
  }
}`,...(P=(z=i.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var T,M,U;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'avatar-upload',
    label: 'Profile Picture',
    value: createMockFileList([{
      name: 'profile.jpg',
      size: 245760,
      type: 'image/jpeg'
    }]),
    accept: 'image/*',
    helpText: 'Upload a profile picture (JPG, PNG, or GIF)'
  }
}`,...(U=(M=n.parameters)==null?void 0:M.docs)==null?void 0:U.source}}};var j,S,D;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    id: 'gallery-upload',
    label: 'Photo Gallery',
    value: createMockFileList([{
      name: 'vacation1.jpg',
      size: 1024000,
      type: 'image/jpeg'
    }, {
      name: 'vacation2.png',
      size: 2048000,
      type: 'image/png'
    }, {
      name: 'vacation3.gif',
      size: 512000,
      type: 'image/gif'
    }]),
    accept: 'image/*',
    multiple: true,
    helpText: 'Upload multiple photos for your gallery'
  }
}`,...(D=(S=s.parameters)==null?void 0:S.docs)==null?void 0:D.source}}};var I,w,E;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    id: 'image-upload',
    label: 'Image Upload',
    value: null,
    accept: 'image/*',
    helpText: 'Only image files are accepted (JPG, PNG, GIF, WebP)'
  }
}`,...(E=(w=p.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var L,k,q;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'document-upload-pdf',
    label: 'Document Upload',
    value: null,
    accept: '.pdf,.doc,.docx,.txt',
    helpText: 'Upload documents (PDF, Word, or Text files)'
  }
}`,...(q=(k=d.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var C,G,O;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: 'required-upload',
    label: 'Required File',
    value: null,
    required: true,
    error: 'Please select a file to upload'
  }
}`,...(O=(G=c.parameters)==null?void 0:G.docs)==null?void 0:O.source}}};var W,V,N;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'resume-upload',
    label: 'Resume Upload',
    value: null,
    accept: '.pdf,.doc,.docx',
    required: true,
    helpText: 'Upload your resume (PDF or Word document required)'
  }
}`,...(N=(V=m.parameters)==null?void 0:V.docs)==null?void 0:N.source}}};var R,A,B;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    id: 'portfolio-upload',
    label: 'Portfolio Files',
    value: null,
    accept: 'image/*,.pdf',
    multiple: true,
    required: true,
    helpText: 'Upload your portfolio files (images and PDFs)'
  }
}`,...(B=(A=u.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var J,_,H;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    id: 'video-upload',
    label: 'Video Upload',
    value: createMockFileList([{
      name: 'presentation.mp4',
      size: 157286400,
      type: 'video/mp4'
    } // ~150MB
    ]),
    accept: 'video/*',
    helpText: 'Upload video files (MP4, AVI, MOV)'
  }
}`,...(H=(_=g.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var K,Q,X;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    id: 'upload-validation-error',
    label: 'File Upload',
    value: createMockFileList([{
      name: 'large-file.zip',
      size: 52428800,
      type: 'application/zip'
    } // 50MB
    ]),
    accept: 'image/*',
    error: 'File type not allowed. Please upload an image file.',
    helpText: 'Only image files under 10MB are allowed'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of validation error when wrong file type is selected.'
      }
    }
  }
}`,...(X=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,$;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <FileInput id="small-files" label="Small Files" value={createMockFileList([{
      name: 'small1.txt',
      size: 1024,
      type: 'text/plain'
    }, {
      name: 'small2.txt',
      size: 2048,
      type: 'text/plain'
    }])} onChange={() => {}} multiple helpText="Multiple small text files" />
      <FileInput id="medium-files" label="Medium Files" value={createMockFileList([{
      name: 'document.pdf',
      size: 1048576,
      type: 'application/pdf'
    } // 1MB
    ])} onChange={() => {}} helpText="Medium-sized PDF document" />
      <FileInput id="large-files" label="Large Files" value={createMockFileList([{
      name: 'presentation.pptx',
      size: 20971520,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    } // 20MB
    ])} onChange={() => {}} helpText="Large presentation file" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Examples showing different file sizes and how they are displayed.'
      }
    }
  }
}`,...($=(Z=h.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,le;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <FileInput id="images" label="Images" value={createMockFileList([{
      name: 'photo.jpg',
      size: 512000,
      type: 'image/jpeg'
    }, {
      name: 'screenshot.png',
      size: 1024000,
      type: 'image/png'
    }])} onChange={() => {}} accept="image/*" multiple helpText="Image files" />
      <FileInput id="documents" label="Documents" value={createMockFileList([{
      name: 'report.pdf',
      size: 2048000,
      type: 'application/pdf'
    }])} onChange={() => {}} accept=".pdf" helpText="PDF documents only" />
      <FileInput id="spreadsheets" label="Spreadsheets" value={createMockFileList([{
      name: 'data.xlsx',
      size: 1536000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }])} onChange={() => {}} accept=".xlsx,.xls,.csv" helpText="Excel or CSV files" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Examples of different file type restrictions and how they appear.'
      }
    }
  }
}`,...(le=(ae=x.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};var te,re,oe;y.parameters={...y.parameters,docs:{...(te=y.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    id: 'empty-upload',
    label: 'File Upload',
    value: null,
    helpText: 'Drag and drop files here or click to browse'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state showing drag and drop area.'
      }
    }
  }
}`,...(oe=(re=y.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};const he=["Default","WithSingleFile","WithMultipleFiles","ImageOnly","DocumentsOnly","WithError","Required","MultipleRequired","LargeFiles","ValidationError","FileSizeVariations","FileTypeExamples","EmptyState"];export{i as Default,d as DocumentsOnly,y as EmptyState,h as FileSizeVariations,x as FileTypeExamples,p as ImageOnly,g as LargeFiles,u as MultipleRequired,m as Required,f as ValidationError,c as WithError,s as WithMultipleFiles,n as WithSingleFile,he as __namedExportsOrder,fe as default};
