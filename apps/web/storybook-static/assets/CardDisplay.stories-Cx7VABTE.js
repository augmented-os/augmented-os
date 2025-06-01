import{j as a}from"./jsx-runtime-BT65X5dW.js";import{C as N}from"./CardDisplay-3IRVwmAz.js";import"./index-C6mWTJJr.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";const ue={title:"Dynamic UI/Atomic Components/Display Components/Card Display",component:N,parameters:{layout:"padded",docs:{description:{component:"A card display component that presents data in a structured card format with configurable layouts and custom field rendering."}}},argTypes:{title:{control:"text",description:"Optional title displayed above the card"},data:{control:"object",description:"Data object containing the values to display"},config:{control:"object",description:"Configuration object defining fields and layout"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},n={firstName:"John",lastName:"Doe",email:"john.doe@company.com",phone:"+1 (555) 123-4567",department:"Engineering",role:"Senior Developer",startDate:"2022-03-15",status:"Active",location:"San Francisco, CA",manager:"Jane Smith"},le={name:"Dynamic UI Framework",description:"A flexible UI component system for rapid application development",status:"In Progress",priority:"High",startDate:"2024-01-01",dueDate:"2024-06-30",budget:15e4,team:"Frontend Engineering",completionPercentage:75,lastUpdated:"2024-01-15T14:30:00Z"},h={companyName:"Acme Corporation",contactPerson:"Alice Johnson",email:"alice@acme.com",phone:"+1 (555) 987-6543",address:"123 Business Ave, Suite 456",city:"New York",state:"NY",zipCode:"10001",industry:"Technology",customerSince:"2020-05-15",accountValue:25e4,tier:"Enterprise"},l={args:{title:"User Profile",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"}],layout:"grid"}}},o={args:{title:"Employee Information",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email Address"},{key:"phone",label:"Phone Number"},{key:"department",label:"Department"},{key:"role",label:"Job Title"},{key:"startDate",label:"Start Date"}],layout:"list"}}},i={args:{data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"status",label:"Status"}],layout:"grid"}}},d={args:{title:"Project Overview",data:le,config:{fields:[{key:"name",label:"Project Name"},{key:"status",label:"Status",render:t=>{const e=t,r=s=>{switch(s){case"In Progress":return"bg-blue-100 text-blue-800";case"Completed":return"bg-green-100 text-green-800";case"On Hold":return"bg-yellow-100 text-yellow-800";case"Cancelled":return"bg-red-100 text-red-800";default:return"bg-gray-100 text-gray-800"}};return a.jsx("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r(e)}`,children:e})}},{key:"priority",label:"Priority",render:t=>{const e=t,r=s=>{switch(s){case"High":return"text-red-600 font-semibold";case"Medium":return"text-yellow-600 font-semibold";case"Low":return"text-green-600 font-semibold";default:return"text-gray-600"}};return a.jsx("span",{className:r(e),children:e})}},{key:"budget",label:"Budget",render:t=>{const e=t;return a.jsxs("span",{className:"font-mono",children:["$",e.toLocaleString()]})}},{key:"completionPercentage",label:"Completion",render:t=>{const e=t;return a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"flex-1 bg-gray-200 rounded-full h-2",children:a.jsx("div",{className:"bg-blue-600 h-2 rounded-full transition-all duration-300",style:{width:`${e}%`}})}),a.jsxs("span",{className:"text-sm font-medium",children:[e,"%"]})]})}},{key:"team",label:"Team"}],layout:"grid"}}},m={args:{title:"Customer Information",data:h,config:{fields:[{key:"companyName",label:"Company"},{key:"contactPerson",label:"Contact"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"accountValue",label:"Account Value",render:t=>{const e=t;return a.jsxs("span",{className:"font-mono text-green-600 font-semibold",children:["$",e.toLocaleString()]})}},{key:"tier",label:"Tier",render:t=>{const e=t,r=s=>{switch(s){case"Enterprise":return"bg-purple-100 text-purple-800";case"Business":return"bg-blue-100 text-blue-800";case"Standard":return"bg-green-100 text-green-800";default:return"bg-gray-100 text-gray-800"}};return a.jsx("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r(e)}`,children:e})}}],layout:"grid"}}},c={args:{title:"Incomplete Profile",data:{firstName:"John",email:"john@example.com"},config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"department",label:"Department"},{key:"status",label:"Status"}],layout:"grid"}},parameters:{docs:{description:{story:'Demonstrates how the component handles missing data fields (shows "N/A").'}}}},u={args:{title:"No Configuration",data:n,config:{fields:[]}},parameters:{docs:{description:{story:"Shows the fallback message when no field configuration is provided."}}}},y={args:{title:"Missing Config",data:n},parameters:{docs:{description:{story:"Shows the fallback message when config prop is entirely missing."}}}},p={args:{title:"Comprehensive Profile",data:{...n,...h,additionalField1:"Value 1",additionalField2:"Value 2",additionalField3:"Value 3",additionalField4:"Value 4"},config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"department",label:"Department"},{key:"role",label:"Role"},{key:"location",label:"Location"},{key:"startDate",label:"Start Date"},{key:"manager",label:"Manager"},{key:"status",label:"Status"},{key:"companyName",label:"Company"},{key:"industry",label:"Industry"}],layout:"grid"}}},g={args:{title:"Styled Card",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"}],layout:"grid"},className:"border-l-4 border-blue-500 shadow-lg"}},b={args:{title:"Card in Controlled Context",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"status",label:"Status"}],layout:"grid"},className:"mb-0"},parameters:{docs:{description:{story:'When className contains "mb-0", the title is not rendered (for controlled contexts).'}}}},f={args:{title:"Responsive Card Layout",data:h,config:{fields:[{key:"companyName",label:"Company Name"},{key:"contactPerson",label:"Contact Person"},{key:"email",label:"Email Address"},{key:"phone",label:"Phone Number"},{key:"address",label:"Address"},{key:"industry",label:"Industry"}],layout:"grid"}},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test how the card displays on mobile devices."}}}},k={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsx(N,{title:"Grid Layout",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"}],layout:"grid"}}),a.jsx(N,{title:"List Layout",data:n,config:{fields:[{key:"firstName",label:"First Name"},{key:"lastName",label:"Last Name"},{key:"email",label:"Email"},{key:"department",label:"Department"}],layout:"list"}})]}),parameters:{docs:{description:{story:"Side-by-side comparison of grid and list layouts."}}}};var x,C,D;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    title: 'User Profile',
    data: userProfileData,
    config: {
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
      }],
      layout: 'grid'
    }
  }
}`,...(D=(C=l.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var S,v,w;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    title: 'Employee Information',
    data: userProfileData,
    config: {
      fields: [{
        key: 'firstName',
        label: 'First Name'
      }, {
        key: 'lastName',
        label: 'Last Name'
      }, {
        key: 'email',
        label: 'Email Address'
      }, {
        key: 'phone',
        label: 'Phone Number'
      }, {
        key: 'department',
        label: 'Department'
      }, {
        key: 'role',
        label: 'Job Title'
      }, {
        key: 'startDate',
        label: 'Start Date'
      }],
      layout: 'list'
    }
  }
}`,...(w=(v=o.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var P,L,E;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    data: userProfileData,
    config: {
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
  }
}`,...(E=(L=i.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var F,j,A;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'Project Overview',
    data: projectData,
    config: {
      fields: [{
        key: 'name',
        label: 'Project Name'
      }, {
        key: 'status',
        label: 'Status',
        render: (value: unknown) => {
          const status = value as string;
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'In Progress':
                return 'bg-blue-100 text-blue-800';
              case 'Completed':
                return 'bg-green-100 text-green-800';
              case 'On Hold':
                return 'bg-yellow-100 text-yellow-800';
              case 'Cancelled':
                return 'bg-red-100 text-red-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          return <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${getStatusColor(status)}\`}>
                {status}
              </span>;
        }
      }, {
        key: 'priority',
        label: 'Priority',
        render: (value: unknown) => {
          const priority = value as string;
          const getColor = (priority: string) => {
            switch (priority) {
              case 'High':
                return 'text-red-600 font-semibold';
              case 'Medium':
                return 'text-yellow-600 font-semibold';
              case 'Low':
                return 'text-green-600 font-semibold';
              default:
                return 'text-gray-600';
            }
          };
          return <span className={getColor(priority)}>{priority}</span>;
        }
      }, {
        key: 'budget',
        label: 'Budget',
        render: (value: unknown) => {
          const budget = value as number;
          return <span className="font-mono">\${budget.toLocaleString()}</span>;
        }
      }, {
        key: 'completionPercentage',
        label: 'Completion',
        render: (value: unknown) => {
          const percentage = value as number;
          return <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
                width: \`\${percentage}%\`
              }}></div>
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>;
        }
      }, {
        key: 'team',
        label: 'Team'
      }],
      layout: 'grid'
    }
  }
}`,...(A=(j=d.parameters)==null?void 0:j.docs)==null?void 0:A.source}}};var T,I,V;m.parameters={...m.parameters,docs:{...(T=m.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    title: 'Customer Information',
    data: customerData,
    config: {
      fields: [{
        key: 'companyName',
        label: 'Company'
      }, {
        key: 'contactPerson',
        label: 'Contact'
      }, {
        key: 'email',
        label: 'Email'
      }, {
        key: 'phone',
        label: 'Phone'
      }, {
        key: 'accountValue',
        label: 'Account Value',
        render: (value: unknown) => {
          const amount = value as number;
          return <span className="font-mono text-green-600 font-semibold">\${amount.toLocaleString()}</span>;
        }
      }, {
        key: 'tier',
        label: 'Tier',
        render: (value: unknown) => {
          const tier = value as string;
          const getTierColor = (tier: string) => {
            switch (tier) {
              case 'Enterprise':
                return 'bg-purple-100 text-purple-800';
              case 'Business':
                return 'bg-blue-100 text-blue-800';
              case 'Standard':
                return 'bg-green-100 text-green-800';
              default:
                return 'bg-gray-100 text-gray-800';
            }
          };
          return <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${getTierColor(tier)}\`}>
                {tier}
              </span>;
        }
      }],
      layout: 'grid'
    }
  }
}`,...(V=(I=m.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var M,$,R;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    title: 'Incomplete Profile',
    data: {
      firstName: 'John',
      email: 'john@example.com'
      // Missing several fields intentionally
    },
    config: {
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
        key: 'phone',
        label: 'Phone'
      }, {
        key: 'department',
        label: 'Department'
      }, {
        key: 'status',
        label: 'Status'
      }],
      layout: 'grid'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the component handles missing data fields (shows "N/A").'
      }
    }
  }
}`,...(R=($=c.parameters)==null?void 0:$.docs)==null?void 0:R.source}}};var B,J,O;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'No Configuration',
    data: userProfileData,
    config: {
      fields: []
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when no field configuration is provided.'
      }
    }
  }
}`,...(O=(J=u.parameters)==null?void 0:J.docs)==null?void 0:O.source}}};var U,H,W;y.parameters={...y.parameters,docs:{...(U=y.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    title: 'Missing Config',
    data: userProfileData
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when config prop is entirely missing.'
      }
    }
  }
}`,...(W=(H=y.parameters)==null?void 0:H.docs)==null?void 0:W.source}}};var G,Y,_;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    title: 'Comprehensive Profile',
    data: {
      ...userProfileData,
      ...customerData,
      additionalField1: 'Value 1',
      additionalField2: 'Value 2',
      additionalField3: 'Value 3',
      additionalField4: 'Value 4'
    },
    config: {
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
        key: 'phone',
        label: 'Phone'
      }, {
        key: 'department',
        label: 'Department'
      }, {
        key: 'role',
        label: 'Role'
      }, {
        key: 'location',
        label: 'Location'
      }, {
        key: 'startDate',
        label: 'Start Date'
      }, {
        key: 'manager',
        label: 'Manager'
      }, {
        key: 'status',
        label: 'Status'
      }, {
        key: 'companyName',
        label: 'Company'
      }, {
        key: 'industry',
        label: 'Industry'
      }],
      layout: 'grid'
    }
  }
}`,...(_=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var z,Z,q;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    title: 'Styled Card',
    data: userProfileData,
    config: {
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
      }],
      layout: 'grid'
    },
    className: 'border-l-4 border-blue-500 shadow-lg'
  }
}`,...(q=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:q.source}}};var K,Q,X;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    title: 'Card in Controlled Context',
    data: userProfileData,
    config: {
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
    },
    className: 'mb-0' // This should prevent title rendering
  },
  parameters: {
    docs: {
      description: {
        story: 'When className contains "mb-0", the title is not rendered (for controlled contexts).'
      }
    }
  }
}`,...(X=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var ee,ae,te;f.parameters={...f.parameters,docs:{...(ee=f.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    title: 'Responsive Card Layout',
    data: customerData,
    config: {
      fields: [{
        key: 'companyName',
        label: 'Company Name'
      }, {
        key: 'contactPerson',
        label: 'Contact Person'
      }, {
        key: 'email',
        label: 'Email Address'
      }, {
        key: 'phone',
        label: 'Phone Number'
      }, {
        key: 'address',
        label: 'Address'
      }, {
        key: 'industry',
        label: 'Industry'
      }],
      layout: 'grid'
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test how the card displays on mobile devices.'
      }
    }
  }
}`,...(te=(ae=f.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var ne,re,se;k.parameters={...k.parameters,docs:{...(ne=k.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <CardDisplay title="Grid Layout" data={userProfileData} config={{
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
      }],
      layout: 'grid'
    }} />
      <CardDisplay title="List Layout" data={userProfileData} config={{
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
      }],
      layout: 'list'
    }} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of grid and list layouts.'
      }
    }
  }
}`,...(se=(re=k.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};const ye=["BasicCard","ListLayout","WithoutTitle","CustomRendering","CustomerCard","MissingData","EmptyConfiguration","NoConfiguration","ManyFields","CustomStyling","ControlledContext","ResponsiveCard","MultipleCards"];export{l as BasicCard,b as ControlledContext,d as CustomRendering,g as CustomStyling,m as CustomerCard,u as EmptyConfiguration,o as ListLayout,p as ManyFields,c as MissingData,k as MultipleCards,y as NoConfiguration,f as ResponsiveCard,i as WithoutTitle,ye as __namedExportsOrder,ue as default};
