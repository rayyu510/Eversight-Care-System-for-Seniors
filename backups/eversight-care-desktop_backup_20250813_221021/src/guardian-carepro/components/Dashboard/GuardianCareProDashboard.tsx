import React, { useState, useEffect } from 'react';
import {
    HeartHandshake,
    Heart,
    Brain,
    Droplets,
    TrendingUp,
    AlertTriangle,
    Calendar,
    Users,
    ClipboardList,
    Phone,
    FileText,
    Activity,
    Shield,
    Target,
    Stethoscope,
    Pill,
    Clock,
    CheckCircle,
    XCircle,
    Info,
    Bell,
    User,
    Settings,
    Camera,
    MessageSquare,
    Zap,
    RefreshCw,
    Download,
    Filter,
    Plus,
    Edit,
    Eye,
    BarChart3
} from 'lucide-react';

// Mock data for Guardian CarePro
const mockCareProData = {
    residents: [
        {
            id: 'r1',
            name: 'Eleanor Johnson',
            age: 78,
            careLevel: 'High Care',
            primaryDiagnosis: ['Type 2 Diabetes', 'Hypertension', 'Mild Cognitive Impairment'],
            riskFactors: {
                heartAttack: { risk: 72, level: 'high', factors: ['Hypertension', 'Age', 'Diabetes'] },
                stroke: { risk: 68, level: 'high', factors: ['Hypertension', 'Age', 'Irregular heartbeat'] },
                diabetes: { risk: 85, level: 'critical', factors: ['Family history', 'Weight', 'Current diagnosis'] }
            },
            carePlan: {
                goals: ['Maintain blood sugar below 150', 'Reduce fall risk', 'Improve social engagement'],
                interventions: ['Daily medication monitoring', 'Physical therapy 3x/week', 'Dietary consultation'],
                lastReview: '2024-08-05',
                nextReview: '2024-08-19'
            },
            recentAlerts: [
                { type: 'blood_sugar_spike', time: '2 hours ago', severity: 'medium' },
                { type: 'missed_medication', time: '1 day ago', severity: 'high' }
            ]
        },
        {
            id: 'r2',
            name: 'Robert Smith',
            age: 82,
            careLevel: 'Medium Care',
            primaryDiagnosis: ['Coronary Artery Disease', 'Arthritis'],
            riskFactors: {
                heartAttack: { risk: 78, level: 'critical', factors: ['CAD history', 'Age', 'Chest pain episodes'] },
                stroke: { risk: 45, level: 'medium', factors: ['Age', 'Blood pressure medication'] },
                diabetes: { risk: 35, level: 'low', factors: ['Age', 'Weight'] }
            },
            carePlan: {
                goals: ['Monitor cardiac function', 'Maintain mobility', 'Pain management'],
                interventions: ['Daily cardiac monitoring', 'Pain medication as needed', 'Gentle exercise'],
                lastReview: '2024-08-01',
                nextReview: '2024-08-15'
            },
            recentAlerts: [
                { type: 'irregular_heartbeat', time: '30 minutes ago', severity: 'high' },
                { type: 'chest_discomfort', time: '3 hours ago', severity: 'critical' }
            ]
        },
        {
            id: 'r3',
            name: 'Margaret Wilson',
            age: 75,
            careLevel: 'Low Care',
            primaryDiagnosis: ['Osteoporosis', 'High Cholesterol'],
            riskFactors: {
                heartAttack: { risk: 42, level: 'medium', factors: ['High cholesterol', 'Age'] },
                stroke: { risk: 38, level: 'low', factors: ['Age', 'Cholesterol'] },
                diabetes: { risk: 28, level: 'low', factors: ['Age'] }
            },
            carePlan: {
                goals: ['Bone density maintenance', 'Cholesterol management', 'Fall prevention'],
                interventions: ['Calcium supplements', 'Low-cholesterol diet', 'Balance exercises'],
                lastReview: '2024-07-28',
                nextReview: '2024-08-11'
            },
            recentAlerts: []
        }
    ],
    staffSchedule: [
        { name: 'Dr. Sarah Chen', role: 'Physician', shift: '8:00 AM - 4:00 PM', status: 'on-duty' },
        { name: 'Nurse Jennifer', role: 'RN', shift: '6:00 AM - 6:00 PM', status: 'on-duty' },
        { name: 'CNA Michael', role: 'CNA', shift: '2:00 PM - 10:00 PM', status: 'on-duty' },
        { name: 'Dr. Williams', role: 'Cardiologist', shift: 'Consultation', status: 'scheduled' }
    ],
    familyCommunication: [
        {
            residentId: 'r1',
            family: 'Sarah Johnson (Daughter)',
            lastContact: '2024-08-09',
            method: 'video_call',
            notes: 'Discussed mother\'s recent blood sugar improvements'
        },
        {
            residentId: 'r2',
            family: 'Linda Smith (Wife)',
            lastContact: '2024-08-08',
            method: 'phone_call',
            notes: 'Informed about irregular heartbeat monitoring'
        }
    ],
    chronicDiseaseAlerts: [
        {
            id: 'cda1',
            residentId: 'r1',
            type: 'diabetes_complication_risk',
            severity: 'high',
            message: 'Blood sugar levels showing sustained elevation pattern. Risk of diabetic complications increased.',
            recommendation: 'Immediate dietary review and medication adjustment consultation',
            predictedOnset: '3-7 days',
            confidence: 0.78,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
            id: 'cda2',
            residentId: 'r2',
            type: 'cardiac_event_risk',
            severity: 'critical',
            message: 'Irregular heartbeat pattern combined with recent chest discomfort indicates elevated cardiac event risk.',
            recommendation: 'Immediate cardiac evaluation and continuous monitoring',
            predictedOnset: '12-24 hours',
            confidence: 0.82,
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
            id: 'cda3',
            residentId: 'r1',
            type: 'stroke_risk_elevation',
            severity: 'medium',
            message: 'Blood pressure trending upward with concurrent diabetes management challenges.',
            recommendation: 'Blood pressure monitoring increase and medication review',
            predictedOnset: '5-10 days',
            confidence: 0.65,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
    ]
};

const RiskGauge = ({ risk, label, size = 60 }) => {
    const radius = size / 2 - 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (risk / 100) * circumference;

    const getRiskColor = (risk) => {
        if (risk >= 70) return '#dc2626';
        if (risk >= 50) return '#ea580c';
        if (risk >= 30) return '#ca8a04';
        return '#16a34a';
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getRiskColor(risk)}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.5s ease'
                    }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: getRiskColor(risk) }}>
                    {risk}%
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    {label}
                </div>
            </div>
        </div>
    );
};

