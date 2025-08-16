// Template Management Service
export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'phone' | 'select' | 'multiselect' | 'date' | 'time' | 'textarea' | 'file' | 'toggle' | 'coordinates' | 'color';
    required: boolean;
    placeholder?: string;
    options?: string[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    defaultValue?: any;
    helpText?: string;
    section?: string;
    conditions?: FieldCondition[];
}

export interface Template {
    id: string;
    name: string;
    category: 'floor_plan' | 'camera' | 'resident' | 'staff' | 'schedule' | 'emergency';
    description: string;
    icon: string;
    fields: TemplateField[];
    previewImage?: string;
    isBuiltIn: boolean;
    usageCount: number;
    lastModified: string;
    workflow?: TemplateWorkflow;
}

export interface FieldCondition {
    dependsOn: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    action: 'show' | 'hide' | 'require' | 'disable';
}

export interface TemplateWorkflow {
    id: string;
    name: string;
    steps: WorkflowStep[];
    approvalRequired: boolean;
    notificationSettings: NotificationSettings;
}

export interface WorkflowStep {
    id: string;
    name: string;
    assignedTo: 'creator' | 'supervisor' | 'specific_role';
    role?: string;
    autoComplete?: boolean;
}

export interface NotificationSettings {
    onSubmit: boolean;
    onApproval: boolean;
    recipients: string[];
    emailTemplate?: string;
}

export class TemplateService {
    private templates: Map<string, Template> = new Map();
    private submissions: Map<string, TemplateSubmission> = new Map();

    // Template CRUD operations
    async createTemplate(template: Omit<Template, 'id' | 'usageCount' | 'lastModified'>): Promise<string> {
        const id = `template_${Date.now()}`;
        const newTemplate: Template = {
            ...template,
            id,
            usageCount: 0,
            lastModified: new Date().toISOString()
        };
        this.templates.set(id, newTemplate);
        return id;
    }

    async getTemplates(category?: string): Promise<Template[]> {
        const templates = Array.from(this.templates.values());
        return category ? templates.filter(t => t.category === category) : templates;
    }

    async updateTemplate(templateId: string, updates: Partial<Template>): Promise<boolean> {
        const template = this.templates.get(templateId);
        if (template) {
            this.templates.set(templateId, { ...template, ...updates, lastModified: new Date().toISOString() });
            return true;
        }
        return false;
    }

    async deleteTemplate(templateId: string): Promise<boolean> {
        return this.templates.delete(templateId);
    }

    // Form validation
    validateForm(template: Template, formData: Record<string, any>): ValidationResult {
        const errors: Record<string, string[]> = {};

        for (const field of template.fields) {
            const value = formData[field.id];
            const fieldErrors = this.validateField(field, value, formData);
            if (fieldErrors.length > 0) {
                errors[field.id] = fieldErrors;
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
            completionPercentage: this.calculateCompletionPercentage(template, formData)
        };
    }

    private validateField(field: TemplateField, value: any, allData: Record<string, any>): string[] {
        const errors: string[] = [];

        // Required field validation
        if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
            errors.push(`${field.label} is required`);
        }

        // Type-specific validation
        if (value) {
            switch (field.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push('Please enter a valid email address');
                    }
                    break;
                case 'phone':
                    if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(value)) {
                        errors.push('Please enter phone number in format: (555) 123-4567');
                    }
                    break;
                case 'number':
                    if (field.validation?.min && value < field.validation.min) {
                        errors.push(`Value must be at least ${field.validation.min}`);
                    }
                    if (field.validation?.max && value > field.validation.max) {
                        errors.push(`Value must be no more than ${field.validation.max}`);
                    }
                    break;
            }
        }

        return errors;
    }

    private calculateCompletionPercentage(template: Template, formData: Record<string, any>): number {
        const requiredFields = template.fields.filter(f => f.required);
        const completedFields = requiredFields.filter(f => formData[f.id] && formData[f.id] !== '');
        return Math.round((completedFields.length / requiredFields.length) * 100);
    }

    // Auto-fill functionality
    async getAutoFillSuggestions(fieldId: string, userId: string): Promise<string[]> {
        // Get previous submissions for suggestions
        const userSubmissions = Array.from(this.submissions.values())
            .filter(s => s.submittedBy === userId && s.data[fieldId])
            .map(s => s.data[fieldId])
            .filter((value, index, array) => array.indexOf(value) === index) // Remove duplicates
            .slice(0, 5); // Limit to 5 suggestions

        return userSubmissions;
    }
}

export interface TemplateSubmission {
    id: string;
    templateId: string;
    submittedBy: string;
    submittedAt: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    data: Record<string, any>;
    version: number;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
    completionPercentage: number;
}

// Export singleton instance
export const templateService = new TemplateService();