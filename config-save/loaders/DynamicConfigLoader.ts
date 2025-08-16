// config/loaders/DynamicConfigLoader.ts
import * as fs from 'fs';

// Define or import CompleteConfig type here
// Replace the following with the actual structure or import if it exists elsewhere
export type CompleteConfig = any;

export class DynamicConfigLoader {
    private configCache = new Map<string, CompleteConfig>();
    private watchers = new Map<string, fs.FSWatcher>();

    async loadConfiguration(configPath: string): Promise<CompleteConfig> {
        const configId = this.generateConfigId(configPath);

        // Check cache first
        if (this.configCache.has(configId)) {
            return this.configCache.get(configId)!;
        }

        // Load and validate configuration
        const rawConfig = await this.readConfigFile(configPath);
        const config = await this.validateAndProcessConfig(rawConfig);

        // Cache configuration
        this.configCache.set(configId, config);

        // Set up file watcher for hot reloading
        this.setupConfigWatcher(configPath, configId);

        return config;
    }

    async reloadConfiguration(configId: string): Promise<void> {
        this.configCache.delete(configId);
        await this.loadConfiguration(this.getConfigPath(configId));

        // Notify subscribers of configuration change
        this.notifyConfigurationChange(configId);
    }

    private getConfigPath(configId: string): string {
        // Placeholder: Implement logic to map configId back to configPath.
        // For now, just return configId assuming configId is the configPath.
        return configId;
    }

    private notifyConfigurationChange(configId: string): void {
        // Placeholder: Implement notification logic here (e.g., emit event, call callback, etc.)
        // For now, just log to the console.
        console.log(`Configuration changed for: ${configId}`);
    }

    private setupConfigWatcher(configPath: string, configId: string): void {
        if (this.watchers.has(configId)) {
            this.watchers.get(configId)?.close();
        }

        const watcher = fs.watch(configPath, (eventType) => {
            if (eventType === 'change') {
                this.reloadConfiguration(configId);
            }
        });

        this.watchers.set(configId, watcher);
    }

    private generateConfigId(configPath: string): string {
        // Simple implementation: use the configPath as the configId
        return configPath;
    }

    private async readConfigFile(configPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (parseErr) {
                        reject(parseErr);
                    }
                }
            });
        });
    }

    private async validateAndProcessConfig(rawConfig: any): Promise<CompleteConfig> {
        // TODO: Add validation logic as needed.
        // For now, just return the raw config.
        return rawConfig;
    }
}