// src/surveillance-center/components/Analytics/FacialRecognition.tsx
import React, { useState } from 'react';
import { Eye, User, UserCheck, UserX } from 'lucide-react';
import { FacialRecognition as FacialRecognitionType, Camera } from '../../types';

interface FacialRecognitionProps {
    recognitions: FacialRecognitionType[];
    cameras: Camera[];
    onPersonAction?: (recognitionId: string, action: string) => void;
    loading?: boolean;
}

export const FacialRecognition: React.FC<FacialRecognitionProps> = ({
    recognitions,
    cameras,
    onPersonAction,
    loading = false
}) => {
    const [filterType, setFilterType] = useState<string>('all');

    const filteredRecognitions = recognitions.filter(recognition => {
        if (filterType === 'known') return recognition.identity.authorized;
        if (filterType === 'unknown') return !recognition.identity.name;
        return true;
    });

    const getAccessLevelColor = (level?: string) => {
        switch (level) {
            case 'authorized': return 'bg-green-100 text-green-800';
            case 'visitor': return 'bg-blue-100 text-blue-800';
            case 'restricted': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Facial Recognition</h3>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                    <option value="all">All Detections</option>
                    <option value="known">Known Persons</option>
                    <option value="unknown">Unknown Persons</option>
                </select>
            </div>

            <div className="space-y-3">
                {filteredRecognitions.map(recognition => (
                    <div key={recognition.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <Eye className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {recognition.identity.name ? recognition.identity.name : 'Unknown Person'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Camera: {cameras.find(c => c.id === recognition.cameraId)?.name}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                        <span>Confidence: {Math.round(recognition.confidence * 100)}%</span>
                                        <span>•</span>
                                        <span>{new Date(recognition.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {recognition.identity.authorized && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(recognition.identity.authorized ? 'authorized' : 'unauthorized')}`}>
                                        {recognition.identity.authorized ? 'authorized' : 'unauthorized'}
                                    </span>
                                )}
                                <div className="flex space-x-2">
                                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                                        View Image
                                    </button>
                                    {!recognition.identity.authorized && (
                                        <button
                                            onClick={() => onPersonAction?.(recognition.id, 'identify')}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Identify
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};