import React from 'react';
import { IconHome, IconYoga, IconDiet, IconWalking, IconProgress } from './icons';

type View = 'dashboard' | 'yoga' | 'diet' | 'walking' | 'progress' | 'settings';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-16 h-16 transition-colors duration-200">
      <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
      <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: 'dashboard', icon: IconHome, label: 'Início' },
    { view: 'yoga', icon: IconYoga, label: 'Yoga' },
    { view: 'diet', icon: IconDiet, label: 'Dieta' },
    { view: 'walking', icon: IconWalking, label: 'Caminhada' },
    { view: 'progress', icon: IconProgress, label: 'Progresso' },
  ] as const;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md mx-auto z-50">
      <div className="flex justify-around items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg h-20 px-2">
        {navItems.map(item => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;