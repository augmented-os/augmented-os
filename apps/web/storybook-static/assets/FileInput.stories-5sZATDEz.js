import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{r as ve}from"./index-B2-qRKKC.js";import{L as Fe}from"./label-BpIRGnnY.js";import{B as be}from"./button-jgCcTafx.js";import{c as D}from"./utils-fDSEsyX8.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const p=({id:l,label:n,value:o,onChange:t,accept:s,multiple:T=!1,required:w,error:c,helpText:M})=>{const d=ve.useRef(null),ge=a=>{const i=a.target.files;t(i)},fe=()=>{d.current&&(d.current.value=""),t(null)},xe=a=>{a.preventDefault(),a.stopPropagation()},he=a=>{a.preventDefault(),a.stopPropagation();const i=a.dataTransfer.files;i&&i.length>0&&(d.current&&(d.current.files=i),t(i))},ye=o&&o.length>0;return e.jsxs("div",{className:"space-y-2",children:[e.jsx(Fe,{htmlFor:l,className:D("text-sm font-medium text-foreground",w&&"after:content-['*'] after:ml-1 after:text-destructive"),children:n}),e.jsxs("div",{className:D("relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer",c?"border-destructive bg-destructive/5":"border-input hover:border-accent-foreground hover:bg-accent/5","focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"),onDragOver:xe,onDrop:he,onClick:()=>{var a;return(a=d.current)==null?void 0:a.click()},"aria-describedby":c?`${l}-error`:M?`${l}-help`:void 0,children:[e.jsx("input",{ref:d,id:l,type:"file",onChange:ge,required:w,accept:s,multiple:T,className:"hidden"}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("svg",{className:"mx-auto h-12 w-12 text-muted-foreground",stroke:"currentColor",fill:"none",viewBox:"0 0 48 48",children:e.jsx("path",{d:"M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),ye?e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-sm text-foreground",children:[o.length," file",o.length!==1?"s":""," selected"]}),e.jsx("div",{className:"text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto",children:Array.from(o).map((a,i)=>e.jsxs("div",{className:"truncate",children:[a.name," (",(a.size/1024).toFixed(1)," KB)"]},i))}),e.jsx(be,{type:"button",variant:"outline",size:"sm",onClick:a=>{a.stopPropagation(),fe()},className:"mt-2",children:"Clear files"})]}):e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-sm text-foreground",children:[e.jsx("span",{className:"font-medium text-primary",children:"Click to upload"})," or drag and drop"]}),s&&e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Accepted: ",s]}),T&&e.jsx("p",{className:"text-xs text-muted-foreground",children:"Multiple files allowed"})]})]})]}),c&&e.jsx("div",{id:`${l}-error`,className:"text-sm text-destructive",role:"alert",children:c}),M&&!c&&e.jsx("div",{id:`${l}-help`,className:"text-sm text-muted-foreground",children:M})]})},Ue={title:"DynamicUI/Fields/FileInput",component:p,parameters:{layout:"centered",docs:{description:{component:"A drag-and-drop file input component with support for file type restrictions, multiple file selection, and visual upload feedback. Features accessible keyboard navigation and file validation."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the file input field"},label:{control:"text",description:"Label text displayed above the file input"},value:{control:!1,description:"Current FileList value"},onChange:{action:"changed",description:"Callback function called when files are selected"},accept:{control:"text",description:"Accepted file types (MIME types or extensions)"},multiple:{control:"boolean",description:"Allow multiple file selection"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[l=>e.jsx("div",{className:"max-w-md",children:e.jsx(l,{})})]},r=l=>{const n=l.map(t=>{const s=new File(["mock content"],t.name,{type:t.type});return Object.defineProperty(s,"size",{value:t.size}),s}),o={length:n.length,item:t=>n[t]||null,[Symbol.iterator]:function*(){for(let t=0;t<n.length;t++)yield n[t]}};return n.forEach((t,s)=>{Object.defineProperty(o,s,{value:t,enumerable:!0})}),o},m={args:{id:"document-upload",label:"Upload Document",value:null}},u={args:{id:"avatar-upload",label:"Profile Picture",value:r([{name:"profile.jpg",size:245760,type:"image/jpeg"}]),accept:"image/*",helpText:"Upload a profile picture (JPG, PNG, or GIF)"}},g={args:{id:"gallery-upload",label:"Photo Gallery",value:r([{name:"vacation1.jpg",size:1024e3,type:"image/jpeg"},{name:"vacation2.png",size:2048e3,type:"image/png"},{name:"vacation3.gif",size:512e3,type:"image/gif"}]),accept:"image/*",multiple:!0,helpText:"Upload multiple photos for your gallery"}},f={args:{id:"image-upload",label:"Image Upload",value:null,accept:"image/*",helpText:"Only image files are accepted (JPG, PNG, GIF, WebP)"}},x={args:{id:"document-upload-pdf",label:"Document Upload",value:null,accept:".pdf,.doc,.docx,.txt",helpText:"Upload documents (PDF, Word, or Text files)"}},h={args:{id:"required-upload",label:"Required File",value:null,required:!0,error:"Please select a file to upload"}},y={args:{id:"resume-upload",label:"Resume Upload",value:null,accept:".pdf,.doc,.docx",required:!0,helpText:"Upload your resume (PDF or Word document required)"}},v={args:{id:"portfolio-upload",label:"Portfolio Files",value:null,accept:"image/*,.pdf",multiple:!0,required:!0,helpText:"Upload your portfolio files (images and PDFs)"}},F={args:{id:"video-upload",label:"Video Upload",value:r([{name:"presentation.mp4",size:157286400,type:"video/mp4"}]),accept:"video/*",helpText:"Upload video files (MP4, AVI, MOV)"}},b={args:{id:"upload-validation-error",label:"File Upload",value:r([{name:"large-file.zip",size:52428800,type:"application/zip"}]),accept:"image/*",error:"File type not allowed. Please upload an image file.",helpText:"Only image files under 10MB are allowed"},parameters:{docs:{description:{story:"Example of validation error when wrong file type is selected."}}}},j={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(p,{id:"small-files",label:"Small Files",value:r([{name:"small1.txt",size:1024,type:"text/plain"},{name:"small2.txt",size:2048,type:"text/plain"}]),onChange:()=>{},multiple:!0,helpText:"Multiple small text files"}),e.jsx(p,{id:"medium-files",label:"Medium Files",value:r([{name:"document.pdf",size:1048576,type:"application/pdf"}]),onChange:()=>{},helpText:"Medium-sized PDF document"}),e.jsx(p,{id:"large-files",label:"Large Files",value:r([{name:"presentation.pptx",size:20971520,type:"application/vnd.openxmlformats-officedocument.presentationml.presentation"}]),onChange:()=>{},helpText:"Large presentation file"})]}),parameters:{docs:{description:{story:"Examples showing different file sizes and how they are displayed."}}}},z={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(p,{id:"images",label:"Images",value:r([{name:"photo.jpg",size:512e3,type:"image/jpeg"},{name:"screenshot.png",size:1024e3,type:"image/png"}]),onChange:()=>{},accept:"image/*",multiple:!0,helpText:"Image files"}),e.jsx(p,{id:"documents",label:"Documents",value:r([{name:"report.pdf",size:2048e3,type:"application/pdf"}]),onChange:()=>{},accept:".pdf",helpText:"PDF documents only"}),e.jsx(p,{id:"spreadsheets",label:"Spreadsheets",value:r([{name:"data.xlsx",size:1536e3,type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}]),onChange:()=>{},accept:".xlsx,.xls,.csv",helpText:"Excel or CSV files"})]}),parameters:{docs:{description:{story:"Examples of different file type restrictions and how they appear."}}}},P={args:{id:"empty-upload",label:"File Upload",value:null,helpText:"Drag and drop files here or click to browse"},parameters:{docs:{description:{story:"Default empty state showing drag and drop area."}}}};var U,k,L;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    id: 'document-upload',
    label: 'Upload Document',
    value: null
  }
}`,...(L=(k=m.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};var N,S,I;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(I=(S=u.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var C,E,q;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(q=(E=g.parameters)==null?void 0:E.docs)==null?void 0:q.source}}};var O,G,W;f.parameters={...f.parameters,docs:{...(O=f.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    id: 'image-upload',
    label: 'Image Upload',
    value: null,
    accept: 'image/*',
    helpText: 'Only image files are accepted (JPG, PNG, GIF, WebP)'
  }
}`,...(W=(G=f.parameters)==null?void 0:G.docs)==null?void 0:W.source}}};var V,R,B;x.parameters={...x.parameters,docs:{...(V=x.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    id: 'document-upload-pdf',
    label: 'Document Upload',
    value: null,
    accept: '.pdf,.doc,.docx,.txt',
    helpText: 'Upload documents (PDF, Word, or Text files)'
  }
}`,...(B=(R=x.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};var A,J,$;h.parameters={...h.parameters,docs:{...(A=h.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    id: 'required-upload',
    label: 'Required File',
    value: null,
    required: true,
    error: 'Please select a file to upload'
  }
}`,...($=(J=h.parameters)==null?void 0:J.docs)==null?void 0:$.source}}};var H,_,K;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    id: 'resume-upload',
    label: 'Resume Upload',
    value: null,
    accept: '.pdf,.doc,.docx',
    required: true,
    helpText: 'Upload your resume (PDF or Word document required)'
  }
}`,...(K=(_=y.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};var Q,X,Y;v.parameters={...v.parameters,docs:{...(Q=v.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    id: 'portfolio-upload',
    label: 'Portfolio Files',
    value: null,
    accept: 'image/*,.pdf',
    multiple: true,
    required: true,
    helpText: 'Upload your portfolio files (images and PDFs)'
  }
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;F.parameters={...F.parameters,docs:{...(Z=F.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ae=(ee=F.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var te,le,re;b.parameters={...b.parameters,docs:{...(te=b.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(re=(le=b.parameters)==null?void 0:le.docs)==null?void 0:re.source}}};var oe,se,ie;j.parameters={...j.parameters,docs:{...(oe=j.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ie=(se=j.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var ne,pe,de;z.parameters={...z.parameters,docs:{...(ne=z.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(de=(pe=z.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};var ce,me,ue;P.parameters={...P.parameters,docs:{...(ce=P.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(ue=(me=P.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};const ke=["Default","WithSingleFile","WithMultipleFiles","ImageOnly","DocumentsOnly","WithError","Required","MultipleRequired","LargeFiles","ValidationError","FileSizeVariations","FileTypeExamples","EmptyState"];export{m as Default,x as DocumentsOnly,P as EmptyState,j as FileSizeVariations,z as FileTypeExamples,f as ImageOnly,F as LargeFiles,v as MultipleRequired,y as Required,b as ValidationError,h as WithError,g as WithMultipleFiles,u as WithSingleFile,ke as __namedExportsOrder,Ue as default};