const ChronicDiseaseCard = ({ alert }) => {
    const getAlertIcon = (type) => {
        switch (type) {
            case 'cardiac_event_risk': return <Heart style={{ width: '20px', height: '20px' }} />;
            case 'stroke_risk_elevation': return <Brain style={{ width: '20px', height: '20px' }} />;
            case 'diabetes_complication_risk': return <Droplets style={{ width: '20px', height: '20px' }} />;
            default: return <AlertTriangle style={{ width: '20px', height: '20px' }} />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
            case 'high': return { bg: '#fff7ed', border: '#fed7aa', text: '#ea580c' };
            case 'medium': return { bg: '#fefbf2', border: '#fde68a', text: '#ca8a04' };
            default: return { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' };
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: colors.text }}>
                        {getAlertIcon(alert.type)}
                    </div>
                    <span style={{ fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>
                        {alert.type.replace(/_/g, ' ')}
                    </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Confidence: {Math.round(alert.confidence * 100)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {alert.predictedOnset}
                    </div>
                </div>
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
                {alert.message}
            </p>

            <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
            }}>
                <p style={{ margin: '0', fontSize: '13px', color: '#166534' }}>
                    <strong>Recommendation:</strong> {alert.recommendation}
                </p>
            </div>

            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Alert generated: {new Date(alert.timestamp).toLocaleString()}
            </div>
        </div>
    );
};

const GuardianCareProDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedResident, setSelectedResident] = useState(null);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Care Overview', icon: <HeartHandshake style={{ width: '16px', height: '16px' }} /> },
        { id: 'chronic-disease', label: 'Disease Prediction', icon: <Stethoscope style={{ width: '16px', height: '16px' }} /> },
        { id: 'care-plans', label: 'Care Plans', icon: <ClipboardList style={{ width: '16px', height: '16px' }} /> },
        { id: 'staff', label: 'Staff Management', icon: <Users style={{ width: '16px', height: '16px' }} /> },
        { id: 'family', label: 'Family Connect', icon: <MessageSquare style={{ width: '16px', height: '16px' }} /> }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <HeartHandshake style={{ width: '32px', height: '32px', color: '#dc2626', animation: 'pulse 2s infinite' }} />
                <span style={{ marginLeft: '12px', fontSize: '18px' }}>Loading care management system...</span>
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
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Total Residents</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                                {mockCareProData.residents.length}
                            </p>
                        </div>
                        <Users style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Critical Alerts</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
                                {mockCareProData.chronicDiseaseAlerts.filter(a => a.severity === 'critical').length}
                            </p>
                        </div>
                        <AlertTriangle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Staff On Duty</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                                {mockCareProData.staffSchedule.filter(s => s.status === 'on-duty').length}
                            </p>
                        </div>
                        <Shield style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Care Plans Due</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#ca8a04' }}>
                                2
                            </p>
                        </div>
                        <Calendar style={{ width: '32px', height: '32px', color: '#ca8a04' }} />
                    </div>
                </div>
            </div>

            {/* Recent Chronic Disease Alerts */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>Recent Chronic Disease Alerts</h3>
                    <Bell style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                </div>
                <div>
                    {mockCareProData.chronicDiseaseAlerts.slice(0, 2).map(alert => (
                        <ChronicDiseaseCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </div>

            {/* Resident Quick View */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Residents Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {mockCareProData.residents.map(resident => (
                        <div key={resident.id} style={{
                            padding: '16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{resident.name}</h4>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                        Age: {resident.age} • {resident.careLevel}
                                    </p>
                                </div>
                                {resident.recentAlerts.length > 0 && (
                                    <div style={{
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        {resident.recentAlerts.length} Alert{resident.recentAlerts.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <RiskGauge risk={resident.riskFactors.heartAttack.risk} label="Heart" size={50} />
                                <RiskGauge risk={resident.riskFactors.stroke.risk} label="Stroke" size={50} />
                                <RiskGauge risk={resident.riskFactors.diabetes.risk} label="Diabetes" size={50} />
                            </div>

                            <button
                                onClick={() => setSelectedResident(resident)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderChronicDisease = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Chronic Disease Prediction & Prevention</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        <Filter style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        Run Analysis
                    </button>
                </div>
            </div>

            {/* Disease Risk Matrix */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Risk Assessment Matrix</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                    {mockCareProData.residents.map(resident => (
                        <div key={resident.id} style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                                {resident.name}
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <RiskGauge risk={resident.riskFactors.heartAttack.risk} label="Heart Attack" size={70} />
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                        {resident.riskFactors.heartAttack.level}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <RiskGauge risk={resident.riskFactors.stroke.risk} label="Stroke" size={70} />
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                        {resident.riskFactors.stroke.level}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <RiskGauge risk={resident.riskFactors.diabetes.risk} label="Diabetes" size={70} />
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                        {resident.riskFactors.diabetes.level}
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: '#374151' }}>
                                <strong>Primary Diagnoses:</strong>
                                <div style={{ marginTop: '4px' }}>
                                    {resident.primaryDiagnosis.map((diagnosis, index) => (
                                        <span key={index} style={{
                                            display: 'inline-block',
                                            backgroundColor: '#dbeafe',
                                            color: '#1e40af',
                                            padding: '2px 6px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            margin: '2px 4px 2px 0'
                                        }}>
                                            {diagnosis}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Chronic Disease Alerts */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Active Prediction Alerts</h3>
                <div>
                    {mockCareProData.chronicDiseaseAlerts.map(alert => (
                        <ChronicDiseaseCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCarePlans = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Care Plan Management</h2>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                    New Care Plan
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {mockCareProData.residents.map(resident => (
                    <div key={resident.id} style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                                    {resident.name}
                                </h3>
                                <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                    {resident.careLevel}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    <Edit style={{ width: '14px', height: '14px' }} />
                                </button>
                                <button style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    <Eye style={{ width: '14px', height: '14px' }} />
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Care Goals</h4>
                            <ul style={{ margin: '0', padding: '0 0 0 16px' }}>
                                {resident.carePlan.goals.map((goal, index) => (
                                    <li key={index} style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                                        {goal}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Current Interventions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {resident.carePlan.interventions.map((intervention, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        color: '#374151'
                                    }}>
                                        <CheckCircle style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                                        {intervention}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#6b7280'
                        }}>
                            <span>Last Review: {new Date(resident.carePlan.lastReview).toLocaleDateString()}</span>
                            <span>Next Review: {new Date(resident.carePlan.nextReview).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStaff = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Staff Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        Schedule
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add Staff
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Current Shift</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {mockCareProData.staffSchedule.map((staff, index) => (
                        <div key={index} style={{
                            padding: '16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: staff.status === 'on-duty' ? '#f0f9ff' : '#f9fafb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                                        {staff.name}
                                    </h4>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                                        {staff.role}
                                    </p>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                                        {staff.shift}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: staff.status === 'on-duty' ? '#dcfce7' : '#fef3c7',
                                    color: staff.status === 'on-duty' ? '#166534' : '#92400e'
                                }}>
                                    {staff.status.replace('-', ' ')}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                    flex: 1,
                                    padding: '6px 12px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}>
                                    Contact
                                </button>
                                <button style={{
                                    flex: 1,
                                    padding: '6px 12px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}>
                                    Schedule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Staff Performance Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>98%</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Attendance Rate</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>4.8</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Rating</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>12</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Training Hours</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>96%</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Task Completion</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFamily = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Family Communication</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        <Camera style={{ width: '16px', height: '16px' }} />
                        Share Photos
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        <Phone style={{ width: '16px', height: '16px' }} />
                        Schedule Call
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {mockCareProData.familyCommunication.map((comm, index) => {
                    const resident = mockCareProData.residents.find(r => r.id === comm.residentId);
                    return (
                        <div key={index} style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>
                                        {resident?.name}
                                    </h3>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                        {comm.family}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#dcfce7',
                                    color: '#166534',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    Active
                                </span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <MessageSquare style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                        Last Contact: {new Date(comm.lastContact).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Phone style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                                    <span style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                                        {comm.method.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '6px',
                                marginBottom: '16px'
                            }}>
                                <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                                    <strong>Notes:</strong> {comm.notes}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}>
                                    Send Update
                                </button>
                                <button style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}>
                                    Video Call
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Communication Analytics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>24</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Calls This Month</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>8</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Video Calls</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>45</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Photos Shared</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>98%</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'chronic-disease': return renderChronicDisease();
            case 'care-plans': return renderCarePlans();
            case 'staff': return renderStaff();
            case 'family': return renderFamily();
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
                                Guardian CarePro Dashboard
                            </h1>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                Professional care management with chronic disease prediction • Last updated: {new Date().toLocaleTimeString()}
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
                                <span>Export Report</span>
                            </button>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                <RefreshCw style={{ width: '16px', height: '16px' }} />
                                <span>Refresh Analysis</span>
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
                                    borderBottom: activeTab === tab.id ? '2px solid #dc2626' : '2px solid transparent',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: activeTab === tab.id ? '#dc2626' : '#6b7280',
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
                                {tab.id === 'chronic-disease' && mockCareProData.chronicDiseaseAlerts.filter(a => a.severity === 'critical').length > 0 && (
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
                                        {mockCareProData.chronicDiseaseAlerts.filter(a => a.severity === 'critical').length}
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

export default GuardianCareProDashboard;