import React, { useState } from 'react';
import { Camera, Settings, Wifi, Zap, Plus, Trash2, Eye, X, Monitor, AlertTriangle } from 'lucide-react';
import { useConfigurationStore } from './../../store/configurationStore';

// Use a looser selector typing to avoid TypeScript resolution against older declaration files.
const useConfigAny: any = useConfigurationStore as any;

const CameraManagementPage = () => {
    const cameraProfiles = useConfigAny(state => state.cameraProfiles);
    const roomCameraAssignments = useConfigAny(state => state.roomCameraAssignments);
    const updateCameraProfile = useConfigAny(state => state.updateCameraProfile);
    const deleteCameraProfile = useConfigAny(state => state.deleteCameraProfile);
    const assignCameraToRoom = useConfigAny(state => state.assignCameraToRoom);
    const unassignCameraFromRoom = useConfigAny(state => state.unassignCameraFromRoom);
    const addCameraProfile = useConfigAny(state => state.addCameraProfile);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [showStreamModal, setShowStreamModal] = useState(null);

    const availableAIFeatures = [
        'Motion Detection', 'Fall Detection', 'Facial Recognition',
        'Crowd Counting', 'Unusual Activity Detection', 'Audio Analytics'
    ];

    const handleToggleCameraStatus = (cameraId) => {
        const camera = cameraProfiles.find(c => c.cameraId === cameraId);
        if (camera) {
            updateCameraProfile(cameraId, {
                isOnline: !camera.isOnline,
                status: !camera.isOnline ? 'online' : 'offline'
            });
        }
    };

    const handleToggleAIFeature = (cameraId, feature) => {
        const camera = cameraProfiles.find(c => c.cameraId === cameraId);
        if (camera) {
            const updatedFeatures = camera.enabledAiFeatures.includes(feature)
                ? camera.enabledAiFeatures.filter(f => f !== feature)
                : [...camera.enabledAiFeatures, feature];
            updateCameraProfile(cameraId, { enabledAiFeatures: updatedFeatures });
        }
    };

    const handleDeleteCamera = (cameraId) => {
        if (window.confirm('Are you sure you want to delete this camera?')) {
            deleteCameraProfile(cameraId);
        }
    };

    const handleAssignToRoom = (cameraId, roomId) => {
        if (roomId === 'unassigned') {
            unassignCameraFromRoom(cameraId, cameraProfiles.find(c => c.cameraId === cameraId)?.roomId || '');
        } else {
            assignCameraToRoom(cameraId, roomId);
        }
    };

    const handleAddCamera = () => {
        const newCamera = {
            cameraId: `CAM-${Date.now()}`,
            name: 'New Camera',
            roomId: 'unassigned',
            roomType: '',
            isOnline: false,
            hasAiFeatures: false,
            enabledAiFeatures: [],
            lastActivity: new Date().toLocaleString(),
            type: 'dome_indoor',
            location: 'unassigned',
            installationDate: new Date().toISOString().split('T')[0],
            specs: '1080p, Night Vision, PTZ',
            ipAddress: '',
            status: 'offline',
            streamUrl: '',
            recordingEnabled: false
        };
        addCameraProfile(newCamera);
    };

    const filteredCameras = cameraProfiles.filter(camera => {
        const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            camera.cameraId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'online' && camera.isOnline) ||
            (filterStatus === 'offline' && !camera.isOnline) ||
            (filterStatus === 'unassigned' && (camera.roomId === 'unassigned' || !camera.roomId));
        const matchesRoom = !selectedRoomId || (selectedRoomId === 'unassigned' ? (camera.roomId === 'unassigned' || !camera.roomId) : camera.roomId === selectedRoomId);
        return matchesSearch && matchesStatus && matchesRoom;
    });

    // Rooms overview derived from assignments
    const roomsOverview = roomCameraAssignments.map(room => ({
        ...room,
        cameras: cameraProfiles.filter(c => c.roomId === room.roomId)
    }));

    // Stream Modal Component
    const StreamModal = ({ camera, onClose }) => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90%'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                        Live Stream: {camera.name}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                <div style={{
                    backgroundColor: '#000',
                    borderRadius: '8px',
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px'
                }}>
                    {camera.isOnline ? (
                        <div style={{ textAlign: 'center' }}>
                            <Monitor size={48} style={{ marginBottom: '16px', opacity: 0.7 }} />
                            <div>Live Stream Placeholder</div>
                            <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>
                                {camera.streamUrl}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <AlertTriangle size={48} style={{ marginBottom: '16px', color: '#ef4444' }} />
                            <div>Camera Offline</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Camera size={28} color="#3b82f6" />
                            <div>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                    Camera Management
                                </h1>
                                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                    Monitor, configure, and manage camera systems with room assignments
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={handleAddCamera}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={16} />
                                Add Camera
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                                <Settings size={16} />
                                System Settings
                            </button>
                        </div>
                    </div>

                    {/* System Status Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                                {cameraProfiles.length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>Total Cameras</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                                {cameraProfiles.filter(cam => cam.isOnline).length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>Online</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                                {cameraProfiles.filter(cam => !cam.isOnline).length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>Offline</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#7c3aed' }}>
                                {cameraProfiles.filter(cam => cam.hasAiFeatures).length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Enabled</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                                {cameraProfiles.reduce((total, cam) => total + cam.enabledAiFeatures.length, 0)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Features</div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                                99.2%
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Search Controls */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search cameras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '10px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        >
                            <option value="all">All Cameras</option>
                            <option value="online">Online Only</option>
                            <option value="offline">Offline Only</option>
                            <option value="unassigned">Unassigned</option>
                        </select>
                    </div>
                </div>

                {/* Rooms Overview */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <button onClick={() => setSelectedRoomId(null)} style={{ padding: '6px 10px', borderRadius: 6, background: selectedRoomId === null ? '#3b82f6' : 'white', color: selectedRoomId === null ? 'white' : '#111827', border: '1px solid #e5e7eb', cursor: 'pointer' }}>All Rooms</button>
                        <button onClick={() => setSelectedRoomId('unassigned')} style={{ padding: '6px 10px', borderRadius: 6, background: selectedRoomId === 'unassigned' ? '#f59e0b' : 'white', color: selectedRoomId === 'unassigned' ? 'white' : '#111827', border: '1px solid #e5e7eb', cursor: 'pointer' }}>Unassigned</button>
                        {roomsOverview.map(r => (
                            <button key={r.roomId} onClick={() => setSelectedRoomId(r.roomId)} style={{ padding: '6px 10px', borderRadius: 6, background: selectedRoomId === r.roomId ? '#10b981' : 'white', color: selectedRoomId === r.roomId ? 'white' : '#111827', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                                {r.roomName} ({r.cameras.length})
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Tip: Use the Dashboard Configuration Wizard to create rooms (room IDs like <code>resident_room_1</code>). Assigned cameras appear grouped under rooms.</div>
                </div>

                {/* Camera Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {filteredCameras.map((camera) => (
                        <div key={camera.cameraId} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                        }}>
                            {/* Camera Header */}
                            <div style={{
                                padding: '20px',
                                borderBottom: '1px solid #e5e7eb',
                                backgroundColor: camera.isOnline ? '#f9fafb' : '#fef2f2'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: camera.isOnline ? '#10b981' : '#ef4444'
                                        }}></div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                                            {camera.name}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button
                                            onClick={() => setShowStreamModal(camera)}
                                            disabled={!camera.isOnline}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: camera.isOnline ? '#3b82f6' : '#9ca3af',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                cursor: camera.isOnline ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            <Eye size={12} />
                                        </button>
                                        <Wifi size={16} color={camera.isOnline ? '#10b981' : '#ef4444'} />
                                        {camera.hasAiFeatures && <Zap size={16} color="#7c3aed" />}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {camera.cameraId} • {camera.roomId} • {camera.specs}
                                </div>
                            </div>

                            {/* Camera Controls */}
                            <div style={{ padding: '20px' }}>
                                {/* Status Control */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                                        Camera Status
                                    </label>
                                    <button
                                        onClick={() => handleToggleCameraStatus(camera.cameraId)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '2px solid #e5e7eb',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            backgroundColor: camera.isOnline ? '#dcfce7' : '#fee2e2',
                                            color: camera.isOnline ? '#166534' : '#dc2626'
                                        }}
                                    >
                                        {camera.isOnline ? 'Online - Click to Disable' : 'Offline - Click to Enable'}
                                    </button>
                                </div>

                                {/* Room Assignment */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                                        Room Assignment
                                    </label>
                                    <select
                                        value={camera.roomId || 'unassigned'}
                                        onChange={(e) => handleAssignToRoom(camera.cameraId, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="unassigned">Unassigned</option>
                                        {roomCameraAssignments.map(room => (
                                            <option key={room.roomId} value={room.roomId}>
                                                {room.roomName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* AI Features */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                                        AI Features ({camera.enabledAiFeatures.length} enabled)
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                        {availableAIFeatures.map(feature => {
                                            const isEnabled = camera.enabledAiFeatures.includes(feature);
                                            return (
                                                <button
                                                    key={feature}
                                                    onClick={() => handleToggleAIFeature(camera.cameraId, feature)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e5e7eb',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        backgroundColor: isEnabled ? '#eff6ff' : '#f9fafb',
                                                        color: isEnabled ? '#1e40af' : '#6b7280',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {isEnabled ? '✓' : '○'} {feature}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Camera Actions Footer */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        Configure
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCamera(camera.cameraId)}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#fee2e2',
                                            color: '#dc2626',
                                            border: '1px solid #fecaca',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stream Modal */}
                {showStreamModal && <StreamModal camera={showStreamModal} onClose={() => setShowStreamModal(null)} />}
            </div>
        </div>
    );
};

export default CameraManagementPage;