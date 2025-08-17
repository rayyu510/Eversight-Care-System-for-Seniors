import React from 'react';

export const FloorPlanView = (props: any) => {
    const {
        selectedFloor,
        onRoomSelect,
        onCameraSelect,
        alerts = [],
        residents = [],
        cameras = [],
        showHeatMap = false
    } = props;

    console.log('📊 FloorPlanView Props:', { selectedFloor, residents, alerts, cameras });

    // Generate room numbers based on floor
    const generateRooms = () => {
        if (selectedFloor === 0) {
            return ['G01', 'G02', 'G03', 'G04', 'Common Area', 'Garden'];
        } else {
            return Array.from({ length: 6 }, (_, i) => `${selectedFloor}${String(i + 1).padStart(2, '0')}`);
        }
    };

    const rooms = generateRooms();
    const floorResidents = residents.filter((r: any) => r.floor === selectedFloor);

    return React.createElement('div', {
        className: 'w-full h-full bg-gray-50 p-4 overflow-y-auto'
    }, [
        React.createElement('h2', {
            key: 'title',
            className: 'text-xl font-bold mb-4'
        }, `Floor ${selectedFloor} - ${floorResidents.length} residents`),

        React.createElement('div', {
            key: 'grid',
            className: 'grid grid-cols-3 gap-4'
        }, rooms.map(roomNum => {
            const resident = floorResidents.find((r: any) => r.roomNumber === roomNum);
            const hasAlert = alerts.some((a: any) => a.roomId === roomNum);

            return React.createElement('div', {
                key: roomNum,
                className: `border-2 rounded-lg p-4 cursor-pointer min-h-32 ${hasAlert ? 'border-red-500 bg-red-100' :
                    resident ? 'border-blue-500 bg-blue-100' :
                        'border-gray-300 bg-gray-50'
                    }`,
                onClick: () => onRoomSelect?.({ roomNumber: roomNum, floor: selectedFloor })
            }, [
                React.createElement('div', {
                    key: 'room',
                    className: 'font-bold'
                }, `Room ${roomNum}`),

                resident && React.createElement('div', {
                    key: 'resident',
                    className: 'text-sm mt-2'
                }, [
                    React.createElement('div', { key: 'name' }, `${resident.firstName} ${resident.lastName}`),
                    React.createElement('div', {
                        key: 'risk',
                        className: 'text-xs text-gray-600'
                    }, `Risk: ${resident.riskLevel}`)
                ]),

                hasAlert && React.createElement('div', {
                    key: 'alert',
                    className: 'absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'
                }, '🚨')
            ])
        }))
    ]);
};

