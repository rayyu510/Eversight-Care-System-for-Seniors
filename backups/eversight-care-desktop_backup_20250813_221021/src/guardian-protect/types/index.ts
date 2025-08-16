// src/guardian-protect/types/index.ts
// Complete type definitions for Guardian Protect module

// Base coordinate and geometry types
export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BoundingBox extends Coordinates, Dimensions { }

// Quality and status enums
export type QualityType = 'low' | 'medium' | 'high' | 'ultra';
export type SeverityType = 'low' | 'medium' | 'high' | 'critical';
export type PriorityType = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatusType = 'detected' | 'acknowledged' | 'responding' | 'resolved' | 'false_positive';
export type ResponseStatusType = 'initiated' | 'acknowledged' | 'en_route' | 'on_scene' | 'resolved';
export type ResponderStatusType = 'available' | 'busy' | 'offline' | 'emergency';
export type ResponderRoleType = 'nurse' | 'doctor' | 'security' | 'maintenance' | 'supervisor';
export type TeamType = 'medical' | 'security' | 'maintenance' | 'management';

// Camera and video types
export interface CameraCapability {
  type: 'fall_detection' | 'facial_recognition' | 'motion_detection' | 'night_vision' | 'audio';
  enabled: boolean;
  sensitivity: number;
}

export interface CameraPosition {
  id: string;
  name: string;
  type: 'room' | 'hallway' | 'overhead' | 'entrance' | 'outdoor';
  floor: number;
  coordinates: Coordinates;
  coverage: BoundingBox;
  isActive: boolean;
  streamUrl: string;
  capabilities: CameraCapability[];
}

export interface VideoFeed {
  cameraId: string;
  streamUrl: string;
  isLive: boolean;
  quality: QualityType;
  latency: number;
  lastUpdate: Date;
}

// Room and facility types
export interface CommonArea {
  id: string;
  name: string;
  type: 'lobby' | 'dining' | 'recreation' | 'hallway' | 'elevator' | 'stairs' | 'kitchen' | 'library' | 'fitness' | 'garden';
  floor: number;
  coordinates: BoundingBox;
  capacity: number;
  monitoringLevel: 'high' | 'medium' | 'low';
  specialRequirements?: string[];
}

export interface EmergencyExit {
  id: string;
  name: string;
  floor: number;
  coordinates: Coordinates;
  type: 'main' | 'emergency' | 'fire_escape';
  isAccessible: boolean;
}

export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  rooms: GuardianRoom[];
  commonAreas: CommonArea[];
  emergencyExits: EmergencyExit[];
  cameraPositions: CameraPosition[];
}

// Fall detection and alerts
export interface FallDetectionEvent {
  id: string;
  cameraId: string;
  roomId?: string;
  residentId?: string;
  timestamp: Date;
  confidence: number;
  coordinates: Coordinates;
  severity: SeverityType;
  status: AlertStatusType;
  responseTime?: number;
  videoClipUrl?: string;
}

// Heat map and risk analysis
export interface HeatMapZone {
  id: string;
  coordinates: BoundingBox;
  riskLevel: number; // 0-100
  incidentCount: number;
  category: 'fall_risk' | 'high_traffic' | 'wandering' | 'medical_emergency';
  recommendedActions: string[];
}

export interface HeatMapData {
  floor: number;
  zones: HeatMapZone[];
  timestamp: Date;
  aggregationPeriod: 'hour' | 'day' | 'week' | 'month';
}

// Emergency response types
export interface EmergencyLocation {
  floor: number;
  roomId?: string;
  coordinates: Coordinates;
}

export interface EmergencyResponse {
  id: string;
  type: 'fall' | 'medical' | 'fire' | 'security' | 'natural_disaster';
  priority: PriorityType;
  location: EmergencyLocation;
  timestamp: Date;
  respondersAssigned: string[];
  estimatedResponseTime: number;
  status: ResponseStatusType;
  escalationLevel: number;
  responseTime?: number;
  coordination?: ResponseCoordination;
}

export interface ResponseCoordination {
  instructions: string;
  meetingPoint?: string;
  equipment?: string[];
  specialInstructions?: string[];
  lastUpdated: Date;
}

// Responder and team types
export interface ContactInfo {
  phone?: string;
  radio?: string;
  email?: string;
}

export interface ResponderTeamMember {
  id: string;
  name: string;
  role: ResponderRoleType;
  status: ResponderStatusType;
  currentLocation: string;
  activeResponses: number;
  team: TeamType;
  capabilities: string[];
  eta?: string;
  contactInfo: ContactInfo;
}

