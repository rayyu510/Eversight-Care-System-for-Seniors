// Centralized event system for inter-module communication
type EventCallback = (data: any) => void;
type EventType = string;

export interface ModuleEvent {
  type: EventType;
  source: string;
  target?: string;
  payload: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  id: string;
}

export class EventBusService {
  private static instance: EventBusService;
  private listeners: Map<EventType, Set<EventCallback>> = new Map();
  private eventHistory: ModuleEvent[] = [];
  private maxHistorySize = 1000;

  static getInstance(): EventBusService {
    if (!EventBusService.instance) {
      EventBusService.instance = new EventBusService();
    }
    return EventBusService.instance;
  }

  // Subscribe to events
  on(eventType: EventType, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  // Subscribe to events with pattern matching
  onPattern(pattern: RegExp, callback: EventCallback): () => void {
    const unsubscribers: (() => void)[] = [];
    
    // Subscribe to existing events that match pattern
    for (const eventType of this.listeners.keys()) {
      if (pattern.test(eventType)) {
        unsubscribers.push(this.on(eventType, callback));
      }
    }

    // TODO: Handle future events that match pattern
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // Emit events
  emit(eventType: EventType, payload: any, options: {
    source: string;
    target?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    const event: ModuleEvent = {
      type: eventType,
      source: options.source,
      target: options.target,
      payload,
      timestamp: new Date(),
      priority: options.priority || 'medium',
      id: this.generateEventId()
    };

    // Store in history
    this.addToHistory(event);

    // Notify listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }

    // Handle priority routing
    if (event.priority === 'critical') {
      this.handleCriticalEvent(event);
    }
  }

  // Emit events with acknowledgment
  async emitWithAck(eventType: EventType, payload: any, options: {
    source: string;
    target?: string;
    timeout?: number;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const ackEventType = `${eventType}.ack.${this.generateEventId()}`;
      const timeout = options.timeout || 5000;

      // Set up acknowledgment listener
      const unsubscribe = this.on(ackEventType, (ackEvent: ModuleEvent) => {
        unsubscribe();
        resolve(ackEvent.payload);
      });

      // Set up timeout
      const timeoutId = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Event acknowledgment timeout for ${eventType}`));
      }, timeout);

      // Emit original event with ack requirement
      this.emit(eventType, {
        ...payload,
        _requiresAck: true,
        _ackEventType: ackEventType
      }, options);
    });
  }

  // Get event history
  getEventHistory(filter?: {
    source?: string;
    type?: string;
    since?: Date;
    priority?: string;
  }): ModuleEvent[] {
    let filtered = [...this.eventHistory];

    if (filter) {
      if (filter.source) {
        filtered = filtered.filter(e => e.source === filter.source);
      }
      if (filter.type) {
        filtered = filtered.filter(e => e.type.includes(filter.type!));
      }
      if (filter.since) {
        filtered = filtered.filter(e => e.timestamp >= filter.since!);
      }
      if (filter.priority) {
        filtered = filtered.filter(e => e.priority === filter.priority);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Clear event history
  clearHistory(): void {
    this.eventHistory = [];
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToHistory(event: ModuleEvent): void {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(0, this.maxHistorySize);
    }
  }

  private handleCriticalEvent(event: ModuleEvent): void {
    // Additional processing for critical events
    console.warn('Critical event detected:', event);
    
    // Could trigger system-wide notifications
    this.emit('system.critical_event', event, {
      source: 'event-bus',
      priority: 'critical'
    });
  }
}

// Event type constants
export const EVENT_TYPES = {
  // Guardian Protect Events
  GUARDIAN_FALL_DETECTED: 'guardian.protect.fall.detected',
  GUARDIAN_RISK_ALERT: 'guardian.protect.risk.alert',
  GUARDIAN_CAMERA_OFFLINE: 'guardian.protect.camera.offline',
  GUARDIAN_EMERGENCY_TRIGGERED: 'guardian.protect.emergency.triggered',

  // Guardian Insight Events
  GUARDIAN_HEALTH_ALERT: 'guardian.insight.health.alert',
  GUARDIAN_PREDICTION_UPDATE: 'guardian.insight.prediction.update',
  GUARDIAN_TREND_DETECTED: 'guardian.insight.trend.detected',

  // Guardian CareTrack Events
  GUARDIAN_CARE_RECORD_CREATED: 'guardian.caretrack.record.created',
  GUARDIAN_BILLING_OPTIMIZED: 'guardian.caretrack.billing.optimized',
  GUARDIAN_VOICE_TRANSCRIBED: 'guardian.caretrack.voice.transcribed',

  // Guardian CarePro Events
  GUARDIAN_RECOMMENDATION_GENERATED: 'guardian.carepro.recommendation.generated',
  GUARDIAN_DRUG_INTERACTION: 'guardian.carepro.drug.interaction',
  GUARDIAN_CONSULTATION_REQUESTED: 'guardian.carepro.consultation.requested',

  // User & Security Events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_PERMISSION_CHANGED: 'user.permission.changed',
  SECURITY_THREAT_DETECTED: 'security.threat.detected',
  SECURITY_ACCESS_DENIED: 'security.access.denied',

  // Family Portal Events
  FAMILY_ACCESS_REQUESTED: 'family.access.requested',
  FAMILY_MESSAGE_SENT: 'family.message.sent',
  FAMILY_VISIT_SCHEDULED: 'family.visit.scheduled',

  // Emergency Response Events
  EMERGENCY_ALERT_TRIGGERED: 'emergency.alert.triggered',
  EMERGENCY_RESPONSE_INITIATED: 'emergency.response.initiated',
  EMERGENCY_LOCKDOWN_ACTIVATED: 'emergency.lockdown.activated',
  EMERGENCY_EVACUATION_ORDERED: 'emergency.evacuation.ordered',

  // System Events
  SYSTEM_STARTUP: 'system.startup',
  SYSTEM_SHUTDOWN: 'system.shutdown',
  SYSTEM_ERROR: 'system.error',
  SYSTEM_PERFORMANCE_ALERT: 'system.performance.alert',

  // Communication Events
  MESSAGE_SENT: 'communication.message.sent',
  MESSAGE_RECEIVED: 'communication.message.received',
  NOTIFICATION_TRIGGERED: 'communication.notification.triggered',

  // Data Sync Events
  DATA_SYNC_STARTED: 'data.sync.started',
  DATA_SYNC_COMPLETED: 'data.sync.completed',
  DATA_SYNC_FAILED: 'data.sync.failed',
  DATA_CONFLICT_DETECTED: 'data.conflict.detected'
} as const;

// Export singleton instance
export const eventBus = EventBusService.getInstance();
