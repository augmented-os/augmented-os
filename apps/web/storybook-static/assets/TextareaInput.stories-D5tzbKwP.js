import{j as r}from"./jsx-runtime-DF2Pcvd1.js";import{r as B}from"./index-B2-qRKKC.js";import{c as x}from"./utils-fDSEsyX8.js";import{L as M}from"./label-BpIRGnnY.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CFX93qP1.js";const u=B.forwardRef(({className:e,...p},m)=>r.jsx("textarea",{className:x("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:m,...p}));u.displayName="Textarea";try{u.displayName="Textarea",u.__docgenInfo={description:"",displayName:"Textarea",props:{}}}catch{}const Q=({id:e,label:p,value:m,onChange:Y,placeholder:$,required:g,error:t,helpText:h})=>r.jsxs("div",{className:"space-y-2",children:[r.jsx(M,{htmlFor:e,className:x("text-sm font-medium text-foreground",g&&"after:content-['*'] after:ml-1 after:text-destructive"),children:p}),r.jsx(u,{id:e,value:m,onChange:H=>Y(H.target.value),placeholder:$,required:g,className:x("w-full min-h-[80px] resize-y",t&&"border-destructive focus:ring-destructive"),"aria-describedby":t?`${e}-error`:h?`${e}-help`:void 0}),t&&r.jsx("div",{id:`${e}-error`,className:"text-sm text-destructive",role:"alert",children:t}),h&&!t&&r.jsx("div",{id:`${e}-help`,className:"text-sm text-muted-foreground",children:h})]}),Z={title:"DynamicUI/Fields/TextareaInput",component:Q,parameters:{layout:"centered",docs:{description:{component:"A multi-line textarea input component for longer text content with support for validation, error states, and help text. Features resizable height."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the textarea field"},label:{control:"text",description:"Label text displayed above the textarea"},value:{control:"text",description:"Current text value of the textarea"},onChange:{action:"changed",description:"Callback function called when textarea value changes"},placeholder:{control:"text",description:"Placeholder text shown when textarea is empty"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[e=>r.jsx("div",{className:"max-w-md",children:r.jsx(e,{})})]},a={args:{id:"description",label:"Description",value:"",placeholder:"Enter a detailed description"}},o={args:{id:"comments",label:"Comments",value:"This is a sample comment that demonstrates how the textarea looks with some content. It can span multiple lines and provides enough space for longer text input.",placeholder:"Share your thoughts"}},s={args:{id:"feedback-error",label:"Feedback",value:"",placeholder:"Please provide your feedback",required:!0,error:"Feedback is required to submit your review"}},n={args:{id:"message-required",label:"Message",value:"",placeholder:"Type your message here",required:!0,helpText:"Please provide a detailed message for our support team"}},i={args:{id:"project-details",label:"Project Details",value:"",placeholder:"Describe your project requirements, timeline, and any specific needs",helpText:"Include as much detail as possible to help us understand your project scope and requirements"}},l={args:{id:"article",label:"Article Content",value:`This is a longer text example that demonstrates how the textarea component handles substantial content. The textarea is designed to be resizable, allowing users to adjust the height as needed for their content.

You can include multiple paragraphs, line breaks, and various types of content. The component maintains proper formatting and provides a good user experience even with longer text.

This flexibility makes it suitable for various use cases like blog posts, comments, feedback forms, and any other scenario where users need to input substantial amounts of text.`,placeholder:"Write your article content",helpText:"You can write as much as you need - the textarea will resize automatically"}},d={args:{id:"notes",label:"Quick Notes",value:"",placeholder:"Add notes...",helpText:"Brief notes or reminders"}},c={args:{id:"review",label:"Product Review",value:"Too short",placeholder:"Write a detailed review of the product",error:"Review must be at least 50 characters long",helpText:"Please provide a detailed review to help other customers"},parameters:{docs:{description:{story:"Example of how validation errors would be displayed for minimum content length requirements."}}}};var b,f,v;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'description',
    label: 'Description',
    value: '',
    placeholder: 'Enter a detailed description'
  }
}`,...(v=(f=a.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var y,w,T;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'comments',
    label: 'Comments',
    value: 'This is a sample comment that demonstrates how the textarea looks with some content. It can span multiple lines and provides enough space for longer text input.',
    placeholder: 'Share your thoughts'
  }
}`,...(T=(w=o.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var k,j,q;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    id: 'feedback-error',
    label: 'Feedback',
    value: '',
    placeholder: 'Please provide your feedback',
    required: true,
    error: 'Feedback is required to submit your review'
  }
}`,...(q=(j=s.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};var S,P,N;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'message-required',
    label: 'Message',
    value: '',
    placeholder: 'Type your message here',
    required: true,
    helpText: 'Please provide a detailed message for our support team'
  }
}`,...(N=(P=n.parameters)==null?void 0:P.docs)==null?void 0:N.source}}};var W,E,_;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    id: 'project-details',
    label: 'Project Details',
    value: '',
    placeholder: 'Describe your project requirements, timeline, and any specific needs',
    helpText: 'Include as much detail as possible to help us understand your project scope and requirements'
  }
}`,...(_=(E=i.parameters)==null?void 0:E.docs)==null?void 0:_.source}}};var D,C,I;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    id: 'article',
    label: 'Article Content',
    value: \`This is a longer text example that demonstrates how the textarea component handles substantial content. The textarea is designed to be resizable, allowing users to adjust the height as needed for their content.

You can include multiple paragraphs, line breaks, and various types of content. The component maintains proper formatting and provides a good user experience even with longer text.

This flexibility makes it suitable for various use cases like blog posts, comments, feedback forms, and any other scenario where users need to input substantial amounts of text.\`,
    placeholder: 'Write your article content',
    helpText: 'You can write as much as you need - the textarea will resize automatically'
  }
}`,...(I=(C=l.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};var R,F,z;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    id: 'notes',
    label: 'Quick Notes',
    value: '',
    placeholder: 'Add notes...',
    helpText: 'Brief notes or reminders'
  }
}`,...(z=(F=d.parameters)==null?void 0:F.docs)==null?void 0:z.source}}};var A,L,V;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(V=(L=c.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};const ee=["Default","WithValue","WithError","Required","WithHelpText","LongText","ShortPlaceholder","ValidationScenario"];export{a as Default,l as LongText,n as Required,d as ShortPlaceholder,c as ValidationScenario,s as WithError,i as WithHelpText,o as WithValue,ee as __namedExportsOrder,Z as default};
