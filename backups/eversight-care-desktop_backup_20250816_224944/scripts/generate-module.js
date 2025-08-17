const fs = require('fs');
const path = require('path');

function generateModule(moduleName, moduleType = 'feature') {
  const modulePath = path.join(__dirname, '..', 'src', moduleName);
  
  // Create module directory structure
  const directories = [
    'components',
    'services',
    'hooks',
    'types',
    'utils',
    '__tests__'
  ];

  if (moduleType === 'guardian') {
    directories.push('workers', 'assets', 'algorithms');
  }

  directories.forEach(dir => {
    const fullPath = path.join(modulePath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Generate index.ts
  const indexContent = `// ${moduleName} module exports
export * from './components';
export * from './services';
export * from './hooks';
export * from './types';
export * from './utils';
`;
  
  fs.writeFileSync(path.join(modulePath, 'index.ts'), indexContent);

  // Generate basic types
  const typesContent = `// ${moduleName} module type definitions
export interface ${toPascalCase(moduleName)}Config {
  id: string;
  name: string;
  isEnabled: boolean;
  settings: Record<string, any>;
}

export interface ${toPascalCase(moduleName)}State {
  isLoading: boolean;
  error: string | null;
  data: any;
}
`;
  
  fs.writeFileSync(path.join(modulePath, 'types', 'index.ts'), typesContent);

  // Generate basic service
  const serviceContent = `// ${moduleName} main service
import { logger } from '@core/services';
import { eventBus, EVENT_TYPES } from '@core/services';

export class ${toPascalCase(moduleName)}Service {
  private static instance: ${toPascalCase(moduleName)}Service;

  static getInstance(): ${toPascalCase(moduleName)}Service {
    if (!${toPascalCase(moduleName)}Service.instance) {
      ${toPascalCase(moduleName)}Service.instance = new ${toPascalCase(moduleName)}Service();
    }
    return ${toPascalCase(moduleName)}Service.instance;
  }

  async initialize(): Promise<void> {
    try {
      logger.info('${moduleName} service initializing...');
      // Initialize module specific logic
      eventBus.emit('module.initialized', { module: '${moduleName}' }, {
        source: '${moduleName}-service'
      });
    } catch (error) {
      logger.error('Failed to initialize ${moduleName} service:', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    logger.info('${moduleName} service shutting down...');
    // Cleanup logic
  }
}

export const ${toCamelCase(moduleName)}Service = ${toPascalCase(moduleName)}Service.getInstance();
`;
  
  fs.writeFileSync(path.join(modulePath, 'services', 'index.ts'), serviceContent);

  console.log(`✅ Generated module: ${moduleName}`);
}

function toPascalCase(str) {
  return str.replace(/(^|-)(.)/g, (_, __, char) => char.toUpperCase()).replace(/-/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// CLI interface
if (require.main === module) {
  const moduleName = process.argv[2];
  const moduleType = process.argv[3] || 'feature';
  
  if (!moduleName) {
    console.error('Please provide a module name');
    console.log('Usage: node generate-module.js <module-name> [module-type]');
    process.exit(1);
  }
  
  generateModule(moduleName, moduleType);
}

module.exports = { generateModule };
