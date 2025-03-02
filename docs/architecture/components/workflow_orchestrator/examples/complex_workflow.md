# Complex Workflow Example

This document provides an advanced example of a workflow definition that demonstrates more complex features of the Workflow Orchestrator Service.

## Loan Application Workflow

The following example illustrates a complex loan application workflow that includes:


1. Event-based waiting
2. Parallel execution paths
3. Conditional branching
4. Human approval steps
5. Compensation mechanisms
6. Timeout handling

### Workflow Definition

```json
{
  "id": "loan-application-wf",
  "name": "Loan Application Workflow",
  "description": "Process loan applications from submission to funding",
  "version": "1.0.0",
  "steps": [
    {
      "stepId": "validate_application",
      "type": "TASK",
      "taskId": "application_validation_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantInfo": "${workflow.input.applicantInfo}",
        "loanDetails": "${workflow.input.loanDetails}"
      },
      "transitions": {
        "default": "check_credit_score",
        "VALIDATION_FAILED": "notify_applicant_invalid"
      }
    },
    {
      "stepId": "check_credit_score",
      "type": "TASK",
      "taskId": "credit_check_task",
      "input": {
        "applicantId": "${workflow.input.applicantInfo.id}",
        "ssn": "${workflow.input.applicantInfo.ssn}"
      },
      "transitions": {
        "default": "parallel_verification"
      }
    },
    {
      "stepId": "parallel_verification",
      "type": "PARALLEL",
      "branches": [
        {
          "name": "income_verification",
          "steps": [
            {
              "stepId": "verify_income",
              "type": "TASK",
              "taskId": "income_verification_task",
              "input": {
                "applicantId": "${workflow.input.applicantInfo.id}",
                "declaredIncome": "${workflow.input.applicantInfo.income}",
                "employerInfo": "${workflow.input.applicantInfo.employer}"
              }
            }
          ]
        },
        {
          "name": "property_appraisal",
          "steps": [
            {
              "stepId": "schedule_appraisal",
              "type": "TASK",
              "taskId": "appraisal_scheduling_task",
              "input": {
                "propertyAddress": "${workflow.input.propertyInfo.address}",
                "applicantContact": "${workflow.input.applicantInfo.contact}"
              },
              "transitions": {
                "default": "wait_for_appraisal_completion"
              }
            },
            {
              "stepId": "wait_for_appraisal_completion",
              "type": "EVENT_WAIT",
              "eventPattern": "property.appraisal.completed",
              "eventCondition": "event.payload.applicationId === workflow.input.applicationId",
              "eventTimeout": {
                "duration": "P5D",
                "timeoutHandlerStepId": "handle_appraisal_timeout"
              },
              "eventPayloadMapping": {
                "appraisalValue": "value",
                "appraisalReport": "reportUrl"
              }
            }
          ]
        }
      ],
      "transitions": {
        "default": "risk_assessment"
      }
    },
    {
      "stepId": "handle_appraisal_timeout",
      "type": "TASK",
      "taskId": "appraisal_followup_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "propertyAddress": "${workflow.input.propertyInfo.address}",
        "scheduledAppraisalId": "${workflow.state.steps.schedule_appraisal.output.appraisalId}"
      },
      "transitions": {
        "default": "wait_for_appraisal_completion",
        "CANCEL_APPRAISAL": "notify_applicant_timeout"
      }
    },
    {
      "stepId": "risk_assessment",
      "type": "TASK",
      "taskId": "risk_assessment_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "creditScore": "${workflow.state.steps.check_credit_score.output.score}",
        "verifiedIncome": "${workflow.state.steps.verify_income.output.verifiedIncome}",
        "appraisalValue": "${workflow.state.steps.wait_for_appraisal_completion.output.appraisalValue}",
        "loanAmount": "${workflow.input.loanDetails.amount}"
      },
      "transitions": {
        "default": "determine_approval_path",
        "HIGH_RISK": "notify_applicant_rejected"
      }
    },
    {
      "stepId": "determine_approval_path",
      "type": "CHOICE",
      "choices": [
        {
          "condition": "${workflow.state.steps.risk_assessment.output.riskScore < 30 && workflow.input.loanDetails.amount < 500000}",
          "nextStep": "auto_approve"
        },
        {
          "condition": "${workflow.state.steps.risk_assessment.output.riskScore >= 30 && workflow.state.steps.risk_assessment.output.riskScore < 70}",
          "nextStep": "underwriter_review"
        },
        {
          "condition": "${workflow.state.steps.risk_assessment.output.riskScore >= 70}",
          "nextStep": "senior_underwriter_review"
        }
      ],
      "default": "underwriter_review"
    },
    {
      "stepId": "auto_approve",
      "type": "TASK",
      "taskId": "auto_approval_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "loanDetails": "${workflow.input.loanDetails}"
      },
      "transitions": {
        "default": "generate_loan_documents"
      }
    },
    {
      "stepId": "underwriter_review",
      "type": "HUMAN_TASK",
      "taskDefinition": {
        "assigneeRole": "UNDERWRITER",
        "taskForm": "loan_review_form",
        "priority": "MEDIUM",
        "dueIn": "P2D"
      },
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantInfo": "${workflow.input.applicantInfo}",
        "loanDetails": "${workflow.input.loanDetails}",
        "creditScore": "${workflow.state.steps.check_credit_score.output.score}",
        "verifiedIncome": "${workflow.state.steps.verify_income.output.verifiedIncome}",
        "appraisalValue": "${workflow.state.steps.wait_for_appraisal_completion.output.appraisalValue}",
        "riskAssessment": "${workflow.state.steps.risk_assessment.output}"
      },
      "transitions": {
        "APPROVED": "generate_loan_documents",
        "REJECTED": "notify_applicant_rejected",
        "NEEDS_MORE_INFO": "request_additional_info"
      }
    },
    {
      "stepId": "senior_underwriter_review",
      "type": "HUMAN_TASK",
      "taskDefinition": {
        "assigneeRole": "SENIOR_UNDERWRITER",
        "taskForm": "loan_review_form",
        "priority": "HIGH",
        "dueIn": "P1D"
      },
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantInfo": "${workflow.input.applicantInfo}",
        "loanDetails": "${workflow.input.loanDetails}",
        "creditScore": "${workflow.state.steps.check_credit_score.output.score}",
        "verifiedIncome": "${workflow.state.steps.verify_income.output.verifiedIncome}",
        "appraisalValue": "${workflow.state.steps.wait_for_appraisal_completion.output.appraisalValue}",
        "riskAssessment": "${workflow.state.steps.risk_assessment.output}"
      },
      "transitions": {
        "APPROVED": "generate_loan_documents",
        "REJECTED": "notify_applicant_rejected",
        "NEEDS_MORE_INFO": "request_additional_info"
      }
    },
    {
      "stepId": "request_additional_info",
      "type": "TASK",
      "taskId": "additional_info_request_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "requiredDocuments": "${workflow.state.steps.underwriter_review.output.requiredDocuments || workflow.state.steps.senior_underwriter_review.output.requiredDocuments}"
      },
      "transitions": {
        "default": "wait_for_additional_info"
      }
    },
    {
      "stepId": "wait_for_additional_info",
      "type": "EVENT_WAIT",
      "eventPattern": "loan.application.documents.submitted",
      "eventCondition": "event.payload.applicationId === workflow.input.applicationId",
      "eventTimeout": {
        "duration": "P7D",
        "timeoutHandlerStepId": "handle_additional_info_timeout"
      },
      "eventPayloadMapping": {
        "additionalDocuments": "documents"
      },
      "transitions": {
        "default": "determine_review_level"
      }
    },
    {
      "stepId": "handle_additional_info_timeout",
      "type": "TASK",
      "taskId": "document_followup_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}"
      },
      "transitions": {
        "default": "wait_for_additional_info",
        "CANCEL_APPLICATION": "notify_applicant_timeout"
      }
    },
    {
      "stepId": "determine_review_level",
      "type": "CHOICE",
      "choices": [
        {
          "condition": "${workflow.state.steps.underwriter_review !== undefined}",
          "nextStep": "underwriter_review"
        },
        {
          "condition": "${workflow.state.steps.senior_underwriter_review !== undefined}",
          "nextStep": "senior_underwriter_review"
        }
      ],
      "default": "underwriter_review"
    },
    {
      "stepId": "generate_loan_documents",
      "type": "TASK",
      "taskId": "document_generation_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantInfo": "${workflow.input.applicantInfo}",
        "loanDetails": "${workflow.input.loanDetails}",
        "approvalDetails": "${workflow.state.steps.auto_approve.output || workflow.state.steps.underwriter_review.output || workflow.state.steps.senior_underwriter_review.output}"
      },
      "transitions": {
        "default": "notify_documents_ready"
      }
    },
    {
      "stepId": "notify_documents_ready",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "DOCUMENTS_READY",
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "documentUrls": "${workflow.state.steps.generate_loan_documents.output.documentUrls}"
      },
      "transitions": {
        "default": "wait_for_document_signing"
      }
    },
    {
      "stepId": "wait_for_document_signing",
      "type": "EVENT_WAIT",
      "eventPattern": "loan.documents.signed",
      "eventCondition": "event.payload.applicationId === workflow.input.applicationId",
      "eventTimeout": {
        "duration": "P14D",
        "timeoutHandlerStepId": "handle_signing_timeout"
      },
      "eventPayloadMapping": {
        "signedDocumentUrls": "documentUrls",
        "signedAt": "timestamp"
      },
      "transitions": {
        "default": "fund_loan"
      }
    },
    {
      "stepId": "handle_signing_timeout",
      "type": "TASK",
      "taskId": "signing_followup_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "documentUrls": "${workflow.state.steps.generate_loan_documents.output.documentUrls}"
      },
      "transitions": {
        "default": "wait_for_document_signing",
        "CANCEL_APPLICATION": "notify_applicant_timeout"
      }
    },
    {
      "stepId": "fund_loan",
      "type": "TASK",
      "taskId": "loan_funding_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "loanDetails": "${workflow.input.loanDetails}",
        "bankingInfo": "${workflow.input.applicantInfo.bankingInfo}",
        "signedDocumentUrls": "${workflow.state.steps.wait_for_document_signing.output.signedDocumentUrls}"
      },
      "transitions": {
        "default": "notify_applicant_funded"
      }
    },
    {
      "stepId": "notify_applicant_funded",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "LOAN_FUNDED",
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "fundingDetails": "${workflow.state.steps.fund_loan.output}"
      }
    },
    {
      "stepId": "notify_applicant_rejected",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "APPLICATION_REJECTED",
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "reason": "${workflow.state.steps.risk_assessment.output.rejectionReason || workflow.state.steps.underwriter_review.output.rejectionReason || workflow.state.steps.senior_underwriter_review.output.rejectionReason}"
      }
    },
    {
      "stepId": "notify_applicant_invalid",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "APPLICATION_INVALID",
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "validationErrors": "${workflow.state.steps.validate_application.output.errors}"
      }
    },
    {
      "stepId": "notify_applicant_timeout",
      "type": "TASK",
      "taskId": "notification_task",
      "input": {
        "type": "APPLICATION_TIMEOUT",
        "applicationId": "${workflow.input.applicationId}",
        "applicantContact": "${workflow.input.applicantInfo.contact}",
        "reason": "Required information was not provided within the specified timeframe."
      }
    }
  ],
  "compensationSteps": [
    {
      "stepId": "cancel_appraisal",
      "compensationFor": "schedule_appraisal",
      "type": "TASK",
      "taskId": "appraisal_cancellation_task",
      "input": {
        "appraisalId": "${workflow.state.steps.schedule_appraisal.output.appraisalId}",
        "reason": "${workflow.cancellation.reason}"
      }
    },
    {
      "stepId": "refund_application_fee",
      "compensationFor": "validate_application",
      "type": "TASK",
      "taskId": "fee_refund_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "paymentId": "${workflow.state.steps.validate_application.output.paymentId}",
        "amount": "${workflow.state.steps.validate_application.output.feeAmount}",
        "reason": "${workflow.cancellation.reason}"
      },
      "condition": "${workflow.state.steps.validate_application.output.feeAmount > 0}"
    },
    {
      "stepId": "void_loan_documents",
      "compensationFor": "generate_loan_documents",
      "type": "TASK",
      "taskId": "document_voiding_task",
      "input": {
        "applicationId": "${workflow.input.applicationId}",
        "documentUrls": "${workflow.state.steps.generate_loan_documents.output.documentUrls}",
        "reason": "${workflow.cancellation.reason}"
      }
    }
  ],
  "cancellationTriggers": [
    {
      "eventPattern": "applicant.withdrawal",
      "eventCondition": "event.payload.applicationId === workflow.input.applicationId",
      "reason": "Application withdrawn by applicant",
      "shouldCompensate": true
    },
    {
      "eventPattern": "property.sale.cancelled",
      "eventCondition": "event.payload.propertyAddress === workflow.input.propertyInfo.address",
      "reason": "Property sale was cancelled",
      "shouldCompensate": true
    },
    {
      "eventPattern": "applicant.fraud.detected",
      "eventCondition": "event.payload.applicantId === workflow.input.applicantInfo.id",
      "reason": "Potential fraud detected",
      "shouldCompensate": false
    }
  ]
}
```