export const VideoFeedGrid = (props: any) => {
    const {
        selectedCameras = [],
        availableCameras = [],
        layout = "grid-9",
        showControls = true,
        onCameraSelect,
        onCameraControl
    } = props;

    console.log('📹 VideoFeedGrid Props:', { selectedCameras, availableCameras, layout, showControls });

    // Generate grid layout classes
    const getGridClass = () => {
        switch (layout) {
            case 'grid-4': return 'grid-cols-2 grid-rows-2';
            case 'grid-6': return 'grid-cols-3 grid-rows-2';
            case 'grid-9': return 'grid-cols-3 grid-rows-3';
            case 'grid-16': return 'grid-cols-4 grid-rows-4';
            default: return 'grid-cols-3 grid-rows-3';
        }
    };

    // Mock video feed data
    const mockVideoFeeds = availableCameras.map((camera: any, index: number) => ({
        ...camera,
        isOnline: camera.status === 'online',
        quality: ['HD', '4K', 'HD', '1080p'][index % 4],
        recording: index % 3 === 0,
        motion: index % 2 === 0,
        lastFrame: `https://picsum.photos/320/240?random=${camera.id}`,
        bitrate: `${Math.floor(Math.random() * 5 + 2)} Mbps`,
        fps: [15, 24, 30, 60][index % 4]
    }));

    // Fill empty slots for grid layout
    const maxSlots = layout === 'grid-4' ? 4 : layout === 'grid-6' ? 6 : layout === 'grid-9' ? 9 : 16;
    const filledFeeds = [...mockVideoFeeds];
    while (filledFeeds.length < maxSlots) {
        filledFeeds.push(null); // Empty slot
    }

    const getCameraStatus = (camera: any) => {
        if (!camera) return 'empty';
        if (!camera.isOnline) return 'offline';
        if (camera.motion) return 'motion';
        if (camera.recording) return 'recording';
        return 'online';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'motion': return 'border-red-500 bg-red-50';
            case 'recording': return 'border-blue-500 bg-blue-50';
            case 'online': return 'border-green-500 bg-green-50';
            case 'offline': return 'border-gray-500 bg-gray-200';
            default: return 'border-gray-300 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'motion': return '🚨';
            case 'recording': return '🔴';
            case 'online': return '🟢';
            case 'offline': return '⚫';
            default: return '📷';
        }
    };

    return React.createElement('div', {
        className: 'w-full h-full bg-gray-900 p-4'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'flex justify-between items-center mb-4'
        }, [
            React.createElement('div', { key: 'title' }, [
                React.createElement('h2', {
                    key: 'h2',
                    className: 'text-2xl font-bold text-white'
                }, 'Video Surveillance'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-gray-400 text-sm'
                }, `${availableCameras.length} available cameras • ${mockVideoFeeds.filter((c: any) => c.isOnline).length} online`),
            ]),
            React.createElement('div', {
                key: 'controls',
                className: 'flex space-x-2'
            }, [
                React.createElement('select', {
                    key: 'layout-select',
                    value: layout,
                    onChange: (e: any) => console.log('Layout changed:', e.target.value),
                    className: 'px-3 py-1 bg-gray-800 text-white border border-gray-600 rounded'
                }, [
                    React.createElement('option', { key: '4', value: 'grid-4' }, '2×2 Grid'),
                    React.createElement('option', { key: '6', value: 'grid-6' }, '3×2 Grid'),
                    React.createElement('option', { key: '9', value: 'grid-9' }, '3×3 Grid'),
                    React.createElement('option', { key: '16', value: 'grid-16' }, '4×4 Grid')
                ]),
                React.createElement('button', {
                    key: 'fullscreen',
                    className: 'px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700',
                    onClick: () => console.log('Toggle fullscreen')
                }, '⛶ Fullscreen')
            ])
        ]),

        // Camera Grid
        React.createElement('div', {
            key: 'grid',
            className: `grid ${getGridClass()} gap-2 h-5/6`
        }, filledFeeds.slice(0, maxSlots).map((camera: any, index: number) => {
            const status = getCameraStatus(camera);
            const isSelected = camera && selectedCameras.includes(camera.id);

            return React.createElement('div', {
                key: camera?.id || `empty-${index}`,
                className: `relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${camera ? getStatusColor(status) : 'border-gray-600 bg-gray-800'
                    } ${isSelected ? 'ring-2 ring-yellow-400' : ''}`,
                onClick: () => {
                    if (camera && onCameraSelect) {
                        onCameraSelect(camera.id);
                    }
                }
            }, camera ? [
                // Video Feed Area
                React.createElement('div', {
                    key: 'video-area',
                    className: 'relative bg-black h-full flex items-center justify-center'
                }, [
                    // Simulated video feed
                    React.createElement('div', {
                        key: 'video-placeholder',
                        className: 'w-full h-full bg-gray-800 flex items-center justify-center text-gray-400'
                    }, [
                        camera.isOnline ?
                            React.createElement('div', {
                                key: 'live-feed',
                                className: 'text-center'
                            }, [
                                React.createElement('div', {
                                    key: 'live-indicator',
                                    className: 'text-red-500 font-bold text-sm mb-1 animate-pulse'
                                }, '● LIVE'),
                                React.createElement('div', {
                                    key: 'camera-icon',
                                    className: 'text-4xl'
                                }, '📹'),
                                React.createElement('div', {
                                    key: 'quality',
                                    className: 'text-xs mt-1'
                                }, `${camera.quality} • ${camera.fps}fps`)
                            ]) :
                            React.createElement('div', {
                                key: 'offline',
                                className: 'text-center'
                            }, [
                                React.createElement('div', {
                                    key: 'offline-icon',
                                    className: 'text-4xl text-gray-600'
                                }, '📵'),
                                React.createElement('div', {
                                    key: 'offline-text',
                                    className: 'text-sm'
                                }, 'OFFLINE')
                            ])
                    ]),

                    // Status Indicators
                    React.createElement('div', {
                        key: 'status-indicators',
                        className: 'absolute top-2 left-2 flex space-x-1'
                    }, [
                        React.createElement('span', {
                            key: 'status-icon',
                            className: 'text-sm'
                        }, getStatusIcon(status)),
                        camera.motion && React.createElement('span', {
                            key: 'motion',
                            className: 'bg-red-600 text-white text-xs px-1 rounded animate-pulse'
                        }, 'MOTION'),
                        camera.recording && React.createElement('span', {
                            key: 'recording',
                            className: 'bg-red-600 text-white text-xs px-1 rounded'
                        }, 'REC')
                    ]),

                    // Selection Indicator
                    isSelected && React.createElement('div', {
                        key: 'selected',
                        className: 'absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold'
                    }, 'SELECTED')
                ]),

                // Camera Info Bar
                React.createElement('div', {
                    key: 'info-bar',
                    className: 'absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2'
                }, [
                    React.createElement('div', {
                        key: 'camera-name',
                        className: 'text-sm font-medium truncate'
                    }, camera.name),
                    camera.isOnline && React.createElement('div', {
                        key: 'camera-stats',
                        className: 'text-xs text-gray-300 flex justify-between'
                    }, [
                        React.createElement('span', { key: 'bitrate' }, camera.bitrate),
                        React.createElement('span', { key: 'time' }, new Date().toLocaleTimeString())
                    ])
                ]),

                // Camera Controls (if showControls)
                showControls && camera.isOnline && React.createElement('div', {
                    key: 'controls',
                    className: 'absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'
                }, [
                    React.createElement('div', {
                        key: 'control-buttons',
                        className: 'flex space-x-2'
                    }, [
                        React.createElement('button', {
                            key: 'zoom-in',
                            className: 'p-2 bg-blue-600 text-white rounded hover:bg-blue-700',
                            onClick: (e: any) => {
                                e.stopPropagation();
                                onCameraControl?.(camera.id, 'zoom_in');
                            }
                        }, '🔍+'),
                        React.createElement('button', {
                            key: 'zoom-out',
                            className: 'p-2 bg-blue-600 text-white rounded hover:bg-blue-700',
                            onClick: (e: any) => {
                                e.stopPropagation();
                                onCameraControl?.(camera.id, 'zoom_out');
                            }
                        }, '🔍-'),
                        React.createElement('button', {
                            key: 'snapshot',
                            className: 'p-2 bg-green-600 text-white rounded hover:bg-green-700',
                            onClick: (e: any) => {
                                e.stopPropagation();
                                onCameraControl?.(camera.id, 'snapshot');
                            }
                        }, '📸')
                    ])
                ])
            ] : [
                // Empty Slot
                React.createElement('div', {
                    key: 'empty-slot',
                    className: 'h-full flex items-center justify-center text-gray-500'
                }, [
                    React.createElement('div', {
                        key: 'empty-content',
                        className: 'text-center'
                    }, [
                        React.createElement('div', {
                            key: 'empty-icon',
                            className: 'text-4xl text-gray-600'
                        }, '📺'),
                        React.createElement('div', {
                            key: 'empty-text',
                            className: 'text-sm mt-2'
                        }, 'No Camera')
                    ])
                ])
            ])
        })),

        // Camera List Sidebar (for available cameras)
        React.createElement('div', {
            key: 'sidebar',
            className: 'mt-4 bg-gray-800 rounded-lg p-4'
        }, [
            React.createElement('h3', {
                key: 'sidebar-title',
                className: 'text-white font-semibold mb-3'
            }, 'Available Cameras'),
            React.createElement('div', {
                key: 'camera-list',
                className: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'
            }, availableCameras.map((camera: any) => {
                const isSelected = selectedCameras.includes(camera.id);
                const isOnline = camera.status === 'online';

                return React.createElement('button', {
                    key: camera.id,
                    className: `p-2 rounded border text-sm transition-all ${isSelected
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                        : isOnline
                            ? 'border-green-500 bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            : 'border-gray-600 bg-gray-600/20 text-gray-400'
                        }`,
                    onClick: () => onCameraSelect?.(camera.id)
                }, [
                    React.createElement('div', {
                        key: 'status',
                        className: 'flex items-center justify-between mb-1'
                    }, [
                        React.createElement('span', { key: 'icon' }, isOnline ? '🟢' : '⚫'),
                        isSelected && React.createElement('span', { key: 'selected' }, '✓')
                    ]),
                    React.createElement('div', {
                        key: 'name',
                        className: 'truncate'
                    }, camera.name.replace(' Monitor', ''))
                ])
            }))
        ])
    ]);
};

