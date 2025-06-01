import{j as n}from"./jsx-runtime-CmtfZKef.js";import{T as ne}from"./TableDisplay-BZ_5kpJV.js";import{C as te}from"./CardDisplay-DissT9ux.js";import{T as se}from"./TextDisplay-svPV22jp.js";import{A as re}from"./ActionButtons-B9l-49-W.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";const le=({field:e,data:a,onAction:t})=>{const g=()=>{var D;switch(e.type){case"table":return n.jsx(ne,{data:e.data||a[e.fieldKey]||[],config:e.tableConfig,className:e.className});case"card":return n.jsx(te,{title:e.label,data:e.data||a,config:e.cardConfig,className:e.className});case"text":return n.jsx(se,{label:e.label,value:e.data||a[e.fieldKey],className:e.className});case"actions":return n.jsx(re,{actions:((D=e.actionsConfig)==null?void 0:D.actions)||[],onAction:t,data:a,className:e.className});default:return console.warn(`Unsupported display type: ${e.type}`),n.jsxs("div",{className:"text-gray-500 text-sm",children:["Unsupported display type: ",e.type]})}};return n.jsx("div",{className:`display-field display-field--${e.type}`,children:g()})},be={title:"Dynamic UI/Atomic Components/Display Components/Display Field",component:le,parameters:{layout:"padded",docs:{description:{component:"A versatile display component that can render different types of displays (table, card, text, actions) based on configuration."}}},argTypes:{field:{control:"object",description:"Configuration object defining the display type and settings"},data:{control:"object",description:"Data to be displayed by the field"},onAction:{action:"action-triggered",description:"Callback function for handling actions"}}},f=[{id:1,name:"John Doe",email:"john@example.com",status:"Active"},{id:2,name:"Jane Smith",email:"jane@example.com",status:"Inactive"},{id:3,name:"Bob Johnson",email:"bob@example.com",status:"Pending"}],w={name:"John Doe",email:"john.doe@example.com",phone:"+1 (555) 123-4567",department:"Engineering",joinDate:"2023-01-15",status:"Active"},s={args:{field:{fieldKey:"userName",label:"User Name",type:"text"},data:{userName:"John Doe"}}},r={args:{field:{fieldKey:"customField",label:"Custom Text",type:"text",data:"This is custom data not from the main data object"},data:{}}},l={args:{field:{fieldKey:"users",type:"table",tableConfig:{columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/4"}]}},data:{users:f}}},i={args:{field:{fieldKey:"users",type:"table",tableConfig:{columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/4",render:e=>{const a=e,t=g=>{switch(g){case"Active":return"bg-green-100 text-green-800";case"Inactive":return"bg-red-100 text-red-800";case"Pending":return"bg-yellow-100 text-yellow-800";default:return"bg-gray-100 text-gray-800"}};return n.jsx("span",{className:`px-2 py-1 text-xs font-semibold rounded-full ${t(a)}`,children:a})}}],rowClassName:e=>e.status==="Inactive"?"bg-gray-50":""}},data:{users:f}}},o={args:{field:{fieldKey:"userInfo",label:"User Information",type:"card",cardConfig:{fields:[{key:"name",label:"Full Name"},{key:"email",label:"Email Address"},{key:"phone",label:"Phone Number"},{key:"department",label:"Department"},{key:"joinDate",label:"Join Date"},{key:"status",label:"Status"}],layout:"grid"}},data:{userInfo:w}}},d={args:{field:{fieldKey:"userInfo",label:"User Information (List Layout)",type:"card",cardConfig:{fields:[{key:"name",label:"Full Name"},{key:"email",label:"Email Address"},{key:"phone",label:"Phone Number"},{key:"department",label:"Department"}],layout:"list"}},data:{userInfo:w}}},c={args:{field:{fieldKey:"userInfo",label:"User Profile",type:"card",cardConfig:{fields:[{key:"name",label:"Full Name"},{key:"email",label:"Email Address"},{key:"status",label:"Account Status",render:e=>{const a=e,t=a==="Active";return n.jsxs("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`,children:[n.jsx("span",{className:`w-1.5 h-1.5 mr-1.5 rounded-full ${t?"bg-green-400":"bg-red-400"}`}),a]})}}]}},data:{userInfo:w}}},m={args:{field:{fieldKey:"actions",type:"actions",actionsConfig:{actions:[{actionKey:"edit",label:"Edit",style:"primary"},{actionKey:"view",label:"View Details",style:"secondary"},{actionKey:"delete",label:"Delete",style:"danger"}]}},data:{id:1,name:"John Doe"}}},p={args:{field:{fieldKey:"actions",type:"actions",actionsConfig:{actions:[{actionKey:"save",label:"Save",style:"primary"}]}},data:{id:1}}},u={args:{field:{fieldKey:"emptyData",type:"table",tableConfig:{columns:[{key:"id",label:"ID"},{key:"name",label:"Name"}]}},data:{emptyData:[]}}},y={args:{field:{fieldKey:"test",type:"unsupported"},data:{}},parameters:{docs:{description:{story:"Demonstrates error handling for unsupported display types."}}}},b={args:{field:{fieldKey:"users",type:"table",tableConfig:{columns:[{key:"id",label:"ID",width:"w-16"},{key:"name",label:"Full Name",width:"w-1/4"},{key:"email",label:"Email Address",width:"w-1/3"},{key:"department",label:"Department",width:"w-1/4"},{key:"status",label:"Status",width:"w-20"}]}},data:{users:[...f,{id:4,name:"Alice Cooper",email:"alice.cooper@verylongdomain.example.com",status:"Active",department:"Product Management"},{id:5,name:"Charlie Brown",email:"charlie.brown@company.co.uk",status:"Pending",department:"Customer Success"}]}},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test table responsiveness on small screens."}}}};var h,C,k;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'userName',
      label: 'User Name',
      type: 'text'
    } as DisplayFieldConfig,
    data: {
      userName: 'John Doe'
    }
  }
}`,...(k=(C=s.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var x,N,v;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'customField',
      label: 'Custom Text',
      type: 'text',
      data: 'This is custom data not from the main data object'
    } as DisplayFieldConfig,
    data: {}
  }
}`,...(v=(N=r.parameters)==null?void 0:N.docs)==null?void 0:v.source}}};var K,A,I;l.parameters={...l.parameters,docs:{...(K=l.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
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
    } as DisplayFieldConfig,
    data: {
      users: sampleTableData
    }
  }
}`,...(I=(A=l.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var S,T,F;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
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
          width: 'w-1/4',
          render: (value: unknown) => {
            const status = value as string;
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'Active':
                  return 'bg-green-100 text-green-800';
                case 'Inactive':
                  return 'bg-red-100 text-red-800';
                case 'Pending':
                  return 'bg-yellow-100 text-yellow-800';
                default:
                  return 'bg-gray-100 text-gray-800';
              }
            };
            return <span className={\`px-2 py-1 text-xs font-semibold rounded-full \${getStatusColor(status)}\`}>
                  {status}
                </span>;
          }
        }],
        rowClassName: (row: Record<string, unknown>) => {
          return row.status === 'Inactive' ? 'bg-gray-50' : '';
        }
      }
    } as DisplayFieldConfig,
    data: {
      users: sampleTableData
    }
  }
}`,...(F=(T=i.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};var j,E,P;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Information',
      type: 'card',
      cardConfig: {
        fields: [{
          key: 'name',
          label: 'Full Name'
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
          key: 'joinDate',
          label: 'Join Date'
        }, {
          key: 'status',
          label: 'Status'
        }],
        layout: 'grid'
      }
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData
    }
  }
}`,...(P=(E=o.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var U,$,J;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Information (List Layout)',
      type: 'card',
      cardConfig: {
        fields: [{
          key: 'name',
          label: 'Full Name'
        }, {
          key: 'email',
          label: 'Email Address'
        }, {
          key: 'phone',
          label: 'Phone Number'
        }, {
          key: 'department',
          label: 'Department'
        }],
        layout: 'list'
      }
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData
    }
  }
}`,...(J=($=d.parameters)==null?void 0:$.docs)==null?void 0:J.source}}};var B,R,L;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'userInfo',
      label: 'User Profile',
      type: 'card',
      cardConfig: {
        fields: [{
          key: 'name',
          label: 'Full Name'
        }, {
          key: 'email',
          label: 'Email Address'
        }, {
          key: 'status',
          label: 'Account Status',
          render: (value: unknown) => {
            const status = value as string;
            const isActive = status === 'Active';
            return <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`}>
                  <span className={\`w-1.5 h-1.5 mr-1.5 rounded-full \${isActive ? 'bg-green-400' : 'bg-red-400'}\`}></span>
                  {status}
                </span>;
          }
        }]
      }
    } as DisplayFieldConfig,
    data: {
      userInfo: sampleCardData
    }
  }
}`,...(L=(R=c.parameters)==null?void 0:R.docs)==null?void 0:L.source}}};var W,M,V;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'actions',
      type: 'actions',
      actionsConfig: {
        actions: [{
          actionKey: 'edit',
          label: 'Edit',
          style: 'primary'
        }, {
          actionKey: 'view',
          label: 'View Details',
          style: 'secondary'
        }, {
          actionKey: 'delete',
          label: 'Delete',
          style: 'danger'
        }]
      }
    } as DisplayFieldConfig,
    data: {
      id: 1,
      name: 'John Doe'
    }
  }
}`,...(V=(M=m.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var _,O,q;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'actions',
      type: 'actions',
      actionsConfig: {
        actions: [{
          actionKey: 'save',
          label: 'Save',
          style: 'primary'
        }]
      }
    } as DisplayFieldConfig,
    data: {
      id: 1
    }
  }
}`,...(q=(O=p.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var z,G,H;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'emptyData',
      type: 'table',
      tableConfig: {
        columns: [{
          key: 'id',
          label: 'ID'
        }, {
          key: 'name',
          label: 'Name'
        }]
      }
    } as DisplayFieldConfig,
    data: {
      emptyData: []
    }
  }
}`,...(H=(G=u.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var Q,X,Y;y.parameters={...y.parameters,docs:{...(Q=y.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'test',
      type: 'unsupported' as 'table' | 'card' | 'text' | 'actions'
    } as DisplayFieldConfig,
    data: {}
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling for unsupported display types.'
      }
    }
  }
}`,...(Y=(X=y.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    field: {
      fieldKey: 'users',
      type: 'table',
      tableConfig: {
        columns: [{
          key: 'id',
          label: 'ID',
          width: 'w-16'
        }, {
          key: 'name',
          label: 'Full Name',
          width: 'w-1/4'
        }, {
          key: 'email',
          label: 'Email Address',
          width: 'w-1/3'
        }, {
          key: 'department',
          label: 'Department',
          width: 'w-1/4'
        }, {
          key: 'status',
          label: 'Status',
          width: 'w-20'
        }]
      }
    } as DisplayFieldConfig,
    data: {
      users: [...sampleTableData, {
        id: 4,
        name: 'Alice Cooper',
        email: 'alice.cooper@verylongdomain.example.com',
        status: 'Active',
        department: 'Product Management'
      }, {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie.brown@company.co.uk',
        status: 'Pending',
        department: 'Customer Success'
      }]
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test table responsiveness on small screens.'
      }
    }
  }
}`,...(ae=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};const ge=["TextDisplay","TextDisplayWithCustomData","TableDisplay","TableWithCustomRendering","CardDisplay","CardDisplayList","CardWithCustomRendering","ActionButtons","ActionButtonsMinimal","EmptyTable","UnsupportedType","ResponsiveTable"];export{m as ActionButtons,p as ActionButtonsMinimal,o as CardDisplay,d as CardDisplayList,c as CardWithCustomRendering,u as EmptyTable,b as ResponsiveTable,l as TableDisplay,i as TableWithCustomRendering,s as TextDisplay,r as TextDisplayWithCustomData,y as UnsupportedType,ge as __namedExportsOrder,be as default};
