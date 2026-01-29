import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { trackEvent } from '../services/analytics'; // We need to create this service or mock it

export const Home: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        trackEvent('view_screen', { screen_name: 'home' });
    }, []);

    const handleNavigate = (path: string, type: string) => {
        trackEvent('begin_simulation', { simulation_type: type });
        navigate(path);
    };

    return (
        <>
            <div className="fixed top-[env(safe-area-inset-top)] left-0 right-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/5 py-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-2 tracking-tight">
                        Planejamento Consórcio
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg font-light max-w-2xl mx-auto">
                        Escolha a estratégia ideal para o seu futuro financeiro.
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col items-center animate-fade-in">
                {/* Spacer for fixed header */}
                <div className="h-[140px] md:h-[160px] w-full" />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4 md:px-0 pb-20">
                    {/* Quita Smart */}
                    <Card
                        variant="interactive"
                        className="p-8 md:p-12 flex flex-col items-center text-center rounded-3xl"
                        onClick={() => handleNavigate('/quita-smart', 'quitacao')}
                    >
                        <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                            Quita Smart
                        </h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Faça uma escolha estratégica para sua aquisição imobiliária. Reduza o custo final do seu imóvel e alavanque seu patrimônio utilizando a inteligência financeira do consórcio.
                        </p>

                        <span className="mt-auto px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm uppercase tracking-wider group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                            Simular Quitação
                        </span>
                    </Card>

                    {/* Invest Smart */}
                    <Card
                        variant="interactive"
                        className="p-8 md:p-12 flex flex-col items-center text-center rounded-3xl"
                        onClick={() => handleNavigate('/invest-smart', 'investimento')}
                    >
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                            Invest Smart
                        </h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Alavanque seu patrimônio com a inteligência do consórcio. Compare rendimentos, projete cenários e descubra o poder dos juros a seu favor.
                        </p>

                        <span className="mt-auto px-8 py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm uppercase tracking-wider group-hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                            Simular Investimento
                        </span>
                    </Card>
                </div>
            </div>
        </>
    );
};
