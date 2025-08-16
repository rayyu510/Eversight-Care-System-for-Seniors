import React, { useState } from 'react';
import { Search, Plus, Download, Settings } from 'lucide-react';

const TemplateLibrary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Templates' },
        { id: 'monitoring', label: 'Monitoring' },
        { id: 'alerts', label: 'Alerts & Notifications' },
        { id: 'reports', label: 'Reports' },
        { id: 'automation', label: 'Automation' }
    ];

    const templates = [
        {
            id: 1,
            name: 'Fall Detection Setup',
            category: 'monitoring',
            description: 'Configure fall detection sensors and alert thresholds',
            icon: '🚨',
            downloads: 45
        },
        {
            id: 2,
            name: 'Daily Activity Report',
            category: 'reports',
            description: 'Generate daily activity summaries for residents',
            icon: '📊',
            downloads: 23
        },
        {
            id: 3,
            name: 'Emergency Contact Alerts',
            category: 'alerts',
            description: 'Set up automated emergency contact notifications',
            icon: '📞',
            downloads: 67
        }
    ];

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Library</h1>
                <p className="text-gray-600">Low-code/no-code configuration templates for EverSight Care</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.label}
                        </option>
                    ))}
                </select>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Template
                </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-3xl">{template.icon}</div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {categories.find(c => c.id === template.category)?.label}
                            </span>
                            <span className="text-xs text-gray-500">{template.downloads} downloads</span>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Use Template
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                                Preview
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    );
};

export default TemplateLibrary;