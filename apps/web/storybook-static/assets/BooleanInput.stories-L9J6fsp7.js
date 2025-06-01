import{j as e}from"./jsx-runtime-CmtfZKef.js";import{B as a}from"./BooleanInput-DAkAH8Ho.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./checkbox-BGOkVoFJ.js";import"./index-C9U_LHPE.js";import"./utils-CytzSlOG.js";import"./check-M_MmD5Zy.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";const se={title:"Dynamic UI/Atomic Components/Form Fields/Boolean Input",component:a,parameters:{layout:"centered",docs:{description:{component:"A checkbox input component for boolean values with support for validation, error states, and help text. Features accessible keyboard navigation."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"Unique identifier for the checkbox field"},label:{control:"text",description:"Label text displayed next to the checkbox"},value:{control:"boolean",description:"Current boolean value (checked/unchecked)"},onChange:{action:"changed",description:"Callback function called when checkbox state changes"},required:{control:"boolean",description:"Whether the field is required"},error:{control:"text",description:"Error message to display"},helpText:{control:"text",description:"Help text to guide the user"}},decorators:[z=>e.jsx("div",{className:"max-w-md",children:e.jsx(z,{})})]},r={args:{id:"newsletter",label:"Subscribe to newsletter",value:!1}},s={args:{id:"terms-accepted",label:"I accept the terms and conditions",value:!0}},o={args:{id:"terms-error",label:"I accept the terms and conditions",value:!1,required:!0,error:"You must accept the terms and conditions to continue"}},t={args:{id:"privacy-required",label:"I agree to the privacy policy",value:!1,required:!0,helpText:"This agreement is required to create your account"}},n={args:{id:"marketing-emails",label:"Receive marketing emails",value:!1,helpText:"You can unsubscribe at any time from your account settings"}},i={args:{id:"data-processing",label:"I consent to the processing of my personal data for marketing purposes and agree to receive promotional communications",value:!1,helpText:"This is optional and you can change your preferences later"}},c={args:{id:"age-verification",label:"I confirm that I am 18 years or older",value:!0,required:!0,helpText:"Age verification is required for this service"}},l={args:{id:"analytics",label:"Enable analytics tracking",value:!0,helpText:"Help us improve our service by allowing anonymous usage analytics"}},u={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(a,{id:"feature-notifications",label:"Push notifications",value:!0,onChange:()=>{},helpText:"Receive notifications about new features"}),e.jsx(a,{id:"feature-sync",label:"Cloud sync",value:!1,onChange:()=>{},helpText:"Sync your data across devices"}),e.jsx(a,{id:"feature-backup",label:"Automatic backups",value:!0,onChange:()=>{},helpText:"Create daily backups of your data"}),e.jsx(a,{id:"feature-advanced",label:"Advanced features (Beta)",value:!1,onChange:()=>{},helpText:"Enable experimental features - may be unstable"})]}),parameters:{docs:{description:{story:"Example of multiple boolean inputs used together for feature preferences."}}}},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium mb-4",children:"Privacy Permissions"}),e.jsx(a,{id:"location-access",label:"Allow location access",value:!1,onChange:()=>{},helpText:"Used to provide location-based features"}),e.jsx(a,{id:"camera-access",label:"Allow camera access",value:!1,onChange:()=>{},helpText:"Required for profile photos and scanning features"}),e.jsx(a,{id:"microphone-access",label:"Allow microphone access",value:!1,onChange:()=>{},helpText:"Used for voice messages and calls"}),e.jsx(a,{id:"contacts-access",label:"Allow contacts access",value:!0,onChange:()=>{},helpText:"Help you find friends who are already using the app"})]}),parameters:{docs:{description:{story:"Example of boolean inputs used for permission settings."}}}},p={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{id:"valid-checkbox",label:"Valid checkbox (no error)",value:!0,onChange:()=>{}}),e.jsx(a,{id:"required-unchecked",label:"Required but unchecked",value:!1,onChange:()=>{},required:!0,error:"This field is required"}),e.jsx(a,{id:"required-checked",label:"Required and checked (valid)",value:!0,onChange:()=>{},required:!0})]}),parameters:{docs:{description:{story:"Demonstrates different validation states for boolean inputs."}}}};var m,h,f;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    id: 'newsletter',
    label: 'Subscribe to newsletter',
    value: false
  }
}`,...(f=(h=r.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var g,b,v;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    id: 'terms-accepted',
    label: 'I accept the terms and conditions',
    value: true
  }
}`,...(v=(b=s.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var x,y,k;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    id: 'terms-error',
    label: 'I accept the terms and conditions',
    value: false,
    required: true,
    error: 'You must accept the terms and conditions to continue'
  }
}`,...(k=(y=o.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var C,T,q;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: 'privacy-required',
    label: 'I agree to the privacy policy',
    value: false,
    required: true,
    helpText: 'This agreement is required to create your account'
  }
}`,...(q=(T=t.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var I,w,j;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    id: 'marketing-emails',
    label: 'Receive marketing emails',
    value: false,
    helpText: 'You can unsubscribe at any time from your account settings'
  }
}`,...(j=(w=n.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};var S,A,B;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'data-processing',
    label: 'I consent to the processing of my personal data for marketing purposes and agree to receive promotional communications',
    value: false,
    helpText: 'This is optional and you can change your preferences later'
  }
}`,...(B=(A=i.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var R,E,N;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    id: 'age-verification',
    label: 'I confirm that I am 18 years or older',
    value: true,
    required: true,
    helpText: 'Age verification is required for this service'
  }
}`,...(N=(E=c.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};var P,H,U;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    id: 'analytics',
    label: 'Enable analytics tracking',
    value: true,
    helpText: 'Help us improve our service by allowing anonymous usage analytics'
  }
}`,...(U=(H=l.parameters)==null?void 0:H.docs)==null?void 0:U.source}}};var D,F,L;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(L=(F=u.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var W,V,Y;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(Y=(V=d.parameters)==null?void 0:V.docs)==null?void 0:Y.source}}};var O,M,_;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(_=(M=p.parameters)==null?void 0:M.docs)==null?void 0:_.source}}};const oe=["Default","Checked","WithError","Required","WithHelpText","LongLabel","RequiredChecked","OptionalFeature","MultipleCheckboxes","PermissionSettings","ValidationStates"];export{s as Checked,r as Default,i as LongLabel,u as MultipleCheckboxes,l as OptionalFeature,d as PermissionSettings,t as Required,c as RequiredChecked,p as ValidationStates,o as WithError,n as WithHelpText,oe as __namedExportsOrder,se as default};
