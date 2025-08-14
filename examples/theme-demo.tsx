// Theme System Demo - Travel Rule Calculator
// This file demonstrates the usage of the centralized theme system

import React from 'react';
import { 
  theme, 
  getVaspTheme, 
  getComponentStyles, 
  commonStyles, 
  vaspThemes,
  combineClasses,
  conditionalClass,
  responsiveClass 
} from '../src/styles/theme-utils';

const ThemeDemo: React.FC = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState<'sumsub' | 'counterparty'>('sumsub');

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            🎨 Theme System Demo
          </h1>
          <p className="text-lg text-neutral-600">
            Centralized theme tokens and utilities for consistent design
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedTheme('sumsub')}
            className={conditionalClass(
              selectedTheme === 'sumsub',
              'bg-sumsub-600 text-white',
              'bg-neutral-200 text-neutral-700'
            ) + ' px-6 py-3 rounded-lg font-medium transition-colors duration-200'}
          >
            Sumsub Theme (Blue)
          </button>
          <button
            onClick={() => setSelectedTheme('counterparty')}
            className={conditionalClass(
              selectedTheme === 'counterparty',
              'bg-counterparty-600 text-white',
              'bg-neutral-200 text-neutral-700'
            ) + ' px-6 py-3 rounded-lg font-medium transition-colors duration-200'}
          >
            Counterparty Theme (Purple)
          </button>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
          
          {/* VASP Theme Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">
              {selectedTheme === 'sumsub' ? 'Sumsub' : 'Counterparty'} Theme Colors
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-16 h-16 rounded-lg mb-2 ${
                      selectedTheme === 'sumsub' 
                        ? `bg-sumsub-${shade}` 
                        : `bg-counterparty-${shade}`
                    }`}
                  />
                  <span className="text-sm text-neutral-600">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <h3 className="text-lg font-medium mb-4">Semantic Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-status-success-100 rounded-lg mb-2 border border-status-success-200" />
                <span className="text-sm text-status-success-800">Success</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-status-warning-100 rounded-lg mb-2 border border-status-warning-200" />
                <span className="text-sm text-status-warning-800">Warning</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-status-error-100 rounded-lg mb-2 border border-status-error-200" />
                <span className="text-sm text-status-error-800">Error</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg mb-2 border border-neutral-200" />
                <span className="text-sm text-neutral-700">Neutral</span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-semibold mb-6">Component Examples</h2>
          
          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <button className={commonStyles.buttons.primary}>
                Primary Button
              </button>
              <button className={commonStyles.buttons.secondary}>
                Secondary Button
              </button>
              <button className={commonStyles.buttons.outline}>
                Outline Button
              </button>
              <button className={commonStyles.buttons.ghost}>
                Ghost Button
              </button>
              <button className={commonStyles.buttons.disabled}>
                Disabled Button
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Input Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Default input" 
                className={commonStyles.inputs.default}
              />
              <input 
                type="text" 
                placeholder="Error input" 
                className={commonStyles.inputs.error}
              />
              <input 
                type="text" 
                placeholder="Success input" 
                className={commonStyles.inputs.success}
              />
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-medium mb-4">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={commonStyles.cards.default}>
                <h4 className="font-medium mb-2">Default Card</h4>
                <p className="text-neutral-600 text-sm">Standard card with basic shadow</p>
              </div>
              <div className={commonStyles.cards.elevated}>
                <h4 className="font-medium mb-2">Elevated Card</h4>
                <p className="text-neutral-600 text-sm">Card with medium shadow for elevation</p>
              </div>
              <div className={commonStyles.cards.interactive}>
                <h4 className="font-medium mb-2">Interactive Card</h4>
                <p className="text-neutral-600 text-sm">Hover to see shadow transition</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spacing & Layout */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-semibold mb-6">Spacing & Layout</h2>
          
          {/* Spacing Scale */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Spacing Scale</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-sumsub-500 rounded"></div>
                <span className="text-sm text-neutral-600">xs (4px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-sumsub-500 rounded"></div>
                <span className="text-sm text-neutral-600">sm (8px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sumsub-500 rounded"></div>
                <span className="text-sm text-neutral-600">md (12px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-sumsub-500 rounded"></div>
                <span className="text-sm text-neutral-600">lg (16px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-sumsub-500 rounded"></div>
                <span className="text-sm text-neutral-600">xl (24px)</span>
              </div>
            </div>
          </div>

          {/* Responsive Layout */}
          <div>
            <h3 className="text-lg font-medium mb-4">Responsive Layout</h3>
            <div className={responsiveClass(
              'grid grid-cols-1 gap-4',
              'sm:grid-cols-2',
              'lg:grid-cols-3'
            )}>
              <div className="bg-neutral-100 p-4 rounded-lg text-center">
                <span className="text-sm text-neutral-600">Responsive Grid Item</span>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg text-center">
                <span className="text-sm text-neutral-600">Responsive Grid Item</span>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg text-center">
                <span className="text-sm text-neutral-600">Responsive Grid Item</span>
              </div>
            </div>
          </div>
        </div>

        {/* Utility Functions */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-2xl font-semibold mb-6">Utility Functions</h2>
          
          {/* combineClasses */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">combineClasses</h3>
            <button 
              className={combineClasses(
                theme.spacing.button,
                theme.radius.button,
                theme.shadow.button,
                theme.transition.colors,
                'bg-sumsub-600 hover:bg-sumsub-700 text-white font-medium'
              )}
              onClick={() => setIsActive(!isActive)}
            >
              Combined Classes Button
            </button>
          </div>

          {/* conditionalClass */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">conditionalClass</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">State:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                conditionalClass(
                  isActive,
                  'bg-status-success-100 text-status-success-800',
                  'bg-status-error-100 text-status-error-800'
                )
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={() => setIsActive(!isActive)}
                className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded text-sm hover:bg-neutral-300 transition-colors"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* VASP Theme Helper */}
          <div>
            <h3 className="text-lg font-medium mb-4">VASP Theme Helper</h3>
            <div className={`p-6 rounded-lg border ${getVaspTheme(selectedTheme).bg} ${getVaspTheme(selectedTheme).border}`}>
              <h4 className={`text-lg font-semibold mb-2 ${getVaspTheme(selectedTheme).text}`}>
                {selectedTheme === 'sumsub' ? 'Sumsub' : 'Counterparty'} Theme Example
              </h4>
              <p className={`text-sm ${getVaspTheme(selectedTheme).accent}`}>
                This card uses the {selectedTheme} theme colors automatically
              </p>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-neutral-900 rounded-xl p-6 text-neutral-100">
          <h2 className="text-2xl font-semibold mb-6 text-white">Code Examples</h2>
          <pre className="text-sm overflow-x-auto">
{`// Import theme utilities
import { 
  theme, 
  getVaspTheme, 
  commonStyles,
  combineClasses 
} from '../styles/theme-utils';

// Use VASP theme
const sumsubTheme = getVaspTheme('sumsub');

// Combine classes
const buttonClasses = combineClasses(
  theme.spacing.button,
  theme.radius.button,
  theme.shadow.button
);

// Use common styles
<button className={commonStyles.buttons.primary}>
  Primary Button
</button>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
