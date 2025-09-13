import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import BottomNav from './components/BottomNav';
import Calendar from './components/Calendar';
import RecipeCard from './components/RecipeCard';
import { RECIPES, YOGA_CLASSES, AUTHORIZED_EMAILS } from './constants';
import { ActivityType, ProgressData, Recipe, DailyProgress } from './types';
import { IconCheckCircle, IconDiet, IconWalking, IconYoga, IconSettings, IconUser, IconLogOut, IconReload } from './components/icons';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Download, Target, Play, Pause, RotateCcw, Expand, Rewind, FastForward, Mail } from 'lucide-react';
// FIX: Updated firebase import and usage to v8 compat syntax to match the new firebase.ts setup.
import { firestore } from './firebase';

type View = 'dashboard' | 'yoga' | 'diet' | 'walking' | 'progress' | 'settings';
interface User {
    email: string;
}

const WelcomeView: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-600 p-8 text-white text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold">Bem-vinda ao</h1>
                <h2 className="text-6xl font-extrabold text-white mt-2 mb-8">Meta Yoga</h2>
                <p className="text-lg max-w-md">Sua jornada para uma vida mais saudável e equilibrada começa agora.</p>
            </div>
            <button
                onClick={onStart}
                className="w-full max-w-md py-4 px-6 bg-white text-emerald-600 font-bold rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
            >
                Começar
            </button>
        </div>
    );
};

const LoginView: React.FC<{ onLoginSuccess: (user: User) => void }> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (AUTHORIZED_EMAILS.has(email.toLowerCase())) {
                onLoginSuccess({ email: email.toLowerCase() });
            } else {
                setError('Email não autorizado. Verifique o email ou contate o suporte.');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-emerald-600">Meta Yoga</h1>
                    <p className="text-slate-500 mt-2">Seu bem-estar começa aqui.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-slate-700">Acessar minha conta</h2>
                            <p className="text-sm text-slate-500 mt-1">Digite o email usado na compra.</p>
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-slate-600 sr-only">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seuemail@exemplo.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 transition-colors duration-300 flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


const Header: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <header className="px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
    </header>
);

const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; }> = ({ progress, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-slate-200"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-emerald-500"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{`${Math.round(progress)}%`}</span>
            </div>
        </div>
    );
};


const Dashboard: React.FC<{
    setCurrentView: (view: View) => void;
    todaysProgress: DailyProgress;
    completedYogaClasses: number;
}> = ({ setCurrentView, todaysProgress, completedYogaClasses }) => {
    const WALKING_GOAL = 30;

    const walkingProgress = Math.min(((todaysProgress.walkingMinutes || 0) / WALKING_GOAL) * 100, 100);

    const totalProgress = useMemo(() => {
        const yogaContribution = todaysProgress.yoga ? 1 : (completedYogaClasses / YOGA_CLASSES.length);
        const dietContribution = todaysProgress.diet ? 1 : 0;
        const walkingContribution = Math.min((todaysProgress.walkingMinutes || 0) / WALKING_GOAL, 1);
        return ((yogaContribution + dietContribution + walkingContribution) / 3) * 100;
    }, [todaysProgress, completedYogaClasses]);

    return (
        <div className="space-y-6">
            <header className="px-4 pt-8 pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Olá!</h1>
                    <p className="text-slate-500 mt-1">Como você está se sentindo hoje?</p>
                </div>
                <button onClick={() => setCurrentView('settings')} className="p-3 rounded-full bg-white shadow-md hover:bg-slate-100 transition-colors">
                    <IconSettings className="w-6 h-6 text-slate-600" />
                </button>
            </header>
            <div className="px-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <Target className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-xl font-bold text-slate-800">Meta Diária</h3>
                    </div>
                    <ProgressRing progress={totalProgress} />
                    <p className="text-slate-500 text-center">Você está indo muito bem, continue assim!</p>
                </div>
            </div>

            <div className="px-4 grid grid-cols-1 gap-4">
                 <button onClick={() => setCurrentView('yoga')} className="bg-white p-4 rounded-2xl shadow-md w-full text-left transition-transform hover:scale-105 space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="bg-emerald-100 p-3 rounded-full"><IconYoga className="w-6 h-6 text-emerald-600" /></div>
                            <div>
                                <p className="text-slate-800 font-bold text-lg">Yoga</p>
                                <p className="text-slate-500 text-sm">{todaysProgress.yoga ? "Concluído!" : "Continue praticando"}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">{completedYogaClasses}/{YOGA_CLASSES.length} aulas</div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(completedYogaClasses / YOGA_CLASSES.length) * 100}%` }}></div>
                    </div>
                </button>

                 <button onClick={() => setCurrentView('walking')} className="bg-white p-4 rounded-2xl shadow-md w-full text-left transition-transform hover:scale-105 space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="bg-emerald-100 p-3 rounded-full"><IconWalking className="w-6 h-6 text-emerald-600" /></div>
                            <div>
                                <p className="text-slate-800 font-bold text-lg">Caminhada</p>
                                <p className="text-slate-500 text-sm">Meta: {WALKING_GOAL} min</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-emerald-700">{todaysProgress.walkingMinutes || 0} / {WALKING_GOAL} min</div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${walkingProgress}%` }}></div>
                    </div>
                </button>

                <button onClick={() => setCurrentView('diet')} className="bg-white p-4 rounded-2xl shadow-md w-full text-left transition-transform hover:scale-105 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-emerald-100 p-3 rounded-full"><IconDiet className="w-6 h-6 text-emerald-600" /></div>
                        <div>
                            <p className="text-slate-800 font-bold text-lg">Dieta</p>
                            <p className="text-slate-500 text-sm">{todaysProgress.diet ? "Dieta de hoje concluída" : "Veja o plano de hoje"}</p>
                        </div>
                    </div>
                    {todaysProgress.diet ? 
                        <IconCheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" /> :
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    }
                </button>
            </div>
        </div>
    );
};

const CustomVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showSkipFeedback, setShowSkipFeedback] = useState<'forward' | 'rewind' | null>(null);
    const controlsTimeoutRef = useRef<number | null>(null);

    const handlePlayPause = useCallback(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, []);

    const handleRestart = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    };

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.duration) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
        }
    };

    const triggerSkipFeedback = (direction: 'forward' | 'rewind') => {
        setShowSkipFeedback(direction);
        setTimeout(() => setShowSkipFeedback(null), 500);
    };

    const handleSkip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
            triggerSkipFeedback(seconds > 0 ? 'forward' : 'rewind');
        }
    };
    
    const lastClickTimeRef = useRef(0);
    const handleClick = useCallback(() => {
        const now = new Date().getTime();
        if (now - lastClickTimeRef.current < 300) {
        } else {
            if (videoRef.current?.paused) {
                handlePlayPause();
            } else {
                 setShowControls(s => !s);
            }
        }
        lastClickTimeRef.current = now;
    }, [handlePlayPause]);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        
        if (clickX > width / 2) {
            handleSkip(10);
        } else {
            handleSkip(-10);
        }
    };

    const resetControlsTimeout = useCallback(() => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    }, [isPlaying]);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        const onPlay = () => { setIsPlaying(true); resetControlsTimeout(); };
        const onPause = () => { setIsPlaying(false); resetControlsTimeout(); };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('timeupdate', handleTimeUpdate);
        container.addEventListener('mousemove', resetControlsTimeout);

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            container.removeEventListener('mousemove', resetControlsTimeout);
             if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [resetControlsTimeout]);

    return (
        <div ref={containerRef} className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 relative group" onClick={handleClick} onDoubleClick={handleDoubleClick}>
            <video ref={videoRef} src={src} playsInline className="w-full h-full object-cover pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300" style={{ opacity: showSkipFeedback ? 1 : 0}}>
                <div className="bg-black/50 p-4 rounded-full">
                    {showSkipFeedback === 'forward' && <FastForward className="w-8 h-8 text-white" />}
                    {showSkipFeedback === 'rewind' && <Rewind className="w-8 h-8 text-white" />}
                </div>
            </div>
            
            <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {!isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                            <Play className="w-10 h-10 text-white" style={{marginLeft: '4px'}}/>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/60 to-transparent pointer-events-auto">
                    <div className="w-full">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer range-sm"
                            style={{ accentColor: 'rgb(16 185 129)'}}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <button onClick={(e) => { e.stopPropagation(); handleRestart()}} className="p-2">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handlePlayPause()}} className="p-2">
                            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleFullscreen()}} className="p-2">
                            <Expand className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const YogaView: React.FC<{
    onToggleComplete: (classId: number) => void;
    completedClasses: Set<number>;
    isYogaDayCompleted: boolean;
}> = ({ onToggleComplete, completedClasses, isYogaDayCompleted }) => {
    const all5Completed = completedClasses.size === YOGA_CLASSES.length;
    const [expandedClassId, setExpandedClassId] = useState<number | null>(null);

    const handleToggleExpand = (classId: number) => {
        setExpandedClassId(prevId => (prevId === classId ? null : classId));
    };

    return (
        <div>
            <Header title="Aulas de Yoga" subtitle="Complete as 5 aulas do dia para progredir." />
            <div className="px-4 space-y-3">
                {YOGA_CLASSES.map((yogaClass) => {
                    const isCompleted = completedClasses.has(yogaClass.id);
                    const isExpanded = expandedClassId === yogaClass.id;

                    return (
                        <div key={yogaClass.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
                            <div className="p-4 flex items-center justify-between">
                                <div onClick={() => handleToggleExpand(yogaClass.id)} className="flex-1 cursor-pointer flex items-center justify-between pr-4">
                                    <p className={`font-semibold text-slate-800 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                                        {yogaClass.title}
                                    </p>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                                <button
                                    onClick={() => onToggleComplete(yogaClass.id)}
                                    disabled={isYogaDayCompleted}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${
                                        isCompleted
                                            ? 'bg-emerald-500'
                                            : 'bg-slate-200 hover:bg-slate-300'
                                    }`}
                                    aria-label={isCompleted ? `Desmarcar ${yogaClass.title}` : `Marcar ${yogaClass.title} como concluída`}
                                >
                                    {isCompleted && <Check className="w-6 h-6 text-white" />}
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="px-4 pb-4">
                                    <CustomVideoPlayer key={yogaClass.url} src={yogaClass.url} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="px-4 mt-6">
                <div className={`w-full p-4 rounded-xl text-lg font-bold text-white text-center flex items-center justify-center space-x-2 ${
                    all5Completed ? 'bg-emerald-600' : 'bg-slate-400'
                }`}>
                    <IconCheckCircle className="w-6 h-6" />
                    <span>
                        {all5Completed ? 'Parabéns! Yoga de hoje concluído!' : `${completedClasses.size} de 5 aulas concluídas`}
                    </span>
                </div>
            </div>
        </div>
    );
};


const DietView: React.FC<{ 
    onComplete: () => void; 
    isCompleted: boolean;
    dailyDiet: Recipe[];
    onReloadRecipe: (category: Recipe['category']) => void;
}> = ({ onComplete, isCompleted, dailyDiet, onReloadRecipe }) => {
    return (
        <div>
            <Header title="Plano de Dieta" subtitle="Receitas nutritivas para o seu dia." />
            <div className="px-4 space-y-4">
                {dailyDiet.map(recipe => (
                    <div key={recipe.category}>
                         <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-slate-700">{recipe.category}</h3>
                            <button 
                                onClick={() => onReloadRecipe(recipe.category)} 
                                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                                aria-label={`Gerar nova receita para ${recipe.category}`}
                            >
                                <IconReload className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <RecipeCard key={recipe.name} recipe={recipe} />
                    </div>
                ))}
            </div>
            <div className="px-4 mt-6">
                <button
                    onClick={onComplete}
                    disabled={isCompleted}
                    className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${isCompleted ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                    <IconCheckCircle className="w-6 h-6" />
                    <span>{isCompleted ? 'Dieta de Hoje Concluída' : 'Concluir Dieta de Hoje'}</span>
                </button>
            </div>
        </div>
    );
};

const WalkingView: React.FC<{ onComplete: (minutes: number) => void }> = ({ onComplete }) => {
    const walkDurations = [5, 10, 15, 30];
    const [selectedDuration, setSelectedDuration] = useState<number | string>('');

    const handleLogWalk = () => {
        const minutes = Number(selectedDuration);
        if (minutes > 0) {
            onComplete(minutes);
            setSelectedDuration('');
        }
    };

    return (
        <div>
            <Header title="Caminhada" subtitle="Registre sua atividade física diária." />
            <div className="px-4">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-bold text-slate-800 text-center">Selecione ou digite o tempo:</h3>
                    
                    <div className="grid grid-cols-4 gap-3 my-6">
                        {walkDurations.map(duration => (
                            <button
                                key={duration}
                                onClick={() => setSelectedDuration(duration)}
                                className={`py-3 rounded-xl text-md font-bold transition-all ${selectedDuration === duration ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                {duration} min
                            </button>
                        ))}
                    </div>

                    <div className="relative my-6">
                        <input
                            type="number"
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            placeholder="Ou digite os minutos..."
                            className="w-full text-center py-4 px-6 rounded-xl text-lg font-bold bg-slate-100 text-slate-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Duração da caminhada em minutos"
                        />
                         <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none">min</span>
                    </div>
                    
                    <button
                        onClick={handleLogWalk}
                        disabled={!selectedDuration || Number(selectedDuration) <= 0}
                        className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${(!selectedDuration || Number(selectedDuration) <= 0) ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                         <IconCheckCircle className="w-6 h-6" />
                        <span>Registrar Caminhada</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgressView: React.FC<{ progressData: ProgressData }> = ({ progressData }) => (
    <div>
        <Header title="Meu Progresso" subtitle="Sua jornada de bem-estar em um só lugar." />
        <div className="px-4">
            <Calendar progressData={progressData} />
        </div>
    </div>
);

const SettingsView: React.FC<{ 
    userEmail: string;
    onBack: () => void; 
    onInstall: () => void;
    onLogout: () => void;
    canInstall: boolean;
}> = ({ userEmail, onBack, onInstall, onLogout, canInstall }) => {
    return (
        <div>
            <header className="px-4 pt-8 pb-4 flex items-center">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 mr-2">
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
                    <p className="text-slate-500 mt-1">Gerencie sua conta e o app.</p>
                </div>
            </header>
            <div className="px-4 mt-4 space-y-6">
                 <div className="bg-white p-4 rounded-2xl shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <IconUser className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 break-all">{userEmail}</p>
                            <span className="text-sm font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Conta Ativa</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {canInstall && (
                        <button onClick={onInstall} className="w-full p-4 flex items-center space-x-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-100">
                             <div className="bg-sky-100 p-3 rounded-full">
                                <Download className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700">Instalar Aplicativo</p>
                                <p className="text-sm text-slate-500">Adicione o Meta Yoga à sua tela inicial.</p>
                            </div>
                        </button>
                    )}
                    <button onClick={onLogout} className="w-full p-4 flex items-center space-x-4 text-left hover:bg-slate-50 transition-colors">
                        <div className="bg-red-100 p-3 rounded-full">
                            <IconLogOut className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700">Sair</p>
                            <p className="text-sm text-slate-500">Desconectar da sua conta.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
};


export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [progressData, setProgressData] = useState<ProgressData>({});
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isPwaInstalled, setIsPwaInstalled] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [todayKey, setTodayKey] = useState(new Date().toISOString().split('T')[0]);
    const [dailyDiet, setDailyDiet] = useState<Recipe[]>([]);

    const todaysProgress = useMemo(() => progressData[todayKey] || {}, [progressData, todayKey]);
    const completedYogaClasses = useMemo(() => new Set(todaysProgress.completedYogaClasses || []), [todaysProgress.completedYogaClasses]);
    
    // Automatic daily progress reset
    useEffect(() => {
        const interval = setInterval(() => {
            const newTodayKey = new Date().toISOString().split('T')[0];
            if (newTodayKey !== todayKey) {
                setTodayKey(newTodayKey);
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [todayKey]);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('meta-yoga-welcome-seen');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
        
        const savedEmail = localStorage.getItem('meta-yoga-user');
        if (savedEmail) {
            setUser({ email: savedEmail });
        }
        setLoadingAuth(false);
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchUserData = async () => {
            // FIX: Use v8 compat syntax for Firestore.
            const userDocRef = firestore.collection('users').doc(user.email);
            // FIX: Use v8 compat syntax for Firestore.
            const docSnap = await userDocRef.get();
            // FIX: Use v8 compat syntax for Firestore. `.exists` is a property, not a method.
            if (docSnap.exists) {
                const data = docSnap.data() as { progressData: ProgressData };
                setProgressData(data.progressData || {});
            } else {
                setProgressData({});
            }
        };
        fetchUserData();
    }, [user]);
    
    const recipesByCategory = useMemo(() => {
        return RECIPES.reduce((acc, recipe) => {
            if (!acc[recipe.category]) acc[recipe.category] = [];
            acc[recipe.category].push(recipe);
            return acc;
        }, {} as Record<string, Recipe[]>);
    }, []);
    
    // Generate diet for the day
    useEffect(() => {
        const MEAL_ORDER: Recipe['category'][] = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'];
        const initialDiet = MEAL_ORDER.map(category => {
            const recipesInCat = recipesByCategory[category];
            const randomIndex = Math.floor(Math.random() * recipesInCat.length);
            return recipesInCat[randomIndex];
        }).filter(Boolean); // Filter out undefined if a category has no recipes
        setDailyDiet(initialDiet);
    }, [todayKey, recipesByCategory]);

    const handleReloadRecipe = (categoryToReload: Recipe['category']) => {
        setDailyDiet(currentDiet => {
            const currentRecipe = currentDiet.find(r => r.category === categoryToReload);
            const availableRecipes = recipesByCategory[categoryToReload].filter(r => r.name !== currentRecipe?.name);
            if (availableRecipes.length > 0) {
                const newRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                return currentDiet.map(r => r.category === categoryToReload ? newRecipe : r);
            }
            return currentDiet;
        });
    };

    const handleWelcomeComplete = () => {
        localStorage.setItem('meta-yoga-welcome-seen', 'true');
        setShowWelcome(false);
    };

    const handleLoginSuccess = (loggedInUser: User) => {
        localStorage.setItem('meta-yoga-user', loggedInUser.email);
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('meta-yoga-user');
        setUser(null);
        setProgressData({});
        setCurrentView('dashboard');
    };

    const updateFirestoreProgress = async (newProgressData: ProgressData) => {
        if (!user) return;
        // FIX: Use v8 compat syntax for Firestore.
        const userDocRef = firestore.collection('users').doc(user.email);
        try {
            // FIX: Use v8 compat syntax for Firestore.
            await userDocRef.set({ progressData: newProgressData });
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };
    
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPwaInstalled(true);
        }
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered: ', reg))
                    .catch(err => console.log('SW registration failed: ', err));
            });
        }
    }, []);

    const handleInstallPWA = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    const logActivity = useCallback((activity: ActivityType, value: boolean | number) => {
        setProgressData(prev => {
            const newProgress = JSON.parse(JSON.stringify(prev));
            const dayProgress: DailyProgress = { ...(newProgress[todayKey] || {}) };

            if (activity === ActivityType.Diet && typeof value === 'boolean') {
                dayProgress.diet = value;
            } else if (activity === ActivityType.Walking && typeof value === 'number') {
                dayProgress.walkingMinutes = (dayProgress.walkingMinutes || 0) + value;
            }
            
            newProgress[todayKey] = dayProgress;
            updateFirestoreProgress(newProgress);
            return newProgress;
        });
    }, [todayKey, user, updateFirestoreProgress]);

    const handleToggleYogaClass = useCallback((classId: number) => {
        if (todaysProgress.yoga) return;

        const newSet = new Set(completedYogaClasses);
        if (newSet.has(classId)) newSet.delete(classId); else newSet.add(classId);

        const newClassIds = Array.from(newSet);
        const allCompleted = newClassIds.length === YOGA_CLASSES.length;

        setProgressData(prev => {
            const newProgress = JSON.parse(JSON.stringify(prev));
            const dayProgress: DailyProgress = { ...(newProgress[todayKey] || {}) };
            dayProgress.completedYogaClasses = newClassIds;
            if(allCompleted) dayProgress.yoga = true;
            else dayProgress.yoga = false; // Un-complete day if a class is unchecked
            
            newProgress[todayKey] = dayProgress;
            updateFirestoreProgress(newProgress);
            return newProgress;
        });
        
    }, [completedYogaClasses, todayKey, user, todaysProgress.yoga, updateFirestoreProgress]);

    const renderView = () => {
        switch (currentView) {
            case 'yoga':
                return <YogaView
                    onToggleComplete={handleToggleYogaClass}
                    completedClasses={completedYogaClasses}
                    isYogaDayCompleted={todaysProgress.yoga ?? false}
                />;
            case 'diet':
                return <DietView 
                    onComplete={() => logActivity(ActivityType.Diet, true)} 
                    isCompleted={todaysProgress.diet ?? false}
                    dailyDiet={dailyDiet}
                    onReloadRecipe={handleReloadRecipe}
                />;
            case 'walking':
                return <WalkingView onComplete={(minutes) => logActivity(ActivityType.Walking, minutes)} />;
            case 'progress':
                return <ProgressView progressData={progressData} />;
            case 'settings':
                return <SettingsView 
                    userEmail={user!.email}
                    onBack={() => setCurrentView('dashboard')}
                    onInstall={handleInstallPWA}
                    onLogout={handleLogout}
                    canInstall={!!deferredPrompt && !isPwaInstalled}
                />;
            case 'dashboard':
            default:
                return <Dashboard 
                    setCurrentView={setCurrentView} 
                    todaysProgress={todaysProgress}
                    completedYogaClasses={completedYogaClasses.size} 
                />;
        }
    };
    
    if (loadingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Carregando...</p></div>;
    }

    if (showWelcome) {
        return <WelcomeView onStart={handleWelcomeComplete} />;
    }

    if (!user) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28">
            <main>
                {renderView()}
            </main>
            {currentView !== 'settings' && <BottomNav currentView={currentView} setCurrentView={setCurrentView} />}
        </div>
    );
}