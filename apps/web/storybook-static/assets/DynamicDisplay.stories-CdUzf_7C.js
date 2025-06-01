import{D as le}from"./DynamicDisplay-CN3Fs3X6.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./button-BIv8UjPY.js";import"./index-C9U_LHPE.js";import"./utils-CytzSlOG.js";import"./conditions-CsAx6Gnl.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";const Le={title:"Dynamic UI/Composite Components/Dynamic Display",component:le,parameters:{layout:"padded",docs:{description:{component:"The main DynamicDisplay component that renders UI based on schema configuration. Supports various display types including tables, cards, forms, and custom layouts."}}},argTypes:{schema:{control:"object",description:"UI component schema defining the structure and behavior"},componentId:{control:"text",description:"Optional component ID for schema lookup"},data:{control:"object",description:"Data object to be displayed"},onAction:{action:"action-triggered",description:"Callback function for handling actions"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},e={id:1,firstName:"John",lastName:"Doe",email:"john.doe@company.com",phone:"+1 (555) 123-4567",department:"Engineering",role:"Senior Developer",status:"Active",startDate:"2022-03-15",salary:95e3},b=[{id:1,name:"John Doe",email:"john@example.com",status:"Active",department:"Engineering"},{id:2,name:"Jane Smith",email:"jane@example.com",status:"Inactive",department:"Product"},{id:3,name:"Bob Johnson",email:"bob@example.com",status:"Pending",department:"Sales"}],se={project:{name:"Dynamic UI Framework",status:"In Progress",priority:"High",budget:15e4,completion:75,team:"Frontend Engineering"},tasks:[{id:1,title:"Component Architecture",status:"Completed",assignee:"John Doe"},{id:2,title:"Storybook Integration",status:"In Progress",assignee:"Jane Smith"},{id:3,title:"Testing Framework",status:"Pending",assignee:"Bob Johnson"}]},a={args:{schema:{componentId:"user-table",name:"User Table",componentType:"Display",title:"User Management",customProps:{displayType:"table",dataKey:"users",columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/4"}]}},data:{users:b}},parameters:{docs:{description:{story:'Demonstrates table display using schema configuration. The data is passed under the "users" key.'}}}},t={args:{schema:{componentId:"user-card",name:"User Card",componentType:"Display",title:"User Profile",customProps:{displayType:"card",fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"},{key:"role",label:"Role"},{key:"status",label:"Status"}],layout:"grid"}},data:e},parameters:{docs:{description:{story:"Demonstrates card display using schema configuration with grid layout."}}}},n={args:{schema:{componentId:"user-form",name:"User Form",componentType:"Form",title:"Edit User",fields:[{fieldKey:"firstName",label:"First Name",type:"text",required:!0},{fieldKey:"lastName",label:"Last Name",type:"text",required:!0},{fieldKey:"email",label:"Email",type:"email",required:!0},{fieldKey:"department",label:"Department",type:"select",options:[{value:"engineering",label:"Engineering"},{value:"product",label:"Product"},{value:"sales",label:"Sales"}]},{fieldKey:"status",label:"Status",type:"select",options:[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"}]}],actions:[{actionKey:"save",label:"Save Changes",style:"primary"},{actionKey:"cancel",label:"Cancel",style:"secondary"}]},data:e},parameters:{docs:{description:{story:"Demonstrates form display using schema configuration with form fields and actions."}}}},s={args:{schema:{componentId:"project-dashboard",name:"Project Dashboard",componentType:"Display",title:"Project Overview (Grid Layout Demo)",customProps:{displayType:"card",fields:[{key:"name",label:"Project Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"},{key:"budget",label:"Budget"},{key:"completion",label:"Completion"}],layout:"grid"}},data:se.project},parameters:{docs:{description:{story:'Demonstrates a card display that could be part of a larger grid layout. In a real application, this would use layout.type: "grid" with multiple component areas.'}}}},l={args:{schema:{componentId:"simple-display",name:"Simple Display",componentType:"Display",title:"User Information",customProps:{displayType:"card",fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"},{key:"status",label:"Status"}],layout:"list"}},data:e,className:"max-w-2xl mx-auto"},parameters:{docs:{description:{story:"Demonstrates a single component display with custom styling. Shows list layout for card fields."}}}},o={args:{schema:{componentId:"conditional-display",name:"Conditional Display",componentType:"Display",title:"Dynamic Content",customProps:{displayType:"card",fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"status",label:"Status"}],layout:"grid"}},data:e},parameters:{docs:{description:{story:"Demonstrates conditional display capabilities. In a real application, this would show/hide based on data conditions."}}}},r={args:{schema:{componentId:"enhanced-table",name:"Enhanced Table",componentType:"Display",title:"Employee Directory",customProps:{displayType:"table",dataKey:"employees",columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/4"},{key:"email",label:"Email",width:"w-1/3"},{key:"department",label:"Department",width:"w-1/6"},{key:"status",label:"Status",width:"w-1/6",render:"status-badge"}],flagConfig:{field:"status",badgeConfigs:{Active:{class:"bg-green-100 text-green-800",text:"Active"},Inactive:{class:"bg-red-100 text-red-800",text:"Inactive"},Pending:{class:"bg-yellow-100 text-yellow-800",text:"Pending"}}}}},data:{employees:b}}},i={args:{schema:{componentId:"styled-table",name:"Styled Table",componentType:"Display",title:"User Status Overview",customProps:{displayType:"table",dataKey:"users",columns:[{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"department",label:"Department",width:"w-1/6"},{key:"status",label:"Status",width:"w-1/6"}],flagConfig:{field:"status",styles:{Inactive:"bg-red-50",Active:"bg-green-50",Pending:"bg-yellow-50"}}}},data:{users:b}}},m={args:{schema:{componentId:"template-display",name:"Template Display",componentType:"Display",title:"User Summary",displayTemplate:"Welcome {{firstName}} {{lastName}}! You are in the {{department}} department with {{status}} status."},data:e}},p={args:{schema:{componentId:"actions-display",name:"Actions Display",componentType:"Display",title:"User Actions",customProps:{displayType:"actions"},actions:[{actionKey:"edit",label:"Edit User",style:"primary"},{actionKey:"view",label:"View Profile",style:"secondary"},{actionKey:"delete",label:"Delete User",style:"danger"}]},data:e}},d={args:{data:e},parameters:{docs:{description:{story:"Shows fallback behavior when no schema is provided."}}}},c={args:{schema:{componentId:"styled-card",name:"Styled Card",componentType:"Display",title:"Custom Styled Display",customProps:{displayType:"card",fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"status",label:"Status"}],layout:"list"}},data:e,className:"border-2 border-blue-200 rounded-lg shadow-lg p-4"}},y={args:{schema:{componentId:"complex-display",name:"Complex Display",componentType:"Display",title:"Project Dashboard",customProps:{displayType:"table",dataKey:"tasks",columns:[{key:"id",label:"Task ID",width:"w-20"},{key:"title",label:"Task Title",width:"w-1/2"},{key:"status",label:"Status",width:"w-1/4",render:"status-badge"},{key:"assignee",label:"Assignee",width:"w-1/4"}],flagConfig:{field:"status",badgeConfigs:{Completed:{class:"bg-green-100 text-green-800",text:"Done"},"In Progress":{class:"bg-blue-100 text-blue-800",text:"Working"},Pending:{class:"bg-yellow-100 text-yellow-800",text:"Waiting"}}}}},data:se},parameters:{docs:{description:{story:"Demonstrates handling of complex nested data structures."}}}},u={args:{schema:{componentId:"responsive-table",name:"Responsive Table",componentType:"Display",title:"Mobile-Friendly Table",customProps:{displayType:"table",dataKey:"users",columns:[{key:"name",label:"Name",width:"w-1/2"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/6"}]}},data:{users:b}},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test how the display adapts to mobile screen sizes."}}}};var g,h,w;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'user-table',
      name: 'User Table',
      componentType: 'Display',
      title: 'User Management',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [{
          key: 'id',
          label: 'ID',
          width: 'w-20'
        }, {
          key: 'name',
          label: 'Name',
          width: 'w-1/3'
        }, {
          key: 'email',
          label: 'Email',
          width: 'w-1/3'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-1/4'
        }]
      }
    } as UIComponentSchema,
    data: {
      users: sampleTableData
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates table display using schema configuration. The data is passed under the "users" key.'
      }
    }
  }
}`,...(w=(h=a.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};var D,k,f;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'user-card',
      name: 'User Card',
      componentType: 'Display',
      title: 'User Profile',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'firstName',
          label: 'First Name'
        }, {
          key: 'lastName',
          label: 'Last Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'department',
          label: 'Department'
        }, {
          key: 'role',
          label: 'Role'
        }, {
          key: 'status',
          label: 'Status'
        }],
        layout: 'grid'
      }
    } as UIComponentSchema,
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates card display using schema configuration with grid layout.'
      }
    }
  }
}`,...(f=(k=t.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var T,S,I;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'user-form',
      name: 'User Form',
      componentType: 'Form',
      title: 'Edit User',
      fields: [{
        fieldKey: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true
      }, {
        fieldKey: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true
      }, {
        fieldKey: 'email',
        label: 'Email',
        type: 'email',
        required: true
      }, {
        fieldKey: 'department',
        label: 'Department',
        type: 'select',
        options: [{
          value: 'engineering',
          label: 'Engineering'
        }, {
          value: 'product',
          label: 'Product'
        }, {
          value: 'sales',
          label: 'Sales'
        }]
      }, {
        fieldKey: 'status',
        label: 'Status',
        type: 'select',
        options: [{
          value: 'active',
          label: 'Active'
        }, {
          value: 'inactive',
          label: 'Inactive'
        }]
      }],
      actions: [{
        actionKey: 'save',
        label: 'Save Changes',
        style: 'primary'
      }, {
        actionKey: 'cancel',
        label: 'Cancel',
        style: 'secondary'
      }]
    } as UIComponentSchema,
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates form display using schema configuration with form fields and actions.'
      }
    }
  }
}`,...(I=(S=n.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var v,N,C;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'project-dashboard',
      name: 'Project Dashboard',
      componentType: 'Display',
      title: 'Project Overview (Grid Layout Demo)',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'name',
          label: 'Project Name'
        }, {
          key: 'status',
          label: 'Status'
        }, {
          key: 'priority',
          label: 'Priority'
        }, {
          key: 'budget',
          label: 'Budget'
        }, {
          key: 'completion',
          label: 'Completion'
        }],
        layout: 'grid'
      }
    } as UIComponentSchema,
    data: sampleProjectData.project
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a card display that could be part of a larger grid layout. In a real application, this would use layout.type: "grid" with multiple component areas.'
      }
    }
  }
}`,...(C=(N=s.parameters)==null?void 0:N.docs)==null?void 0:C.source}}};var P,U,x;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'simple-display',
      name: 'Simple Display',
      componentType: 'Display',
      title: 'User Information',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'firstName',
          label: 'First Name'
        }, {
          key: 'lastName',
          label: 'Last Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'department',
          label: 'Department'
        }, {
          key: 'status',
          label: 'Status'
        }],
        layout: 'list'
      }
    } as UIComponentSchema,
    data: sampleUserData,
    className: 'max-w-2xl mx-auto'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a single component display with custom styling. Shows list layout for card fields.'
      }
    }
  }
}`,...(x=(U=l.parameters)==null?void 0:U.docs)==null?void 0:x.source}}};var E,K,j;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'conditional-display',
      name: 'Conditional Display',
      componentType: 'Display',
      title: 'Dynamic Content',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'firstName',
          label: 'First Name'
        }, {
          key: 'lastName',
          label: 'Last Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'status',
          label: 'Status'
        }],
        layout: 'grid'
      }
    } as UIComponentSchema,
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates conditional display capabilities. In a real application, this would show/hide based on data conditions.'
      }
    }
  }
}`,...(j=(K=o.parameters)==null?void 0:K.docs)==null?void 0:j.source}}};var A,F,L;r.parameters={...r.parameters,docs:{...(A=r.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'enhanced-table',
      name: 'Enhanced Table',
      componentType: 'Display',
      title: 'Employee Directory',
      customProps: {
        displayType: 'table',
        dataKey: 'employees',
        columns: [{
          key: 'id',
          label: 'ID',
          width: 'w-20'
        }, {
          key: 'name',
          label: 'Name',
          width: 'w-1/4'
        }, {
          key: 'email',
          label: 'Email',
          width: 'w-1/3'
        }, {
          key: 'department',
          label: 'Department',
          width: 'w-1/6'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-1/6',
          render: 'status-badge'
        }],
        flagConfig: {
          field: 'status',
          badgeConfigs: {
            'Active': {
              class: 'bg-green-100 text-green-800',
              text: 'Active'
            },
            'Inactive': {
              class: 'bg-red-100 text-red-800',
              text: 'Inactive'
            },
            'Pending': {
              class: 'bg-yellow-100 text-yellow-800',
              text: 'Pending'
            }
          }
        }
      }
    } as UIComponentSchema,
    data: {
      employees: sampleTableData
    }
  }
}`,...(L=(F=r.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var R,W,O;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'styled-table',
      name: 'Styled Table',
      componentType: 'Display',
      title: 'User Status Overview',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [{
          key: 'name',
          label: 'Name',
          width: 'w-1/3'
        }, {
          key: 'email',
          label: 'Email',
          width: 'w-1/3'
        }, {
          key: 'department',
          label: 'Department',
          width: 'w-1/6'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-1/6'
        }],
        flagConfig: {
          field: 'status',
          styles: {
            'Inactive': 'bg-red-50',
            'Active': 'bg-green-50',
            'Pending': 'bg-yellow-50'
          }
        }
      }
    } as UIComponentSchema,
    data: {
      users: sampleTableData
    }
  }
}`,...(O=(W=i.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var J,q,B;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'template-display',
      name: 'Template Display',
      componentType: 'Display',
      title: 'User Summary',
      displayTemplate: 'Welcome {{firstName}} {{lastName}}! You are in the {{department}} department with {{status}} status.'
    } as UIComponentSchema,
    data: sampleUserData
  }
}`,...(B=(q=m.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var G,M,V;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'actions-display',
      name: 'Actions Display',
      componentType: 'Display',
      title: 'User Actions',
      customProps: {
        displayType: 'actions'
      },
      actions: [{
        actionKey: 'edit',
        label: 'Edit User',
        style: 'primary'
      }, {
        actionKey: 'view',
        label: 'View Profile',
        style: 'secondary'
      }, {
        actionKey: 'delete',
        label: 'Delete User',
        style: 'danger'
      }]
    } as UIComponentSchema,
    data: sampleUserData
  }
}`,...(V=(M=p.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var z,Y,_;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    data: sampleUserData
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows fallback behavior when no schema is provided.'
      }
    }
  }
}`,...(_=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var H,Q,X;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'styled-card',
      name: 'Styled Card',
      componentType: 'Display',
      title: 'Custom Styled Display',
      customProps: {
        displayType: 'card',
        fields: [{
          key: 'firstName',
          label: 'First Name'
        }, {
          key: 'lastName',
          label: 'Last Name'
        }, {
          key: 'email',
          label: 'Email'
        }, {
          key: 'status',
          label: 'Status'
        }],
        layout: 'list'
      }
    } as UIComponentSchema,
    data: sampleUserData,
    className: 'border-2 border-blue-200 rounded-lg shadow-lg p-4'
  }
}`,...(X=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Z,$,ee;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'complex-display',
      name: 'Complex Display',
      componentType: 'Display',
      title: 'Project Dashboard',
      customProps: {
        displayType: 'table',
        dataKey: 'tasks',
        columns: [{
          key: 'id',
          label: 'Task ID',
          width: 'w-20'
        }, {
          key: 'title',
          label: 'Task Title',
          width: 'w-1/2'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-1/4',
          render: 'status-badge'
        }, {
          key: 'assignee',
          label: 'Assignee',
          width: 'w-1/4'
        }],
        flagConfig: {
          field: 'status',
          badgeConfigs: {
            'Completed': {
              class: 'bg-green-100 text-green-800',
              text: 'Done'
            },
            'In Progress': {
              class: 'bg-blue-100 text-blue-800',
              text: 'Working'
            },
            'Pending': {
              class: 'bg-yellow-100 text-yellow-800',
              text: 'Waiting'
            }
          }
        }
      }
    } as UIComponentSchema,
    data: sampleProjectData
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of complex nested data structures.'
      }
    }
  }
}`,...(ee=($=y.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var ae,te,ne;u.parameters={...u.parameters,docs:{...(ae=u.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    schema: {
      componentId: 'responsive-table',
      name: 'Responsive Table',
      componentType: 'Display',
      title: 'Mobile-Friendly Table',
      customProps: {
        displayType: 'table',
        dataKey: 'users',
        columns: [{
          key: 'name',
          label: 'Name',
          width: 'w-1/2'
        }, {
          key: 'email',
          label: 'Email',
          width: 'w-1/3'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-1/6'
        }]
      }
    } as UIComponentSchema,
    data: {
      users: sampleTableData
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test how the display adapts to mobile screen sizes.'
      }
    }
  }
}`,...(ne=(te=u.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};const Re=["TableDisplay","CardDisplay","FormDisplay","GridLayout","SingleLayout","ConditionalLayout","TableWithCustomRendering","TableWithRowStyling","TemplateDisplay","ActionsOnly","EmptySchema","CustomStyling","ComplexDataStructure","ResponsiveDisplay"];export{p as ActionsOnly,t as CardDisplay,y as ComplexDataStructure,o as ConditionalLayout,c as CustomStyling,d as EmptySchema,n as FormDisplay,s as GridLayout,u as ResponsiveDisplay,l as SingleLayout,a as TableDisplay,r as TableWithCustomRendering,i as TableWithRowStyling,m as TemplateDisplay,Re as __namedExportsOrder,Le as default};
