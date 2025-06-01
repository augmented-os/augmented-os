import type { Meta, StoryObj } from '@storybook/react';

// Simple component for documentation story
const IntroductionDocs = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    {/* Hero Section */}
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white', 
      padding: '3rem 2rem', 
      borderRadius: '12px', 
      marginBottom: '3rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.1
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            margin: '0 0 1rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Dynamic UI System
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.95, 
            margin: '0 auto',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Power your workflow orchestration with dynamic, database-driven user interfaces that adapt to any task, approval process, or business workflow
          </p>
        </div>
        
        {/* Workflow Context Badge */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>⚙️</span>
            Part of the AugmentedOS Workflow Orchestration Platform
          </div>
        </div>
        
        {/* Key Benefits Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Task Execution</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Dynamic task forms</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Approval Workflows</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Multi-step processes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Workflow Integration</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Seamless orchestration</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>No-Code Changes</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Database-driven UI</div>
          </div>
        </div>
      </div>
    </div>
    
    <h2>What is Dynamic UI?</h2>
    <p>Dynamic UI is the user interface engine that powers task execution and workflow interaction in the AugmentedOS platform. It renders context-aware forms, approval interfaces, and decision support tools dynamically from JSON schemas stored in the database, enabling workflows to present the exact interface needed for each step without requiring code deployments.</p>
    
    <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid #e9ecef' }}>
      <h3 style={{ marginTop: 0, color: '#495057' }}>💡 Workflow Integration</h3>
      <p style={{ marginBottom: 0 }}>
        When the Workflow Orchestrator Service creates a task instance (like "Review Insurance Claim" or "Approve Loan Application"), Dynamic UI automatically renders the appropriate interface based on the task definition's UI schema. This seamless integration means complex business workflows can adapt their user experience without any frontend development.
      </p>
    </div>
    
    <h2>The Problem We Solve</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '1.5rem 0' }}>
      <div style={{ background: '#fff5f5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fed7d7' }}>
        <h3 style={{ color: '#c53030', marginTop: 0 }}>❌ Traditional Approach:</h3>
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>New form requirements = new React components</li>
          <li>UI changes require code deployments</li>
          <li>Non-technical users can't modify workflows</li>
          <li>Every form variation needs developer time</li>
          <li>Tight coupling between UI and business logic</li>
          <li>Difficult to A/B test form variations</li>
        </ul>
      </div>
      <div style={{ background: '#f0fff4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #9ae6b4' }}>
        <h3 style={{ color: '#2f855a', marginTop: 0 }}>✅ Dynamic UI Approach:</h3>
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Forms defined as JSON schemas in database</li>
          <li>UI changes happen instantly without deployments</li>
          <li>Business users can create and modify forms</li>
          <li>One component system handles infinite variations</li>
          <li>Clean separation of concerns</li>
          <li>Easy experimentation and iteration</li>
        </ul>
      </div>
    </div>
    
    <h2>Business Value</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', margin: '1.5rem 0' }}>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2563eb', marginTop: 0 }}>🚀 Faster Development</h3>
        <p>Reduce form development time from days to minutes. Create complex workflows without writing a single line of React code.</p>
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#dc2626', marginTop: 0 }}>⚡ Instant Updates</h3>
        <p>Change forms without code deployments. Update validation rules, add fields, or modify layouts instantly in production.</p>
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#7c3aed', marginTop: 0 }}>👥 Empower Users</h3>
        <p>Enable business users, product managers, and designers to create and modify workflows without technical expertise.</p>
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#059669', marginTop: 0 }}>🔄 Flexibility</h3>
        <p>Adapt to changing requirements without technical debt. Scale from simple forms to complex multi-step workflows.</p>
      </div>
    </div>
    
    <h2>Key Use Cases in Workflow Orchestration</h2>
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>📋 Manual Task Execution</h3>
        <p style={{ marginLeft: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>When workflows reach human decision points, Dynamic UI renders task-specific interfaces with context, reference data, and decision support tools.</p>
        <div style={{ marginLeft: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Example:</strong> Insurance claim review task presents damage photos, policy details, estimation tools, and approval options in a single, contextual interface.
        </div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>✅ Multi-Level Approval Processes</h3>
        <p style={{ marginLeft: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>Complex approval workflows automatically present different interfaces based on approval level, amount thresholds, and user roles.</p>
        <div style={{ marginLeft: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Example:</strong> Loan approval workflow shows basic details to junior officers but reveals credit analysis tools and policy guidelines to senior managers.
        </div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>🔍 Investigation & Data Collection</h3>
        <p style={{ marginLeft: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>Investigation workflows present specialized tools for evidence collection, interview documentation, and timeline building.</p>
        <div style={{ marginLeft: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Example:</strong> Fraud investigation task provides document viewers, annotation tools, contact lookup, and structured evidence collection forms.
        </div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>📊 Decision Support Workflows</h3>
        <p style={{ marginLeft: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>Complex decision tasks present comparison tools, impact analysis, and recommendation engines to guide informed decision-making.</p>
        <div style={{ marginLeft: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Example:</strong> Vendor selection task shows side-by-side comparisons, scoring matrices, risk assessments, and contract term analysis.
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>🔄 Adaptive Process Flows</h3>
        <p style={{ marginLeft: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>Workflows that change behavior based on data, user roles, or business rules automatically present different interfaces at each step.</p>
        <div style={{ marginLeft: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Example:</strong> Customer onboarding workflow presents different forms for individual vs. business customers, with conditional fields based on selected products.
        </div>
      </div>
    </div>
    
    <h2>Real-World Impact</h2>
    <div style={{ background: '#fefce8', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fde047', margin: '1.5rem 0' }}>
      <h3 style={{ color: '#a16207', marginTop: 0 }}>📈 Workflow Orchestration Success Story</h3>
      <p style={{ marginBottom: '1rem' }}>
        <strong>Before Dynamic UI:</strong> Our insurance claims processing workflow required separate React components for each claim type. Adding new claim types or changing approval criteria meant weeks of development, testing, and deployment.
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>After Dynamic UI:</strong> Claims processors see contextual interfaces generated from task definitions. New claim types are configured in minutes through schema updates. Approval thresholds and conditional logic changes take effect immediately across all active workflows, reducing processing time by 60%.
      </p>
    </div>
    
    <h2>What You'll Learn</h2>
    <p>This comprehensive documentation will guide you through:</p>
    <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
      <li><strong>Understanding the Architecture</strong> - How Dynamic UI works under the hood, component hierarchy, and integration patterns</li>
      <li><strong>Creating Your First Schema</strong> - Hands-on schema creation with live examples and best practices</li>
      <li><strong>Field Types & Validation</strong> - Complete reference for all supported field types and validation rules</li>
      <li><strong>Advanced Patterns</strong> - Conditional logic, multi-step forms, and complex business workflows</li>
      <li><strong>Performance Optimization</strong> - Scaling to large datasets and optimizing render performance</li>
      <li><strong>Real-World Examples</strong> - Complete business workflows from task management to approval processes</li>
    </ol>
    
    <h2>Development Philosophy</h2>
    <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #7dd3fc', margin: '1.5rem 0' }}>
      <h3 style={{ color: '#0369a1', marginTop: 0 }}>🎯 Progressive Enhancement</h3>
      <p style={{ marginBottom: '1rem' }}>
        Dynamic UI is designed with a "start simple, build complexity" approach:
      </p>
      <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
        <li><strong>Phase 1:</strong> Basic forms with essential field types and validation</li>
        <li><strong>Phase 2:</strong> Conditional logic and enhanced field types</li>
        <li><strong>Phase 3:</strong> Multi-step workflows and advanced features</li>
        <li><strong>Phase 4:</strong> Performance optimization and accessibility</li>
      </ul>
    </div>
    
    <h2>Next Steps</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ color: '#475569', marginTop: 0, marginBottom: '0.5rem' }}>🏗️ Architecture</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: 0, color: '#64748b' }}>Understand how the system works</p>
      </div>
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ color: '#475569', marginTop: 0, marginBottom: '0.5rem' }}>🚀 Getting Started</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: 0, color: '#64748b' }}>Create your first schema</p>
      </div>
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ color: '#475569', marginTop: 0, marginBottom: '0.5rem' }}>📚 Examples</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: 0, color: '#64748b' }}>See it in action</p>
      </div>
    </div>
    
    <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
    <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Ready to transform how your team builds forms and workflows?</p>
      <p style={{ marginBottom: 0, opacity: 0.9 }}>Let's dive into the architecture and start building!</p>
    </div>
  </div>
);

const meta: Meta<typeof IntroductionDocs> = {
  title: 'Dynamic UI/🎯 Getting Started/Introduction',
  component: IntroductionDocs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {}; 