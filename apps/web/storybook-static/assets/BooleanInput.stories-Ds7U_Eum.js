import{j as e}from"./jsx-runtime-DF2Pcvd1.js";import{C as ae}from"./checkbox-B7Qu6JZP.js";import{L as re}from"./label-BpIRGnnY.js";import{c as b}from"./utils-fDSEsyX8.js";import"./index-B2-qRKKC.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./check-1J8gLrA-.js";import"./index-CFX93qP1.js";const a=({id:r,label:Q,value:X,onChange:Z,required:g,error:s,helpText:f})=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(ae,{id:r,checked:X,onCheckedChange:ee=>Z(ee===!0),required:g,className:b(s&&"border-destructive data-[state=checked]:bg-destructive"),"aria-describedby":s?`${r}-error`:f?`${r}-help`:void 0}),e.jsx(re,{htmlFor:r,className:b("text-sm font-medium text-foreground cursor-pointer",g&&"after:content-['*'] after:ml-1 after:text-destructive"),children:Q})]}),s&&e.jsx("div",{id:`${r}-error`,className:"text-sm text-destructive",role:"alert",children:s}),f&&!s&&e.jsx("div",{id:`${r}-help`,className:"text-sm text-muted-foreground",children:f})]}),ue={title:"DynamicUI/Fields/BooleanInput",component:a,parameters:{layout:"centered",docs:{description:{component:"A checkbox input component for boolean values with support for validation, error states, and help text. Features accessible keyboard navigation."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the checkbox field"},label:{control:"text",description:"Label text displayed next to the checkbox"},value:{control:"boolean",description:"Current boolean value (checked/unchecked)"},onChange:{action:"changed",description:"Callback function called when checkbox state changes"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[r=>e.jsx("div",{className:"max-w-md",children:e.jsx(r,{})})]},t={args:{id:"newsletter",label:"Subscribe to newsletter",value:!1}},o={args:{id:"terms-accepted",label:"I accept the terms and conditions",value:!0}},n={args:{id:"terms-error",label:"I accept the terms and conditions",value:!1,required:!0,error:"You must accept the terms and conditions to continue"}},c={args:{id:"privacy-required",label:"I agree to the privacy policy",value:!1,required:!0,helpText:"This agreement is required to create your account"}},i={args:{id:"marketing-emails",label:"Receive marketing emails",value:!1,helpText:"You can unsubscribe at any time from your account settings"}},l={args:{id:"data-processing",label:"I consent to the processing of my personal data for marketing purposes and agree to receive promotional communications",value:!1,helpText:"This is optional and you can change your preferences later"}},d={args:{id:"age-verification",label:"I confirm that I am 18 years or older",value:!0,required:!0,helpText:"Age verification is required for this service"}},u={args:{id:"analytics",label:"Enable analytics tracking",value:!0,helpText:"Help us improve our service by allowing anonymous usage analytics"}},p={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(a,{id:"feature-notifications",label:"Push notifications",value:!0,onChange:()=>{},helpText:"Receive notifications about new features"}),e.jsx(a,{id:"feature-sync",label:"Cloud sync",value:!1,onChange:()=>{},helpText:"Sync your data across devices"}),e.jsx(a,{id:"feature-backup",label:"Automatic backups",value:!0,onChange:()=>{},helpText:"Create daily backups of your data"}),e.jsx(a,{id:"feature-advanced",label:"Advanced features (Beta)",value:!1,onChange:()=>{},helpText:"Enable experimental features - may be unstable"})]}),parameters:{docs:{description:{story:"Example of multiple boolean inputs used together for feature preferences."}}}},m={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Privacy Permissions"}),e.jsx(a,{id:"location-access",label:"Allow location access",value:!1,onChange:()=>{},helpText:"Used to provide location-based features"}),e.jsx(a,{id:"camera-access",label:"Allow camera access",value:!1,onChange:()=>{},helpText:"Required for profile photos and scanning features"}),e.jsx(a,{id:"microphone-access",label:"Allow microphone access",value:!1,onChange:()=>{},helpText:"Used for voice messages and calls"}),e.jsx(a,{id:"contacts-access",label:"Allow contacts access",value:!0,onChange:()=>{},helpText:"Help you find friends who are already using the app"})]}),parameters:{docs:{description:{story:"Example of boolean inputs used for permission settings."}}}},h={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"valid-checkbox",label:"Valid checkbox (no error)",value:!0,onChange:()=>{}}),e.jsx(a,{id:"required-unchecked",label:"Required but unchecked",value:!1,onChange:()=>{},required:!0,error:"This field is required"}),e.jsx(a,{id:"required-checked",label:"Required and checked (valid)",value:!0,onChange:()=>{},required:!0})]}),parameters:{docs:{description:{story:"Demonstrates different validation states for boolean inputs."}}}};var v,x,y;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'newsletter',
    label: 'Subscribe to newsletter',
    value: false
  }
}`,...(y=(x=t.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var k,C,q;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    id: 'terms-accepted',
    label: 'I accept the terms and conditions',
    value: true
  }
}`,...(q=(C=o.parameters)==null?void 0:C.docs)==null?void 0:q.source}}};var T,I,j;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    id: 'terms-error',
    label: 'I accept the terms and conditions',
    value: false,
    required: true,
    error: 'You must accept the terms and conditions to continue'
  }
}`,...(j=(I=n.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};var w,S,A;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    id: 'privacy-required',
    label: 'I agree to the privacy policy',
    value: false,
    required: true,
    helpText: 'This agreement is required to create your account'
  }
}`,...(A=(S=c.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var B,N,R;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    id: 'marketing-emails',
    label: 'Receive marketing emails',
    value: false,
    helpText: 'You can unsubscribe at any time from your account settings'
  }
}`,...(R=(N=i.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};var E,P,H;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    id: 'data-processing',
    label: 'I consent to the processing of my personal data for marketing purposes and agree to receive promotional communications',
    value: false,
    helpText: 'This is optional and you can change your preferences later'
  }
}`,...(H=(P=l.parameters)==null?void 0:P.docs)==null?void 0:H.source}}};var L,U,D;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    id: 'age-verification',
    label: 'I confirm that I am 18 years or older',
    value: true,
    required: true,
    helpText: 'Age verification is required for this service'
  }
}`,...(D=(U=d.parameters)==null?void 0:U.docs)==null?void 0:D.source}}};var F,W,V;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    id: 'analytics',
    label: 'Enable analytics tracking',
    value: true,
    helpText: 'Help us improve our service by allowing anonymous usage analytics'
  }
}`,...(V=(W=u.parameters)==null?void 0:W.docs)==null?void 0:V.source}}};var Y,$,O;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <BooleanInput id="feature-notifications" label="Push notifications" value={true} onChange={() => {}} helpText="Receive notifications about new features" />
      <BooleanInput id="feature-sync" label="Cloud sync" value={false} onChange={() => {}} helpText="Sync your data across devices" />
      <BooleanInput id="feature-backup" label="Automatic backups" value={true} onChange={() => {}} helpText="Create daily backups of your data" />
      <BooleanInput id="feature-advanced" label="Advanced features (Beta)" value={false} onChange={() => {}} helpText="Enable experimental features - may be unstable" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple boolean inputs used together for feature preferences.'
      }
    }
  }
}`,...(O=($=p.parameters)==null?void 0:$.docs)==null?void 0:O.source}}};var M,_,z;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Privacy Permissions</h3>
      <BooleanInput id="location-access" label="Allow location access" value={false} onChange={() => {}} helpText="Used to provide location-based features" />
      <BooleanInput id="camera-access" label="Allow camera access" value={false} onChange={() => {}} helpText="Required for profile photos and scanning features" />
      <BooleanInput id="microphone-access" label="Allow microphone access" value={false} onChange={() => {}} helpText="Used for voice messages and calls" />
      <BooleanInput id="contacts-access" label="Allow contacts access" value={true} onChange={() => {}} helpText="Help you find friends who are already using the app" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of boolean inputs used for permission settings.'
      }
    }
  }
}`,...(z=(_=m.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var G,J,K;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <BooleanInput id="valid-checkbox" label="Valid checkbox (no error)" value={true} onChange={() => {}} />
      <BooleanInput id="required-unchecked" label="Required but unchecked" value={false} onChange={() => {}} required={true} error="This field is required" />
      <BooleanInput id="required-checked" label="Required and checked (valid)" value={true} onChange={() => {}} required={true} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different validation states for boolean inputs.'
      }
    }
  }
}`,...(K=(J=h.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const pe=["Default","Checked","WithError","Required","WithHelpText","LongLabel","RequiredChecked","OptionalFeature","MultipleCheckboxes","PermissionSettings","ValidationStates"];export{o as Checked,t as Default,l as LongLabel,p as MultipleCheckboxes,u as OptionalFeature,m as PermissionSettings,c as Required,d as RequiredChecked,h as ValidationStates,n as WithError,i as WithHelpText,pe as __namedExportsOrder,ue as default};
