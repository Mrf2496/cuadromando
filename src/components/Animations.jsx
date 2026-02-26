'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ==========================================
// ANIMATED LOGO - Nombre con gradiente animado
// ==========================================
export function AnimatedLogo({ name, period, showDetails = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Efecto de brillo animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4"/>
          <path d="M10 10h4"/>
          <path d="M10 14h4"/>
          <path d="M10 18h4"/>
        </motion.svg>
      </motion.div>
      <div>
        <motion.span
          className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] animate-gradient"
          initial={{ backgroundPosition: '0% center' }}
          animate={{ backgroundPosition: ['0% center', '200% center'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {name}
        </motion.span>
        {showDetails && (
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Plan {period}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ==========================================
// ANIMATED TITLE - Títulos con efecto de entrada
// ==========================================
export function AnimatedTitle({ children, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-1"
    >
      <motion.h1
        className="text-2xl lg:text-3xl font-bold flex items-center gap-3"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>
        )}
        <motion.span
          className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        >
          {children}
        </motion.span>
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

// ==========================================
// ANIMATED MENU ITEM - Items del menú con efectos
// ==========================================
export function AnimatedMenuItem({ item, isActive, onClick, collapsed }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden group ${
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "hover:bg-accent text-muted-foreground hover:text-foreground"
      }`}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Efecto de fondo animado para item activo */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"
          layoutId="activeMenuBg"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {/* Efecto hover */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent to-accent/50 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
      
      {/* Icono con animación */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        <item.icon className="w-5 h-5 shrink-0" />
      </motion.div>
      
      {/* Texto */}
      {!collapsed && (
        <motion.span
          className="text-sm font-medium whitespace-nowrap relative z-10"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
        >
          {item.label}
        </motion.span>
      )}
      
      {/* Indicador activo */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/50 rounded-r-full"
          layoutId="activeIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

// ==========================================
// ANIMATED CARD - Tarjetas con efectos
// ==========================================
export function AnimatedCard({ children, delay = 0, className = "", onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// ANIMATED CHART CONTAINER - Contenedor de gráficos
// ==========================================
export function AnimatedChartContainer({ children, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
      className="bg-card rounded-xl border shadow-sm overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-b"
      >
        <h3 className="text-base font-semibold flex items-center gap-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// ANIMATED KPI CARD - Tarjetas de KPI
// ==========================================
export function AnimatedKPI({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="relative overflow-hidden bg-card rounded-xl border shadow-sm"
    >
      {/* Barra de color superior animada */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1`}
        style={{ background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
      />
      
      {/* Efecto de brillo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity"
      />
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <motion.p
              className="text-sm font-medium text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              {title}
            </motion.p>
            <motion.p
              className="text-3xl font-bold mt-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.4, type: "spring" }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <motion.p
                className="text-xs text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.5 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {Icon && (
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <Icon className="w-5 h-5 text-primary" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// ANIMATED PROGRESS - Barra de progreso animada
// ==========================================
export function AnimatedProgress({ value, className = "" }) {
  return (
    <div className={`relative h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Efecto de brillo */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

// ==========================================
// STAGGER CONTAINER - Contenedor con animación escalonada
// ==========================================
export function StaggerContainer({ children, staggerDelay = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// STAGGER ITEM - Item para usar dentro de StaggerContainer
// ==========================================
export function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 100 }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// FLOATING ICON - Icono flotante con animación
// ==========================================
export function FloatingIcon({ icon: Icon, color = "#10b981" }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ color }}
    >
      <Icon className="w-5 h-5" />
    </motion.div>
  );
}

// ==========================================
// PULSE EFFECT - Efecto de pulso
// ==========================================
export function PulseEffect({ children, color = "rgba(16, 185, 129, 0.4)" }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default {
  AnimatedLogo,
  AnimatedTitle,
  AnimatedMenuItem,
  AnimatedCard,
  AnimatedChartContainer,
  AnimatedKPI,
  AnimatedProgress,
  StaggerContainer,
  StaggerItem,
  FloatingIcon,
  PulseEffect
};