// Imported types from core foundation (mock for standalone)
export interface GuardianRoom {
  id: string;
  number: string;
  floor: number;
  type: 'resident_room' | 'common_room' | 'service_room';
  capacity: number;
  coordinates: BoundingBox;
  currentOccupants?: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'emergency';
  lastCleaned: Date;
  amenities: string[];
}

export interface GuardianAlert {
  id: string;
  type: string;
  severity: SeverityType;
  timestamp: Date;
  status: AlertStatusType;
  location?: EmergencyLocation;
  description: string;
}

export interface GuardianFloor {
  id: string;
  level: number;
  name: string;
  rooms: GuardianRoom[];
  commonAreas: CommonArea[];
}

// Event types for inter-module communication
export interface ModuleEvent {
  type: string;
  source: string;
  target?: string;
  payload: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: Date;
    version: string;
    requestId: string;
  };
}

// Component prop types
export interface FloorPlanViewProps {
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
  onRoomSelect: (roomId: string) => void;
  onCameraSelect: (cameraId: string) => void;
}

export interface VideoFeedGridProps {
  selectedCameras: string[];
  onCameraSelect: (cameraId: string) => void;
  layout: '1x1' | '2x2' | '3x3' | '4x4';
  onLayoutChange: (layout: '1x1' | '2x2' | '3x3' | '4x4') => void;
}

export interface HeatMapOverlayProps {
  floor: number;
  timeRange: 'hour' | 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'hour' | 'day' | 'week' | 'month') => void;
  onZoneClick: (zone: HeatMapZone) => void;
}

export interface AlertPanelProps {
  onAlertSelect: (alertId: string) => void;
  onResponseInitiate: (alertId: string) => void;
}

export interface ResponseDashboardProps {
  activeResponse?: string;
  onResponseSelect: (responseId: string) => void;
}

// Hook return types
export interface UseFloorPlanReturn {
  floorPlan: FloorPlan | null;
  rooms: GuardianRoom[];
  commonAreas: CommonArea[];
  isLoading: boolean;
  refreshFloorPlan: () => void;
}

export interface UseVideoFeedsReturn {
  activeFeeds: VideoFeed[];
  feedQuality: Record<string, QualityType>;
  isRecording: Record<string, boolean>;
  switchCamera: (oldCameraId: string, newCameraId: string) => Promise<void>;
  adjustQuality: (cameraId: string, quality: QualityType) => Promise<void>;
  startRecording: (cameraId: string) => Promise<void>;
  stopRecording: (cameraId: string) => Promise<string | null>;
  addCameraFeed: (cameraId: string) => void;
  removeCameraFeed: (cameraId: string) => void;
  getAvailableCameras: () => CameraInfo[];
  refreshFeeds: () => Promise<void>;
}

export interface UseFallDetectionReturn {
  fallEvents: FallDetectionEvent[];
  heatMapData: HeatMapData[];
  riskZones: HeatMapZone[];
  isLoading: boolean;
  acknowledgeAlert: (eventId: string) => Promise<void>;
  resolveAlert: (eventId: string) => Promise<void>;
  markFalsePositive: (eventId: string) => Promise<void>;
  escalateAlert: (eventId: string) => Promise<void>;
  getZoneRecommendations: (zoneId: string) => string[];
  getZoneHistory: (zoneId: string) => Promise<FallDetectionEvent[]>;
  refreshData: () => Promise<void>;
}

export interface UseEmergencyResponseReturn {
  activeResponses: EmergencyResponse[];
  responseHistory: EmergencyResponse[];
  responseTeams: ResponderTeamMember[];
  isLoading: boolean;
  coordinateResponse: (responseId: string, coordination: ResponseCoordination) => Promise<void>;
  updateResponseStatus: (responseId: string, status: ResponseStatusType) => Promise<void>;
  assignResponder: (responseId: string, responderId: string) => Promise<void>;
  escalateResponse: (responseId: string) => Promise<void>;
  closeResponse: (responseId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Helper types
export interface CameraInfo {
  id: string;
  name: string;
  location: string;
}

export interface StreamStatistics {
  bytesReceived: number;
  framesDecoded: number;
  packetsLost: number;
  jitter: number;
  lastUpdate: Date;
}

export interface DetectionResult {
  type: string;
  cameraId: string;
  confidence: number;
  coordinates: Coordinates;
  fallType?: string;
  impact?: string;
  timestamp: number;
  residentId?: string;
}

// Worker message types
export interface WorkerMessage {
  type: string;
  payload?: any;
  config?: any;
  frameData?: ImageData;
}

export interface WorkerResponse {
  type: string;
  result?: any;
  error?: string;
  cameraId?: string;
}