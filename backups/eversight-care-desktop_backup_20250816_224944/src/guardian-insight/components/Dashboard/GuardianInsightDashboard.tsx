import React, { useState, useEffect } from 'react';
import {
    Brain,
    TrendingUp,
    AlertCircle,
    BarChart3,
    PieChart,
    Activity,
    Users,
    Clock,
    Target,
    Zap,
    Eye,
    RefreshCw,
    Download,
    Filter,
    Calendar,
    ArrowUp,
    ArrowDown,
    Minus,
    CheckCircle,
    XCircle,
    Info
} from 'lucide-react';

// Mock AI Insights Data
const mockInsightData = {
    aiSummary: {
        riskScore: 76,
        trendDirection: 'improving',
        keyInsights: [
            "Fall risk decreased by 23% over the past week",
            "Medication adherence improved to 94%",
            "Sleep pattern irregularities detected in 2 residents",
            "Optimal activity levels maintained in common areas"
        ],
        predictiveAlerts: [
            {
                id: 'p1',
                type: 'fall_risk',
                resident: 'Eleanor Johnson',
                probability: 0.78,
                timeframe: '24-48 hours',
                factors: ['Decreased mobility', 'Medication change', 'Weather change'],
                recommendation: 'Increase monitoring during evening hours'
            },
            {
                id: 'p2',
                type: 'health_decline',
                resident: 'Robert Smith',
                probability: 0.65,
                timeframe: '3-5 days',
                factors: ['Reduced appetite', 'Sleep disruption', 'Social withdrawal'],
                recommendation: 'Schedule wellness check with primary physician'
            }
        ]
    },
    behaviorPatterns: {
        activityTrends: [
            { time: '6:00', activity: 12, optimal: 15, date: '2024-08-09' },
            { time: '8:00', activity: 45, optimal: 40, date: '2024-08-09' },
            { time: '10:00', activity: 68, optimal: 60, date: '2024-08-09' },
            { time: '12:00', activity: 82, optimal: 80, date: '2024-08-09' },
            { time: '14:00', activity: 65, optimal: 70, date: '2024-08-09' },
            { time: '16:00', activity: 55, optimal: 60, date: '2024-08-09' },
            { time: '18:00', activity: 38, optimal: 45, date: '2024-08-09' },
            { time: '20:00', activity: 25, optimal: 30, date: '2024-08-09' },
            { time: '22:00', activity: 8, optimal: 10, date: '2024-08-09' }
        ],
        anomalies: [
            {
                id: 'a1',
                type: 'sleep_disruption',
                resident: 'Eleanor Johnson',
                description: 'Unusual nighttime activity detected at 3:15 AM',
                severity: 'medium',
                timestamp: '2024-08-09T03:15:00Z'
            },
            {
                id: 'a2',
                type: 'social_isolation',
                resident: 'Margaret Wilson',
                description: 'No social interactions detected for 6+ hours',
                severity: 'high',
                timestamp: '2024-08-09T14:30:00Z'
            }
        ]
    },
    healthMetrics: {
        vitalTrends: {
            heartRate: { current: 72, trend: -2, status: 'normal' },
            bloodPressure: { current: '125/78', trend: 3, status: 'normal' },
            temperature: { current: 98.6, trend: 0, status: 'normal' },
            oxygenSaturation: { current: 97, trend: -1, status: 'normal' }
        },
        medicationAdherence: {
            overall: 94,
            residents: [
                { name: 'Eleanor Johnson', adherence: 96, missedDoses: 2 },
                { name: 'Robert Smith', adherence: 89, missedDoses: 8 },
                { name: 'Margaret Wilson', adherence: 98, missedDoses: 1 }
            ]
        }
    },
    environmentalFactors: {
        airQuality: { score: 85, status: 'good' },
        lighting: { score: 92, status: 'optimal' },
        temperature: { score: 78, status: 'comfortable' },
        humidity: { score: 68, status: 'normal' },
        noiseLevel: { score: 88, status: 'quiet' }
    }
};

