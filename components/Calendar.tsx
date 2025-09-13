
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressData, ActivityType, DailyProgress } from '../types';

interface CalendarProps {
  progressData: ProgressData;
}

const ActivityDot: React.FC<{ type: ActivityType }> = ({ type }) => {
  const color = {
    [ActivityType.Yoga]: 'bg-emerald-500',
    [ActivityType.Diet]: 'bg-sky-500',
    [ActivityType.Walking]: 'bg-amber-500',
  }[type];
  return <div className={`w-2 h-2 rounded-full ${color}`}></div>;
};

const Calendar: React.FC<CalendarProps> = ({ progressData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);

  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
  const blanks = useMemo(() => Array.from({ length: startingDayOfWeek }, (_, i) => i), [startingDayOfWeek]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeft className="w-6 h-6 text-slate-600" /></button>
        <h2 className="text-xl font-bold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100"><ChevronRight className="w-6 h-6 text-slate-600" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-500">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {blanks.map(blank => <div key={`blank-${blank}`} className="p-2"></div>)}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateKey = date.toISOString().split('T')[0];
          const dailyProgress: Partial<DailyProgress> | undefined = progressData[dateKey];
          
          const activities = new Set<ActivityType>();
          if (dailyProgress) {
            if (dailyProgress.yoga) activities.add(ActivityType.Yoga);
            if (dailyProgress.diet) activities.add(ActivityType.Diet);
            if ((dailyProgress.walkingMinutes || 0) > 0) activities.add(ActivityType.Walking);
          }
          
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div key={day} className={`flex flex-col items-center justify-center h-14 rounded-xl ${isToday ? 'bg-emerald-100' : ''}`}>
              <span className={`text-slate-800 ${isToday ? 'font-bold text-emerald-700' : ''}`}>{day}</span>
              {activities.size > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  {Array.from(activities).map(activity => <ActivityDot key={activity} type={activity} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-slate-600 mb-2 text-center">Legenda:</h4>
        <div className="flex justify-center items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ActivityDot type={ActivityType.Yoga} />
            <span className="text-xs text-slate-500">Yoga</span>
          </div>
          <div className="flex items-center space-x-2">
            <ActivityDot type={ActivityType.Diet} />
            <span className="text-xs text-slate-500">Dieta</span>
          </div>
          <div className="flex items-center space-x-2">
            <ActivityDot type={ActivityType.Walking} />
            <span className="text-xs text-slate-500">Caminhada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;