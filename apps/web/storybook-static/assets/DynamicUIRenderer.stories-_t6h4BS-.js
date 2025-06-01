import{j as e}from"./jsx-runtime-BT65X5dW.js";import{D as ae}from"./DynamicUIRenderer-DW83NvMH.js";import{D as re}from"./DynamicUIErrorBoundary-Ca1kF0AK.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-OHA8l7o_.js";import"./FormSection-BXqWezJv.js";import"./TextInput-D1rd6FA3.js";import"./input-dGyvt1gO.js";import"./utils-CytzSlOG.js";import"./label-DL8xO4EN.js";import"./index-kk9Evfeg.js";import"./index-B5vUWwF_.js";import"./NumberInput-DNalEYdP.js";import"./SelectInput-bHGg1ngK.js";import"./check-BvmRBcsD.js";import"./TextareaInput-DTn6fcBx.js";import"./BooleanInput-BbQ8GhQ8.js";import"./checkbox-DAvk8bKM.js";import"./DateInput-Cgcb2E7S.js";import"./FileInput-ltJkPhXW.js";import"./button-DTZ1A7rA.js";import"./MultiSelectInput-BlXkhP6C.js";import"./EmailInput-BZWgOOXu.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-CiQj-xe7.js";import"./QueryClientProvider-9W50J78D.js";import"./iframe-CSMkAxJl.js";import"./DynamicDisplay-CW0ZWIbw.js";import"./TableDisplay-CACaD82O.js";import"./CardDisplay-3IRVwmAz.js";import"./ActionButtons-4328mjEA.js";import"./DynamicUIStateContext-BrzZPoL3.js";const Qe={title:"Dynamic UI/System Integration/UI Renderer",component:ae,parameters:{layout:"padded",docs:{description:{component:"The main orchestration component for the Dynamic UI system. Routes to appropriate renderers based on componentType and provides UI state management for conditional rendering."}}},tags:["autodocs"],argTypes:{schema:{control:"object",description:"UI component schema defining the structure and behavior"},componentId:{control:"text",description:"Optional component ID for schema lookup"},initialData:{control:"object",description:"Initial data for form components"},data:{control:"object",description:"Data object for display components"},onSubmit:{action:"form-submitted",description:"Callback function for form submissions"},onCancel:{action:"form-cancelled",description:"Callback function for form cancellation"},onAction:{action:"action-triggered",description:"Callback function for handling actions"},className:{control:"text",description:"Additional CSS classes for custom styling"},initialUIState:{control:"object",description:"Initial UI state for conditional rendering"}},decorators:[h=>e.jsx("div",{className:"max-w-4xl",children:e.jsx(h,{})})]},te={componentId:"contact-form",name:"Contact Form",title:"Get in Touch",description:"Send us a message and we'll get back to you soon",componentType:"Form",fields:[{fieldKey:"name",label:"Full Name",type:"text",required:!0,placeholder:"Enter your full name"},{fieldKey:"email",label:"Email Address",type:"email",required:!0,placeholder:"Enter your email"},{fieldKey:"subject",label:"Subject",type:"select",required:!0,options:[{value:"general",label:"General Inquiry"},{value:"support",label:"Technical Support"},{value:"sales",label:"Sales Question"}]},{fieldKey:"message",label:"Message",type:"textarea",required:!0,placeholder:"Tell us how we can help..."}],actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Send Message",style:"primary"}]},oe={componentId:"user-registration",name:"User Registration",title:"Create Your Account",description:"Join our platform and start building amazing things",componentType:"Form",fields:[{fieldKey:"username",label:"Username",type:"text",required:!0,placeholder:"Choose a username",helpText:"Must be unique and 3-20 characters long"},{fieldKey:"email",label:"Email Address",type:"email",required:!0,placeholder:"Enter your email"},{fieldKey:"password",label:"Password",type:"text",required:!0,placeholder:"Create a strong password",helpText:"At least 8 characters with uppercase, lowercase, and numbers"},{fieldKey:"confirmPassword",label:"Confirm Password",type:"text",required:!0,placeholder:"Confirm your password"},{fieldKey:"newsletter",label:"Subscribe to our newsletter",type:"boolean",helpText:"Get updates about new features and tips"}],actions:[{actionKey:"cancel",label:"Cancel",style:"secondary"},{actionKey:"submit",label:"Create Account",style:"primary"}]},ne={componentId:"user-profile-display",name:"User Profile Display",title:"User Profile",description:"View and manage user profile information",componentType:"Display",displayTemplate:`
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
          {{name.charAt(0).toUpperCase()}}
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{name}}</h2>
          <p class="text-muted-foreground">{{email}}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-muted-foreground">Department</label>
          <p class="text-foreground">{{department}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Role</label>
          <p class="text-foreground">{{role}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Join Date</label>
          <p class="text-foreground">{{joinDate}}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground">Status</label>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{status}}
          </span>
        </div>
      </div>
    </div>
  `,actions:[{actionKey:"edit",label:"Edit Profile",style:"primary"},{actionKey:"deactivate",label:"Deactivate",style:"danger",confirmation:"Are you sure you want to deactivate this user?"}]},se={componentId:"task-list-display",name:"Task List Display",title:"My Tasks",description:"View and manage your assigned tasks",componentType:"Display",displayTemplate:`
    <div class="space-y-4">
      {{#each tasks}}
      <div class="border rounded-lg p-4 {{#if completed}}bg-muted{{/if}}">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <input type="checkbox" {{#if completed}}checked{{/if}} class="rounded" />
            <div>
              <h3 class="font-medium {{#if completed}}line-through text-muted-foreground{{/if}}">{{title}}</h3>
              <p class="text-sm text-muted-foreground">{{description}}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
              {{#eq priority 'high'}}bg-red-100 text-red-800{{/eq}}
              {{#eq priority 'medium'}}bg-yellow-100 text-yellow-800{{/eq}}
              {{#eq priority 'low'}}bg-green-100 text-green-800{{/eq}}">
              {{priority}}
            </span>
            <span class="text-sm text-muted-foreground">{{dueDate}}</span>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
  `,actions:[{actionKey:"add_task",label:"Add Task",style:"primary"},{actionKey:"filter",label:"Filter",style:"secondary"}]},g={componentId:"approval-workflow",name:"Approval Workflow",title:"Document Review",description:"Review and approve submitted documents",componentType:"Display",displayTemplate:`
    <div class="space-y-6">
      <div class="border rounded-lg p-4">
        <h3 class="font-medium mb-2">{{document.title}}</h3>
        <p class="text-sm text-muted-foreground mb-4">{{document.description}}</p>
        <div class="flex items-center space-x-4 text-sm">
          <span>Submitted by: <strong>{{document.author}}</strong></span>
          <span>Date: {{document.submittedDate}}</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
            {{#eq document.status 'pending'}}bg-yellow-100 text-yellow-800{{/eq}}
            {{#eq document.status 'approved'}}bg-green-100 text-green-800{{/eq}}
            {{#eq document.status 'rejected'}}bg-red-100 text-red-800{{/eq}}">
            {{document.status}}
          </span>
        </div>
      </div>
      
      {{#if showReviewForm}}
      <div class="border rounded-lg p-4 bg-muted/50">
        <h4 class="font-medium mb-3">Review Comments</h4>
        <textarea class="w-full p-3 border rounded-md" rows="4" placeholder="Enter your review comments..."></textarea>
      </div>
      {{/if}}
    </div>
  `,actions:[{actionKey:"request_review",label:"Request Review",style:"primary",visibleIf:'document.status == "draft"'},{actionKey:"approve",label:"Approve",style:"primary",visibleIf:'document.status == "pending" && userRole == "reviewer"'},{actionKey:"reject",label:"Reject",style:"danger",visibleIf:'document.status == "pending" && userRole == "reviewer"',confirmation:"Are you sure you want to reject this document?"},{actionKey:"edit",label:"Edit",style:"secondary",visibleIf:'document.status == "draft" || document.status == "rejected"'}]},t={args:{schema:te,initialData:{}}},a={args:{schema:te,initialData:{name:"John Doe",email:"john.doe@example.com",subject:"support",message:"I need help with my account settings."}}},r={args:{schema:oe,initialData:{}}},o={args:{schema:ne,data:{name:"Sarah Johnson",email:"sarah.johnson@company.com",department:"Engineering",role:"Senior Developer",joinDate:"January 15, 2022",status:"Active"}}},n={args:{schema:se,data:{tasks:[{id:1,title:"Review pull request #123",description:"Code review for new authentication feature",priority:"high",dueDate:"Today",completed:!1},{id:2,title:"Update documentation",description:"Add API documentation for new endpoints",priority:"medium",dueDate:"Tomorrow",completed:!1},{id:3,title:"Fix bug in user dashboard",description:"Resolve issue with data not loading",priority:"high",dueDate:"Yesterday",completed:!0},{id:4,title:"Team meeting preparation",description:"Prepare slides for weekly team sync",priority:"low",dueDate:"Friday",completed:!1}]}}},s={args:{schema:g,data:{document:{title:"Q4 Marketing Strategy",description:"Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.",author:"Marketing Team",submittedDate:"December 1, 2023",status:"draft"},userRole:"author"},initialUIState:{showReviewForm:!1}}},i={args:{schema:g,data:{document:{title:"Q4 Marketing Strategy",description:"Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.",author:"Marketing Team",submittedDate:"December 1, 2023",status:"pending"},userRole:"reviewer"},initialUIState:{showReviewForm:!1}}},d={args:{schema:g,data:{document:{title:"Q4 Marketing Strategy",description:"Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.",author:"Marketing Team",submittedDate:"December 1, 2023",status:"pending"},userRole:"reviewer"},initialUIState:{showReviewForm:!0}}},c={args:{schema:g,data:{document:{title:"Q4 Marketing Strategy",description:"Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.",author:"Marketing Team",submittedDate:"December 1, 2023",status:"approved"},userRole:"viewer"},initialUIState:{showReviewForm:!1}}},l={args:{data:{}},parameters:{docs:{description:{story:"Shows the loading state when a component schema is being fetched from the server. This story simulates the loading state without making actual database calls."}}},render:h=>e.jsx(re,{children:e.jsx("div",{className:"flex items-center justify-center py-8",children:e.jsx("div",{className:"text-muted-foreground",children:"Loading component schema..."})})})},m={args:{schema:void 0,data:{}},parameters:{docs:{description:{story:"Shows the error state when no schema is available."}}}},p={args:{schema:{componentId:"modal-example",name:"Modal Example",title:"Example Modal",componentType:"Modal",description:"This component type is not yet implemented"},data:{}},parameters:{docs:{description:{story:"Shows the placeholder for unsupported Modal component type."}}}},u={args:{schema:{componentId:"custom-example",name:"Custom Example",title:"Example Custom Component",componentType:"Custom",description:"This component type is not yet implemented"},data:{}},parameters:{docs:{description:{story:"Shows the placeholder for unsupported Custom component type."}}}};var y,f,b;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    schema: contactFormSchema,
    initialData: {}
  }
}`,...(b=(f=t.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var w,v,x;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    schema: contactFormSchema,
    initialData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'support',
      message: 'I need help with my account settings.'
    }
  }
}`,...(x=(v=a.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var S,D,k;r.parameters={...r.parameters,docs:{...(S=r.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    schema: userRegistrationSchema,
    initialData: {}
  }
}`,...(k=(D=r.parameters)==null?void 0:D.docs)==null?void 0:k.source}}};var T,I,C;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    schema: userProfileDisplaySchema,
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      joinDate: 'January 15, 2022',
      status: 'Active'
    }
  }
}`,...(C=(I=o.parameters)==null?void 0:I.docs)==null?void 0:C.source}}};var R,U,q;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    schema: taskListDisplaySchema,
    data: {
      tasks: [{
        id: 1,
        title: 'Review pull request #123',
        description: 'Code review for new authentication feature',
        priority: 'high',
        dueDate: 'Today',
        completed: false
      }, {
        id: 2,
        title: 'Update documentation',
        description: 'Add API documentation for new endpoints',
        priority: 'medium',
        dueDate: 'Tomorrow',
        completed: false
      }, {
        id: 3,
        title: 'Fix bug in user dashboard',
        description: 'Resolve issue with data not loading',
        priority: 'high',
        dueDate: 'Yesterday',
        completed: true
      }, {
        id: 4,
        title: 'Team meeting preparation',
        description: 'Prepare slides for weekly team sync',
        priority: 'low',
        dueDate: 'Friday',
        completed: false
      }]
    }
  }
}`,...(q=(U=n.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var j,M,F;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'draft'
      },
      userRole: 'author'
    },
    initialUIState: {
      showReviewForm: false
    }
  }
}`,...(F=(M=s.parameters)==null?void 0:M.docs)==null?void 0:F.source}}};var E,A,K;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'pending'
      },
      userRole: 'reviewer'
    },
    initialUIState: {
      showReviewForm: false
    }
  }
}`,...(K=(A=i.parameters)==null?void 0:A.docs)==null?void 0:K.source}}};var P,W,L;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'pending'
      },
      userRole: 'reviewer'
    },
    initialUIState: {
      showReviewForm: true
    }
  }
}`,...(L=(W=d.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var Q,J,N;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    schema: workflowSchema,
    data: {
      document: {
        title: 'Q4 Marketing Strategy',
        description: 'Comprehensive marketing strategy for the fourth quarter including budget allocation and campaign planning.',
        author: 'Marketing Team',
        submittedDate: 'December 1, 2023',
        status: 'approved'
      },
      userRole: 'viewer'
    },
    initialUIState: {
      showReviewForm: false
    }
  }
}`,...(N=(J=c.parameters)==null?void 0:J.docs)==null?void 0:N.source}}};var _,B,G;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when a component schema is being fetched from the server. This story simulates the loading state without making actual database calls.'
      }
    }
  },
  render: args => {
    // Simulate loading state by rendering the loading UI directly
    return <DynamicUIErrorBoundary>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading component schema...</div>
        </div>
      </DynamicUIErrorBoundary>;
  }
}`,...(G=(B=l.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var Y,O,V;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    schema: undefined,
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error state when no schema is available.'
      }
    }
  }
}`,...(V=(O=m.parameters)==null?void 0:O.docs)==null?void 0:V.source}}};var z,H,X;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'modal-example',
      name: 'Modal Example',
      title: 'Example Modal',
      componentType: 'Modal',
      description: 'This component type is not yet implemented'
    } as UIComponentSchema,
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the placeholder for unsupported Modal component type.'
      }
    }
  }
}`,...(X=(H=p.parameters)==null?void 0:H.docs)==null?void 0:X.source}}};var Z,$,ee;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'custom-example',
      name: 'Custom Example',
      title: 'Example Custom Component',
      componentType: 'Custom',
      description: 'This component type is not yet implemented'
    } as UIComponentSchema,
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the placeholder for unsupported Custom component type.'
      }
    }
  }
}`,...(ee=($=u.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};const Je=["ContactForm","ContactFormPrefilled","UserRegistrationForm","UserProfileDisplay","TaskListDisplay","WorkflowDraftState","WorkflowPendingReview","WorkflowWithReviewForm","WorkflowApproved","LoadingState","ErrorState","UnsupportedModalType","UnsupportedCustomType"];export{t as ContactForm,a as ContactFormPrefilled,m as ErrorState,l as LoadingState,n as TaskListDisplay,u as UnsupportedCustomType,p as UnsupportedModalType,o as UserProfileDisplay,r as UserRegistrationForm,c as WorkflowApproved,s as WorkflowDraftState,i as WorkflowPendingReview,d as WorkflowWithReviewForm,Je as __namedExportsOrder,Qe as default};
