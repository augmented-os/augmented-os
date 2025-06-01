import{j as d}from"./jsx-runtime-BT65X5dW.js";import{F as Z}from"./FormActions-CiQj-xe7.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./button-DTZ1A7rA.js";import"./index-B5vUWwF_.js";import"./utils-CytzSlOG.js";import"./conditions-CsAx6Gnl.js";const mt={title:"Dynamic UI/Composite Components/Form Actions",component:Z,parameters:{layout:"padded",docs:{description:{component:"A form actions component that renders action buttons with different styles, states, and conditional visibility. Supports submit, cancel, and custom actions."}}},tags:["autodocs"],argTypes:{actions:{control:"object",description:"Array of action button configurations"},onAction:{action:"action-triggered",description:"Callback function called when an action button is clicked"},isSubmitting:{control:"boolean",description:"Whether the form is currently submitting (disables submit button)"},formData:{control:"object",description:"Current form data for evaluating conditional visibility"}},decorators:[Y=>d.jsxs("div",{className:"max-w-2xl bg-card p-6 rounded-lg border",children:[d.jsx("div",{className:"mb-4 text-sm text-muted-foreground",children:"Form content would appear here..."}),d.jsx(Y,{})]})]},X=[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Submit",style:"primary"}],$=[{actionKey:"draft",label:"Save Draft",style:"secondary"},{actionKey:"delete",label:"Delete",style:"danger",confirmation:"Are you sure you want to delete this item? This action cannot be undone."},{actionKey:"submit",label:"Publish",style:"primary"}],b=[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"save_draft",label:"Save Draft",style:"secondary",visibleIf:'status != "published"'},{actionKey:"approve",label:"Approve",style:"primary",visibleIf:'status == "pending_review" && userRole == "admin"'},{actionKey:"reject",label:"Reject",style:"danger",visibleIf:'status == "pending_review" && userRole == "admin"'},{actionKey:"submit",label:"Submit for Review",style:"primary",visibleIf:'status == "draft"'},{actionKey:"edit",label:"Edit",style:"secondary",visibleIf:'status == "published"'}],tt=[{actionKey:"previous",label:"Previous Step",style:"secondary"},{actionKey:"save_exit",label:"Save & Exit",style:"secondary"},{actionKey:"next",label:"Next Step",style:"primary"}],et=[{actionKey:"submit",label:"Create Account",style:"primary"}],t={args:{actions:X,isSubmitting:!1,formData:{}}},e={args:{actions:X,isSubmitting:!0,formData:{}}},a={args:{actions:$,isSubmitting:!1,formData:{}}},s={args:{actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"delete",label:"Delete Account",style:"danger",confirmation:"Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."}],isSubmitting:!1,formData:{}}},n={args:{actions:b,isSubmitting:!1,formData:{status:"pending_review",userRole:"admin"}}},i={args:{actions:b,isSubmitting:!1,formData:{status:"draft",userRole:"user"}}},o={args:{actions:b,isSubmitting:!1,formData:{status:"published",userRole:"user"}}},r={args:{actions:tt,isSubmitting:!1,formData:{}}},c={args:{actions:et,isSubmitting:!1,formData:{}}},l={args:{actions:[{actionKey:"cancel",label:"Cancel",style:"secondary",disabled:!0},{actionKey:"submit",label:"Submit",style:"primary",disabled:!0}],isSubmitting:!1,formData:{}}},m={args:{actions:[{actionKey:"save_draft",label:"Save Draft",style:"secondary"},{actionKey:"submit",label:"Processing...",style:"primary"}],isSubmitting:!0,formData:{}}},u={args:{actions:[],isSubmitting:!1,formData:{}}};var y,p,f;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    actions: basicActions,
    isSubmitting: false,
    formData: {}
  }
}`,...(f=(p=t.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var g,S,D;e.parameters={...e.parameters,docs:{...(g=e.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    actions: basicActions,
    isSubmitting: true,
    formData: {}
  }
}`,...(D=(S=e.parameters)==null?void 0:S.docs)==null?void 0:D.source}}};var A,v,K;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    actions: styledActions,
    isSubmitting: false,
    formData: {}
  }
}`,...(K=(v=a.parameters)==null?void 0:v.docs)==null?void 0:K.source}}};var h,w,C;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }, {
      actionKey: 'delete',
      label: 'Delete Account',
      style: 'danger',
      confirmation: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    }],
    isSubmitting: false,
    formData: {}
  }
}`,...(C=(w=s.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var x,R,_;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'pending_review',
      userRole: 'admin'
    }
  }
}`,...(_=(R=n.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var j,k,E;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'draft',
      userRole: 'user'
    }
  }
}`,...(E=(k=i.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var I,P,V;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    actions: conditionalActions,
    isSubmitting: false,
    formData: {
      status: 'published',
      userRole: 'user'
    }
  }
}`,...(V=(P=o.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var W,F,T;r.parameters={...r.parameters,docs:{...(W=r.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    actions: workflowActions,
    isSubmitting: false,
    formData: {}
  }
}`,...(T=(F=r.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var N,B,L;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    actions: singleAction,
    isSubmitting: false,
    formData: {}
  }
}`,...(L=(B=c.parameters)==null?void 0:B.docs)==null?void 0:L.source}}};var O,U,q;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary',
      disabled: true
    }, {
      actionKey: 'submit',
      label: 'Submit',
      style: 'primary',
      disabled: true
    }],
    isSubmitting: false,
    formData: {}
  }
}`,...(q=(U=l.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var z,G,H;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'save_draft',
      label: 'Save Draft',
      style: 'secondary'
    }, {
      actionKey: 'submit',
      label: 'Processing...',
      style: 'primary'
    }],
    isSubmitting: true,
    formData: {}
  }
}`,...(H=(G=m.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,M,Q;u.parameters={...u.parameters,docs:{...(J=u.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    actions: [],
    isSubmitting: false,
    formData: {}
  }
}`,...(Q=(M=u.parameters)==null?void 0:M.docs)==null?void 0:Q.source}}};const ut=["BasicActions","SubmittingState","DifferentStyles","WithConfirmation","ConditionalVisibility","ConditionalVisibilityDraft","ConditionalVisibilityPublished","WorkflowSteps","SingleAction","DisabledActions","LoadingStates","EmptyActions"];export{t as BasicActions,n as ConditionalVisibility,i as ConditionalVisibilityDraft,o as ConditionalVisibilityPublished,a as DifferentStyles,l as DisabledActions,u as EmptyActions,m as LoadingStates,c as SingleAction,e as SubmittingState,s as WithConfirmation,r as WorkflowSteps,ut as __namedExportsOrder,mt as default};
