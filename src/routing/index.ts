// src/routing/index.ts
import { lazy } from 'react';

// Lazy load the template component
const TemplateConfigurationSystem = lazy(() => import('../guardian-protect/components/Templates/TemplateConfigurationSystem'));

// Template routes (fix the duplicate and structure)
export const templateRoutes = [
    {
        path: '/templates',
        component: TemplateConfigurationSystem,
        name: 'Template Configuration'
    },
    // Add more template routes later
    // {
    //     path: '/templates/builder',
    //     component: lazy(() => import('../guardian-protect/components/Templates/TemplateBuilder')),
    //     name: 'Template Builder'
    // }
];

// Export all routes (you probably have other routes too)
export const allRoutes = [
    ...templateRoutes,
    // Add your other existing routes here
];