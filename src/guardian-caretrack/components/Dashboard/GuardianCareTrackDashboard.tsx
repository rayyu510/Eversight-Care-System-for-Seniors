import React, { useState, useEffect } from 'react';
import {
    Pill,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    User,
    FileText,
    Activity,
    TrendingUp,
    Bell,
    Shield,
    Target,
    Zap,
    RefreshCw,
    Download,
    Filter,
    Plus,
    Edit,
    Eye,
    Search,
    Phone,
    Stethoscope,
    Heart,
    Droplets,
    Thermometer,
    Scale,
    Timer,
    Package,
    Truck,
    AlertOctagon,
    Info,
    Settings,
    BarChart3
} from 'lucide-react';

// Mock data for Guardian CareTrack
const mockCareTrackData = {
    residents: [
        {
            id: 'r1',
            name: 'Eleanor Johnson',
            age: 78,
            medications: [
                {
                    id: 'm1',
                    name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    times: ['08:00', '20:00'],
                    prescribedBy: 'Dr. Williams',
                    startDate: '2024-06-01',
                    endDate: null,
                    instructions: 'Take with meals',
                    sideEffects: ['Nausea', 'Diarrhea'],
                    adherence: 96,
                    nextDose: '2024-08-09T20:00:00Z',
                    status: 'active',
                    refillsRemaining: 2,
                    refillDate: '2024-08-15'
                },
                {
                    id: 'm2',
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    times: ['08:00'],
                    prescribedBy: 'Dr. Williams',
                    startDate: '2024-05-15',
                    endDate: null,
                    instructions: 'Take in morning',
                    sideEffects: ['Dizziness', 'Dry cough'],
                    adherence: 89,
                    nextDose: '2024-08-10T08:00:00Z',
                    status: 'active',
                    refillsRemaining: 1,
                    refillDate: '2024-08-12'
                }
            ],
            treatments: [
                {
                    id: 't1',
                    type: 'Physical Therapy',
                    provider: 'Sarah Mitchell, PT',
                    frequency: '3x per week',
                    duration: '45 minutes',
                    nextSession: '2024-08-09T14:00:00Z',
                    progress: 'Improving mobility'
                }
            ],
            allergies: [
                { drug: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis' }
            ],
            vitals: {
                lastUpdated: '2024-08-09T08:00:00Z',
                bloodPressure: '145/88',
                heartRate: 78,
                temperature: 98.6,
                weight: 142
            }
        },
        {
            id: 'r2',
            name: 'Robert Smith',
            age: 82,
            medications: [
                {
                    id: 'm3',
                    name: 'Atorvastatin',
                    dosage: '20mg',
                    frequency: 'Once daily',
                    times: ['21:00'],
                    prescribedBy: 'Dr. Chen',
                    startDate: '2024-03-15',
                    endDate: null,
                    instructions: 'Take at bedtime',
                    sideEffects: ['Muscle pain'],
                    adherence: 85,
                    nextDose: '2024-08-09T21:00:00Z',
                    status: 'active',
                    refillsRemaining: 0,
                    refillDate: '2024-08-10'
                }
            ],
            treatments: [
                {
                    id: 't2',
                    type: 'Cardiac Monitoring',
                    provider: 'Dr. Chen',
                    frequency: 'Continuous',
                    nextCheck: '2024-08-09T16:00:00Z',
                    lastReading: 'Irregular rhythm detected'
                }
            ],
            allergies: [
                { drug: 'Ibuprofen', severity: 'mild', reaction: 'Stomach irritation' }
            ],
            vitals: {
                lastUpdated: '2024-08-09T08:30:00Z',
                bloodPressure: '128/75',
                heartRate: 65,
                temperature: 98.4,
                weight: 165
            }
        }
    ],
    medicationSchedule: [
        {
            time: '08:00',
            medications: [
                { residentName: 'Eleanor Johnson', medication: 'Metformin 500mg', status: 'completed' },
                { residentName: 'Eleanor Johnson', medication: 'Lisinopril 10mg', status: 'completed' }
            ]
        },
        {
            time: '20:00',
            medications: [
                { residentName: 'Eleanor Johnson', medication: 'Metformin 500mg', status: 'scheduled' }
            ]
        },
        {
            time: '21:00',
            medications: [
                { residentName: 'Robert Smith', medication: 'Atorvastatin 20mg', status: 'scheduled' }
            ]
        }
    ],
    pharmacyAlerts: [
        {
            id: 'pa1',
            type: 'refill_needed',
            medication: 'Atorvastatin',
            resident: 'Robert Smith',
            severity: 'high',
            message: 'Medication refill needed urgently. Zero refills remaining.',
            dueDate: '2024-08-10',
            pharmacy: 'Central Pharmacy',
            pharmacyPhone: '(555) 123-4567'
        },
        {
            id: 'pa2',
            type: 'interaction_warning',
            medications: ['Metformin', 'New prescription pending'],
            resident: 'Eleanor Johnson',
            severity: 'medium',
            message: 'Potential drug interaction detected. Consult physician.',
            details: 'Monitor blood sugar levels closely if new medication is started.'
        }
    ],
    complianceMetrics: {
        overall: 92,
        byResident: [
            { name: 'Eleanor Johnson', compliance: 94, missedDoses: 3, onTime: 89 },
            { name: 'Robert Smith', compliance: 88, missedDoses: 7, onTime: 85 }
        ],
        trends: {
            thisWeek: 92,
            lastWeek: 89,
            thisMonth: 91,
            lastMonth: 87
        }
    }
};

const MedicationCard = ({ medication, residentName }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
            case 'paused': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
            case 'discontinued': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
            default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
        }
    };

    const getAdherenceColor = (adherence) => {
        if (adherence >= 95) return '#16a34a';
        if (adherence >= 85) return '#ca8a04';
        return '#dc2626';
    };

    const colors = getStatusColor(medication.status);

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                        {medication.name}
                    </h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                        {medication.dosage} • {medication.frequency}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
                        Prescribed by {medication.prescribedBy}
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`
                    }}>
                        {medication.status}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: getAdherenceColor(medication.adherence) }}>
                            {medication.adherence}%
                        </div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>adherence</div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#374151' }}>
                    <strong>Instructions:</strong> {medication.instructions}
                </p>
                <p style={{ margin: '0', fontSize: '13px', color: '#374151' }}>
                    <strong>Times:</strong> {medication.times.join(', ')}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
                <span>Next dose: {new Date(medication.nextDose).toLocaleString()}</span>
                <span>Refills: {medication.refillsRemaining}</span>
            </div>

            {medication.refillsRemaining === 0 && (
                <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <AlertTriangle style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                    <span style={{ fontSize: '12px', color: '#991b1b' }}>
                        Refill needed by {new Date(medication.refillDate).toLocaleDateString()}
                    </span>
                </div>
            )}
        </div>
    );
};

const PharmacyAlertCard = ({ alert }) => {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' };
            case 'medium': return { bg: '#fef3c7', border: '#fde68a', text: '#92400e' };
            case 'low': return { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' };
            default: return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' };
        }
    };

    const colors = getSeverityColor(alert.severity);

    return (
        <div style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Package style={{ width: '16px', height: '16px', color: colors.text }} />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: colors.text }}>
                            {alert.resident}
                        </h4>
                        <span style={{
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            color: colors.text,
                            textTransform: 'uppercase'
                        }}>
                            {alert.severity}
                        </span>
                    </div>

                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: colors.text }}>
                        {alert.message}
                    </p>

                    {alert.dueDate && (
                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: colors.text }}>
                            <strong>Due:</strong> {new Date(alert.dueDate).toLocaleDateString()}
                        </p>
                    )}

                    {alert.pharmacy && (
                        <p style={{ margin: '0', fontSize: '12px', color: colors.text }}>
                            <strong>Pharmacy:</strong> {alert.pharmacy} - {alert.pharmacyPhone}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const GuardianCareTrackDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Medication Overview', icon: <Pill style={{ width: '16px', height: '16px' }} /> },
        { id: 'schedule', label: 'Daily Schedule', icon: <Calendar style={{ width: '16px', height: '16px' }} /> },
        { id: 'treatments', label: 'Treatments', icon: <Stethoscope style={{ width: '16px', height: '16px' }} /> },
        { id: 'pharmacy', label: 'Pharmacy Alerts', icon: <Package style={{ width: '16px', height: '16px' }} /> },
        { id: 'compliance', label: 'Compliance', icon: <BarChart3 style={{ width: '16px', height: '16px' }} /> }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Pill style={{ width: '32px', height: '32px', color: '#3b82f6', animation: 'pulse 2s infinite' }} />
                <span style={{ marginLeft: '12px', fontSize: '18px' }}>Loading medication tracking system...</span>
            </div>
        );
    }

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Overall Compliance</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                                {mockCareTrackData.complianceMetrics.overall}%
                            </p>
                        </div>
                        <CheckCircle style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Active Medications</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                                {mockCareTrackData.residents.reduce((total, resident) =>
                                    total + resident.medications.filter(med => med.status === 'active').length, 0
                                )}
                            </p>
                        </div>
                        <Pill style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Pharmacy Alerts</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
                                {mockCareTrackData.pharmacyAlerts.filter(alert => alert.severity === 'high').length}
                            </p>
                        </div>
                        <AlertTriangle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Upcoming Doses</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#ca8a04' }}>
                                {mockCareTrackData.medicationSchedule.filter(schedule =>
                                    schedule.medications.some(med => med.status === 'scheduled')
                                ).length}
                            </p>
                        </div>
                        <Clock style={{ width: '32px', height: '32px', color: '#ca8a04' }} />
                    </div>
                </div>
            </div>

            {/* Urgent Pharmacy Alerts */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Urgent Pharmacy Alerts</h3>
                <div>
                    {mockCareTrackData.pharmacyAlerts.filter(alert => alert.severity === 'high').map(alert => (
                        <PharmacyAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </div>

            {/* Residents Overview */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Residents Medication Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {mockCareTrackData.residents.map(resident => (
                        <div key={resident.id} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{resident.name}</h4>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                        Age: {resident.age} • {resident.medications.filter(med => med.status === 'active').length} Active Medications
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                                        {Math.round(resident.medications.reduce((sum, med) => sum + med.adherence, 0) / resident.medications.length)}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Compliance</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Current Medications</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {resident.medications.filter(med => med.status === 'active').map(med => (
                                        <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>{med.name} {med.dosage}</span>
                                            <span style={{ color: med.adherence >= 95 ? '#16a34a' : med.adherence >= 85 ? '#ca8a04' : '#dc2626' }}>
                                                {med.adherence}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {resident.allergies.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                    <h5 style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: '#dc2626' }}>
                                        Allergies
                                    </h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {resident.allergies.map((allergy, index) => (
                                            <span key={index} style={{
                                                padding: '2px 6px',
                                                backgroundColor: '#fee2e2',
                                                color: '#991b1b',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                fontWeight: '500'
                                            }}>
                                                {allergy.drug}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Daily Medication Schedule</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockCareTrackData.medicationSchedule.map((schedule, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#dbeafe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Clock style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>{schedule.time}</h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                    {schedule.medications.length} medication{schedule.medications.length !== 1 ? 's' : ''} scheduled
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                            {schedule.medications.map((med, medIndex) => (
                                <div key={medIndex} style={{
                                    padding: '12px',
                                    borderRadius: '6px',
                                    backgroundColor: med.status === 'completed' ? '#f0f9ff' : med.status === 'scheduled' ? '#f9fafb' : '#fef3c7',
                                    border: `1px solid ${med.status === 'completed' ? '#93c5fd' : med.status === 'scheduled' ? '#e5e7eb' : '#fde68a'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '600' }}>
                                                {med.residentName}
                                            </h4>
                                            <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
                                                {med.medication}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {med.status === 'completed' && <CheckCircle style={{ width: '16px', height: '16px', color: '#16a34a' }} />}
                                            {med.status === 'scheduled' && <Timer style={{ width: '16px', height: '16px', color: '#6b7280' }} />}
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                textTransform: 'capitalize',
                                                backgroundColor: med.status === 'completed' ? '#dcfce7' : '#f3f4f6',
                                                color: med.status === 'completed' ? '#166534' : '#6b7280'
                                            }}>
                                                {med.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTreatments = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Treatment Management</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {mockCareTrackData.residents.map(resident => (
                    <div key={resident.id} style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>{resident.name}</h3>

                        {resident.treatments.map(treatment => (
                            <div key={treatment.id} style={{
                                padding: '16px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                backgroundColor: '#f9fafb'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{treatment.type}</h4>
                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>{treatment.provider}</p>
                                <p style={{ margin: '0', fontSize: '13px', color: '#9ca3af' }}>{treatment.frequency}</p>

                                {treatment.nextSession && (
                                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#374151' }}>
                                        <strong>Next session:</strong> {new Date(treatment.nextSession).toLocaleString()}
                                    </div>
                                )}

                                {treatment.progress && (
                                    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                                        <p style={{ margin: '0', fontSize: '12px', color: '#1e40af' }}>
                                            <strong>Progress:</strong> {treatment.progress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div style={{ marginTop: '16px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Recent Vitals</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Blood Pressure:</span>
                                    <span style={{ fontWeight: '500' }}>{resident.vitals.bloodPressure}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Heart Rate:</span>
                                    <span style={{ fontWeight: '500' }}>{resident.vitals.heartRate} bpm</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Temperature:</span>
                                    <span style={{ fontWeight: '500' }}>{resident.vitals.temperature}°F</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Weight:</span>
                                    <span style={{ fontWeight: '500' }}>{resident.vitals.weight} lbs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPharmacy = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Pharmacy Management</h2>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Active Pharmacy Alerts</h3>
                <div>
                    {mockCareTrackData.pharmacyAlerts.map(alert => (
                        <PharmacyAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Medication Inventory</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                    {mockCareTrackData.residents.map(resident => (
                        <div key={resident.id}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>{resident.name}</h4>
                            {resident.medications.map(medication => (
                                <MedicationCard key={medication.id} medication={medication} residentName={resident.name} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCompliance = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Compliance Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <TrendingUp style={{ width: '32px', height: '32px', color: '#16a34a', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                        {mockCareTrackData.complianceMetrics.overall}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Compliance</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <Activity style={{ width: '32px', height: '32px', color: '#3b82f6', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                        +{mockCareTrackData.complianceMetrics.trends.thisWeek - mockCareTrackData.complianceMetrics.trends.lastWeek}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Weekly Improvement</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <Target style={{ width: '32px', height: '32px', color: '#ca8a04', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ca8a04' }}>
                        {Math.round(mockCareTrackData.complianceMetrics.byResident.reduce((sum, resident) => sum + resident.onTime, 0) / mockCareTrackData.complianceMetrics.byResident.length)}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>On-Time Rate</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <XCircle style={{ width: '32px', height: '32px', color: '#dc2626', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
                        {mockCareTrackData.complianceMetrics.byResident.reduce((sum, resident) => sum + resident.missedDoses, 0)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Missed Doses (Month)</div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Compliance by Resident</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {mockCareTrackData.complianceMetrics.byResident.map((resident, index) => (
                        <div key={index} style={{
                            padding: '16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>{resident.name}</h4>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: resident.compliance >= 95 ? '#16a34a' : resident.compliance >= 85 ? '#ca8a04' : '#dc2626'
                                    }}>
                                        {resident.compliance}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Compliance</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Missed Doses:</span>
                                    <span style={{ fontWeight: '500', color: '#dc2626' }}>{resident.missedDoses}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>On Time:</span>
                                    <span style={{ fontWeight: '500', color: '#16a34a' }}>{resident.onTime}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'schedule': return renderSchedule();
            case 'treatments': return renderTreatments();
            case 'pharmacy': return renderPharmacy();
            case 'compliance': return renderCompliance();
            default: return renderOverview();
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px 24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                                Guardian CareTrack Dashboard
                            </h1>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                Medication & treatment tracking system • Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    cursor: 'pointer'
                                }}
                            >
                                <Download style={{ width: '16px', height: '16px' }} />
                                <span>Export MAR</span>
                            </button>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                <RefreshCw style={{ width: '16px', height: '16px' }} />
                                <span>Sync Data</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
                    <nav style={{ display: 'flex', gap: '32px', padding: '0 24px' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '16px 4px',
                                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.color = '#374151';
                                        e.currentTarget.style.borderBottomColor = '#d1d5db';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.color = '#6b7280';
                                        e.currentTarget.style.borderBottomColor = 'transparent';
                                    }
                                }}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.id === 'pharmacy' && mockCareTrackData.pharmacyAlerts.filter(a => a.severity === 'high').length > 0 && (
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        fontSize: '12px',
                                        borderRadius: '999px',
                                        padding: '2px 6px',
                                        minWidth: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {mockCareTrackData.pharmacyAlerts.filter(a => a.severity === 'high').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default GuardianCareTrackDashboard;