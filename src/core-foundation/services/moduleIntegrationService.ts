// Cross-module communication service
export class ModuleIntegrationService {
    private modules: Map<string, any> = new Map();
    private eventListeners: Map<string, Function[]> = new Map();

    registerModule(name: string, module: any) {
        this.modules.set(name, module);
        this.emit('moduleRegistered', { name, module });
        console.log(`Module registered: ${name}`);
    }

    unregisterModule(name: string) {
        const module = this.modules.get(name);
        if (module) {
            this.modules.delete(name);
            this.emit('moduleUnregistered', { name, module });
            console.log(`Module unregistered: ${name}`);
        }
    }

    getModule(name: string) {
        return this.modules.get(name);
    }

    getAllModules() {
        return Array.from(this.modules.entries()).map(([name, module]) => ({
            name,
            module,
            status: this.getModuleStatus(name)
        }));
    }

    getModuleStatus(name: string): 'online' | 'offline' | 'error' {
        const module = this.modules.get(name);
        if (!module) return 'offline';

        // Check if module has a health check method
        if (typeof module.getHealth === 'function') {
            try {
                const health = module.getHealth();
                return health === 'healthy' ? 'online' : 'error';
            } catch (error) {
                return 'error';
            }
        }

        return 'online';
    }

    async aggregateData() {
        const data: any = {};

        for (const [name, module] of this.modules) {
            try {
                if (module.getData && typeof module.getData === 'function') {
                    data[name] = await module.getData();
                } else if (module.getStatus && typeof module.getStatus === 'function') {
                    data[name] = await module.getStatus();
                } else {
                    data[name] = { status: 'active', timestamp: new Date() };
                }
            } catch (error) {
                console.error(`Error getting data from module ${name}:`, error);
                data[name] = { status: 'error', error: error.message };
            }
        }

        return data;
    }

    async broadcastMessage(message: string, data?: any) {
        const broadcastData = {
            message,
            data,
            timestamp: new Date(),
            source: 'moduleIntegrationService'
        };

        for (const [name, module] of this.modules) {
            try {
                if (module.onMessage && typeof module.onMessage === 'function') {
                    await module.onMessage(broadcastData);
                }
            } catch (error) {
                console.error(`Error broadcasting to module ${name}:`, error);
            }
        }
    }

    on(event: string, callback: Function) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }

    off(event: string, callback: Function) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    async sendModuleMessage(targetModule: string, message: string, data?: any) {
        const module = this.modules.get(targetModule);
        if (!module) {
            throw new Error(`Module ${targetModule} not found`);
        }

        if (module.onMessage && typeof module.onMessage === 'function') {
            return await module.onMessage({
                message,
                data,
                timestamp: new Date(),
                source: 'moduleIntegrationService'
            });
        } else {
            throw new Error(`Module ${targetModule} does not support messaging`);
        }
    }

    getModuleCount(): number {
        return this.modules.size;
    }

    getActiveModuleCount(): number {
        let activeCount = 0;
        for (const [name] of this.modules) {
            if (this.getModuleStatus(name) === 'online') {
                activeCount++;
            }
        }
        return activeCount;
    }

    async performHealthCheck(): Promise<{ [moduleName: string]: any }> {
        const healthStatus: { [moduleName: string]: any } = {};

        for (const [name, module] of this.modules) {
            try {
                if (module.performHealthCheck && typeof module.performHealthCheck === 'function') {
                    healthStatus[name] = await module.performHealthCheck();
                } else {
                    healthStatus[name] = {
                        status: this.getModuleStatus(name),
                        timestamp: new Date(),
                        details: 'Basic health check'
                    };
                }
            } catch (error) {
                healthStatus[name] = {
                    status: 'error',
                    error: error.message,
                    timestamp: new Date()
                };
            }
        }

        return healthStatus;
    }
}