export const AlertPanel = (props: any) => {
    const {
        currentUser,
        autoRefresh = true,
        showResolved = false,
        onAlertAcknowledge,
        onAlertResolve,
        onCameraFocus,
        onRoomFocus,
        alerts = [],
        residents = [],
        staff = []
    } = props;

    console.log('🚨 AlertPanel Props:', { currentUser, alerts, residents, staff });

    // Mock alerts data if none provided
    const mockAlerts = alerts.length > 0 ? alerts : [
        {
            id: 'ALERT-001',
            type: 'fall_detected',
            severity: 'critical',
            title: 'Fall Detected - Room 201',
            description: 'AI detected fall in Room 201',
            location: 'Room 201',
            timestamp: new Date().toISOString(),
            status: 'active',
            roomId: '201'
        },
        {
            id: 'ALERT-002',
            type: 'wandering',
            severity: 'high',
            title: 'Wandering Alert - Harold Williams',
            description: 'Resident found in unauthorized area',
            location: 'Room 102',
            timestamp: new Date().toISOString(),
            status: 'active',
            roomId: '102'
        },
        {
            id: 'ALERT-003',
            type: 'medication',
            severity: 'medium',
            title: 'Medication Reminder',
            description: 'Margaret Johnson - Evening medication due',
            location: 'Room 101',
            timestamp: new Date().toISOString(),
            status: 'active',
            roomId: '101'
        }
    ];

    const activeAlerts = mockAlerts.filter((alert: any) => alert.status === 'active');
    const resolvedAlerts = mockAlerts.filter((alert: any) => alert.status === 'resolved');

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 border-red-500 text-red-800';
            case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
            case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
            default: return 'bg-gray-100 border-gray-500 text-gray-800';
        }
    };

    const getSeverityIcon = (type: string) => {
        switch (type) {
            case 'fall_detected': return '🚨';
            case 'wandering': return '🚶';
            case 'medication': return '💊';
            case 'emergency': return '🆘';
            default: return '⚠️';
        }
    };

    return React.createElement('div', {
        className: 'w-full h-full bg-gray-50 p-6'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'flex justify-between items-center mb-6'
        }, [
            React.createElement('div', { key: 'title' }, [
                React.createElement('h2', {
                    key: 'h2',
                    className: 'text-2xl font-bold text-gray-900'
                }, 'Alert Management'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: 'text-sm text-gray-600 mt-1'
                }, `Active user: ${currentUser} • ${activeAlerts.length} active alerts`)
            ]),
            React.createElement('div', {
                key: 'actions',
                className: 'flex space-x-2'
            }, [
                React.createElement('button', {
                    key: 'refresh',
                    className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                    onClick: () => console.log('Refresh alerts')
                }, '🔄 Refresh'),
                React.createElement('button', {
                    key: 'emergency',
                    className: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700',
                    onClick: () => console.log('Emergency protocol')
                }, '🆘 Emergency')
            ])
        ]),

        // Stats Bar
        React.createElement('div', {
            key: 'stats',
            className: 'grid grid-cols-4 gap-4 mb-6'
        }, [
            React.createElement('div', {
                key: 'critical',
                className: 'bg-red-100 border border-red-200 rounded-lg p-4'
            }, [
                React.createElement('div', {
                    key: 'count',
                    className: 'text-2xl font-bold text-red-600'
                }, activeAlerts.filter((a: any) => a.severity === 'critical').length),
                React.createElement('div', {
                    key: 'label',
                    className: 'text-sm text-red-800'
                }, 'Critical')
            ]),
            React.createElement('div', {
                key: 'high',
                className: 'bg-orange-100 border border-orange-200 rounded-lg p-4'
            }, [
                React.createElement('div', {
                    key: 'count',
                    className: 'text-2xl font-bold text-orange-600'
                }, activeAlerts.filter((a: any) => a.severity === 'high').length),
                React.createElement('div', {
                    key: 'label',
                    className: 'text-sm text-orange-800'
                }, 'High')
            ]),
            React.createElement('div', {
                key: 'medium',
                className: 'bg-yellow-100 border border-yellow-200 rounded-lg p-4'
            }, [
                React.createElement('div', {
                    key: 'count',
                    className: 'text-2xl font-bold text-yellow-600'
                }, activeAlerts.filter((a: any) => a.severity === 'medium').length),
                React.createElement('div', {
                    key: 'label',
                    className: 'text-sm text-yellow-800'
                }, 'Medium')
            ]),
            React.createElement('div', {
                key: 'total',
                className: 'bg-gray-100 border border-gray-200 rounded-lg p-4'
            }, [
                React.createElement('div', {
                    key: 'count',
                    className: 'text-2xl font-bold text-gray-600'
                }, activeAlerts.length),
                React.createElement('div', {
                    key: 'label',
                    className: 'text-sm text-gray-800'
                }, 'Total Active')
            ])
        ]),

        // Active Alerts
        React.createElement('div', {
            key: 'alerts-section',
            className: 'mb-6'
        }, [
            React.createElement('h3', {
                key: 'alerts-title',
                className: 'text-lg font-semibold text-gray-900 mb-4'
            }, `Active Alerts (${activeAlerts.length})`),

            React.createElement('div', {
                key: 'alerts-list',
                className: 'space-y-4 max-h-96 overflow-y-auto'
            }, activeAlerts.length > 0 ? activeAlerts.map((alert: any) =>
                React.createElement('div', {
                    key: alert.id,
                    className: `border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)} transition-all hover:shadow-md`
                }, [
                    React.createElement('div', {
                        key: 'alert-header',
                        className: 'flex justify-between items-start mb-2'
                    }, [
                        React.createElement('div', {
                            key: 'alert-info',
                            className: 'flex-1'
                        }, [
                            React.createElement('div', {
                                key: 'title-row',
                                className: 'flex items-center space-x-2 mb-1'
                            }, [
                                React.createElement('span', {
                                    key: 'icon',
                                    className: 'text-lg'
                                }, getSeverityIcon(alert.type)),
                                React.createElement('h4', {
                                    key: 'title',
                                    className: 'font-semibold'
                                }, alert.title),
                                React.createElement('span', {
                                    key: 'severity',
                                    className: `px-2 py-1 rounded-full text-xs font-medium bg-white/50`
                                }, alert.severity.toUpperCase())
                            ]),
                            React.createElement('p', {
                                key: 'description',
                                className: 'text-sm mb-2'
                            }, alert.description),
                            React.createElement('div', {
                                key: 'meta',
                                className: 'text-xs opacity-75'
                            }, [
                                React.createElement('span', { key: 'location' }, `📍 ${alert.location}`),
                                React.createElement('span', { key: 'separator' }, ' • '),
                                React.createElement('span', { key: 'time' }, new Date(alert.timestamp).toLocaleTimeString())
                            ])
                        ]),
                        React.createElement('div', {
                            key: 'alert-actions',
                            className: 'flex flex-col space-y-2'
                        }, [
                            React.createElement('button', {
                                key: 'acknowledge',
                                className: 'px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700',
                                onClick: () => {
                                    console.log('Acknowledging alert:', alert.id);
                                    onAlertAcknowledge?.(alert.id, currentUser);
                                }
                            }, 'Acknowledge'),
                            React.createElement('button', {
                                key: 'resolve',
                                className: 'px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700',
                                onClick: () => {
                                    console.log('Resolving alert:', alert.id);
                                    onAlertResolve?.(alert.id, currentUser);
                                }
                            }, 'Resolve'),
                            alert.roomId && React.createElement('button', {
                                key: 'room-focus',
                                className: 'px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700',
                                onClick: () => {
                                    console.log('Focusing on room:', alert.roomId);
                                    onRoomFocus?.(alert.roomId);
                                }
                            }, 'View Room')
                        ])
                    ])
                ])
            ) : [
                React.createElement('div', {
                    key: 'no-alerts',
                    className: 'text-center py-8 text-gray-500'
                }, [
                    React.createElement('div', {
                        key: 'icon',
                        className: 'text-4xl mb-2'
                    }, '✅'),
                    React.createElement('p', {
                        key: 'message'
                    }, 'No active alerts')
                ])
            ])
        ]),

        // Resolved Alerts (if showResolved is true)
        showResolved && React.createElement('div', {
            key: 'resolved-section',
            className: 'mt-8'
        }, [
            React.createElement('h3', {
                key: 'resolved-title',
                className: 'text-lg font-semibold text-gray-900 mb-4'
            }, `Resolved Alerts (${resolvedAlerts.length})`),
            React.createElement('div', {
                key: 'resolved-list',
                className: 'space-y-2 max-h-48 overflow-y-auto'
            }, resolvedAlerts.map((alert: any) =>
                React.createElement('div', {
                    key: alert.id,
                    className: 'border border-gray-200 bg-gray-50 rounded p-3 text-sm'
                }, [
                    React.createElement('span', {
                        key: 'title',
                        className: 'font-medium text-gray-700'
                    }, alert.title),
                    React.createElement('span', {
                        key: 'meta',
                        className: 'text-gray-500 ml-2'
                    }, `• Resolved • ${alert.location}`)
                ])
            ))
        ])
    ]);
};

