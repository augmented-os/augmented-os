import{D as w}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const ne={title:"Demo Tasks/Coding/Deployment Pipeline",component:w,parameters:{docs:{description:{component:`
# CI/CD Deployment Pipeline

Continuous integration and deployment pipeline showing different stages of the software delivery process.
Demonstrates DevOps workflows, automated testing, and deployment management.

**Pipeline Stages:**
- Building - Code compilation and dependency resolution
- Testing - Automated test execution
- Ready to Deploy - All checks passed, awaiting deployment
- Deploying - Active deployment in progress
- Failed - Pipeline failure with error details
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},e={componentId:"deployment-pipeline-demo",name:"Deployment Pipeline",componentType:"Display",title:"Pipeline #{{buildNumber}} - {{branch}}",customProps:{displayType:"card",fields:[{key:"commit",label:"Commit"},{key:"author",label:"Author"},{key:"triggeredBy",label:"Triggered By"},{key:"startTime",label:"Started"},{key:"duration",label:"Duration"},{key:"environment",label:"Target Environment"},{key:"status",label:"Status"},{key:"testResults",label:"Test Results"},{key:"coverage",label:"Code Coverage"}],layout:"grid"},actions:[{actionKey:"view_logs",label:"View Logs",style:"secondary"},{actionKey:"deploy",label:"Deploy",style:"primary",visibleIf:'status == "ready"'},{actionKey:"retry",label:"Retry",style:"primary",visibleIf:'status == "failed"'},{actionKey:"rollback",label:"Rollback",style:"danger",visibleIf:'status == "deployed"'}]},n={name:"Building - In Progress",args:{schema:e,data:{buildNumber:"1,847",branch:"main",commit:"a7b8c9d - Fix authentication middleware bug",author:"sarah.dev",triggeredBy:"Push to main branch",startTime:"2 minutes ago",duration:"2m 14s (running)",environment:"Production",status:"building",testResults:"Pending...",coverage:"Calculating..."}},parameters:{docs:{description:{story:"Build pipeline in progress showing compilation and dependency resolution."}}}},t={name:"Testing - Running Tests",args:{schema:e,data:{buildNumber:"1,847",branch:"main",commit:"a7b8c9d - Fix authentication middleware bug",author:"sarah.dev",triggeredBy:"Push to main branch",startTime:"5 minutes ago",duration:"4m 32s (running)",environment:"Production",status:"testing",testResults:"847 passed, 12 running, 0 failed",coverage:"94.2% (+0.3%)"}},parameters:{docs:{description:{story:"Pipeline executing automated tests including unit, integration, and e2e tests."}}}},a={name:"Ready to Deploy",args:{schema:e,data:{buildNumber:"1,847",branch:"main",commit:"a7b8c9d - Fix authentication middleware bug",author:"sarah.dev",triggeredBy:"Push to main branch",startTime:"8 minutes ago",duration:"6m 18s",environment:"Production",status:"ready",testResults:"859 passed, 0 failed",coverage:"94.2% (+0.3%)"}},parameters:{docs:{description:{story:"Pipeline completed successfully and ready for deployment to production."}}}},i={name:"Deploying to Production",args:{schema:e,data:{buildNumber:"1,847",branch:"main",commit:"a7b8c9d - Fix authentication middleware bug",author:"sarah.dev",triggeredBy:"Manual deployment by john.smith",startTime:"12 minutes ago",duration:"8m 45s (deploying)",environment:"Production",status:"deploying",testResults:"859 passed, 0 failed",coverage:"94.2% (+0.3%)"}},parameters:{docs:{description:{story:"Active deployment in progress with infrastructure updates and health checks."}}}},r={name:"Pipeline Failed",args:{schema:e,data:{buildNumber:"1,846",branch:"feature/new-auth",commit:"b8c9d0e - Add new authentication flow",author:"alice.chen",triggeredBy:"Pull request #1248",startTime:"25 minutes ago",duration:"3m 12s (failed)",environment:"Staging",status:"failed",testResults:"834 passed, 7 failed",coverage:"92.8% (-1.1%)"}},parameters:{docs:{description:{story:"Failed pipeline with test failures requiring developer attention."}}}};var o,s,d;n.parameters={...n.parameters,docs:{...(o=n.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'Building - In Progress',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '2 minutes ago',
      duration: '2m 14s (running)',
      environment: 'Production',
      status: 'building',
      testResults: 'Pending...',
      coverage: 'Calculating...'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Build pipeline in progress showing compilation and dependency resolution.'
      }
    }
  }
}`,...(d=(s=n.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};var m,l,c;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'Testing - Running Tests',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '5 minutes ago',
      duration: '4m 32s (running)',
      environment: 'Production',
      status: 'testing',
      testResults: '847 passed, 12 running, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pipeline executing automated tests including unit, integration, and e2e tests.'
      }
    }
  }
}`,...(c=(l=t.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var u,p,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Ready to Deploy',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Push to main branch',
      startTime: '8 minutes ago',
      duration: '6m 18s',
      environment: 'Production',
      status: 'ready',
      testResults: '859 passed, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pipeline completed successfully and ready for deployment to production.'
      }
    }
  }
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var y,h,b;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Deploying to Production',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,847',
      branch: 'main',
      commit: 'a7b8c9d - Fix authentication middleware bug',
      author: 'sarah.dev',
      triggeredBy: 'Manual deployment by john.smith',
      startTime: '12 minutes ago',
      duration: '8m 45s (deploying)',
      environment: 'Production',
      status: 'deploying',
      testResults: '859 passed, 0 failed',
      coverage: '94.2% (+0.3%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Active deployment in progress with infrastructure updates and health checks.'
      }
    }
  }
}`,...(b=(h=i.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var v,P,f;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Pipeline Failed',
  args: {
    schema: deploymentPipelineSchema,
    data: {
      buildNumber: '1,846',
      branch: 'feature/new-auth',
      commit: 'b8c9d0e - Add new authentication flow',
      author: 'alice.chen',
      triggeredBy: 'Pull request #1248',
      startTime: '25 minutes ago',
      duration: '3m 12s (failed)',
      environment: 'Staging',
      status: 'failed',
      testResults: '834 passed, 7 failed',
      coverage: '92.8% (-1.1%)'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Failed pipeline with test failures requiring developer attention.'
      }
    }
  }
}`,...(f=(P=r.parameters)==null?void 0:P.docs)==null?void 0:f.source}}};const te=["Building","Testing","ReadyToDeploy","Deploying","Failed"];export{n as Building,i as Deploying,r as Failed,a as ReadyToDeploy,t as Testing,te as __namedExportsOrder,ne as default};
