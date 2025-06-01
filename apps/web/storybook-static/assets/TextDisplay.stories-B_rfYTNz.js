import{j as e}from"./jsx-runtime-CmtfZKef.js";import{T as a}from"./TextDisplay-svPV22jp.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";const oe={title:"Dynamic UI/Atomic Components/Display Components/Text Display",component:a,parameters:{layout:"padded",docs:{description:{component:"A simple text display component that shows labeled or unlabeled text values with consistent styling."}}},argTypes:{label:{control:"text",description:"Optional label displayed above the value"},value:{control:"text",description:"The value to display (can be any data type)"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},s={args:{label:"User Name",value:"John Doe"}},r={args:{value:"Some important information without a label"}},t={args:{label:"Description",value:"This is a very long text that demonstrates how the TextDisplay component handles lengthy content. It should wrap naturally and maintain readability across different viewport sizes."}},o={args:{label:"Total Revenue",value:123456789e-2}},l={args:{label:"Is Active",value:!0}},n={args:{label:"Created At",value:new Date("2024-01-15T10:30:00Z").toISOString()}},i={args:{label:"Website",value:"https://example.com/very-long-url-path/that-might-need-wrapping"}},c={args:{label:"Empty Field",value:null}},p={args:{label:"Undefined Field",value:void 0}},u={args:{label:"Count",value:0}},m={args:{label:"Custom Styled",value:"This text has custom styling applied",className:"border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-r"}},d={args:{label:"Responsive Text",value:"This text should be readable across all viewport sizes from mobile to desktop"},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test how the component behaves on different screen sizes."}}}},b={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(a,{label:"First Name",value:"John"}),e.jsx(a,{label:"Last Name",value:"Doe"}),e.jsx(a,{label:"Email",value:"john.doe@example.com"}),e.jsx(a,{label:"Phone",value:"+1 (555) 123-4567"}),e.jsx(a,{value:"No label field"})]}),parameters:{docs:{description:{story:"Multiple TextDisplay components showing different use cases together."}}}};var g,v,h;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: 'User Name',
    value: 'John Doe'
  }
}`,...(h=(v=s.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var y,x,T;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    value: 'Some important information without a label'
  }
}`,...(T=(x=r.parameters)==null?void 0:x.docs)==null?void 0:T.source}}};var f,S,w;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: 'Description',
    value: 'This is a very long text that demonstrates how the TextDisplay component handles lengthy content. It should wrap naturally and maintain readability across different viewport sizes.'
  }
}`,...(w=(S=t.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var D,V,N;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Total Revenue',
    value: 1234567.89
  }
}`,...(N=(V=o.parameters)==null?void 0:V.docs)==null?void 0:N.source}}};var C,j,I;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: 'Is Active',
    value: true
  }
}`,...(I=(j=l.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};var U,E,A;n.parameters={...n.parameters,docs:{...(U=n.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: 'Created At',
    value: new Date('2024-01-15T10:30:00Z').toISOString()
  }
}`,...(A=(E=n.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var R,z,F;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: 'Website',
    value: 'https://example.com/very-long-url-path/that-might-need-wrapping'
  }
}`,...(F=(z=i.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var L,B,J;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: 'Empty Field',
    value: null
  }
}`,...(J=(B=c.parameters)==null?void 0:B.docs)==null?void 0:J.source}}};var M,O,W;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Undefined Field',
    value: undefined
  }
}`,...(W=(O=p.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var Z,k,P;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    label: 'Count',
    value: 0
  }
}`,...(P=(k=u.parameters)==null?void 0:k.docs)==null?void 0:P.source}}};var _,q,G;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    label: 'Custom Styled',
    value: 'This text has custom styling applied',
    className: 'border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-r'
  }
}`,...(G=(q=m.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var H,K,Q;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: 'Responsive Text',
    value: 'This text should be readable across all viewport sizes from mobile to desktop'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test how the component behaves on different screen sizes.'
      }
    }
  }
}`,...(Q=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var X,Y,$;b.parameters={...b.parameters,docs:{...(X=b.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <TextDisplay label="First Name" value="John" />
      <TextDisplay label="Last Name" value="Doe" />
      <TextDisplay label="Email" value="john.doe@example.com" />
      <TextDisplay label="Phone" value="+1 (555) 123-4567" />
      <TextDisplay value="No label field" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Multiple TextDisplay components showing different use cases together.'
      }
    }
  }
}`,...($=(Y=b.parameters)==null?void 0:Y.docs)==null?void 0:$.source}}};const le=["Basic","WithoutLabel","LongText","NumericValue","BooleanValue","DateValue","UrlValue","EmptyValue","UndefinedValue","ZeroValue","CustomStyling","ResponsiveTest","MultipleInstances"];export{s as Basic,l as BooleanValue,m as CustomStyling,n as DateValue,c as EmptyValue,t as LongText,b as MultipleInstances,o as NumericValue,d as ResponsiveTest,p as UndefinedValue,i as UrlValue,r as WithoutLabel,u as ZeroValue,le as __namedExportsOrder,oe as default};
