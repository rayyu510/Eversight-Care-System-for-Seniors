import React from 'react';

export const FloorPlanViewTest: React.FC = () => {
    return (
        <div className="p-8 bg-blue-100">
            <h2 className="text-2xl font-bold">FloorPlanView Test - Working!</h2>
            <div className="grid grid-cols-5 gap-2 mt-4">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="bg-green-400 p-4 rounded text-center">
                        🏠 {101 + i}
                    </div>
                ))}
            </div>
        </div>
    );
};