### Sample Workflow Input

```json
{
  "applicationId": "LOAN-12345",
  "applicantInfo": {
    "id": "APP-789",
    "name": {
      "first": "Jane",
      "last": "Smith"
    },
    "ssn": "123-45-6789",
    "income": 120000,
    "employer": {
      "name": "Acme Corporation",
      "address": "123 Business St, Business City, BC 12345",
      "phone": "555-123-4567",
      "employmentLength": 36
    },
    "contact": {
      "email": "jane.smith@example.com",
      "phone": "555-987-6543",
      "preferredMethod": "email"
    },
    "bankingInfo": {
      "accountNumber": "9876543210",
      "routingNumber": "123456789",
      "accountType": "checking"
    }
  },
  "loanDetails": {
    "amount": 350000,
    "term": 360,
    "type": "CONVENTIONAL",
    "purpose": "PURCHASE",
    "interestRate": 4.5
  },
  "propertyInfo": {
    "address": {
      "street": "456 Home Ave",
      "city": "Hometown",
      "state": "HT",
      "zipCode": "98765"
    },
    "type": "SINGLE_FAMILY",
    "purchasePrice": 400000,
    "yearBuilt": 1995
  }
}
```

## Key Features Demonstrated

### Parallel Execution

The workflow uses a parallel step to simultaneously:


