import { EmergencyProtocol, ProtocolStep } from '../types/operationsTypes';

export class EmergencyProtocolService {
    private static instance: EmergencyProtocolService;
    private protocols: Map<string, EmergencyProtocol> = new Map();
    private activeProtocols: Set<string> = new Set();

    public static getInstance(): EmergencyProtocolService {
        if (!EmergencyProtocolService.instance) {
            EmergencyProtocolService.instance = new EmergencyProtocolService();
            EmergencyProtocolService.instance.initializeDefaultProtocols();
        }
        return EmergencyProtocolService.instance;
    }

    private initializeDefaultProtocols(): void {
        // Fire Emergency Protocol
        const fireProtocol: EmergencyProtocol = {
            id: 'fire-emergency',
            name: 'Fire Emergency Response',
            type: 'fire',
            status: 'inactive',
            steps: [
                { id: 'fire-1', order: 1, description: 'Activate fire alarm system', completed: false },
                { id: 'fire-2', order: 2, description: 'Contact fire department', completed: false },
                { id: 'fire-3', order: 3, description: 'Begin resident evacuation', completed: false },
                { id: 'fire-4', order: 4, description: 'Account for all residents and staff', completed: false }
            ]
        };

        // Medical Emergency Protocol
        const medicalProtocol: EmergencyProtocol = {
            id: 'medical-emergency',
            name: 'Medical Emergency Response',
            type: 'medical',
            status: 'inactive',
            steps: [
                { id: 'med-1', order: 1, description: 'Assess patient condition', completed: false },
                { id: 'med-2', order: 2, description: 'Contact emergency medical services', completed: false },
                { id: 'med-3', order: 3, description: 'Provide first aid if qualified', completed: false },
                { id: 'med-4', order: 4, description: 'Notify family and attending physician', completed: false }
            ]
        };

        // Security Emergency Protocol
        const securityProtocol: EmergencyProtocol = {
            id: 'security-emergency',
            name: 'Security Emergency Response',
            type: 'security',
            status: 'inactive',
            steps: [
                { id: 'sec-1', order: 1, description: 'Assess security threat level', completed: false },
                { id: 'sec-2', order: 2, description: 'Contact law enforcement if needed', completed: false },
                { id: 'sec-3', order: 3, description: 'Secure facility and residents', completed: false },
                { id: 'sec-4', order: 4, description: 'Document incident details', completed: false }
            ]
        };

        this.protocols.set(fireProtocol.id, fireProtocol);
        this.protocols.set(medicalProtocol.id, medicalProtocol);
        this.protocols.set(securityProtocol.id, securityProtocol);
    }

    async activateProtocol(protocolId: string, activatedBy?: string): Promise<boolean> {
        const protocol = this.protocols.get(protocolId);
        if (!protocol) {
            throw new Error(`Protocol ${protocolId} not found`);
        }

        if (protocol.status === 'active') {
            console.warn(`Protocol ${protocolId} is already active`);
            return false;
        }

        protocol.status = 'active';
        protocol.activatedAt = new Date();
        protocol.activatedBy = activatedBy;

        this.activeProtocols.add(protocolId);
        this.protocols.set(protocolId, protocol);

        console.log(`Emergency protocol ${protocol.name} activated by ${activatedBy || 'system'}`);
        return true;
    }

    async deactivateProtocol(protocolId: string): Promise<boolean> {
        const protocol = this.protocols.get(protocolId);
        if (!protocol) {
            throw new Error(`Protocol ${protocolId} not found`);
        }

        protocol.status = 'inactive';
        this.activeProtocols.delete(protocolId);
        this.protocols.set(protocolId, protocol);

        console.log(`Emergency protocol ${protocol.name} deactivated`);
        return true;
    }

    async completeStep(protocolId: string, stepId: string, completedBy?: string): Promise<boolean> {
        const protocol = this.protocols.get(protocolId);
        if (!protocol) {
            throw new Error(`Protocol ${protocolId} not found`);
        }

        const step = protocol.steps.find(s => s.id === stepId);
        if (!step) {
            throw new Error(`Step ${stepId} not found in protocol ${protocolId}`);
        }

        step.completed = true;
        step.completedAt = new Date();
        step.assignedTo = completedBy;

        this.protocols.set(protocolId, protocol);
        return true;
    }

    async getAllProtocols(): Promise<EmergencyProtocol[]> {
        return Array.from(this.protocols.values());
    }

    async getActiveProtocols(): Promise<EmergencyProtocol[]> {
        return Array.from(this.protocols.values())
            .filter(protocol => protocol.status === 'active');
    }
}