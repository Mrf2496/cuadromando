"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: '¡Hola! Soy el Asistente Inteligente de Antigravity BSC. Puedes preguntarme sobre la lógica de la plataforma, cómo se calculan los avances, o cómo gestionar Ejes, Objetivos y Equipos. ¿En qué te puedo ayudar hoy?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const generateBotResponse = (input: string) => {
        const text = input.toLowerCase();

        // Base de conocimiento integrada para responder dudas de la aplicación
        if (text.includes('avance') || text.includes('porcentaje') || text.includes('logica') || text.includes('progres') || text.includes('calculo')) {
            if (text.includes('equipo')) {
                return "El avance de los **Equipos** se calcula buscando todos los Planes de Acción asignados a ese equipo en particular y realizando un promedio aritmético de sus porcentajes de progreso actuales.";
            }
            if (text.includes('meta')) {
                return "El avance de las **Metas** es la media calculada de los progresos de todos los Planes de Acción activos que fueron declarados como vehículos para alcanzar dicha meta.";
            }
            if (text.includes('objetivo')) {
                return "El avance de un **Objetivo Estratégico** promedia los porcentajes de logro de todos los Planes de Acción vinculados a dicho Objetivo.";
            }
            if (text.includes('eje')) {
                return "El avance de los **Ejes Estratégicos** suma el rendimiento individual de todos los Planes de Acción desarrollados bajo ese Eje y lo divide entre la cantidad total de esos planes.";
            }
            return "El sistema matemático es 'Bottom-Up'. El cálculo base reside en los **Planes de Acción** (filtrando las Actividades activas en el Año Fiscal seleccionado). A partir de ahí, el promedio se irradia matemáticamente hacia los Equipos, Metas, Objetivos y Ejes Estratégicos como un porcentaje global.";
        }

        if (text.includes('año fiscal') || text.includes('vigencia') || text.includes('selector') || text.includes('cambiar año')) {
            return "El **Año Fiscal** o vigencia funciona como un *filtro temporal transversal*. Cuando cambias el año en el menú superior, el sistema recalcula en tiempo real todos los porcentajes de avance asegurando que sólo se contabilicen las actividades cuyas fechas de inicio y fin pertenezcan a ese año seleccionado.";
        }

        if (text.includes('eje') || text.includes('estrategico')) {
            return "Los **Ejes Estratégicos** representan los 6 pilares fundamentales de crecimiento y desarrollo del plan cooperativo. Son el nivel jerárquico máximo y contienen Objetivos, Políticas, Metas y Estrategias.";
        }

        if (text.includes('objetivo')) {
            return "Los **Objetivos Estratégicos** desagregan la visión de cada Eje en proposiciones de valor específicas. Los Planes de Acción se vinculan directamente a estos objetivos para impulsarlos.";
        }

        if (text.includes('plan de accion') || text.includes('accion')) {
            return "Un **Plan de Acción** es una iniciativa temporal con presupuesto y un responsable. Su progreso general dictamina el éxito que va reportando la plataforma a métricas superiores.";
        }

        if (text.includes('creador') || text.includes('quien te creo') || text.includes('quien eres')) {
            return "Soy una inteligencia integrada desarrollada por el equipo de Antigravity para ayudar a maximizar el uso de esta plataforma de arquitectura 'Supermodern'.";
        }

        return "Es una gran pregunta. Como Asistente Especializado en el núcleo de Antigravity BSC, estoy entrenado principalmente para explicarte la arquitectura de la aplicación, el motor de métricas de progreso y la jerarquía de los Ejes y Metas. Por favor, intenta ser un poco más específico relacionándolo con un módulo de la plataforma.";
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simular el tiempo de "pensamiento" de la IA
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: generateBotResponse(newUserMsg.content),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1200 + Math.random() * 1000);
    };

    return (
        <>
            <AnimatePresence>
                {/* Chat Widget Floating Button */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center p-0 transition-transform hover:scale-110"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
                            </span>
                        </Button>
                    </motion.div>
                )}

                {/* Chat Window */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card"></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm leading-tight">Antigravity AI</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Asistente de Plataforma
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 hover:bg-black/5 dark:hover:bg-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.type === 'bot' && (
                                        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                                            <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-xs">
                                                <Bot className="w-4 h-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.type === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                    : 'bg-card border border-border text-card-foreground rounded-tl-sm'
                                                }`}
                                        >
                                            {/* Simple hack to render bold text correctly for our local markdown responses */}
                                            {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {msg.type === 'user' && (
                                        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                <User className="w-4 h-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-xs">
                                            <Bot className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                                        <motion.div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                        <motion.div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                        <motion.div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-card border-t border-border">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input
                                    placeholder="Pregunta algo sobre la app..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="rounded-full bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary h-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="rounded-full h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
