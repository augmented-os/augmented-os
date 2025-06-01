import{j as e}from"./jsx-runtime-CmtfZKef.js";import{A as a}from"./ActionButtons-B9l-49-W.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";const le={title:"Dynamic UI/Atomic Components/Display Components/Action Buttons",component:a,parameters:{layout:"padded",docs:{description:{component:"A component for rendering action buttons with different styles and behaviors. Supports primary, secondary, and danger button variants."}}},argTypes:{actions:{control:"object",description:"Array of action configurations"},onAction:{action:"action-clicked",description:"Callback function called when an action button is clicked"},data:{control:"object",description:"Data context passed to action handlers"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},n={args:{actions:[{actionKey:"save",label:"Save",style:"primary"}],data:{id:1,name:"Test Item"}}},t={args:{actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"}],data:{id:1}}},o={args:{actions:[{actionKey:"delete",label:"Delete",style:"danger"}],data:{id:1,name:"Important Item"}}},s={args:{actions:[{actionKey:"save",label:"Save",style:"primary"},{actionKey:"draft",label:"Save as Draft",style:"secondary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}],data:{id:1,title:"Document",modified:!0}}},r={args:{actions:[{actionKey:"view",label:"View",style:"secondary"},{actionKey:"edit",label:"Edit",style:"primary"},{actionKey:"delete",label:"Delete",style:"danger"}],data:{id:123,name:"User Record",email:"user@example.com"}}},c={args:{actions:[{actionKey:"submit",label:"Submit Form",style:"primary"},{actionKey:"reset",label:"Reset",style:"secondary"}],data:{formId:"contact-form",hasChanges:!0}}},i={args:{actions:[{actionKey:"download",label:"Download Report as PDF",style:"primary"},{actionKey:"email",label:"Email to Recipients",style:"secondary"},{actionKey:"schedule",label:"Schedule for Later",style:"secondary"}],data:{reportId:"monthly-sales-2024"}}},l={args:{actions:[{actionKey:"export",label:"Export Data",style:"primary",icon:"download"}],data:{dataset:"users"}},parameters:{docs:{description:{story:"Shows how icons would be displayed (icon property is included but not rendered in the current implementation)."}}}},d={args:{actions:[],data:{}},parameters:{docs:{description:{story:"When no actions are provided, the component renders nothing."}}}},y={args:{actions:[{actionKey:"approve",label:"Approve Request",style:"primary"},{actionKey:"reject",label:"Reject",style:"danger"},{actionKey:"request-changes",label:"Request Changes",style:"secondary"}],data:{requestId:"REQ-2024-001",submitter:"John Doe",amount:1500,type:"expense",status:"pending"}}},m={args:{actions:[{actionKey:"confirm",label:"Confirm Action",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}],data:{id:1},className:"justify-center bg-gray-50 p-4 rounded-lg"}},p={args:{actions:[{actionKey:"action1",label:"Action 1",style:"primary"},{actionKey:"action2",label:"Action 2",style:"secondary"},{actionKey:"action3",label:"Action 3",style:"secondary"},{actionKey:"action4",label:"Action 4",style:"secondary"},{actionKey:"action5",label:"Action 5",style:"secondary"},{actionKey:"dangerous",label:"Dangerous Action",style:"danger"}],data:{id:1}},parameters:{docs:{description:{story:"Testing layout with many action buttons."}}}},u={args:{actions:[{actionKey:"primary-action",label:"Primary Action with Long Label",style:"primary"},{actionKey:"secondary-action",label:"Secondary Action",style:"secondary"},{actionKey:"danger-action",label:"Danger Action",style:"danger"}],data:{id:1,context:"mobile-test"}},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test how action buttons behave on small screens."}}}},b={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Primary Style"}),e.jsx(a,{actions:[{actionKey:"primary-demo",label:"Primary Button",style:"primary"}],data:{demo:!0}})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Secondary Style"}),e.jsx(a,{actions:[{actionKey:"secondary-demo",label:"Secondary Button",style:"secondary"}],data:{demo:!0}})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Danger Style"}),e.jsx(a,{actions:[{actionKey:"danger-demo",label:"Danger Button",style:"danger"}],data:{demo:!0}})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-3",children:"Mixed Styles"}),e.jsx(a,{actions:[{actionKey:"save",label:"Save",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"delete",label:"Delete",style:"danger"}],data:{demo:!0}})]})]}),parameters:{docs:{description:{story:"Comparison of all available button styles."}}}};var g,K,h;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'save',
      label: 'Save',
      style: 'primary'
    }],
    data: {
      id: 1,
      name: 'Test Item'
    }
  }
}`,...(h=(K=n.parameters)==null?void 0:K.docs)==null?void 0:h.source}}};var S,A,v;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }],
    data: {
      id: 1
    }
  }
}`,...(v=(A=t.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var x,f,D;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'delete',
      label: 'Delete',
      style: 'danger'
    }],
    data: {
      id: 1,
      name: 'Important Item'
    }
  }
}`,...(D=(f=o.parameters)==null?void 0:f.docs)==null?void 0:D.source}}};var w,C,j;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'save',
      label: 'Save',
      style: 'primary'
    }, {
      actionKey: 'draft',
      label: 'Save as Draft',
      style: 'secondary'
    }, {
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }],
    data: {
      id: 1,
      title: 'Document',
      modified: true
    }
  }
}`,...(j=(C=s.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var R,I,N;r.parameters={...r.parameters,docs:{...(R=r.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'view',
      label: 'View',
      style: 'secondary'
    }, {
      actionKey: 'edit',
      label: 'Edit',
      style: 'primary'
    }, {
      actionKey: 'delete',
      label: 'Delete',
      style: 'danger'
    }],
    data: {
      id: 123,
      name: 'User Record',
      email: 'user@example.com'
    }
  }
}`,...(N=(I=r.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var B,E,L;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'submit',
      label: 'Submit Form',
      style: 'primary'
    }, {
      actionKey: 'reset',
      label: 'Reset',
      style: 'secondary'
    }],
    data: {
      formId: 'contact-form',
      hasChanges: true
    }
  }
}`,...(L=(E=c.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var P,q,T;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'download',
      label: 'Download Report as PDF',
      style: 'primary'
    }, {
      actionKey: 'email',
      label: 'Email to Recipients',
      style: 'secondary'
    }, {
      actionKey: 'schedule',
      label: 'Schedule for Later',
      style: 'secondary'
    }],
    data: {
      reportId: 'monthly-sales-2024'
    }
  }
}`,...(T=(q=i.parameters)==null?void 0:q.docs)==null?void 0:T.source}}};var F,M,W;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'export',
      label: 'Export Data',
      style: 'primary',
      icon: 'download'
    }],
    data: {
      dataset: 'users'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how icons would be displayed (icon property is included but not rendered in the current implementation).'
      }
    }
  }
}`,...(W=(M=l.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var V,k,U;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    actions: [],
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'When no actions are provided, the component renders nothing.'
      }
    }
  }
}`,...(U=(k=d.parameters)==null?void 0:k.docs)==null?void 0:U.source}}};var J,Q,_;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'approve',
      label: 'Approve Request',
      style: 'primary'
    }, {
      actionKey: 'reject',
      label: 'Reject',
      style: 'danger'
    }, {
      actionKey: 'request-changes',
      label: 'Request Changes',
      style: 'secondary'
    }],
    data: {
      requestId: 'REQ-2024-001',
      submitter: 'John Doe',
      amount: 1500,
      type: 'expense',
      status: 'pending'
    }
  }
}`,...(_=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:_.source}}};var O,z,G;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'confirm',
      label: 'Confirm Action',
      style: 'primary'
    }, {
      actionKey: 'cancel',
      label: 'Cancel',
      style: 'secondary'
    }],
    data: {
      id: 1
    },
    className: 'justify-center bg-gray-50 p-4 rounded-lg'
  }
}`,...(G=(z=m.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var H,X,Y;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'action1',
      label: 'Action 1',
      style: 'primary'
    }, {
      actionKey: 'action2',
      label: 'Action 2',
      style: 'secondary'
    }, {
      actionKey: 'action3',
      label: 'Action 3',
      style: 'secondary'
    }, {
      actionKey: 'action4',
      label: 'Action 4',
      style: 'secondary'
    }, {
      actionKey: 'action5',
      label: 'Action 5',
      style: 'secondary'
    }, {
      actionKey: 'dangerous',
      label: 'Dangerous Action',
      style: 'danger'
    }],
    data: {
      id: 1
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing layout with many action buttons.'
      }
    }
  }
}`,...(Y=(X=p.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,$,ee;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    actions: [{
      actionKey: 'primary-action',
      label: 'Primary Action with Long Label',
      style: 'primary'
    }, {
      actionKey: 'secondary-action',
      label: 'Secondary Action',
      style: 'secondary'
    }, {
      actionKey: 'danger-action',
      label: 'Danger Action',
      style: 'danger'
    }],
    data: {
      id: 1,
      context: 'mobile-test'
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test how action buttons behave on small screens.'
      }
    }
  }
}`,...(ee=($=u.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ae,ne,te;b.parameters={...b.parameters,docs:{...(ae=b.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Primary Style</h3>
        <ActionButtons actions={[{
        actionKey: 'primary-demo',
        label: 'Primary Button',
        style: 'primary'
      }]} data={{
        demo: true
      }} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Secondary Style</h3>
        <ActionButtons actions={[{
        actionKey: 'secondary-demo',
        label: 'Secondary Button',
        style: 'secondary'
      }]} data={{
        demo: true
      }} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Danger Style</h3>
        <ActionButtons actions={[{
        actionKey: 'danger-demo',
        label: 'Danger Button',
        style: 'danger'
      }]} data={{
        demo: true
      }} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Mixed Styles</h3>
        <ActionButtons actions={[{
        actionKey: 'save',
        label: 'Save',
        style: 'primary'
      }, {
        actionKey: 'cancel',
        label: 'Cancel',
        style: 'secondary'
      }, {
        actionKey: 'delete',
        label: 'Delete',
        style: 'danger'
      }]} data={{
        demo: true
      }} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available button styles.'
      }
    }
  }
}`,...(te=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};const de=["SinglePrimary","SingleSecondary","SingleDanger","MultipleActions","CrudActions","FormActions","LongLabels","SingleActionWithIcon","EmptyActions","WithCustomData","CustomStyling","ManyActions","ResponsiveActions","AllStyles"];export{b as AllStyles,r as CrudActions,m as CustomStyling,d as EmptyActions,c as FormActions,i as LongLabels,p as ManyActions,s as MultipleActions,u as ResponsiveActions,l as SingleActionWithIcon,o as SingleDanger,n as SinglePrimary,t as SingleSecondary,y as WithCustomData,de as __namedExportsOrder,le as default};