1. Verify the applicant's income
2. Schedule and wait for a property appraisal

This allows these independent processes to run concurrently, reducing the overall workflow execution time.

### Event-Based Waiting

The workflow includes multiple event wait steps:


1. Waiting for appraisal completion
2. Waiting for additional document submission
3. Waiting for document signing

These steps allow the workflow to pause execution until external events occur, which is essential for long-running business processes.

### Conditional Branching

The workflow uses choice steps to implement business logic:


1. `determine_approval_path`: Routes applications based on risk score and loan amount
2. `determine_review_level`: Returns to the appropriate underwriter review based on history

### Human Tasks

The workflow integrates human decision-making:


1. `underwriter_review`: Assigned to an underwriter for review
2. `senior_underwriter_review`: Escalated to a senior underwriter for high-risk cases

### Timeout Handling

The workflow implements robust timeout handling:


1. Appraisal timeout with follow-up
2. Document submission timeout with follow-up
3. Document signing timeout with follow-up

### Compensation Mechanisms

The workflow defines compensation steps to handle cancellations:


1. Canceling scheduled appraisals
2. Refunding application fees
3. Voiding generated loan documents

### Event-Based Cancellation

The workflow can be automatically canceled based on external events:


1. Applicant withdrawal
2. Property sale cancellation
3. Fraud detection

## Execution Flow Visualization