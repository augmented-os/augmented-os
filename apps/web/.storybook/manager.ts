import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'AugmentedOS DynamicUI',
  brandUrl: '',
  brandTarget: '_self',
  
  colorPrimary: '#4f46e5',
  colorSecondary: '#6366f1',
  
  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 6,
  
  // Typography
  fontBase: '"Inter", "system-ui", sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#1e293b',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#64748b',
  barSelectedColor: '#4f46e5',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1e293b',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme,
  showPanel: true,
  panelPosition: 'bottom',
}); 