const TrendIcon = ({ trend }) => {
    if (trend > 0) return <ArrowUp style={{ width: '16px', height: '16px', color: '#16a34a' }} />;
    if (trend < 0) return <ArrowDown style={{ width: '16px', height: '16px', color: '#dc2626' }} />;
    return <Minus style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
};

const RiskScoreGauge = ({ score }) => {
    const radius = 60;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getScoreColor = (score) => {
        if (score >= 80) return '#16a34a'; // Green
        if (score >= 60) return '#ca8a04'; // Yellow
        return '#dc2626'; // Red
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={getScoreColor(score)}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: getScoreColor(score) }}>
                    {score}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Risk Score
                </div>
            </div>
        </div>
    );
};

const GuardianInsightDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24h');

    const tabs = [
        { id: 'overview', label: 'AI Overview', icon: <Brain style={{ width: '16px', height: '16px' }} /> },
        { id: 'predictive', label: 'Predictive Analytics', icon: <Target style={{ width: '16px', height: '16px' }} /> },
        { id: 'behavior', label: 'Behavior Patterns', icon: <Activity style={{ width: '16px', height: '16px' }} /> },
        { id: 'health', label: 'Health Insights', icon: <BarChart3 style={{ width: '16px', height: '16px' }} /> },
        { id: 'environment', label: 'Environment', icon: <Eye style={{ width: '16px', height: '16px' }} /> }
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Brain style={{ width: '32px', height: '32px', color: '#7c3aed', animation: 'pulse 2s infinite' }} />
                <span style={{ marginLeft: '12px', fontSize: '18px' }}>Analyzing healthcare data...</span>
            </div>
        );
    }

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Overall Risk Assessment</h3>
                        <Brain style={{ width: '24px', height: '24px', color: '#7c3aed' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <RiskScoreGauge score={mockInsightData.aiSummary.riskScore} />
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <TrendingUp style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                                <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '500' }}>
                                    {mockInsightData.aiSummary.trendDirection}
                                </span>
                            </div>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                Risk factors are trending positively with improved safety metrics.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Key AI Insights</h3>
                        <Zap style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {mockInsightData.aiSummary.keyInsights.map((insight, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CheckCircle style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                                <span style={{ fontSize: '14px', color: '#374151' }}>{insight}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Predictive Alerts */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Predictive Risk Alerts</h3>
                    <Target style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
                    {mockInsightData.aiSummary.predictiveAlerts.map(alert => (
                        <div key={alert.id} style={{
                            padding: '16px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#991b1b' }}>
                                        {alert.resident}
                                    </h4>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#7f1d1d' }}>
                                        {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Risk
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                                        {Math.round(alert.probability * 100)}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {alert.timeframe}
                                    </div>
                                </div>
                            </div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
                                <strong>Factors:</strong> {alert.factors.join(', ')}
                            </p>
                            <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '4px' }}>
                                <p style={{ margin: '0', fontSize: '13px', color: '#166534' }}>
                                    <strong>Recommendation:</strong> {alert.recommendation}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPredictive = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Predictive Analytics</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Fall Risk Prediction</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AlertCircle style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>78%</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>High Risk Probability</div>
                        </div>
                    </div>
                    <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                        Eleanor Johnson shows elevated fall risk based on recent mobility patterns and environmental factors.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Health Decline Indicators</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp style={{ width: '24px', height: '24px', color: '#ca8a04' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>65%</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Moderate Risk</div>
                        </div>
                    </div>
                    <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                        Robert Smith shows early indicators requiring wellness check within 3-5 days.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Medication Adherence</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#dcfce7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>94%</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Compliance</div>
                        </div>
                    </div>
                    <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                        Medication adherence has improved significantly over the past week.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderBehavior = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Behavior Pattern Analysis</h2>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Daily Activity Patterns</h3>
                <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '8px', padding: '20px 0' }}>
                    {mockInsightData.behaviorPatterns.activityTrends.map((trend, index) => (
                        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ position: 'relative', height: '200px', width: '100%', display: 'flex', alignItems: 'end' }}>
                                <div style={{
                                    width: '60%',
                                    height: `${(trend.activity / 100) * 180}px`,
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '4px 4px 0 0',
                                    marginRight: '2px'
                                }} />
                                <div style={{
                                    width: '60%',
                                    height: `${(trend.optimal / 100) * 180}px`,
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px 4px 0 0'
                                }} />
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                {trend.time}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Actual Activity</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '2px' }} />
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Optimal Range</span>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Behavioral Anomalies</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mockInsightData.behaviorPatterns.anomalies.map(anomaly => (
                        <div key={anomaly.id} style={{
                            padding: '16px',
                            backgroundColor: anomaly.severity === 'high' ? '#fef2f2' : '#fefbf2',
                            border: `1px solid ${anomaly.severity === 'high' ? '#fecaca' : '#fed7aa'}`,
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                                        {anomaly.resident}
                                    </h4>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                                        {anomaly.description}
                                    </p>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {new Date(anomaly.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: anomaly.severity === 'high' ? '#dc2626' : '#f59e0b',
                                    color: 'white'
                                }}>
                                    {anomaly.severity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderHealth = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Health Insights</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {Object.entries(mockInsightData.healthMetrics.vitalTrends).map(([vital, data]) => (
                    <div key={vital} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                                {vital.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <TrendIcon trend={data.trend} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {data.current}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: data.status === 'normal' ? '#16a34a' : '#dc2626',
                            fontWeight: '500'
                        }}>
                            {data.status}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Medication Adherence by Resident</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {mockInsightData.healthMetrics.medicationAdherence.residents.map(resident => (
                        <div key={resident.name} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                                    {resident.name}
                                </h4>
                                <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                    {resident.missedDoses} missed doses this month
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: resident.adherence >= 95 ? '#16a34a' : resident.adherence >= 90 ? '#ca8a04' : '#dc2626'
                                }}>
                                    {resident.adherence}%
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    adherence
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEnvironment = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Environmental Monitoring</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {Object.entries(mockInsightData.environmentalFactors).map(([factor, data]) => (
                    <div key={factor} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                            {factor.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: data.score >= 80 ? '#dcfce7' : data.score >= 60 ? '#fef3c7' : '#fee2e2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: data.score >= 80 ? '#16a34a' : data.score >= 60 ? '#ca8a04' : '#dc2626'
                                }}>
                                    {data.score}
                                </div>
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: data.score >= 80 ? '#16a34a' : data.score >= 60 ? '#ca8a04' : '#dc2626',
                                    textTransform: 'capitalize'
                                }}>
                                    {data.status}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                    Environmental Score
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Environmental Impact Analysis</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#16a34a' }}>
                            Positive Factors
                        </h4>
                        <ul style={{ margin: '0', padding: '0 0 0 20px', listStyle: 'disc' }}>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Optimal lighting levels support circadian rhythm regulation
                            </li>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Low noise levels promote restful sleep patterns
                            </li>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Good air quality reduces respiratory stress
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#ca8a04' }}>
                            Areas for Improvement
                        </h4>
                        <ul style={{ margin: '0', padding: '0 0 0 20px', listStyle: 'disc' }}>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Temperature fluctuations in common areas
                            </li>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Humidity levels could be optimized for comfort
                            </li>
                            <li style={{ marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                                Consider air purification in high-traffic zones
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'predictive': return renderPredictive();
            case 'behavior': return renderBehavior();
            case 'health': return renderHealth();
            case 'environment': return renderEnvironment();
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
                                Guardian Insight Dashboard
                            </h1>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                AI-powered healthcare analytics and predictive insights • Last updated: {new Date().toLocaleTimeString()}
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
                                    backgroundColor: '#7c3aed',
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
                                    borderBottom: activeTab === tab.id ? '2px solid #7c3aed' : '2px solid transparent',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== tab.id) {
                                        const target = e.target as HTMLElement;
                                        target.style.color = '#374151';
                                        target.style.borderBottomColor = '#d1d5db';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== tab.id) {
                                        const target = e.target as HTMLElement;
                                        target.style.color = '#6b7280';
                                        target.style.borderBottomColor = 'transparent';
                                    }
                                }}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
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

export default GuardianInsightDashboard;