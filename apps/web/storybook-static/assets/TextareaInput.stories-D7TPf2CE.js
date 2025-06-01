import{j as l}from"./jsx-runtime-CmtfZKef.js";import{T as R}from"./TextareaInput-d_sTEtii.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";const M={title:"Dynamic UI/Atomic Components/Form Fields/Textarea Input",component:R,parameters:{layout:"centered",docs:{description:{component:"A multi-line textarea input component for longer text content with support for validation, error states, and help text. Features resizable height."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the textarea field"},label:{control:"text",description:"Label text displayed above the textarea"},value:{control:"text",description:"Current text value of the textarea"},onChange:{action:"changed",description:"Callback function called when textarea value changes"},placeholder:{control:"text",description:"Placeholder text shown when textarea is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[I=>l.jsx("div",{className:"max-w-md",children:l.jsx(I,{})})]},e={args:{id:"description",label:"Description",value:"",placeholder:"Enter a detailed description"}},r={args:{id:"comments",label:"Comments",value:"This is a sample comment that demonstrates how the textarea looks with some content. It can span multiple lines and provides enough space for longer text input.",placeholder:"Share your thoughts"}},t={args:{id:"feedback-error",label:"Feedback",value:"",placeholder:"Please provide your feedback",required:!0,error:"Feedback is required to submit your review"}},a={args:{id:"message-required",label:"Message",value:"",placeholder:"Type your message here",required:!0,helpText:"Please provide a detailed message for our support team"}},o={args:{id:"project-details",label:"Project Details",value:"",placeholder:"Describe your project requirements, timeline, and any specific needs",helpText:"Include as much detail as possible to help us understand your project scope and requirements"}},s={args:{id:"article",label:"Article Content",value:`This is a longer text example that demonstrates how the textarea component handles substantial content. The textarea is designed to be resizable, allowing users to adjust the height as needed for their content.

You can include multiple paragraphs, line breaks, and various types of content. The component maintains proper formatting and provides a good user experience even with longer text.

This flexibility makes it suitable for various use cases like blog posts, comments, feedback forms, and any other scenario where users need to input substantial amounts of text.`,placeholder:"Write your article content",helpText:"You can write as much as you need - the textarea will resize automatically"}},n={args:{id:"notes",label:"Quick Notes",value:"",placeholder:"Add notes...",helpText:"Brief notes or reminders"}},i={args:{id:"review",label:"Product Review",value:"Too short",placeholder:"Write a detailed review of the product",error:"Review must be at least 50 characters long",helpText:"Please provide a detailed review to help other customers"},parameters:{docs:{description:{story:"Example of how validation errors would be displayed for minimum content length requirements."}}}};var d,c,p;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    id: 'description',
    label: 'Description',
    value: '',
    placeholder: 'Enter a detailed description'
  }
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,m,h;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    id: 'comments',
    label: 'Comments',
    value: 'This is a sample comment that demonstrates how the textarea looks with some content. It can span multiple lines and provides enough space for longer text input.',
    placeholder: 'Share your thoughts'
  }
}`,...(h=(m=r.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,x,b;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    id: 'feedback-error',
    label: 'Feedback',
    value: '',
    placeholder: 'Please provide your feedback',
    required: true,
    error: 'Feedback is required to submit your review'
  }
}`,...(b=(x=t.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var v,f,y;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'message-required',
    label: 'Message',
    value: '',
    placeholder: 'Type your message here',
    required: true,
    helpText: 'Please provide a detailed message for our support team'
  }
}`,...(y=(f=a.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var w,T,k;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'project-details',
    label: 'Project Details',
    value: '',
    placeholder: 'Describe your project requirements, timeline, and any specific needs',
    helpText: 'Include as much detail as possible to help us understand your project scope and requirements'
  }
}`,...(k=(T=o.parameters)==null?void 0:T.docs)==null?void 0:k.source}}};var q,j,S;s.parameters={...s.parameters,docs:{...(q=s.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    id: 'article',
    label: 'Article Content',
    value: \`This is a longer text example that demonstrates how the textarea component handles substantial content. The textarea is designed to be resizable, allowing users to adjust the height as needed for their content.

You can include multiple paragraphs, line breaks, and various types of content. The component maintains proper formatting and provides a good user experience even with longer text.

This flexibility makes it suitable for various use cases like blog posts, comments, feedback forms, and any other scenario where users need to input substantial amounts of text.\`,
    placeholder: 'Write your article content',
    helpText: 'You can write as much as you need - the textarea will resize automatically'
  }
}`,...(S=(j=s.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var P,W,D;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    id: 'notes',
    label: 'Quick Notes',
    value: '',
    placeholder: 'Add notes...',
    helpText: 'Brief notes or reminders'
  }
}`,...(D=(W=n.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var E,C,F;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'review',
    label: 'Product Review',
    value: 'Too short',
    placeholder: 'Write a detailed review of the product',
    error: 'Review must be at least 50 characters long',
    helpText: 'Please provide a detailed review to help other customers'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how validation errors would be displayed for minimum content length requirements.'
      }
    }
  }
}`,...(F=(C=i.parameters)==null?void 0:C.docs)==null?void 0:F.source}}};const Q=["Default","WithValue","WithError","Required","WithHelpText","LongText","ShortPlaceholder","ValidationScenario"];export{e as Default,s as LongText,a as Required,n as ShortPlaceholder,i as ValidationScenario,t as WithError,o as WithHelpText,r as WithValue,Q as __namedExportsOrder,M as default};
