import React from 'react';
import { Shield, Home, Settings, Bell } from 'lucide-react';

type ModuleType = 'home' | 'operations-center' | 'surveillance-center' | 'guardian-protect' | 'guardian-insight' | 'guardian-carepro' | 'guardian-caretrack';

interface Module {
    id: ModuleType;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface AppHeaderProps {
    activeModule: ModuleType;
    modules: Module[];
    onModuleSelect: (module: ModuleType) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    activeModule,
    modules = [],
    onModuleSelect
}) => {
    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-blue-100/50 sticky top-0 z-50">
            <div className="max-w-full px-8 py-5">
                <div className="flex items-center justify-between">
                    {/* Enhanced Logo Section */}
                    <div className="flex items-center">
                        <button
                            onClick={() => onModuleSelect('home')}
                            className="flex items-center hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all duration-300 group"
                        >
                            <div className="relative mr-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-sm">
                                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    EverSight Care
                                </div>
                                <div className="text-sm font-semibold text-blue-600">Healthcare Management Platform</div>
                            </div>
                        </button>
                    </div>

                    {/* Enhanced Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1 bg-gray-50/80 rounded-2xl p-2">
                        <button
                            onClick={() => onModuleSelect('home')}
                            className={`flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeModule === 'home'
                                    ? 'bg-white text-blue-700 shadow-lg shadow-blue-100'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                                }`}
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Operations Center
                        </button>

                        {modules && modules.map((module) => {
                            const IconComponent = module.icon;
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => onModuleSelect(module.id)}
                                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeModule === module.id
                                            ? 'bg-white text-blue-700 shadow-lg shadow-blue-100'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                                        }`}
                                >
                                    <IconComponent className="h-4 w-4 mr-2" />
                                    <span className="hidden xl:inline">{module.name}</span>
                                    <span className="xl:hidden">{module.name.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Enhanced Right Section */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden lg:block text-right">
                            <div className="text-sm font-bold text-gray-900">Sunrise Manor</div>
                            <div className="text-xs text-gray-500 font-medium">Long-term Care Facility</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="relative p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                    3
                                </span>
                            </button>
                            <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;