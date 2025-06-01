import{j as r}from"./jsx-runtime-BT65X5dW.js";import{D as Y}from"./DynamicUIErrorBoundary-Ca1kF0AK.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";const K=({children:e,fallback:s})=>r.jsx(Y,{fallback:s,children:e}),er={title:"Dynamic UI/System Integration/Error Boundary",component:K,parameters:{layout:"padded",docs:{description:{component:"Error boundary component for dynamic UI components. Provides comprehensive error handling with graceful degradation and customizable fallback components."}}},tags:["autodocs"],argTypes:{children:{control:!1,description:"Child components to wrap with error boundary"},fallback:{control:!1,description:"Optional custom fallback component to render when an error occurs"}},decorators:[e=>r.jsx("div",{className:"max-w-2xl",children:r.jsx(e,{})})]},o=({shouldThrow:e=!0,errorMessage:s="Something went wrong in the component"})=>{if(e)throw new Error(s);return r.jsxs("div",{className:"p-4 bg-green-50 border border-green-200 rounded-lg",children:[r.jsx("h3",{className:"text-green-800 font-medium",children:"Component Working Correctly"}),r.jsx("p",{className:"text-green-700 text-sm mt-1",children:"This component is rendering successfully without any errors."})]})},H=({error:e})=>r.jsxs("div",{className:"custom-error-fallback bg-purple-50 border border-purple-200 rounded-lg p-6",children:[r.jsxs("div",{className:"flex items-center mb-4",children:[r.jsx("div",{className:"flex-shrink-0",children:r.jsx("svg",{className:"w-6 h-6 text-purple-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})})}),r.jsx("div",{className:"ml-3",children:r.jsx("h3",{className:"text-lg font-medium text-purple-800",children:"Custom Error Handler"})})]}),r.jsxs("div",{className:"text-purple-700",children:[r.jsx("p",{className:"mb-3",children:"A custom error boundary caught this error and is displaying a specialized fallback UI."}),r.jsxs("div",{className:"bg-purple-100 rounded p-3 font-mono text-sm",children:[r.jsx("strong",{children:"Error:"})," ",e.message]})]}),r.jsx("div",{className:"mt-6",children:r.jsx("button",{onClick:()=>window.location.reload(),className:"bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors",children:"Reload Application"})})]}),n=()=>r.jsxs("div",{className:"p-6 bg-card border border-border rounded-lg",children:[r.jsx("h2",{className:"text-xl font-semibold text-foreground mb-4",children:"Dynamic Form Component"}),r.jsxs("div",{className:"space-y-4",children:[r.jsxs("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-foreground mb-1",children:"Name"}),r.jsx("input",{type:"text",className:"w-full p-2 border border-border rounded-md",placeholder:"Enter your name"})]}),r.jsxs("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-foreground mb-1",children:"Email"}),r.jsx("input",{type:"email",className:"w-full p-2 border border-border rounded-md",placeholder:"Enter your email"})]}),r.jsxs("div",{className:"flex gap-2",children:[r.jsx("button",{className:"px-4 py-2 bg-primary text-primary-foreground rounded-md",children:"Submit"}),r.jsx("button",{className:"px-4 py-2 bg-secondary text-secondary-foreground rounded-md",children:"Cancel"})]})]})]}),Q=({data:e})=>{const s=()=>e.items.map(g=>g.name.toUpperCase());return r.jsxs("div",{className:"p-6 bg-card border border-border rounded-lg",children:[r.jsx("h2",{className:"text-xl font-semibold text-foreground mb-4",children:"Data Processing Component"}),r.jsx("div",{className:"space-y-2",children:s().map((g,G)=>r.jsx("div",{className:"p-2 bg-muted rounded",children:g},G))})]})},a={args:{children:r.jsx(n,{})},parameters:{docs:{description:{story:"Shows a working component wrapped in the error boundary. No error occurs, so the component renders normally."}}}},t={args:{children:r.jsx(o,{shouldThrow:!0})},parameters:{docs:{description:{story:"Shows the default error fallback when a component throws an error. The error boundary catches the error and displays a user-friendly message."}}}},c={args:{children:r.jsx(o,{shouldThrow:!0}),fallback:H},parameters:{docs:{description:{story:"Shows a custom error fallback component. You can provide your own fallback component to customize the error display."}}}},d={args:{children:r.jsx(o,{shouldThrow:!0,errorMessage:"Failed to fetch data from API: Network request failed"})},parameters:{docs:{description:{story:"Shows how the error boundary handles network-related errors with descriptive error messages."}}}},i={args:{children:r.jsx(o,{shouldThrow:!0,errorMessage:"Validation failed: Required field 'email' is missing"})},parameters:{docs:{description:{story:"Shows how the error boundary handles validation errors in form components."}}}},l={args:{children:r.jsx(Q,{data:void 0})},parameters:{docs:{description:{story:"Shows how the error boundary handles errors that occur during data processing, such as accessing properties on undefined objects."}}}},m={args:{children:r.jsx(o,{shouldThrow:!0,errorMessage:"TypeError: Cannot read property 'map' of undefined"})},parameters:{docs:{description:{story:"Shows how the error boundary handles common JavaScript runtime errors."}}}},p={args:{children:r.jsxs("div",{className:"space-y-4",children:[r.jsx(n,{}),r.jsx(o,{shouldThrow:!0,errorMessage:"Second component failed"}),r.jsx(n,{})]})},parameters:{docs:{description:{story:"Shows how the error boundary handles multiple components, where one fails but others continue to work. The entire boundary content is replaced with the error fallback."}}}},h={args:{children:r.jsxs("div",{className:"space-y-4",children:[r.jsx(n,{}),r.jsx(Y,{fallback:H,children:r.jsx(o,{shouldThrow:!0,errorMessage:"Nested component error"})}),r.jsx(n,{})]})},parameters:{docs:{description:{story:"Shows nested error boundaries where an inner boundary catches an error while outer components continue to work normally."}}}},u={args:{children:r.jsx(o,{shouldThrow:!1})},parameters:{docs:{description:{story:"Shows a component that has recovered from an error state and is now working correctly."}}}};var w,y,b;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: <WorkingComponent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a working component wrapped in the error boundary. No error occurs, so the component renders normally.'
      }
    }
  }
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var x,f,j;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the default error fallback when a component throws an error. The error boundary catches the error and displays a user-friendly message.'
      }
    }
  }
}`,...(j=(f=t.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var k,v,N;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />,
    fallback: CustomErrorFallback
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a custom error fallback component. You can provide your own fallback component to customize the error display.'
      }
    }
  }
}`,...(N=(v=c.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};var E,S,C;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} errorMessage="Failed to fetch data from API: Network request failed" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles network-related errors with descriptive error messages.'
      }
    }
  }
}`,...(C=(S=d.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var T,M,D;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} errorMessage="Validation failed: Required field 'email' is missing" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles validation errors in form components.'
      }
    }
  }
}`,...(D=(M=i.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};var W,F,I;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: <ComplexComponent data={undefined} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles errors that occur during data processing, such as accessing properties on undefined objects.'
      }
    }
  }
}`,...(I=(F=l.parameters)==null?void 0:F.docs)==null?void 0:I.source}}};var B,U,P;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} errorMessage="TypeError: Cannot read property 'map' of undefined" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles common JavaScript runtime errors.'
      }
    }
  }
}`,...(P=(U=m.parameters)==null?void 0:U.docs)==null?void 0:P.source}}};var R,_,z;p.parameters={...p.parameters,docs:{...(R=p.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-4">
        <WorkingComponent />
        <ErrorThrowingComponent shouldThrow={true} errorMessage="Second component failed" />
        <WorkingComponent />
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles multiple components, where one fails but others continue to work. The entire boundary content is replaced with the error fallback.'
      }
    }
  }
}`,...(z=(_=p.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var q,A,J;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    children: <div className="space-y-4">
        <WorkingComponent />
        <DynamicUIErrorBoundary fallback={CustomErrorFallback}>
          <ErrorThrowingComponent shouldThrow={true} errorMessage="Nested component error" />
        </DynamicUIErrorBoundary>
        <WorkingComponent />
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows nested error boundaries where an inner boundary catches an error while outer components continue to work normally.'
      }
    }
  }
}`,...(J=(A=h.parameters)==null?void 0:A.docs)==null?void 0:J.source}}};var V,L,O;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: <ErrorThrowingComponent shouldThrow={false} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a component that has recovered from an error state and is now working correctly.'
      }
    }
  }
}`,...(O=(L=u.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};const or=["WorkingComponent_","DefaultErrorFallback","CustomErrorFallback_","NetworkError","ValidationError","DataProcessingError","JavaScriptError","MultipleComponents","NestedErrorBoundaries","RecoveryScenario"];export{c as CustomErrorFallback_,l as DataProcessingError,t as DefaultErrorFallback,m as JavaScriptError,p as MultipleComponents,h as NestedErrorBoundaries,d as NetworkError,u as RecoveryScenario,i as ValidationError,a as WorkingComponent_,or as __namedExportsOrder,er as default};
