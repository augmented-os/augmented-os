import{D as v}from"./DynamicUIRenderer-UL-Os6h0.js";import"./jsx-runtime-CmtfZKef.js";import"./index-Dm8qopDP.js";import"./_commonjsHelpers-BosuxZz1.js";import"./DynamicForm-CQvi70jR.js";import"./FormSection-BXhPtV5Y.js";import"./TextInput-B-b59Q_e.js";import"./input-CbSxzvDx.js";import"./utils-CytzSlOG.js";import"./label-pJGNFEHw.js";import"./index-nna2CGTn.js";import"./index-C9U_LHPE.js";import"./NumberInput-BM-Ag6sN.js";import"./SelectInput-Cji-AcSY.js";import"./check-M_MmD5Zy.js";import"./TextareaInput-d_sTEtii.js";import"./BooleanInput-DAkAH8Ho.js";import"./checkbox-BGOkVoFJ.js";import"./DateInput-DrtaTLZA.js";import"./FileInput-CkTp4YSM.js";import"./button-BIv8UjPY.js";import"./MultiSelectInput-GIzsWy5u.js";import"./EmailInput-BDtJ9KKU.js";import"./conditions-CsAx6Gnl.js";import"./FormActions-DwxbG8kR.js";import"./QueryClientProvider-mz6q_e7V.js";import"./iframe-BVJQxLgr.js";import"./DynamicDisplay-CN3Fs3X6.js";import"./TableDisplay-BZ_5kpJV.js";import"./CardDisplay-DissT9ux.js";import"./ActionButtons-B9l-49-W.js";import"./DynamicUIErrorBoundary-B-AhmovT.js";import"./DynamicUIStateContext-BU6sB-Jv.js";const Y={title:"Demo Tasks/Coding/Code Review",component:v,parameters:{docs:{description:{component:`
# Code Review Workflow

Pull request review process showing different states of the code review lifecycle.
Demonstrates how Dynamic UI handles developer workflows and collaboration tools.

**States Include:**
- Pending Review - PR awaiting initial review
- Approved - PR approved and ready to merge
- Changes Requested - PR needs modifications
- Merged - Successfully merged PR
        `}}},argTypes:{onSubmit:{action:"submitted"},onCancel:{action:"cancelled"},onAction:{action:"action triggered"}}},n={componentId:"code-review-demo",name:"Code Review Workflow",componentType:"Display",title:"Pull Request #{{prNumber}}: {{title}}",customProps:{displayType:"card",fields:[{key:"title",label:"PR Title"},{key:"author",label:"Author"},{key:"branch",label:"Branch"},{key:"description",label:"Description"},{key:"filesChanged",label:"Files Changed"},{key:"additions",label:"Lines Added"},{key:"deletions",label:"Lines Deleted"},{key:"reviewers",label:"Reviewers"},{key:"status",label:"Status"}],layout:"grid"},actions:[{actionKey:"approve",label:"Approve",style:"primary"},{actionKey:"request_changes",label:"Request Changes",style:"danger"},{actionKey:"comment",label:"Add Comment",style:"secondary"},{actionKey:"merge",label:"Merge",style:"primary",visibleIf:'status == "approved"'}]},e={name:"Pending Review",args:{schema:n,data:{prNumber:"1247",title:"Add authentication middleware for API routes",author:"sarah.dev",branch:"feature/auth-middleware",description:"Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.",filesChanged:"12",additions:"+247",deletions:"-15",reviewers:"john.smith, alice.chen",status:"pending_review"}},parameters:{docs:{description:{story:"A pull request awaiting initial review from team members."}}}},a={name:"Approved - Ready to Merge",args:{schema:n,data:{prNumber:"1247",title:"Add authentication middleware for API routes",author:"sarah.dev",branch:"feature/auth-middleware",description:"Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.",filesChanged:"12",additions:"+247",deletions:"-15",reviewers:"john.smith ✅, alice.chen ✅",status:"approved"}},parameters:{docs:{description:{story:"A pull request that has been approved by all required reviewers and is ready to merge."}}}},t={name:"Changes Requested",args:{schema:n,data:{prNumber:"1247",title:"Add authentication middleware for API routes",author:"sarah.dev",branch:"feature/auth-middleware",description:"Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.",filesChanged:"12",additions:"+247",deletions:"-15",reviewers:"john.smith ❌, alice.chen ⏳",status:"changes_requested"}},parameters:{docs:{description:{story:"A pull request where reviewers have requested changes before approval."}}}},r={name:"Successfully Merged",args:{schema:{...n,actions:[]},data:{prNumber:"1247",title:"Add authentication middleware for API routes",author:"sarah.dev",branch:"feature/auth-middleware",description:"Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.",filesChanged:"12",additions:"+247",deletions:"-15",reviewers:"john.smith ✅, alice.chen ✅",status:"merged"}},parameters:{docs:{description:{story:"A successfully merged pull request showing the final state."}}}};var i,s,o;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Pending Review',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith, alice.chen',
      status: 'pending_review'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request awaiting initial review from team members.'
      }
    }
  }
}`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var d,l,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Approved - Ready to Merge',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ✅, alice.chen ✅',
      status: 'approved'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request that has been approved by all required reviewers and is ready to merge.'
      }
    }
  }
}`,...(m=(l=a.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var c,p,u;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'Changes Requested',
  args: {
    schema: codeReviewSchema,
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ❌, alice.chen ⏳',
      status: 'changes_requested'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A pull request where reviewers have requested changes before approval.'
      }
    }
  }
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var h,g,w;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Successfully Merged',
  args: {
    schema: {
      ...codeReviewSchema,
      actions: [] // No actions available for merged PRs
    },
    data: {
      prNumber: '1247',
      title: 'Add authentication middleware for API routes',
      author: 'sarah.dev',
      branch: 'feature/auth-middleware',
      description: 'Implements JWT-based authentication middleware for all API endpoints. Includes rate limiting and request validation.',
      filesChanged: '12',
      additions: '+247',
      deletions: '-15',
      reviewers: 'john.smith ✅, alice.chen ✅',
      status: 'merged'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'A successfully merged pull request showing the final state.'
      }
    }
  }
}`,...(w=(g=r.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};const Z=["PendingReview","Approved","ChangesRequested","Merged"];export{a as Approved,t as ChangesRequested,r as Merged,e as PendingReview,Z as __namedExportsOrder,Y as default};