export const HeatMapOverlay = (props: any) => {
    const {
        floor = 1,
        heatMapType = "all",
        intensity = 0.6,
        showZones = true,
        showLegend = true,
        timeRange = "24h",
        residents = [],
        alerts = [],
        onPointClick,
        onZoneClick,
        className = ""
    } = props;

    console.log('🔥 HeatMapOverlay Props:', { floor, heatMapType, intensity, showZones, showLegend, timeRange });

    // Generate heat map data points
    const generateHeatMapData = () => {
        const heatPoints: any[] = []; // Add explicit type here

        // High activity areas (common areas, dining room, etc.)
        const highActivityAreas = [
            { x: 20, y: 30, intensity: 0.9, type: 'high_traffic', label: 'Dining Area' },
            { x: 70, y: 25, intensity: 0.8, type: 'high_traffic', label: 'Nurses Station' },
            { x: 50, y: 80, intensity: 0.7, type: 'medium_traffic', label: 'Common Room' }
        ];

        // Alert-based heat points
        alerts.forEach((alert: any) => {
            if (alert.roomId) {
                const roomNumber = parseInt(alert.roomId);
                if (roomNumber) {
                    heatPoints.push({
                        x: (roomNumber % 3) * 30 + 15,
                        y: Math.floor(roomNumber / 100) * 40 + 20,
                        intensity: alert.severity === 'critical' ? 0.95 :
                            alert.severity === 'high' ? 0.8 : 0.6,
                        type: 'alert',
                        label: `Alert: ${alert.type}`,
                        alertId: alert.id
                    });
                }
            }
        });

        // Resident activity heat points
        residents.filter((r: any) => r.floor === floor).forEach((resident: any, index: number) => {
            const roomNum = parseInt(resident.roomNumber) || (floor * 100 + index + 1);
            heatPoints.push({
                x: (roomNum % 3) * 30 + 10,
                y: Math.floor(roomNum / 100) * 40 + 30,
                intensity: resident.riskLevel === 'critical' ? 0.9 :
                    resident.riskLevel === 'high' ? 0.7 : 0.5,
                type: 'resident_activity',
                label: `${resident.firstName} ${resident.lastName}`,
                residentId: resident.id
            });
        });

        return [...highActivityAreas, ...heatPoints];
    };

    const heatMapData = generateHeatMapData();

    // Risk zones based on data
    const riskZones = [
        {
            id: 'zone-1',
            x: 10, y: 10, width: 25, height: 20,
            risk: 'high',
            label: 'High Fall Risk Area',
            color: 'rgba(255, 0, 0, 0.3)'
        },
        {
            id: 'zone-2',
            x: 60, y: 40, width: 30, height: 25,
            risk: 'medium',
            label: 'Wandering Risk Zone',
            color: 'rgba(255, 165, 0, 0.3)'
        },
        {
            id: 'zone-3',
            x: 15, y: 70, width: 40, height: 15,
            risk: 'low',
            label: 'Safe Zone',
            color: 'rgba(0, 255, 0, 0.2)'
        }
    ];

    const getHeatPointColor = (point: any) => {
        switch (point.type) {
            case 'alert':
                return point.intensity > 0.8 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 100, 0, 0.6)';
            case 'high_traffic':
                return 'rgba(0, 100, 255, 0.6)';
            case 'medium_traffic':
                return 'rgba(0, 150, 255, 0.4)';
            case 'resident_activity':
                return 'rgba(100, 255, 100, 0.5)';
            default:
                return 'rgba(128, 128, 128, 0.4)';
        }
    };

    const getHeatPointSize = (intensity: number) => {
        return Math.max(20, intensity * 60); // Min 20px, max 60px
    };

    return React.createElement('div', {
        className: `relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 ${className}`
    }, [
        // Background grid
        React.createElement('div', {
            key: 'grid-background',
            className: 'absolute inset-0 opacity-20'
        }, [
            React.createElement('svg', {
                key: 'grid-svg',
                className: 'w-full h-full',
                viewBox: '0 0 100 100'
            }, [
                // Grid lines
                ...Array.from({ length: 11 }, (_, i) =>
                    React.createElement('line', {
                        key: `v-line-${i}`,
                        x1: i * 10, y1: 0, x2: i * 10, y2: 100,
                        stroke: '#ccc', strokeWidth: 0.5
                    })
                ),
                ...Array.from({ length: 11 }, (_, i) =>
                    React.createElement('line', {
                        key: `h-line-${i}`,
                        x1: 0, y1: i * 10, x2: 100, y2: i * 10,
                        stroke: '#ccc', strokeWidth: 0.5
                    })
                )
            ])
        ]),

        // Risk zones
        showZones && React.createElement('div', {
            key: 'risk-zones',
            className: 'absolute inset-0'
        }, [
            React.createElement('svg', {
                key: 'zones-svg',
                className: 'w-full h-full',
                viewBox: '0 0 100 100'
            }, riskZones.map((zone: any) =>
                React.createElement('rect', {
                    key: zone.id,
                    x: zone.x, y: zone.y,
                    width: zone.width, height: zone.height,
                    fill: zone.color,
                    stroke: zone.risk === 'high' ? '#ff0000' : zone.risk === 'medium' ? '#ffa500' : '#00ff00',
                    strokeWidth: 1,
                    strokeDasharray: '2,2',
                    className: 'cursor-pointer',
                    onClick: () => {
                        console.log('Zone clicked:', zone.label);
                        onZoneClick?.(zone);
                    }
                }, [
                    React.createElement('title', { key: 'tooltip' }, zone.label)
                ])
            ))
        ]),

        // Heat map points
        React.createElement('div', {
            key: 'heat-points',
            className: 'absolute inset-0'
        }, [
            React.createElement('svg', {
                key: 'points-svg',
                className: 'w-full h-full',
                viewBox: '0 0 100 100'
            }, heatMapData.map((point: any, index: number) =>
                React.createElement('g', {
                    key: `point-${index}`,
                    className: 'cursor-pointer',
                    onClick: () => {
                        console.log('Heat point clicked:', point.label);
                        onPointClick?.(point);
                    }
                }, [
                    // Heat point circle
                    React.createElement('circle', {
                        key: 'circle',
                        cx: point.x, cy: point.y,
                        r: getHeatPointSize(point.intensity) / 10, // Scale for SVG
                        fill: getHeatPointColor(point),
                        className: 'animate-pulse'
                    }),
                    // Point label
                    React.createElement('text', {
                        key: 'label',
                        x: point.x, y: point.y - 3,
                        textAnchor: 'middle',
                        fontSize: '2',
                        fill: '#333',
                        className: 'pointer-events-none'
                    }, point.intensity > 0.7 ? '🔥' : point.type === 'alert' ? '⚠️' : '📍')
                ])
            ))
        ]),

        // Heat map controls
        React.createElement('div', {
            key: 'controls',
            className: 'absolute top-4 left-4 bg-white/90 rounded-lg p-3 shadow-md'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'font-bold text-sm mb-2'
            }, `Heat Map - Floor ${floor}`),
            React.createElement('div', {
                key: 'options',
                className: 'space-y-2 text-xs'
            }, [
                React.createElement('div', { key: 'type' }, [
                    React.createElement('label', {
                        key: 'type-label',
                        className: 'block font-medium'
                    }, 'View Type:'),
                    React.createElement('select', {
                        key: 'type-select',
                        value: heatMapType,
                        className: 'w-full border rounded px-1 py-1',
                        onChange: (e: any) => console.log('Heat map type changed:', e.target.value)
                    }, [
                        React.createElement('option', { key: 'all', value: 'all' }, 'All Activity'),
                        React.createElement('option', { key: 'alerts', value: 'alerts' }, 'Alerts Only'),
                        React.createElement('option', { key: 'traffic', value: 'traffic' }, 'Traffic Only'),
                        React.createElement('option', { key: 'risk', value: 'risk' }, 'Risk Zones')
                    ])
                ]),
                React.createElement('div', { key: 'time' }, [
                    React.createElement('label', {
                        key: 'time-label',
                        className: 'block font-medium'
                    }, 'Time Range:'),
                    React.createElement('select', {
                        key: 'time-select',
                        value: timeRange,
                        className: 'w-full border rounded px-1 py-1',
                        onChange: (e: any) => console.log('Time range changed:', e.target.value)
                    }, [
                        React.createElement('option', { key: '1h', value: '1h' }, 'Last Hour'),
                        React.createElement('option', { key: '24h', value: '24h' }, 'Last 24 Hours'),
                        React.createElement('option', { key: '7d', value: '7d' }, 'Last 7 Days'),
                        React.createElement('option', { key: '30d', value: '30d' }, 'Last 30 Days')
                    ])
                ]),
                React.createElement('div', { key: 'intensity' }, [
                    React.createElement('label', {
                        key: 'intensity-label',
                        className: 'block font-medium'
                    }, `Intensity: ${Math.round(intensity * 100)}%`),
                    React.createElement('input', {
                        key: 'intensity-slider',
                        type: 'range',
                        min: '0.1', max: '1', step: '0.1',
                        value: intensity,
                        className: 'w-full',
                        onChange: (e: any) => console.log('Intensity changed:', e.target.value)
                    })
                ])
            ])
        ]),

        // Legend
        showLegend && React.createElement('div', {
            key: 'legend',
            className: 'absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 shadow-md'
        }, [
            React.createElement('h4', {
                key: 'legend-title',
                className: 'font-bold text-sm mb-2'
            }, 'Heat Map Legend'),
            React.createElement('div', {
                key: 'legend-items',
                className: 'space-y-1 text-xs'
            }, [
                React.createElement('div', {
                    key: 'alerts',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('div', {
                        key: 'color',
                        className: 'w-3 h-3 bg-red-500 rounded-full'
                    }),
                    React.createElement('span', { key: 'label' }, 'Alert Activity')
                ]),
                React.createElement('div', {
                    key: 'traffic',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('div', {
                        key: 'color',
                        className: 'w-3 h-3 bg-blue-500 rounded-full'
                    }),
                    React.createElement('span', { key: 'label' }, 'High Traffic')
                ]),
                React.createElement('div', {
                    key: 'residents',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('div', {
                        key: 'color',
                        className: 'w-3 h-3 bg-green-500 rounded-full'
                    }),
                    React.createElement('span', { key: 'label' }, 'Resident Activity')
                ]),
                React.createElement('div', {
                    key: 'zones',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('div', {
                        key: 'color',
                        className: 'w-3 h-3 border-2 border-orange-500 border-dashed'
                    }),
                    React.createElement('span', { key: 'label' }, 'Risk Zones')
                ])
            ])
        ]),

        // Stats overlay
        React.createElement('div', {
            key: 'stats',
            className: 'absolute top-4 right-4 bg-white/90 rounded-lg p-3 shadow-md'
        }, [
            React.createElement('h4', {
                key: 'stats-title',
                className: 'font-bold text-sm mb-2'
            }, 'Activity Stats'),
            React.createElement('div', {
                key: 'stats-data',
                className: 'space-y-1 text-xs'
            }, [
                React.createElement('div', { key: 'hotspots' }, `🔥 ${heatMapData.filter((p: any) => p.intensity > 0.7).length} Hotspots`),
                React.createElement('div', { key: 'alerts' }, `⚠️ ${heatMapData.filter((p: any) => p.type === 'alert').length} Alert Areas`),
                React.createElement('div', { key: 'zones' }, `🛡️ ${riskZones.length} Risk Zones`),
                React.createElement('div', { key: 'coverage' }, `📊 ${Math.round(intensity * 100)}% Coverage`)
            ])
        ])
    ]);
}

