import { Home, Youtube, Salad, Footprints, Calendar, Dumbbell, Award, Flame, CheckCircle, BarChart3, User, Settings, Info, Apple, Soup, Sandwich, CookingPot, LogOut, RefreshCw } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

export const IconHome = (props: LucideProps) => <Home {...props} />;
export const IconYoga = (props: LucideProps) => <Dumbbell {...props} />;
export const IconDiet = (props: LucideProps) => <Salad {...props} />;
export const IconWalking = (props: LucideProps) => <Footprints {...props} />;
export const IconProgress = (props: LucideProps) => <Calendar {...props} />;
export const IconAward = (props: LucideProps) => <Award {...props} />;
export const IconFlame = (props: LucideProps) => <Flame {...props} />;
export const IconCheckCircle = (props: LucideProps) => <CheckCircle {...props} />;
export const IconBarChart = (props: LucideProps) => <BarChart3 {...props} />;
export const IconUser = (props: LucideProps) => <User {...props} />;
export const IconSettings = (props: LucideProps) => <Settings {...props} />;
export const IconInfo = (props: LucideProps) => <Info {...props} />;
export const IconLogOut = (props: LucideProps) => <LogOut {...props} />;
export const IconReload = (props: LucideProps) => <RefreshCw {...props} />;

export const getDietCategoryIcon = (category: string) => {
    switch (category) {
        case 'Café da Manhã':
            return <Apple className="w-6 h-6 text-emerald-600" />;
        case 'Almoço':
            return <CookingPot className="w-6 h-6 text-emerald-600" />;
        case 'Lanche':
            return <Sandwich className="w-6 h-6 text-emerald-600" />;
        case 'Jantar':
            return <Soup className="w-6 h-6 text-emerald-600" />;
        default:
            return <Salad className="w-6 h-6 text-emerald-600" />;
    }
};
