-- Eversight Care Desktop Database Schema

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('caregiver', 'family', 'admin', 'emergency', 'resident')),
  facility_id TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);

CREATE TABLE IF NOT EXISTS user_permissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  permission TEXT NOT NULL,
  resource TEXT,
  conditions TEXT, -- JSON
  granted_by TEXT,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (granted_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  refresh_token_hash TEXT NOT NULL,
  device_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS mfa_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'email')),
  secret TEXT,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN DEFAULT 0,
  is_enabled BOOLEAN DEFAULT 1,
  backup_codes TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Facilities and Infrastructure
CREATE TABLE IF NOT EXISTS facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  settings TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS floor_plans (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  scale_pixels_per_meter REAL DEFAULT 100.0,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  metadata TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL,
  floor_plan_id TEXT,
  number TEXT NOT NULL,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('single', 'double', 'suite', 'common', 'medical', 'utility')),
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  floor_level INTEGER,
  position_x REAL,
  position_y REAL,
  width REAL,
  height REAL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'emergency')),
  is_accessible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (floor_plan_id) REFERENCES floor_plans(id)
);

-- Residents and Health Profiles
CREATE TABLE IF NOT EXISTS residents (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL,
  room_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  medical_record_number TEXT UNIQUE,
  care_level TEXT CHECK (care_level IN ('independent', 'assisted', 'memory', 'skilled')),
  mobility TEXT CHECK (mobility IN ('independent', 'walker', 'wheelchair', 'bedridden')),
  cognition TEXT CHECK (cognition IN ('normal', 'mild_impairment', 'moderate_impairment', 'severe_impairment')),
  fall_risk TEXT CHECK (fall_risk IN ('low', 'medium', 'high', 'critical')),
  admission_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'temporary_out', 'discharged', 'deceased')),
  emergency_contacts TEXT, -- JSON array
  health_profile TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS family_relationships (
  id TEXT PRIMARY KEY,
  resident_id TEXT NOT NULL,
  family_member_id TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary_contact BOOLEAN DEFAULT 0,
  can_receive_updates BOOLEAN DEFAULT 1,
  can_schedule_visits BOOLEAN DEFAULT 1,
  emergency_priority INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (family_member_id) REFERENCES users(id)
);

-- Guardian Protect Module
CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  facility_id TEXT NOT NULL,
  room_id TEXT,
  floor_plan_id TEXT,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('fixed', 'ptz', 'thermal')),
  stream_url TEXT NOT NULL,
  position_x REAL,
  position_y REAL,
  height REAL,
  view_angle REAL DEFAULT 60.0,
  view_distance REAL DEFAULT 10.0,
  has_audio BOOLEAN DEFAULT 0,
  has_night_vision BOOLEAN DEFAULT 0,
  capabilities TEXT, -- JSON array
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
  last_heartbeat DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (floor_plan_id) REFERENCES floor_plans(id)
);

CREATE TABLE IF NOT EXISTS fall_detection_events (
  id TEXT PRIMARY KEY,
  resident_id TEXT,
  room_id TEXT NOT NULL,
  camera_id TEXT NOT NULL,
  confidence REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'confirmed', 'false_positive', 'resolved')),
  bounding_box_x REAL,
  bounding_box_y REAL,
  bounding_box_width REAL,
  bounding_box_height REAL,
  video_clip_url TEXT,
  thumbnail_url TEXT,
  response_time INTEGER, -- seconds
  responder_ids TEXT, -- JSON array
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (camera_id) REFERENCES cameras(id)
);

CREATE TABLE IF NOT EXISTS risk_zones (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  floor_plan_id TEXT,
  name TEXT NOT NULL,
  polygon_points TEXT NOT NULL, -- JSON array of {x, y} coordinates
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  fall_count_24h INTEGER DEFAULT 0,
  fall_count_week INTEGER DEFAULT 0,
  fall_count_month INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (floor_plan_id) REFERENCES floor_plans(id)
);

-- Emergency Response
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('fall', 'medical', 'security', 'fire', 'evacuation', 'system')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  room_id TEXT,
  resident_id TEXT,
  facility_id TEXT,
  triggered_by TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'cancelled')),
  assigned_to TEXT, -- JSON array of user IDs
  response_team TEXT, -- JSON array of user IDs
  estimated_response_time INTEGER,
  actual_response_time INTEGER,
  escalation_level INTEGER DEFAULT 1,
  metadata TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (triggered_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS emergency_actions (
  id TEXT PRIMARY KEY,
  alert_id TEXT NOT NULL,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  result TEXT,
  notes TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alert_id) REFERENCES emergency_alerts(id),
  FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- Care Documentation
CREATE TABLE IF NOT EXISTS care_records (
  id TEXT PRIMARY KEY,
  resident_id TEXT NOT NULL,
  caregiver_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assessment', 'medication', 'activity', 'incident', 'note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  voice_transcription_url TEXT,
  transcription_accuracy REAL,
  billing_codes TEXT, -- JSON array
  documentation_time INTEGER, -- seconds spent documenting
  is_locked BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (caregiver_id) REFERENCES users(id)
);

-- Health Analytics
CREATE TABLE IF NOT EXISTS health_metrics (
  id TEXT PRIMARY KEY,
  resident_id TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  recorded_by TEXT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT, -- manual, device, calculated
  metadata TEXT, -- JSON
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS health_predictions (
  id TEXT PRIMARY KEY,
  resident_id TEXT NOT NULL,
  prediction_type TEXT NOT NULL,
  prediction_value REAL NOT NULL,
  confidence REAL NOT NULL,
  risk_factors TEXT, -- JSON array
  recommendations TEXT, -- JSON array
  valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
  valid_until DATETIME,
  model_version TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(id)
);

-- Communication and Messaging
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  recipient_id TEXT,
  recipient_type TEXT CHECK (recipient_type IN ('user', 'group', 'broadcast')),
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'file')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read')),
  parent_message_id TEXT,
  attachments TEXT, -- JSON array
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id),
  FOREIGN KEY (parent_message_id) REFERENCES messages(id)
);

-- System Configuration and Monitoring
CREATE TABLE IF NOT EXISTS system_configuration (
  id TEXT PRIMARY KEY,
  module_name TEXT NOT NULL,
  configuration_key TEXT NOT NULL,
  configuration_value TEXT, -- JSON
  data_type TEXT NOT NULL CHECK (data_type IN ('string', 'number', 'boolean', 'object', 'array')),
  is_encrypted BOOLEAN DEFAULT 0,
  updated_by TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id),
  UNIQUE(module_name, configuration_key)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_facility ON users(facility_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_residents_facility ON residents(facility_id);
CREATE INDEX IF NOT EXISTS idx_residents_room ON residents(room_id);
CREATE INDEX IF NOT EXISTS idx_fall_events_resident ON fall_detection_events(resident_id);
CREATE INDEX IF NOT EXISTS idx_fall_events_camera ON fall_detection_events(camera_id);
CREATE INDEX IF NOT EXISTS idx_fall_events_timestamp ON fall_detection_events(created_at);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_facility ON emergency_alerts(facility_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_care_records_resident ON care_records(resident_id);
CREATE INDEX IF NOT EXISTS idx_care_records_caregiver ON care_records(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_resident ON health_metrics(resident_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON health_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
