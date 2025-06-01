import{j as a}from"./jsx-runtime-CmtfZKef.js";import{T as K}from"./TableDisplay-BZ_5kpJV.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./utils-CytzSlOG.js";const se={title:"Dynamic UI/Atomic Components/Display Components/Table Display",component:K,parameters:{layout:"padded",docs:{description:{component:"A table display component that renders data in a structured table format with configurable columns, custom rendering, and row styling."}}},argTypes:{data:{control:"object",description:"Array of data objects to display in the table"},config:{control:"object",description:"Configuration object defining columns and table behavior"},className:{control:"text",description:"Additional CSS classes for custom styling"}}},b=[{id:1,name:"John Doe",email:"john@example.com",status:"Active"},{id:2,name:"Jane Smith",email:"jane@example.com",status:"Inactive"},{id:3,name:"Bob Johnson",email:"bob@example.com",status:"Pending"}],y=[{id:1,name:"John Doe",email:"john.doe@company.com",department:"Engineering",role:"Senior Developer",salary:95e3,startDate:"2022-03-15",status:"Active"},{id:2,name:"Jane Smith",email:"jane.smith@company.com",department:"Product",role:"Product Manager",salary:105e3,startDate:"2021-08-20",status:"Active"},{id:3,name:"Bob Johnson",email:"bob.johnson@company.com",department:"Sales",role:"Sales Representative",salary:65e3,startDate:"2023-01-10",status:"Inactive"},{id:4,name:"Alice Cooper",email:"alice.cooper@company.com",department:"Engineering",role:"Frontend Developer",salary:85e3,startDate:"2023-06-01",status:"Active"}],Q=[{id:"PROJ-001",name:"Dynamic UI Framework",status:"In Progress",priority:"High",budget:15e4,completion:75,team:"Frontend Engineering",dueDate:"2024-06-30"},{id:"PROJ-002",name:"Customer Portal",status:"Completed",priority:"Medium",budget:8e4,completion:100,team:"Full Stack",dueDate:"2024-03-15"},{id:"PROJ-003",name:"Mobile App Redesign",status:"On Hold",priority:"Low",budget:12e4,completion:25,team:"Mobile Team",dueDate:"2024-12-01"}],r={args:{data:b,config:{columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/4"}]}}},o={args:{data:y,config:{columns:[{key:"id",label:"ID",width:"w-16"},{key:"name",label:"Name",width:"w-1/4"},{key:"email",label:"Email",width:"w-1/4"},{key:"department",label:"Department",width:"w-1/6"},{key:"role",label:"Role",width:"w-1/4"},{key:"status",label:"Status",width:"w-20"}]}}},l={args:{data:y,config:{columns:[{key:"name",label:"Employee",width:"w-1/4"},{key:"department",label:"Department",width:"w-1/6"},{key:"salary",label:"Salary",width:"w-1/6",render:t=>{const e=t;return a.jsxs("span",{className:"font-mono text-green-600",children:["$",e.toLocaleString()]})}},{key:"status",label:"Status",width:"w-1/6",render:t=>{const e=t,n=s=>{switch(s){case"Active":return"bg-green-100 text-green-800";case"Inactive":return"bg-red-100 text-red-800";case"Pending":return"bg-yellow-100 text-yellow-800";default:return"bg-gray-100 text-gray-800"}};return a.jsx("span",{className:`px-2 py-1 text-xs font-semibold rounded-full ${n(e)}`,children:e})}},{key:"startDate",label:"Start Date",width:"w-1/6",render:t=>{const e=new Date(t);return a.jsx("span",{className:"text-gray-600",children:e.toLocaleDateString()})}}]}}},i={args:{data:Q,config:{columns:[{key:"id",label:"Project ID",width:"w-24"},{key:"name",label:"Project Name",width:"w-1/4"},{key:"status",label:"Status",width:"w-1/6",render:t=>{const e=t,n=s=>{switch(s){case"In Progress":return"bg-blue-100 text-blue-800";case"Completed":return"bg-green-100 text-green-800";case"On Hold":return"bg-yellow-100 text-yellow-800";case"Cancelled":return"bg-red-100 text-red-800";default:return"bg-gray-100 text-gray-800"}};return a.jsx("span",{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${n(e)}`,children:e})}},{key:"priority",label:"Priority",width:"w-20",render:t=>{const e=t,n=s=>{switch(s){case"High":return"text-red-600 font-semibold";case"Medium":return"text-yellow-600 font-semibold";case"Low":return"text-green-600 font-semibold";default:return"text-gray-600"}};return a.jsx("span",{className:n(e),children:e})}},{key:"completion",label:"Progress",width:"w-1/6",render:t=>{const e=t;return a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"flex-1 bg-gray-200 rounded-full h-2",children:a.jsx("div",{className:"bg-blue-600 h-2 rounded-full transition-all duration-300",style:{width:`${e}%`}})}),a.jsxs("span",{className:"text-xs font-medium w-8",children:[e,"%"]})]})}}]}}},d={args:{data:y,config:{columns:[{key:"name",label:"Name",width:"w-1/3"},{key:"department",label:"Department",width:"w-1/4"},{key:"role",label:"Role",width:"w-1/4"},{key:"status",label:"Status",width:"w-1/6"}],rowClassName:t=>t.status==="Inactive"?"bg-red-50 opacity-75":t.department==="Engineering"?"bg-blue-50":""}}},c={args:{data:[],config:{columns:[{key:"id",label:"ID"},{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"status",label:"Status"}]}},parameters:{docs:{description:{story:"Shows how the table displays when no data is provided."}}}},m={args:{data:b},parameters:{docs:{description:{story:"Shows the fallback message when no table configuration is provided."}}}},u={args:{data:[{id:1,name:"John Doe with a Very Long Name That Should Wrap",email:"john.doe.with.very.long.email@verylongdomainname.example.com",description:"This is a very long description that should demonstrate how the table handles content that exceeds the normal column width and needs to wrap to multiple lines.",status:"Active"},{id:2,name:"Jane Smith",email:"jane@short.com",description:"Short description.",status:"Inactive"}],config:{columns:[{key:"id",label:"ID",width:"w-16"},{key:"name",label:"Name",width:"w-1/4"},{key:"email",label:"Email",width:"w-1/4"},{key:"description",label:"Description",width:"w-1/3"},{key:"status",label:"Status",width:"w-20"}]}}},p={args:{data:b,config:{columns:[{key:"id",label:"ID",width:"w-20"},{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"status",label:"Status",width:"w-1/4"}]},className:"border-2 border-blue-200 rounded-xl shadow-lg"}},w={args:{data:y,config:{columns:[{key:"name",label:"Name",width:"w-1/3"},{key:"email",label:"Email",width:"w-1/3"},{key:"department",label:"Dept",width:"w-1/6"},{key:"status",label:"Status",width:"w-1/6"}]}},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Test how the table behaves on small screens."}}}},g={args:{data:[{id:1,name:"John Doe",isActive:!0,score:95.5,tags:["developer","senior","frontend"],metadata:{location:"SF",timezone:"PST"},lastLogin:new Date("2024-01-15T10:30:00Z")},{id:2,name:"Jane Smith",isActive:!1,score:87.2,tags:["manager","product"],metadata:{location:"NY",timezone:"EST"},lastLogin:new Date("2024-01-10T15:45:00Z")}],config:{columns:[{key:"name",label:"Name",width:"w-1/4"},{key:"isActive",label:"Active",width:"w-20",render:t=>{const e=t;return a.jsx("span",{className:`w-3 h-3 rounded-full inline-block ${e?"bg-green-400":"bg-red-400"}`})}},{key:"score",label:"Score",width:"w-20",render:t=>{const e=t;return a.jsx("span",{className:"font-mono",children:e.toFixed(1)})}},{key:"tags",label:"Tags",width:"w-1/3",render:t=>{const e=t;return a.jsx("div",{className:"flex flex-wrap gap-1",children:e.map((n,s)=>a.jsx("span",{className:"px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded",children:n},s))})}},{key:"lastLogin",label:"Last Login",width:"w-1/4",render:t=>{const e=t;return a.jsx("span",{className:"text-sm text-gray-600",children:e.toLocaleString()})}}]}},parameters:{docs:{description:{story:"Demonstrates handling of complex data types including booleans, arrays, objects, and dates."}}}};var h,k,x;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    data: basicUserData,
    config: {
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
  }
}`,...(x=(k=r.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};var f,v,S;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    data: employeeData,
    config: {
      columns: [{
        key: 'id',
        label: 'ID',
        width: 'w-16'
      }, {
        key: 'name',
        label: 'Name',
        width: 'w-1/4'
      }, {
        key: 'email',
        label: 'Email',
        width: 'w-1/4'
      }, {
        key: 'department',
        label: 'Department',
        width: 'w-1/6'
      }, {
        key: 'role',
        label: 'Role',
        width: 'w-1/4'
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-20'
      }]
    }
  }
}`,...(S=(v=o.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var D,N,j;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    data: employeeData,
    config: {
      columns: [{
        key: 'name',
        label: 'Employee',
        width: 'w-1/4'
      }, {
        key: 'department',
        label: 'Department',
        width: 'w-1/6'
      }, {
        key: 'salary',
        label: 'Salary',
        width: 'w-1/6',
        render: (value: unknown) => {
          const salary = value as number;
          return <span className="font-mono text-green-600">\${salary.toLocaleString()}</span>;
        }
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-1/6',
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
      }, {
        key: 'startDate',
        label: 'Start Date',
        width: 'w-1/6',
        render: (value: unknown) => {
          const date = new Date(value as string);
          return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
        }
      }]
    }
  }
}`,...(j=(N=l.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var T,C,E;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    data: projectData,
    config: {
      columns: [{
        key: 'id',
        label: 'Project ID',
        width: 'w-24'
      }, {
        key: 'name',
        label: 'Project Name',
        width: 'w-1/4'
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-1/6',
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
        width: 'w-20',
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
        key: 'completion',
        label: 'Progress',
        width: 'w-1/6',
        render: (value: unknown) => {
          const percentage = value as number;
          return <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
                width: \`\${percentage}%\`
              }}></div>
                </div>
                <span className="text-xs font-medium w-8">{percentage}%</span>
              </div>;
        }
      }]
    }
  }
}`,...(E=(C=i.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var A,I,P;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    data: employeeData,
    config: {
      columns: [{
        key: 'name',
        label: 'Name',
        width: 'w-1/3'
      }, {
        key: 'department',
        label: 'Department',
        width: 'w-1/4'
      }, {
        key: 'role',
        label: 'Role',
        width: 'w-1/4'
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-1/6'
      }],
      rowClassName: (row: Record<string, unknown>) => {
        if (row.status === 'Inactive') return 'bg-red-50 opacity-75';
        if (row.department === 'Engineering') return 'bg-blue-50';
        return '';
      }
    }
  }
}`,...(P=(I=d.parameters)==null?void 0:I.docs)==null?void 0:P.source}}};var L,J,R;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    data: [],
    config: {
      columns: [{
        key: 'id',
        label: 'ID'
      }, {
        key: 'name',
        label: 'Name'
      }, {
        key: 'email',
        label: 'Email'
      }, {
        key: 'status',
        label: 'Status'
      }]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the table displays when no data is provided.'
      }
    }
  }
}`,...(R=(J=c.parameters)==null?void 0:J.docs)==null?void 0:R.source}}};var $,F,O;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    data: basicUserData
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the fallback message when no table configuration is provided.'
      }
    }
  }
}`,...(O=(F=m.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var H,M,U;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: [{
      id: 1,
      name: 'John Doe with a Very Long Name That Should Wrap',
      email: 'john.doe.with.very.long.email@verylongdomainname.example.com',
      description: 'This is a very long description that should demonstrate how the table handles content that exceeds the normal column width and needs to wrap to multiple lines.',
      status: 'Active'
    }, {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@short.com',
      description: 'Short description.',
      status: 'Inactive'
    }],
    config: {
      columns: [{
        key: 'id',
        label: 'ID',
        width: 'w-16'
      }, {
        key: 'name',
        label: 'Name',
        width: 'w-1/4'
      }, {
        key: 'email',
        label: 'Email',
        width: 'w-1/4'
      }, {
        key: 'description',
        label: 'Description',
        width: 'w-1/3'
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-20'
      }]
    }
  }
}`,...(U=(M=u.parameters)==null?void 0:M.docs)==null?void 0:U.source}}};var W,z,B;p.parameters={...p.parameters,docs:{...(W=p.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    data: basicUserData,
    config: {
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
    },
    className: 'border-2 border-blue-200 rounded-xl shadow-lg'
  }
}`,...(B=(z=p.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var V,Z,Y;w.parameters={...w.parameters,docs:{...(V=w.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    data: employeeData,
    config: {
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
        label: 'Dept',
        width: 'w-1/6'
      }, {
        key: 'status',
        label: 'Status',
        width: 'w-1/6'
      }]
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Test how the table behaves on small screens.'
      }
    }
  }
}`,...(Y=(Z=w.parameters)==null?void 0:Z.docs)==null?void 0:Y.source}}};var _,q,G;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    data: [{
      id: 1,
      name: 'John Doe',
      isActive: true,
      score: 95.5,
      tags: ['developer', 'senior', 'frontend'],
      metadata: {
        location: 'SF',
        timezone: 'PST'
      },
      lastLogin: new Date('2024-01-15T10:30:00Z')
    }, {
      id: 2,
      name: 'Jane Smith',
      isActive: false,
      score: 87.2,
      tags: ['manager', 'product'],
      metadata: {
        location: 'NY',
        timezone: 'EST'
      },
      lastLogin: new Date('2024-01-10T15:45:00Z')
    }],
    config: {
      columns: [{
        key: 'name',
        label: 'Name',
        width: 'w-1/4'
      }, {
        key: 'isActive',
        label: 'Active',
        width: 'w-20',
        render: (value: unknown) => {
          const isActive = value as boolean;
          return <span className={\`w-3 h-3 rounded-full inline-block \${isActive ? 'bg-green-400' : 'bg-red-400'}\`}></span>;
        }
      }, {
        key: 'score',
        label: 'Score',
        width: 'w-20',
        render: (value: unknown) => {
          const score = value as number;
          return <span className="font-mono">{score.toFixed(1)}</span>;
        }
      }, {
        key: 'tags',
        label: 'Tags',
        width: 'w-1/3',
        render: (value: unknown) => {
          const tags = value as string[];
          return <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>)}
              </div>;
        }
      }, {
        key: 'lastLogin',
        label: 'Last Login',
        width: 'w-1/4',
        render: (value: unknown) => {
          const date = value as Date;
          return <span className="text-sm text-gray-600">{date.toLocaleString()}</span>;
        }
      }]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of complex data types including booleans, arrays, objects, and dates.'
      }
    }
  }
}`,...(G=(q=g.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};const re=["BasicTable","EmployeeTable","WithCustomRendering","ProjectTable","WithRowStyling","EmptyTable","NoConfiguration","LongContent","CustomStyling","ResponsiveTable","ComplexDataTypes"];export{r as BasicTable,g as ComplexDataTypes,p as CustomStyling,o as EmployeeTable,c as EmptyTable,u as LongContent,m as NoConfiguration,i as ProjectTable,w as ResponsiveTable,l as WithCustomRendering,d as WithRowStyling,re as __namedExportsOrder,se as default};