export const ResponseDashboard = (props: any) => {
    const {
        currentUser,
        alerts = [],
        staff = [],
        emergencyResponses = []
    } = props;

    return React.createElement('div', {
        className: 'w-full h-full bg-white p-6'
    }, [
        React.createElement('h2', {
            key: 'title',
            className: 'text-2xl font-bold mb-6'
        }, 'Emergency Response Dashboard'),

        React.createElement('div', {
            key: 'content',
            className: 'grid grid-cols-2 gap-6'
        }, [
            // Left side - Stats
            React.createElement('div', {
                key: 'stats',
                className: 'space-y-4'
            }, [
                React.createElement('div', {
                    key: 'active-responses',
                    className: 'bg-red-100 border border-red-300 rounded-lg p-4'
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        className: 'font-bold text-red-800'
                    }, 'Active Responses'),
                    React.createElement('div', {
                        key: 'count',
                        className: 'text-3xl font-bold text-red-600'
                    }, '2'),
                    React.createElement('p', {
                        key: 'desc',
                        className: 'text-red-700'
                    }, 'Fall Response - Room 201, Medication Alert - Room 102')
                ]),

                React.createElement('div', {
                    key: 'staff-status',
                    className: 'bg-green-100 border border-green-300 rounded-lg p-4'
                }, [
                    React.createElement('h3', {
                        key: 'title',
                        className: 'font-bold text-green-800'
                    }, 'Staff Available'),
                    React.createElement('div', {
                        key: 'count',
                        className: 'text-3xl font-bold text-green-600'
                    }, `${staff.length}/5`),
                    React.createElement('p', {
                        key: 'desc',
                        className: 'text-green-700'
                    }, 'Dr. Wells, Nurse Adams on duty')
                ])
            ]),

            // Right side - Controls
            React.createElement('div', {
                key: 'controls',
                className: 'space-y-4'
            }, [
                React.createElement('div', {
                    key: 'emergency-buttons',
                    className: 'space-y-3'
                }, [
                    React.createElement('button', {
                        key: 'facility-emergency',
                        className: 'w-full p-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700',
                        onClick: () => console.log('Facility Emergency')
                    }, '🚨 FACILITY EMERGENCY'),

                    React.createElement('button', {
                        key: 'medical',
                        className: 'w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                        onClick: () => console.log('Medical Emergency')
                    }, '🏥 Medical Emergency'),

                    React.createElement('button', {
                        key: 'security',
                        className: 'w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700',
                        onClick: () => console.log('Security Alert')
                    }, '🔐 Security Alert')
                ])
            ])
        ])
    ]);
};

