"use client";

import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
// UI Components
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

// Charts
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from "recharts";

// Icons
import {
  LayoutDashboard,
  Target,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Save,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
  Award,
  Zap,
  Shield,
  Lightbulb,
  Heart,
  ArrowRight,
  Eye,
  Edit,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  Home,
  Layers,
  PieChartIcon,
  FileBarChart,
  Database,
  Sparkles,
  Leaf,
  UsersRound,
  Factory,
  Cpu,
  Edit2,
  PlusCircle,
  XCircle,
  LogOut,
} from "lucide-react";

// ==========================================
// COMPONENTES DE UTILIDAD
// ==========================================

const Icon = ({ name, className, style }: { name: string | any, className?: string, style?: React.CSSProperties }) => {
  // Si ya es un componente (función), lo renderizamos directamente
  if (typeof name !== 'string') {
    const IconComp = name;
    return <IconComp className={className} style={style} />;
  }

  const icons: any = {
    LayoutDashboard, Target, Users, FileText, Settings, Menu, X, Sun, Moon, Bell,
    ChevronRight, Plus, Pencil, Trash2, Download, Upload, Save, AlertTriangle,
    CheckCircle2, Clock, TrendingUp, TrendingDown, Minus, Search, Filter,
    MoreHorizontal, Building2, Briefcase, Calendar, DollarSign, BarChart3,
    Activity, Award, Zap, Shield, Lightbulb, Heart, ArrowRight, Eye, Edit,
    Copy, RefreshCw, ChevronDown, ChevronLeft, Home, Layers, PieChartIcon,
    FileBarChart, Database, Sparkles, Leaf, UsersRound, Factory, Cpu, Edit2,
    PlusCircle, XCircle, LogOut
  };
  const IconComp = icons[name] || icons['Activity']; // Fallback
  return <IconComp className={className} style={style} />;
};

// ==========================================
// TIPOS
// ==========================================
interface Eje {
  id: string;
  name: string;
  color: string;
  icon: any; // Using any or string to avoid react component serialization errors
  weight: number;
  description?: string;
}

interface Objetivo {
  id: string;
  ejeId: string;
  code: string;
  description: string;
  weight: number;
  status: string;
  targetDate?: string;
  responsible?: string;
}

interface Politica {
  id: string;
  ejeId: string;
  code: string;
  description: string;
  status: string;
}

interface Meta {
  id: string;
  ejeId: string;
  objetivoId: string;
  description: string;
  targetYear: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  progress: number;
}

interface Estrategia {
  id: string;
  ejeId: string;
  code: string;
  description: string;
  type: string;
  status: string;
  indicator?: string;
  baseline?: string;
  measurementPeriod?: 'CP' | 'MP' | 'LP';
}

interface Actividad {
  id: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  responsable?: string;
  presupuesto?: number;
  avance: number;
  evidencia?: string;
  cronograma?: boolean[];
}

interface EstrategiaPersonal {
  id: string;
  estrategiaCorporativaId?: string;
  descripcion: string;
  indicador?: string;
  indicatorType?: 'CUANTITATIVO' | 'CUALITATIVO';
  actividades: Actividad[];
}

interface PlanAccion {
  id: string;
  // Alineación Corporativa (Jerárquica)
  ejeId: string;
  objectiveId: string;
  politicaId?: string;
  metaId?: string;
  estrategiaId?: string;

  // Datos del Plan
  code: string;
  name: string;
  description: string;
  personalGoal?: string; // Meta personal vinculada

  // Indicador de Gestión
  indicator?: string;
  indicatorType?: 'CUANTITATIVO' | 'CUALITATIVO';
  baseline?: string;
  targetValue?: string;
  currentValue?: string;
  measurementPeriod?: 'CP' | 'MP' | 'LP';

  // Fechas y Estado
  startDate: string;
  endDate: string;
  status: string;
  progress: number;

  // Presupuesto y Equipo
  budget?: number;
  spentBudget?: number;
  responsible?: string;
  teamId?: string;

  // Estrategias Personales (múltiples)
  estrategiasPersonales?: EstrategiaPersonal[];

  // Actividades (legado - mantener compatibilidad)
  actividades?: Actividad[];
}

interface Equipo {
  id: string;
  name: string;
  area: string;
  leaderId?: string;
  description?: string;
}

interface Empleado {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  teamId?: string;
  avatar?: string;
}

interface PlanInfo {
  organizationName: string;
  planPeriod: string;
  planModel: string;
  planStatus: string;
  generalResponsible: string;
  startDate: string;
  endDate: string;
}

// ==========================================
// DATOS INICIALES DEL PLAN ESTRATÉGICO COACREMAT 2026-2030
// ==========================================

const EJES_INICIALES: Eje[] = [
  { id: "eje-1", name: "Gestión Financiera", color: "#10b981", icon: "DollarSign", weight: 18, description: "Fortalecer procesos económicos a través de la ejecución de políticas del orden financiero logrando mayor solvencia y liquidez para la cooperativa." },
  { id: "eje-2", name: "Asociados Pilar Fundamental", color: "#3b82f6", icon: "UsersRound", weight: 18, description: "Garantizar a los asociados la prestación de los servicios, beneficios y auxilios con igualdad, equidad y fundamentos legales del sector solidario." },
  { id: "eje-3", name: "Gestión y Desarrollo Empresarial Solidario", color: "#f59e0b", icon: "Factory", weight: 17, description: "Establecer mecanismos de información, actualización, capacitación, educación e investigación mediante la articulación del PESEM con el Plan Estratégico." },
  { id: "eje-4", name: "Aprendizaje y Crecimiento del Talento Humano", color: "#8b5cf6", icon: "Lightbulb", weight: 17, description: "Garantizar el bienestar y la formación del talento humano a través de procesos de seguridad y salud en el trabajo, capacitación permanente y pertinente." },
  { id: "eje-5", name: "Infraestructura Física y Tecnológica", color: "#ec4899", icon: "Cpu", weight: 15, description: "Planear el desarrollo de la infraestructura física y tecnológica a través de la apropiación de recursos que permitan estar a la vanguardia de la modernidad." },
  { id: "eje-6", name: "Gestión Ambiental y Desarrollo Sostenible", color: "#06b6d4", icon: "Leaf", weight: 15, description: "Promover la conservación del medio ambiente y la corresponsabilidad social mediante la adopción de productos de eficiencia energética y bajo impacto ambiental." },
];

const OBJETIVOS_INICIALES: Objetivo[] = [
  { id: "obj-1-1", ejeId: "eje-1", code: "OE-GF-01", description: "Fortalecer procesos económicos a través de la ejecución de políticas del orden financiero logrando mayor solvencia y liquidez para la cooperativa", weight: 50, status: "active" },
  { id: "obj-1-2", ejeId: "eje-1", code: "OE-GF-02", description: "Impulsar la innovación y el desarrollo (I+D) en los servicios de la cooperativa, aprovechando la disposición interna al cambio", weight: 50, status: "active" },
  { id: "obj-2-1", ejeId: "eje-2", code: "OE-APF-01", description: "Garantizar a los asociados la prestación de los servicios, beneficios y auxilios con igualdad, equidad y fundamentos legales", weight: 40, status: "active" },
  { id: "obj-2-2", ejeId: "eje-2", code: "OE-APF-02", description: "Fortalecer la experiencia del asociado para consolidar el sentido de pertenencia y fidelización", weight: 30, status: "active" },
  { id: "obj-2-3", ejeId: "eje-2", code: "OE-APF-03", description: "Diversificar y adaptar el portafolio de créditos según las tendencias del mercado", weight: 30, status: "active" },
  { id: "obj-3-1", ejeId: "eje-3", code: "OE-GES-01", description: "Establecer mecanismos de información, actualización, capacitación e investigación mediante la articulación del PESEM", weight: 35, status: "active" },
  { id: "obj-3-2", ejeId: "eje-3", code: "OE-GES-02", description: "Mejorar la gobernanza a través de la aplicación del código de ética y buen gobierno", weight: 35, status: "active" },
  { id: "obj-3-3", ejeId: "eje-3", code: "OE-GES-03", description: "Crear el departamento de Educación para desarrollar programas de formación integral", weight: 30, status: "active" },
  { id: "obj-4-1", ejeId: "eje-4", code: "OE-TH-01", description: "Formular un plan de capacitaciones oportuno y pertinente para asociados, directivos y funcionarios", weight: 30, status: "active" },
  { id: "obj-4-2", ejeId: "eje-4", code: "OE-TH-02", description: "Establecer un modelo de evaluación de personal objetivo para el mejoramiento continuo", weight: 25, status: "active" },
  { id: "obj-4-3", ejeId: "eje-4", code: "OE-TH-03", description: "Desarrollar sistemas de control interno SARO y SARC integrando la gestión de riesgos", weight: 25, status: "active" },
  { id: "obj-4-4", ejeId: "eje-4", code: "OE-TH-04", description: "Mantener cumplimiento del 100% de estándares mínimos del SG-SST", weight: 20, status: "active" },
  { id: "obj-5-1", ejeId: "eje-5", code: "OE-IFT-01", description: "Optimizar el uso de canales de pago existentes y evaluar nuevas tecnologías", weight: 35, status: "active" },
  { id: "obj-5-2", ejeId: "eje-5", code: "OE-IFT-02", description: "Capacitar y sensibilizar a los asociados en mecanismos digitales", weight: 35, status: "active" },
  { id: "obj-5-3", ejeId: "eje-5", code: "OE-IFT-03", description: "Liderar la diferenciación en el mercado mediante estrategia continua de I+D en servicios", weight: 30, status: "active" },
  { id: "obj-6-1", ejeId: "eje-6", code: "OE-GA-01", description: "Incentivar el consumo de productos para ahorro de energía y conservación del medio ambiente", weight: 35, status: "active" },
  { id: "obj-6-2", ejeId: "eje-6", code: "OE-GA-02", description: "Desarrollar el eje ambiental y proyectar una imagen de responsabilidad con el medio ambiente", weight: 35, status: "active" },
  { id: "obj-6-3", ejeId: "eje-6", code: "OE-GA-03", description: "Fortalecer la educación y sensibilización ambiental de los asociados", weight: 30, status: "active" },
];

const POLITICAS_INICIALES: Politica[] = [
  { id: "pol-1-1", ejeId: "eje-1", code: "P-GF-01", description: "Tasas de Interés por debajo de las del sector bancario", status: "active" },
  { id: "pol-1-2", ejeId: "eje-1", code: "P-GF-02", description: "Los procesos de planificación fiscal y financiera garantizan la solidez y confianza empresarial", status: "active" },
  { id: "pol-1-3", ejeId: "eje-1", code: "P-GF-03", description: "Líneas de crédito acordes a las necesidades de los asociados, teniendo en cuenta la segmentación socioeconómica", status: "active" },
  { id: "pol-2-1", ejeId: "eje-2", code: "P-APF-01", description: "Los procesos de educación solidaria se enmarcan dentro de los ámbitos del PESEM", status: "active" },
  { id: "pol-2-2", ejeId: "eje-2", code: "P-APF-02", description: "Medios de comunicación e información oportunos y apropiados", status: "active" },
  { id: "pol-2-3", ejeId: "eje-2", code: "P-APF-03", description: "Atención eficiente y con calidad humana a los asociados", status: "active" },
  { id: "pol-2-4", ejeId: "eje-2", code: "P-APF-04", description: "Portafolio de servicios acordes a las necesidades, intereses y expectativas del asociado", status: "active" },
  { id: "pol-3-1", ejeId: "eje-3", code: "P-GES-01", description: "Procesos administrativos, operativos y de control eficientes y eficaces", status: "active" },
  { id: "pol-3-2", ejeId: "eje-3", code: "P-GES-02", description: "Los principios democráticos, el código de ética y buen gobierno son la base para la conformación de comités", status: "active" },
  { id: "pol-3-3", ejeId: "eje-3", code: "P-GES-03", description: "Equilibrio entre el balance social y financiero de acuerdo a la normatividad", status: "active" },
  { id: "pol-3-4", ejeId: "eje-3", code: "P-GES-04", description: "Procesos de Contratación bajo lineamientos de transparencia, legalidad, rotación y calidad", status: "active" },
  { id: "pol-4-1", ejeId: "eje-4", code: "P-TH-01", description: "Capacitación permanente, oportuna y pertinente para el desarrollo del talento humano", status: "active" },
  { id: "pol-4-2", ejeId: "eje-4", code: "P-TH-02", description: "La evaluación de desempeño y retroalimentación permanente como base para medir el cumplimiento", status: "active" },
  { id: "pol-4-3", ejeId: "eje-4", code: "P-TH-03", description: "La seguridad y salud en el trabajo fundamento para el bienestar y efectividad laboral", status: "active" },
  { id: "pol-4-4", ejeId: "eje-4", code: "P-TH-04", description: "Los miembros actuarán conforme a principios de respeto, tolerancia y buen trato", status: "active" },
  { id: "pol-5-1", ejeId: "eje-5", code: "P-IFT-01", description: "La modernidad y la tecnología base para el crecimiento y desarrollo sostenible", status: "active" },
  { id: "pol-5-2", ejeId: "eje-5", code: "P-IFT-02", description: "Planta física y tecnológica acorde a las necesidades y crecimiento de la organización", status: "active" },
  { id: "pol-5-3", ejeId: "eje-5", code: "P-IFT-03", description: "Establecimiento de reglas y lineamientos técnicos para el uso controlado de activos de información", status: "active" },
  { id: "pol-6-1", ejeId: "eje-6", code: "P-GA-01", description: "La conservación del ambiente, corresponsabilidad social de COACREMAT", status: "active" },
  { id: "pol-6-2", ejeId: "eje-6", code: "P-GA-02", description: "Cero papel y utilización de productos biodegradables en las actividades y procedimientos", status: "active" },
  { id: "pol-6-3", ejeId: "eje-6", code: "P-GA-03", description: "Promoción de la utilización de energías limpias y el uso racional de los recursos naturales", status: "active" },
  { id: "pol-6-4", ejeId: "eje-6", code: "P-GA-04", description: "Prevención, reducción y control de la contaminación por impactos ambientales", status: "active" },
];

const METAS_INICIALES: Meta[] = [
  { id: "meta-1-1", ejeId: "eje-1", objetivoId: "obj-1-1", description: "Para el 2027 implementar en un 100% un sistema dinámico para modificación de tasas de interés", targetYear: "2027", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-1-2", ejeId: "eje-1", objetivoId: "obj-1-1", description: "Anualmente realizar un plan financiero acorde a la normatividad vigente para la sostenibilidad económica", targetYear: "2026-2030", unit: "Planes/año", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-1-3", ejeId: "eje-1", objetivoId: "obj-1-1", description: "Contar con tres líneas de crédito dedicadas al sector productivo y medioambiental", targetYear: "2030", unit: "Líneas", targetValue: 3, currentValue: 0, progress: 0 },
  { id: "meta-1-4", ejeId: "eje-1", objetivoId: "obj-1-2", description: "Para el 2030 tener en funcionamiento la fábrica de créditos en todas las líneas", targetYear: "2030", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-2-1", ejeId: "eje-2", objetivoId: "obj-2-1", description: "Para el 2030 contar con un 25% de asociados capacitados en manejo de plataformas digitales", targetYear: "2030", unit: "%", targetValue: 25, currentValue: 0, progress: 0 },
  { id: "meta-2-2", ejeId: "eje-2", objetivoId: "obj-2-1", description: "Para el 2027 contar con una Plataforma Tecnológica para educación", targetYear: "2027", unit: "Plataforma", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-2-3", ejeId: "eje-2", objetivoId: "obj-2-1", description: "Para el 2028 contar con la incorporación de una APP como mecanismo de información", targetYear: "2028", unit: "APP", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-2-4", ejeId: "eje-2", objetivoId: "obj-2-2", description: "Para el 2027 contar con un Plan de Fidelización dirigido a la base social", targetYear: "2027", unit: "Plan", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-2-5", ejeId: "eje-2", objetivoId: "obj-2-3", description: "Para el 2030 ampliar el portafolio en nuevas líneas de crédito", targetYear: "2030", unit: "Líneas nuevas", targetValue: 3, currentValue: 0, progress: 0 },
  { id: "meta-3-1", ejeId: "eje-3", objetivoId: "obj-3-1", description: "Para el 2027 contar con un adecuado sistema de control interno", targetYear: "2027", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-3-2", ejeId: "eje-3", objetivoId: "obj-3-1", description: "Consolidar en 2027 la Asociación Mutual Coacremat como brazo de innovación", targetYear: "2027", unit: "Asociación", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-3-3", ejeId: "eje-3", objetivoId: "obj-3-2", description: "Para el 2030 lograr que el 100% de integrantes de comités se certifiquen en Código de Ética", targetYear: "2030", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-3-4", ejeId: "eje-3", objetivoId: "obj-3-2", description: "Incrementar tasa de retención de asociados menores de 35 años mediante Escuela de Liderazgo", targetYear: "2030", unit: "%", targetValue: 80, currentValue: 0, progress: 0 },
  { id: "meta-3-5", ejeId: "eje-3", objetivoId: "obj-3-3", description: "Lograr que el 100% de asociados activos completen al menos un ciclo de formación integral", targetYear: "2030", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-4-1", ejeId: "eje-4", objetivoId: "obj-4-1", description: "Para el 2027 contar con un plan de capacitaciones dirigido a grupos de interés", targetYear: "2027", unit: "Plan", targetValue: 1, currentValue: 0, progress: 0 },
  { id: "meta-4-2", ejeId: "eje-4", objetivoId: "obj-4-2", description: "Para el 2027 establecer y aplicar el modelo de evaluación de desempeño al 100% de funcionarios", targetYear: "2027", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-4-3", ejeId: "eje-4", objetivoId: "obj-4-3", description: "Para el 2027 implementar en un 100% el SARO", targetYear: "2027", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-4-4", ejeId: "eje-4", objetivoId: "obj-4-3", description: "Para el 2030 tener implementado el 100% del manual de procesos y procedimientos", targetYear: "2030", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-4-5", ejeId: "eje-4", objetivoId: "obj-4-4", description: "Mantener cumplimiento del 100% de estándares mínimos del SG-SST", targetYear: "2030", unit: "%", targetValue: 100, currentValue: 0, progress: 0 },
  { id: "meta-5-1", ejeId: "eje-5", objetivoId: "obj-5-1", description: "Reducir costo operativo transaccional mediante optimización de canales y arquitectura de pagos digitales", targetYear: "2030", unit: "% reducción", targetValue: 30, currentValue: 0, progress: 0 },
  { id: "meta-5-2", ejeId: "eje-5", objetivoId: "obj-5-2", description: "Elevar el Índice de Madurez Digital del asociado mediante programa 'Coacremat Digital Segura'", targetYear: "2030", unit: "Índice", targetValue: 80, currentValue: 0, progress: 0 },
  { id: "meta-5-3", ejeId: "eje-5", objetivoId: "obj-5-3", description: "Alcanzar participación de mercado superior en Nariño y Putumayo mediante 3 nuevas líneas de productos", targetYear: "2030", unit: "Líneas", targetValue: 3, currentValue: 0, progress: 0 },
  { id: "meta-5-4", ejeId: "eje-5", objetivoId: "obj-5-3", description: "Alcanzar alto nivel de disponibilidad operativa en canales de pago con autenticación biométrica", targetYear: "2030", unit: "% disponibilidad", targetValue: 99, currentValue: 0, progress: 0 },
  { id: "meta-6-1", ejeId: "eje-6", objetivoId: "obj-6-1", description: "Para el 2027 contar con dos convenios comerciales dedicados a la protección del ambiente", targetYear: "2027", unit: "Convenios", targetValue: 2, currentValue: 0, progress: 0 },
  { id: "meta-6-2", ejeId: "eje-6", objetivoId: "obj-6-1", description: "Anualmente reducir en un 10% la utilización de papel, utilizar materiales biodegradables en un 80%", targetYear: "Anual", unit: "% reducción", targetValue: 10, currentValue: 0, progress: 0 },
  { id: "meta-6-3", ejeId: "eje-6", objetivoId: "obj-6-2", description: "Para el 2030 contar con dos líneas de crédito destinados a la protección del ambiente", targetYear: "2030", unit: "Líneas", targetValue: 2, currentValue: 0, progress: 0 },
  { id: "meta-6-4", ejeId: "eje-6", objetivoId: "obj-6-3", description: "Anualmente diseñar campañas de concienciación ambiental dirigidas a los asociados", targetYear: "Anual", unit: "Campañas/año", targetValue: 1, currentValue: 0, progress: 0 },
];

const ESTRATEGIAS_INICIALES: Estrategia[] = [
  { id: "est-1-1", ejeId: "eje-1", code: "E-GF-01", description: "Reestructuración del comité financiero con autonomía para cambiar oportunamente las tasas de interés", type: "efficiency", status: "active", indicator: "Número de reuniones del comité financiero", baseline: "0 reuniones", measurementPeriod: "CP" },
  { id: "est-1-2", ejeId: "eje-1", code: "E-GF-02", description: "Revisar la estructura de costos de comisiones de recaudo para mantener la competitividad", type: "control", status: "active", indicator: "Porcentaje de reducción de costos de comisiones", baseline: "100% de costo actual", measurementPeriod: "MP" },
  { id: "est-1-3", ejeId: "eje-1", code: "E-GF-03", description: "Potenciar la solvencia económica para asegurar fuentes de apalancamiento con tasas preferenciales", type: "growth", status: "active", indicator: "Índice de solvencia", baseline: "Índice actual: 1.2", measurementPeriod: "LP" },
  { id: "est-1-4", ejeId: "eje-1", code: "E-GF-04", description: "Diseñar y lanzar una Línea de Crédito Verde para promover productos de ahorro de energía", type: "innovation", status: "active", indicator: "Número de líneas de crédito verde activas", baseline: "0 líneas", measurementPeriod: "MP" },
  { id: "est-1-5", ejeId: "eje-1", code: "E-GF-05", description: "Diseñar esquema de créditos de apalancamiento preferencial y exclusivo para el sector productivo", type: "growth", status: "active", indicator: "Monto de créditos colocados en sector productivo", baseline: "$0 COP", measurementPeriod: "LP" },
  { id: "est-1-6", ejeId: "eje-1", code: "E-GF-06", description: "Impulsar la innovación y el desarrollo (I+D) en los servicios de la cooperativa", type: "innovation", status: "active", indicator: "Número de nuevos servicios implementados", baseline: "0 servicios", measurementPeriod: "LP" },
  { id: "est-2-1", ejeId: "eje-2", code: "E-APF-01", description: "Llevar a cabo proceso de capacitación permanente en manejo de plataformas digitales", type: "growth", status: "active", indicator: "Porcentaje de asociados capacitados", baseline: "0% capacitados", measurementPeriod: "CP" },
  { id: "est-2-2", ejeId: "eje-2", code: "E-APF-02", description: "Desarrollar e implementar una plataforma tecnológica robusta para la educación solidaria", type: "innovation", status: "active", indicator: "Plataforma educativa operativa", baseline: "Sin plataforma", measurementPeriod: "MP" },
  { id: "est-2-3", ejeId: "eje-2", code: "E-APF-03", description: "Fortalecer los mecanismos de comunicación interna y externa", type: "efficiency", status: "active", indicator: "Índice de satisfacción de comunicación", baseline: "Sin medición", measurementPeriod: "CP" },
  { id: "est-2-4", ejeId: "eje-2", code: "E-APF-04", description: "Fortalecer la experiencia del asociado para consolidar sentido de pertenencia y fidelización", type: "growth", status: "active", indicator: "Índice de fidelización de asociados", baseline: "Sin índice", measurementPeriod: "MP" },
  { id: "est-2-5", ejeId: "eje-2", code: "E-APF-05", description: "Diversificar y adaptar el portafolio de créditos según tendencias del PIB y tasa de desempleo", type: "innovation", status: "active", indicator: "Número de nuevas líneas de crédito", baseline: "Portafolio actual", measurementPeriod: "LP" },
  { id: "est-3-1", ejeId: "eje-3", code: "E-GES-01", description: "Dinamizar el plan estratégico utilizando como herramienta el PESEM", type: "efficiency", status: "active", indicator: "Grado de articulación PESEM", baseline: "0% articulación", measurementPeriod: "CP" },
  { id: "est-3-2", ejeId: "eje-3", code: "E-GES-02", description: "Establecer la Asociación Mutual Coacremat alineada con el modelo solidario", type: "growth", status: "active", indicator: "Asociación Mutual constituida", baseline: "No constituida", measurementPeriod: "MP" },
  { id: "est-3-3", ejeId: "eje-3", code: "E-GES-03", description: "Ampliar la intervención de los delegados en participación activa como apoyo y fortalecimiento", type: "growth", status: "active", indicator: "Porcentaje de participación de delegados", baseline: "Participación actual", measurementPeriod: "MP" },
  { id: "est-3-4", ejeId: "eje-3", code: "E-GES-04", description: "Mejorar la gobernanza a través de la aplicación del código de ética y buen gobierno", type: "control", status: "active", indicator: "Porcentaje de certificación en código de ética", baseline: "0% certificados", measurementPeriod: "LP" },
  { id: "est-3-5", ejeId: "eje-3", code: "E-GES-05", description: "Crear el comité de planeación para resignificar el plan estratégico permanentemente", type: "efficiency", status: "active", indicator: "Comité de planeación activo", baseline: "Sin comité", measurementPeriod: "CP" },
  { id: "est-3-6", ejeId: "eje-3", code: "E-GES-06", description: "Fomentar la participación y mejorar comunicación para fidelizar asociados jóvenes mediante Escuela de Liderazgo", type: "growth", status: "active", indicator: "Tasa de retención de asociados <35 años", baseline: "Tasa actual de retención", measurementPeriod: "LP" },
  { id: "est-3-7", ejeId: "eje-3", code: "E-GES-07", description: "Crear el departamento de Educación encargado de desarrollar programas de formación integral", type: "growth", status: "active", indicator: "Departamento de Educación creado", baseline: "Sin departamento", measurementPeriod: "MP" },
  { id: "est-4-1", ejeId: "eje-4", code: "E-TH-01", description: "Formular un plan de capacitaciones oportuno y pertinente para asociados, directivos y funcionarios", type: "growth", status: "active", indicator: "Plan de capacitaciones aprobado", baseline: "Sin plan formal", measurementPeriod: "CP" },
  { id: "est-4-2", ejeId: "eje-4", code: "E-TH-02", description: "Fortalecer la cultura organizacional y el trabajo en equipo mediante educación continua", type: "efficiency", status: "active", indicator: "Índice de clima organizacional", baseline: "Sin medición formal", measurementPeriod: "MP" },
  { id: "est-4-3", ejeId: "eje-4", code: "E-TH-03", description: "Establecer un modelo de evaluación de personal objetivo para el mejoramiento continuo", type: "control", status: "active", indicator: "Porcentaje de funcionarios evaluados", baseline: "0% evaluados", measurementPeriod: "MP" },
  { id: "est-4-4", ejeId: "eje-4", code: "E-TH-04", description: "Desarrollar sistemas de control interno SARO y SARC integrando la gestión de riesgos tecnológicos", type: "control", status: "active", indicator: "Porcentaje de implementación SARO/SARC", baseline: "0% implementado", measurementPeriod: "MP" },
  { id: "est-4-5", ejeId: "eje-4", code: "E-TH-05", description: "Implementar un sistema integral de riesgo robusto que anticipe y gestione amenazas", type: "control", status: "active", indicator: "Sistema de gestión de riesgos operativo", baseline: "Sin sistema integral", measurementPeriod: "LP" },
  { id: "est-4-6", ejeId: "eje-4", code: "E-TH-06", description: "Designar personal idóneo como base para asegurar el cumplimiento riguroso del marco normativo", type: "efficiency", status: "active", indicator: "Personal designado y capacitado", baseline: "Sin designación formal", measurementPeriod: "CP" },
  { id: "est-5-1", ejeId: "eje-5", code: "E-IFT-01", description: "Optimizar el uso de los canales de pago existentes y evaluar nuevas tecnologías", type: "efficiency", status: "active", indicator: "Reducción de costos operativos transaccionales", baseline: "Costo actual", measurementPeriod: "LP" },
  { id: "est-5-2", ejeId: "eje-5", code: "E-IFT-02", description: "Capacitar y sensibilizar a los asociados en mecanismos digitales y seguridad informática", type: "growth", status: "active", indicator: "Índice de Madurez Digital", baseline: "Sin índice", measurementPeriod: "LP" },
  { id: "est-5-3", ejeId: "eje-5", code: "E-IFT-03", description: "Liderar la diferenciación en el mercado mediante estrategia continua de I+D en servicios", type: "innovation", status: "active", indicator: "Número de nuevos servicios I+D", baseline: "0 servicios I+D", measurementPeriod: "LP" },
  { id: "est-5-4", ejeId: "eje-5", code: "E-IFT-04", description: "Optimizar la eficiencia y seguridad de los canales de pago mediante soluciones tecnológicas", type: "efficiency", status: "active", indicator: "% de disponibilidad de canales de pago", baseline: "Disponibilidad actual", measurementPeriod: "MP" },
  { id: "est-6-1", ejeId: "eje-6", code: "E-GA-01", description: "Incentivar el consumo de productos para ahorro de energía y conservación del medio ambiente", type: "growth", status: "active", indicator: "Número de convenios ambientales", baseline: "0 convenios", measurementPeriod: "MP" },
  { id: "est-6-2", ejeId: "eje-6", code: "E-GA-02", description: "Desarrollar el eje ambiental y proyectar imagen de responsabilidad con el medio ambiente", type: "growth", status: "active", indicator: "Número de líneas de crédito ambientales", baseline: "0 líneas", measurementPeriod: "LP" },
  { id: "est-6-3", ejeId: "eje-6", code: "E-GA-03", description: "Diseñar y lanzar una Línea de Crédito Verde para promover productos de ahorro de energía", type: "innovation", status: "active", indicator: "Línea de Crédito Verde activa", baseline: "Sin línea verde", measurementPeriod: "MP" },
  { id: "est-6-4", ejeId: "eje-6", code: "E-GA-04", description: "Fortalecer la educación y sensibilización ambiental de los asociados, incentivando canales digitales", type: "growth", status: "active", indicator: "Número de campañas ambientales realizadas", baseline: "0 campañas", measurementPeriod: "CP" },
];

const PLANES_ACCION_INICIALES: PlanAccion[] = [
  { id: "pa-1-1", ejeId: "eje-1", objectiveId: "obj-1-1", politicaId: "pol-1-1", metaId: "meta-1-1", estrategiaId: "est-1-1", code: "PA-GF-001", name: "Reestructuración Comité Financiero", description: "Reorganizar el comité financiero con autonomía para modificación de tasas", startDate: "2026-01-01", endDate: "2026-12-31", status: "pending", progress: 0, budget: 5000000, indicator: "Número de reuniones del comité financiero", indicatorType: "CUANTITATIVO", baseline: "0 reuniones", targetValue: "12 reuniones/año", measurementPeriod: "CP", teamId: "eq-6", actividades: [] },
  { id: "pa-1-2", ejeId: "eje-1", objectiveId: "obj-1-1", politicaId: "pol-1-1", metaId: "meta-1-1", estrategiaId: "est-1-1", code: "PA-GF-002", name: "Sistema Dinámico de Tasas", description: "Implementar sistema para modificación automática de tasas de interés", startDate: "2026-06-01", endDate: "2027-06-30", status: "pending", progress: 0, budget: 15000000, indicator: "Sistema de tasas implementado", indicatorType: "CUANTITATIVO", baseline: "Sin sistema", targetValue: "100% implementado", measurementPeriod: "CP", teamId: "eq-6", actividades: [] },
  { id: "pa-1-3", ejeId: "eje-1", objectiveId: "obj-1-1", politicaId: "pol-1-2", metaId: "meta-1-2", code: "PA-GF-003", name: "Plan Financiero Anual", description: "Desarrollar plan financiero acorde a normatividad vigente", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 20, budget: 10000000, indicator: "Planes financieros aprobados", indicatorType: "CUANTITATIVO", baseline: "0 planes", targetValue: "1 plan/año", measurementPeriod: "CP", teamId: "eq-6", actividades: [] },
  { id: "pa-1-4", ejeId: "eje-1", objectiveId: "obj-1-2", politicaId: "pol-1-3", metaId: "meta-1-3", estrategiaId: "est-1-4", code: "PA-GF-004", name: "Línea de Crédito Verde", description: "Diseñar y lanzar línea de crédito para productos de ahorro de energía", startDate: "2026-03-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 20000000, indicator: "Líneas de crédito verde activas", indicatorType: "CUANTITATIVO", baseline: "0 líneas", targetValue: "1 línea activa", measurementPeriod: "MP", teamId: "eq-8", actividades: [] },
  { id: "pa-1-5", ejeId: "eje-1", objectiveId: "obj-1-2", politicaId: "pol-1-3", metaId: "meta-1-4", estrategiaId: "est-1-6", code: "PA-GF-005", name: "Fábrica de Créditos", description: "Implementar fábrica de créditos en todas las líneas", startDate: "2027-01-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 50000000, indicator: "Porcentaje de líneas automatizadas", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "LP", teamId: "eq-8", actividades: [] },
  { id: "pa-2-1", ejeId: "eje-2", objectiveId: "obj-2-1", politicaId: "pol-2-1", metaId: "meta-2-1", estrategiaId: "est-2-1", code: "PA-APF-001", name: "Capacitación Plataformas Digitales", description: "Capacitar a asociados en manejo de plataformas digitales de la cooperativa", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 10, budget: 30000000, indicator: "Porcentaje de asociados capacitados", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "25%", measurementPeriod: "LP", teamId: "eq-3", actividades: [] },
  { id: "pa-2-2", ejeId: "eje-2", objectiveId: "obj-2-1", politicaId: "pol-2-2", metaId: "meta-2-2", estrategiaId: "est-2-2", code: "PA-APF-002", name: "Plataforma de Educación", description: "Desarrollar plataforma tecnológica para educación solidaria", startDate: "2026-06-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 40000000, indicator: "Plataforma educativa operativa", indicatorType: "CUANTITATIVO", baseline: "Sin plataforma", targetValue: "1 plataforma", measurementPeriod: "MP", teamId: "eq-7", actividades: [] },
  { id: "pa-2-3", ejeId: "eje-2", objectiveId: "obj-2-1", politicaId: "pol-2-2", metaId: "meta-2-3", code: "PA-APF-003", name: "App Coacremat", description: "Desarrollar APP como mecanismo de información para la base social", startDate: "2027-01-01", endDate: "2028-12-31", status: "pending", progress: 0, budget: 60000000, indicator: "APP lanzada y funcional", indicatorType: "CUANTITATIVO", baseline: "Sin APP", targetValue: "1 APP activa", measurementPeriod: "MP", teamId: "eq-7", actividades: [] },
  { id: "pa-2-4", ejeId: "eje-2", objectiveId: "obj-2-2", politicaId: "pol-2-4", metaId: "meta-2-4", estrategiaId: "est-2-4", code: "PA-APF-004", name: "Plan de Fidelización", description: "Diseñar e implementar plan de fidelización para la base social", startDate: "2026-06-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 25000000, indicator: "Índice de fidelización", indicatorType: "CUANTITATIVO", baseline: "Sin índice", targetValue: "80%", measurementPeriod: "MP", teamId: "eq-12", actividades: [] },
  { id: "pa-2-5", ejeId: "eje-2", objectiveId: "obj-2-3", politicaId: "pol-2-4", metaId: "meta-2-5", estrategiaId: "est-2-5", code: "PA-APF-005", name: "Nuevas Líneas de Crédito", description: "Ampliar portafolio con nuevas líneas de crédito", startDate: "2027-01-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 35000000, indicator: "Número de nuevas líneas de crédito", indicatorType: "CUANTITATIVO", baseline: "Portafolio actual", targetValue: "3 nuevas líneas", measurementPeriod: "LP", teamId: "eq-8", actividades: [] },
  { id: "pa-3-1", ejeId: "eje-3", objectiveId: "obj-3-1", politicaId: "pol-3-1", metaId: "meta-3-1", estrategiaId: "est-3-1", code: "PA-GES-001", name: "Sistema de Control Interno", description: "Implementar sistema de control interno eficiente y eficaz", startDate: "2026-01-01", endDate: "2027-12-31", status: "in_progress", progress: 15, budget: 20000000, indicator: "Porcentaje de implementación", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "MP", teamId: "eq-10", actividades: [] },
  { id: "pa-3-2", ejeId: "eje-3", objectiveId: "obj-3-1", politicaId: "pol-3-1", metaId: "meta-3-2", estrategiaId: "est-3-2", code: "PA-GES-002", name: "Asociación Mutual Coacremat", description: "Constituir Asociación Mutual como brazo de innovación y bienestar", startDate: "2026-06-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 80000000, indicator: "Asociación Mutual constituida", indicatorType: "CUANTITATIVO", baseline: "No constituida", targetValue: "1 Asociación", measurementPeriod: "MP", teamId: "eq-1", actividades: [] },
  { id: "pa-3-3", ejeId: "eje-3", objectiveId: "obj-3-2", politicaId: "pol-3-2", metaId: "meta-3-3", estrategiaId: "est-3-4", code: "PA-GES-003", name: "Certificación Código de Ética", description: "Certificar a 100% de integrantes de comités en Código de Ética", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 5, budget: 15000000, indicator: "Porcentaje de certificación", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "LP", teamId: "eq-5", actividades: [] },
  { id: "pa-3-4", ejeId: "eje-3", objectiveId: "obj-3-2", politicaId: "pol-3-2", metaId: "meta-3-4", estrategiaId: "est-3-6", code: "PA-GES-004", name: "Escuela de Liderazgo", description: "Crear escuela de liderazgo para fidelizar asociados jóvenes", startDate: "2026-06-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 45000000, indicator: "Tasa de retención asociados <35 años", indicatorType: "CUANTITATIVO", baseline: "Tasa actual", targetValue: "80%", measurementPeriod: "LP", teamId: "eq-3", actividades: [] },
  { id: "pa-3-5", ejeId: "eje-3", objectiveId: "obj-3-3", politicaId: "pol-3-3", metaId: "meta-3-5", estrategiaId: "est-3-7", code: "PA-GES-005", name: "Departamento de Educación", description: "Crear departamento de educación para programas de formación integral", startDate: "2026-01-01", endDate: "2027-06-30", status: "pending", progress: 0, budget: 30000000, indicator: "Departamento de Educación creado", indicatorType: "CUANTITATIVO", baseline: "Sin departamento", targetValue: "1 Departamento", measurementPeriod: "MP", teamId: "eq-1", actividades: [] },
  { id: "pa-4-1", ejeId: "eje-4", objectiveId: "obj-4-1", politicaId: "pol-4-1", metaId: "meta-4-1", estrategiaId: "est-4-1", code: "PA-TH-001", name: "Plan de Capacitaciones", description: "Formular plan de capacitaciones para grupos de interés", startDate: "2026-01-01", endDate: "2027-12-31", status: "in_progress", progress: 25, budget: 40000000, indicator: "Plan de capacitaciones aprobado", indicatorType: "CUANTITATIVO", baseline: "Sin plan formal", targetValue: "1 plan aprobado", measurementPeriod: "CP", teamId: "eq-9", actividades: [] },
  { id: "pa-4-2", ejeId: "eje-4", objectiveId: "obj-4-2", politicaId: "pol-4-2", metaId: "meta-4-2", estrategiaId: "est-4-3", code: "PA-TH-002", name: "Modelo de Evaluación de Desempeño", description: "Establecer y aplicar modelo de evaluación de desempeño", startDate: "2026-06-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 15000000, indicator: "Porcentaje de funcionarios evaluados", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "MP", teamId: "eq-9", actividades: [] },
  { id: "pa-4-3", ejeId: "eje-4", objectiveId: "obj-4-3", politicaId: "pol-4-2", metaId: "meta-4-3", estrategiaId: "est-4-4", code: "PA-TH-003", name: "Implementación SARO", description: "Implementar sistema SARO para gestión de riesgos operativos", startDate: "2026-01-01", endDate: "2027-12-31", status: "in_progress", progress: 30, budget: 25000000, indicator: "Porcentaje de implementación SARO", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "MP", teamId: "eq-10", actividades: [] },
  { id: "pa-4-4", ejeId: "eje-4", objectiveId: "obj-4-3", politicaId: "pol-4-2", metaId: "meta-4-4", code: "PA-TH-004", name: "Manual de Procesos", description: "Desarrollar manual de procesos y procedimientos", startDate: "2027-01-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 20000000, indicator: "Porcentaje del manual implementado", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "LP", teamId: "eq-9", actividades: [] },
  { id: "pa-4-5", ejeId: "eje-4", objectiveId: "obj-4-4", politicaId: "pol-4-3", metaId: "meta-4-5", code: "PA-TH-005", name: "SG-SST", description: "Mantener cumplimiento de estándares mínimos del SG-SST", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 60, budget: 30000000, indicator: "Cumplimiento estándares SG-SST", indicatorType: "CUANTITATIVO", baseline: "0%", targetValue: "100%", measurementPeriod: "CP", teamId: "eq-9", actividades: [] },
  { id: "pa-5-1", ejeId: "eje-5", objectiveId: "obj-5-1", politicaId: "pol-5-1", metaId: "meta-5-1", estrategiaId: "est-5-1", code: "PA-IFT-001", name: "Optimización Canales de Pago", description: "Optimizar canales de pago y evaluar nuevas tecnologías", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 20, budget: 50000000, indicator: "Reducción de costos operativos", indicatorType: "CUANTITATIVO", baseline: "Costo actual", targetValue: "30% reducción", measurementPeriod: "LP", teamId: "eq-7", actividades: [] },
  { id: "pa-5-2", ejeId: "eje-5", objectiveId: "obj-5-2", politicaId: "pol-5-2", metaId: "meta-5-2", estrategiaId: "est-5-2", code: "PA-IFT-002", name: "Coacremat Digital Segura", description: "Programa de madurez digital y seguridad informática", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 15, budget: 35000000, indicator: "Índice de Madurez Digital", indicatorType: "CUANTITATIVO", baseline: "Sin índice", targetValue: "80 puntos", measurementPeriod: "LP", teamId: "eq-7", actividades: [] },
  { id: "pa-5-3", ejeId: "eje-5", objectiveId: "obj-5-3", politicaId: "pol-5-1", metaId: "meta-5-3", estrategiaId: "est-5-3", code: "PA-IFT-003", name: "I+D en Servicios", description: "Desarrollar estrategia de I+D para nuevos servicios financieros", startDate: "2026-06-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 70000000, indicator: "Número de nuevos servicios I+D", indicatorType: "CUANTITATIVO", baseline: "0 servicios", targetValue: "3 servicios", measurementPeriod: "LP", teamId: "eq-7", actividades: [] },
  { id: "pa-5-4", ejeId: "eje-5", objectiveId: "obj-5-3", politicaId: "pol-5-3", metaId: "meta-5-4", estrategiaId: "est-5-4", code: "PA-IFT-004", name: "Autenticación Biométrica", description: "Implementar sistemas de autenticación biométrica en canales de pago", startDate: "2028-01-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 45000000, indicator: "% disponibilidad de canales", indicatorType: "CUANTITATIVO", baseline: "Disponibilidad actual", targetValue: "99%", measurementPeriod: "LP", teamId: "eq-7", actividades: [] },
  { id: "pa-6-1", ejeId: "eje-6", objectiveId: "obj-6-1", politicaId: "pol-6-1", metaId: "meta-6-1", estrategiaId: "est-6-1", code: "PA-GA-001", name: "Convenios Ambientales", description: "Establecer convenios comerciales para protección del ambiente", startDate: "2026-01-01", endDate: "2027-12-31", status: "pending", progress: 0, budget: 10000000, indicator: "Número de convenios ambientales", indicatorType: "CUANTITATIVO", baseline: "0 convenios", targetValue: "2 convenios", measurementPeriod: "MP", teamId: "eq-12", actividades: [] },
  { id: "pa-6-2", ejeId: "eje-6", objectiveId: "obj-6-1", politicaId: "pol-6-2", metaId: "meta-6-2", estrategiaId: "est-6-4", code: "PA-GA-002", name: "Reducción de Papel", description: "Implementar programa de reducción de papel y uso de biodegradables", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 10, budget: 15000000, indicator: "% reducción de papel", indicatorType: "CUANTITATIVO", baseline: "100% uso actual", targetValue: "10% reducción anual", measurementPeriod: "CP", teamId: "eq-9", actividades: [] },
  { id: "pa-6-3", ejeId: "eje-6", objectiveId: "obj-6-2", politicaId: "pol-6-3", metaId: "meta-6-3", estrategiaId: "est-6-2", code: "PA-GA-003", name: "Líneas de Crédito Ambientales", description: "Crear líneas de crédito para protección del ambiente", startDate: "2027-01-01", endDate: "2030-12-31", status: "pending", progress: 0, budget: 40000000, indicator: "Número de líneas de crédito ambientales", indicatorType: "CUANTITATIVO", baseline: "0 líneas", targetValue: "2 líneas", measurementPeriod: "LP", teamId: "eq-8", actividades: [] },
  { id: "pa-6-4", ejeId: "eje-6", objectiveId: "obj-6-3", politicaId: "pol-6-4", metaId: "meta-6-4", estrategiaId: "est-6-4", code: "PA-GA-004", name: "Campañas Ambientales", description: "Diseñar campañas de concienciación ambiental por agencia", startDate: "2026-01-01", endDate: "2030-12-31", status: "in_progress", progress: 20, budget: 12000000, indicator: "Número de campañas ambientales", indicatorType: "CUANTITATIVO", baseline: "0 campañas", targetValue: "1 campaña/año", measurementPeriod: "CP", teamId: "eq-3", actividades: [] },
];

const EQUIPOS_INICIALES: Equipo[] = [
  { id: "eq-1", name: "Consejo de Administración", area: "Dirección" },
  { id: "eq-2", name: "Junta de Vigilancia", area: "Control" },
  { id: "eq-3", name: "Comité de Educación", area: "Educación" },
  { id: "eq-4", name: "Comité de Recreación, Cultura, Turismo y Deporte", area: "Bienestar" },
  { id: "eq-5", name: "Comité de Ética y Buen Gobierno", area: "Gobernanza" },
  { id: "eq-6", name: "Departamento Financiero", area: "Finanzas" },
  { id: "eq-7", name: "Departamento de Sistemas", area: "Tecnología" },
  { id: "eq-8", name: "Departamento de Crédito y Cartera", area: "Crédito" },
  { id: "eq-9", name: "Departamento Administrativo y RRHH", area: "Administración" },
  { id: "eq-10", name: "Departamento de Riesgos", area: "Riesgos" },
  { id: "eq-11", name: "Departamento Jurídico", area: "Legal" },
  { id: "eq-12", name: "Departamento Comercial", area: "Comercial" },
];

const EMPLEADOS_INICIALES: Empleado[] = [
  { id: "emp-1", name: "Carlos Andrés Muñoz", position: "Gerente General", teamId: "eq-1", email: "cmunoz@coacremat.com", phone: "3001234567" },
  { id: "emp-2", name: "María Fernanda López", position: "Presidente Consejo", teamId: "eq-1", email: "mlopez@coacremat.com", phone: "3002345678" },
  { id: "emp-3", name: "José Ricardo Herrera", position: "Director Financiero", teamId: "eq-6", email: "jherrera@coacremat.com", phone: "3003456789" },
  { id: "emp-4", name: "Ana Milena Sánchez", position: "Contadora General", teamId: "eq-6", email: "asanchez@coacremat.com", phone: "3004567890" },
  { id: "emp-5", name: "Luis Fernando Paz", position: "Director de Sistemas", teamId: "eq-7", email: "lpaz@coacremat.com", phone: "3005678901" },
  { id: "emp-6", name: "Diana Carolina Torres", position: "Analista de Desarrollo", teamId: "eq-7", email: "dtorres@coacremat.com", phone: "3006789012" },
  { id: "emp-7", name: "Pedro Pablo Rojas", position: "Director de Crédito", teamId: "eq-8", email: "projas@coacremat.com", phone: "3007890123" },
  { id: "emp-8", name: "Laura Valentina Díaz", position: "Analista de Crédito", teamId: "eq-8", email: "ldiaz@coacremat.com", phone: "3008901234" },
  { id: "emp-9", name: "Sandra Milena Gómez", position: "Directora de RRHH", teamId: "eq-9", email: "sgomez@coacremat.com", phone: "3009012345" },
  { id: "emp-10", name: "Andrés Felipe Cruz", position: "Analista de RRHH", teamId: "eq-9", email: "acruz@coacremat.com", phone: "3010123456" },
  { id: "emp-11", name: "Roberto Carlos Vargas", position: "Oficial de Cumplimiento", teamId: "eq-10", email: "rvargas@coacremat.com", phone: "3011234567" },
  { id: "emp-12", name: "Patricia Alexandra Mora", position: "Directora Jurídica", teamId: "eq-11", email: "pmora@coacremat.com", phone: "3012345678" },
  { id: "emp-13", name: "Juan Sebastián Medina", position: "Director Comercial", teamId: "eq-12", email: "jmedina@coacremat.com", phone: "3013456789" },
  { id: "emp-14", name: "Catalina Rodríguez", position: "Coordinadora Educación", teamId: "eq-3", email: "crodriguez@coacremat.com", phone: "3014567890" },
  { id: "emp-15", name: "Fernando José Ramírez", position: "Presidente Junta Vigilancia", teamId: "eq-2", email: "framirez@coacremat.com", phone: "3015678901" },
];

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
const generateId = () => Math.random().toString(36).substring(2, 11);

// Obtener prefijo del eje según su ID
const getEjePrefix = (ejeId: string): string => {
  const prefixes: { [key: string]: string } = {
    'eje-1': 'GF',   // Gestión Financiera
    'eje-2': 'APF',  // Asociados Pilar Fundamental
    'eje-3': 'GES',  // Gestión y Desarrollo Empresarial Solidario
    'eje-4': 'TH',   // Aprendizaje y Crecimiento del Talento Humano
    'eje-5': 'IFT',  // Infraestructura Física y Tecnológica
    'eje-6': 'GA',   // Gestión Ambiental y Desarrollo Sostenible
  };
  return prefixes[ejeId] || 'GEN';
};

// Extraer número del código existente
const extractCodeNumber = (code: string): number => {
  const match = code.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

// Generar código consecutivo para políticas por eje
const generatePoliticaCode = (ejeId: string, politicas: Politica[]): string => {
  const prefix = getEjePrefix(ejeId);
  const politicasDelEje = politicas.filter(p => p.ejeId === ejeId);

  // Encontrar el número más alto de las políticas existentes
  const maxNum = politicasDelEje.length > 0
    ? Math.max(...politicasDelEje.map(p => extractCodeNumber(p.code)))
    : 0;

  return `P-${prefix}-${String(maxNum + 1).padStart(2, '0')}`;
};

// Generar código consecutivo para objetivos por eje
const generateObjetivoCode = (ejeId: string, objetivos: Objetivo[]): string => {
  const prefix = getEjePrefix(ejeId);
  const objetivosDelEje = objetivos.filter(o => o.ejeId === ejeId);

  const maxNum = objetivosDelEje.length > 0
    ? Math.max(...objetivosDelEje.map(o => extractCodeNumber(o.code)))
    : 0;

  return `OE-${prefix}-${String(maxNum + 1).padStart(2, '0')}`;
};

// Generar código consecutivo para estrategias por eje
const generateEstrategiaCode = (ejeId: string, estrategias: Estrategia[]): string => {
  const prefix = getEjePrefix(ejeId);
  const estrategiasDelEje = estrategias.filter(e => e.ejeId === ejeId);

  const maxNum = estrategiasDelEje.length > 0
    ? Math.max(...estrategiasDelEje.map(e => extractCodeNumber(e.code)))
    : 0;

  return `E-${prefix}-${String(maxNum + 1).padStart(2, '0')}`;
};

// Generar código consecutivo para metas
const generateMetaCode = (): string => {
  return `META-${Date.now().toString().slice(-4)}`;
};

// Generar código consecutivo para planes de acción
const generatePlanCode = (planesAccion: PlanAccion[]): string => {
  const maxNum = planesAccion.length > 0
    ? Math.max(...planesAccion.map(p => extractCodeNumber(p.code)))
    : 0;

  return `PA-${String(maxNum + 1).padStart(3, '0')}`;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "#10b981",
    completed: "#3b82f6",
    at_risk: "#ef4444",
    delayed: "#f59e0b",
    pending: "#6b7280",
    in_progress: "#8b5cf6",
  };
  return colors[status] || "#6b7280";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Activo",
    completed: "Completado",
    at_risk: "En Riesgo",
    delayed: "Retrasado",
    pending: "Pendiente",
    in_progress: "En Progreso",
  };
  return labels[status] || status;
};

const getTrafficLight = (progress: number) => {
  if (progress >= 80) return { color: "#10b981", label: "Verde", icon: CheckCircle2 };
  if (progress >= 50) return { color: "#f59e0b", label: "Amarillo", icon: Minus };
  return { color: "#ef4444", label: "Rojo", icon: AlertTriangle };
};

const getStrategyTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    growth: "Crecimiento",
    control: "Control",
    efficiency: "Eficiencia",
    innovation: "Innovación",
  };
  return labels[type] || type;
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function StrategicPlanSystem() {
  const { theme, setTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedEjeId, setSelectedEjeId] = useState<string>("");

  // Data state via LocalStorage Hook (Local Persistence)
  const { data: ejes, setData: setEjes, saveItem: saveEje, removeItem: removeEje } = useLocalStorage('ejes', EJES_INICIALES);
  const { data: objetivos, setData: setObjetivos, saveItem: saveObjetivo, removeItem: removeObjetivo } = useLocalStorage('objetivos', OBJETIVOS_INICIALES);
  const { data: politicas, setData: setPoliticas, saveItem: savePolitica, removeItem: removePolitica } = useLocalStorage('politicas', POLITICAS_INICIALES);
  const { data: metas, setData: setMetas, saveItem: saveMeta, removeItem: removeMeta } = useLocalStorage('metas', METAS_INICIALES);
  const { data: estrategias, setData: setEstrategias, saveItem: saveEstrategia, removeItem: removeEstrategia } = useLocalStorage('estrategias', ESTRATEGIAS_INICIALES);
  const { data: planesAccion, setData: setPlanesAccion, saveItem: savePlan, removeItem: removePlan } = useLocalStorage('planesAccion', PLANES_ACCION_INICIALES);
  const { data: equipos, setData: setEquipos, saveItem: saveEquipo, removeItem: removeEquipo } = useLocalStorage('equipos', EQUIPOS_INICIALES);
  const { data: empleados, setData: setEmpleados, saveItem: saveEmpleado, removeItem: removeEmpleado } = useLocalStorage('empleados', EMPLEADOS_INICIALES);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>("");
  const [addingType, setAddingType] = useState<string>("");

  // Expanded team state for showing employees
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [reportFilter, setReportFilter] = useState<{
    tipo: 'corporativo' | 'personal';
    ejeId: string;
    objetivoId: string;
    politicaId: string;
    metaId: string;
    estrategiaId: string;
    estado: string;
    equipoId: string;
    empleadoId: string;
  }>({
    tipo: 'corporativo',
    ejeId: '',
    objetivoId: '',
    politicaId: '',
    metaId: '',
    estrategiaId: '',
    estado: '',
    equipoId: '',
    empleadoId: ''
  });

  // Form state
  const [form, setForm] = useState<any>({});

  // Local filter state for Planes de Accion view
  const [planFilterTeamId, setPlanFilterTeamId] = useState<string>('');
  const [planFilterStatus, setPlanFilterStatus] = useState<string>('');
  // Plan Info state
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    organizationName: "COACREMAT",
    planPeriod: "2026 - 2030",
    planModel: "Economía Solidaria",
    planStatus: "active",
    generalResponsible: "Consejo de Administración",
    startDate: "2026-01-01",
    endDate: "2030-12-31",
  });

  // Cyclic animation state for Dashboard cards
  const [activeMagneticIndex, setActiveMagneticIndex] = useState(0);

  useEffect(() => {
    if (activeView === "dashboard") {
      const interval = setInterval(() => {
        setActiveMagneticIndex((prev) => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeView]);

  // Mounted state for theme
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);



  // Calculate progress by eje
  const calculateEjeProgress = (ejeId: string) => {
    const ejeObjetivos = objetivos.filter(o => o.ejeId === ejeId);
    if (ejeObjetivos.length === 0) return 0;

    const totalProgress = ejeObjetivos.reduce((sum, obj) => {
      const objPlans = planesAccion.filter(pa => pa.objectiveId === obj.id);
      if (objPlans.length === 0) return sum;
      const avgProgress = objPlans.reduce((s, pa) => s + pa.progress, 0) / objPlans.length;
      return sum + avgProgress;
    }, 0);

    return Math.round(totalProgress / ejeObjetivos.length);
  };

  const overallProgress = () => {
    if (ejes.length === 0) return 0;
    const totalProgress = ejes.reduce((sum, eje) => sum + calculateEjeProgress(eje.id), 0);
    return Math.round(totalProgress / ejes.length);
  };

  // ==========================================
  // FUNCIONES DE CÁLCULO JERÁRQUICO DE AVANCE
  // ==========================================

  // Obtener año actual
  const getCurrentYear = (): number => {
    return selectedYear;
  };

  // Obtener años del plan estratégico
  const getPlanYears = (): number[] => {
    const startYear = parseInt(planInfo.startDate?.split('-')[0] || '2026');
    const endYear = parseInt(planInfo.endDate?.split('-')[0] || '2030');
    const years: number[] = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  };

  // Calcular progreso esperado basado en tiempo transcurrido
  const calculateExpectedProgress = (): number => {
    const startYear = parseInt(planInfo.startDate?.split('-')[0] || '2026');
    const endYear = parseInt(planInfo.endDate?.split('-')[0] || '2030');
    const currentYear = getCurrentYear();
    const currentMonth = new Date().getMonth() + 1;

    // Si estamos antes del inicio del plan
    if (currentYear < startYear) return 0;
    // Si estamos después del fin del plan
    if (currentYear > endYear) return 100;

    // Calcular progreso esperado
    const totalYears = endYear - startYear + 1;
    const yearsCompleted = currentYear - startYear;
    const monthProgress = currentMonth / 12;

    const expectedProgress = ((yearsCompleted + monthProgress) / totalYears) * 100;
    return Math.min(100, Math.round(expectedProgress));
  };

  // Calcular avance de una estrategia personal basado en sus actividades
  const calculateEstrategiaPersonalProgress = (estrategiaP: any): number => {
    const actividades = estrategiaP.actividades || [];
    if (actividades.length === 0) return 0;
    const totalAvance = actividades.reduce((sum: number, act: any) => sum + (act.avance || 0), 0);
    return Math.round(totalAvance / actividades.length);
  };

  // Calcular avance de actividades para un año específico
  const calculateEstrategiaPersonalProgressByYear = (estrategiaP: any, year: number): number => {
    const actividades = estrategiaP.actividades || [];
    if (actividades.length === 0) return 0;

    const actividadesDelYear = actividades.filter((act: any) => {
      if (!act.fechaInicio || !act.fechaFin) return false;
      const startYear = parseInt(act.fechaInicio.split('-')[0]);
      const endYear = parseInt(act.fechaFin.split('-')[0]);
      return year >= startYear && year <= endYear;
    });

    if (actividadesDelYear.length === 0) return 0;

    const totalAvance = actividadesDelYear.reduce((sum: number, act: any) => sum + (act.avance || 0), 0);
    return Math.round(totalAvance / actividadesDelYear.length);
  };

  // Calcular avance de un plan basado en sus estrategias personales (ahora usa el año actual)
  const calculatePlanProgress = (estrategiasPersonales: any[]): number => {
    return calculateCurrentYearProgress(estrategiasPersonales);
  };

  // Calcular avance del año fiscal actual
  const calculateCurrentYearProgress = (estrategiasPersonales: any[]): number => {
    if (!estrategiasPersonales || estrategiasPersonales.length === 0) return 0;
    const currentYear = getCurrentYear();
    const totalProgress = estrategiasPersonales.reduce((sum: number, ep: any) => {
      return sum + calculateEstrategiaPersonalProgressByYear(ep, currentYear);
    }, 0);
    return Math.round(totalProgress / estrategiasPersonales.length);
  };

  // Determinar estado del avance (En tiempo, Retrasado, Adelantado)
  const getProgressStatus = (realProgress: number, expectedProgress: number): {
    status: 'on-time' | 'delayed' | 'ahead' | 'not-started';
    label: string;
    color: string;
    icon: any;
  } => {
    const diff = realProgress - expectedProgress;

    if (realProgress === 0 && expectedProgress === 0) {
      return { status: 'not-started', label: 'No iniciado', color: 'text-gray-500', icon: Clock };
    }
    if (diff >= 5) {
      return { status: 'ahead', label: 'Adelantado', color: 'text-emerald-500', icon: TrendingUp };
    }
    if (diff <= -10) {
      return { status: 'delayed', label: 'Retrasado', color: 'text-red-500', icon: TrendingDown };
    }
    return { status: 'on-time', label: 'En tiempo', color: 'text-blue-500', icon: CheckCircle2 };
  };

  // Calcular avance de una meta basado en los planes asociados
  const calculateMetaProgress = (metaId: string, planes: any[]): number => {
    const metaPlanes = planes.filter(p => p.metaId === metaId);
    if (metaPlanes.length === 0) return 0;
    const totalProgress = metaPlanes.reduce((sum, p) => sum + (p.progress || 0), 0);
    return Math.round(totalProgress / metaPlanes.length);
  };

  // Calcular avance de un objetivo basado en los planes asociados
  const calculateObjetivoProgress = (objetivoId: string, planes: any[]): number => {
    const objPlanes = planes.filter(p => p.objectiveId === objetivoId);
    if (objPlanes.length === 0) return 0;
    const totalProgress = objPlanes.reduce((sum, p) => sum + (p.progress || 0), 0);
    return Math.round(totalProgress / objPlanes.length);
  };

  // Calcular avance de un eje basado en los objetivos
  const calculateEjeProgressFromObjetivos = (ejeId: string, objs: any[], planes: any[]): number => {
    const ejeObjetivos = objs.filter(o => o.ejeId === ejeId);
    if (ejeObjetivos.length === 0) return 0;
    const totalProgress = ejeObjetivos.reduce((sum, obj) => {
      return sum + calculateObjetivoProgress(obj.id, planes);
    }, 0);
    return Math.round(totalProgress / ejeObjetivos.length);
  };

  // Recalcular y actualizar todos los niveles jerárquicos
  const recalculateAllProgress = (updatedPlanes: any[], updatedMetas: any[], updatedObjetivos: any[]) => {
    // Actualizar progreso de metas
    const newMetas = updatedMetas.map(meta => {
      const metaProgress = calculateMetaProgress(meta.id, updatedPlanes);
      return { ...meta, progress: metaProgress };
    });

    // El progreso de objetivos se calcula desde los planes
    const newObjetivos = updatedObjetivos.map(obj => {
      const objProgress = calculateObjetivoProgress(obj.id, updatedPlanes);
      return { ...obj, progress: objProgress };
    });

    return { newMetas, newObjetivos };
  };

  // Recalcular avances al cambiar el año seleccionado
  useEffect(() => {
    const updatedPlanes = planesAccion.map(plan => {
      const p = calculatePlanProgress(plan.estrategiasPersonales || []);
      return { ...plan, progress: p };
    });

    let changed = false;
    for (let i = 0; i < updatedPlanes.length; i++) {
      if (updatedPlanes[i].progress !== planesAccion[i].progress) {
        changed = true;
        break;
      }
    }

    if (changed) {
      setPlanesAccion(updatedPlanes);
      const { newMetas, newObjetivos } = recalculateAllProgress(updatedPlanes, metas, objetivos);
      setMetas(newMetas);
      setObjetivos(newObjetivos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  // Open edit modal
  const openEditModal = (type: string, item: any) => {
    setEditingType(type);
    setEditingItem(item);
    setForm({ ...item });
    setEditModalOpen(true);
  };

  // Open add modal
  const openAddModal = (type: string, ejeId?: string) => {
    setAddingType(type);
    setEditingType(type);
    setEditingItem(null);

    // Set default values based on type
    const defaults: any = {};
    if (ejeId) defaults.ejeId = ejeId;
    if (type === 'objetivo') {
      defaults.weight = 0;
      defaults.status = 'active';
    }
    if (type === 'politica') {
      defaults.status = 'active';
    }
    if (type === 'meta') {
      defaults.targetValue = 0;
      defaults.currentValue = 0;
      defaults.progress = 0;
    }
    if (type === 'estrategia') {
      defaults.type = 'growth';
      defaults.status = 'active';
      defaults.indicator = '';
      defaults.baseline = '';
      defaults.measurementPeriod = 'CP';
    }
    if (type === 'plan') {
      defaults.progress = 0;
      defaults.status = 'pending';
      defaults.indicatorType = 'CUANTITATIVO';
      defaults.indicator = '';
      defaults.estrategiasPersonales = [];
    }
    if (type === 'eje') {
      defaults.weight = 15;
      defaults.color = '#3b82f6';
    }
    if (type === 'equipo') {
      defaults.area = '';
    }
    if (type === 'empleado') {
      defaults.position = '';
      defaults.email = '';
      defaults.phone = '';
      defaults.teamId = '';
    }

    setForm(defaults);
    setAddModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    switch (editingType) {
      case 'eje':
        await saveEje({ ...ejes.find(e => e.id === editingItem.id), ...form } as any);
        break;
      case 'objetivo':
        await saveObjetivo({ ...objetivos.find(o => o.id === editingItem.id), ...form } as any);
        break;
      case 'politica':
        await savePolitica({ ...politicas.find(p => p.id === editingItem.id), ...form } as any);
        break;
      case 'meta':
        await saveMeta({ ...metas.find(m => m.id === editingItem.id), ...form } as any);
        break;
      case 'estrategia':
        await saveEstrategia({ ...estrategias.find(e => e.id === editingItem.id), ...form } as any);
        break;
      case 'plan':
        const calculatedProgress = calculatePlanProgress(form.estrategiasPersonales || []);
        const updatedPlan = { ...planesAccion.find(p => p.id === editingItem.id), ...form, progress: calculatedProgress };
        await savePlan(updatedPlan as any);
        break;
      case 'equipo':
        await saveEquipo({ ...equipos.find(e => e.id === editingItem.id), ...form } as any);
        break;
      case 'empleado':
        await saveEmpleado({ ...empleados.find(e => e.id === editingItem.id), ...form } as any);
        break;
      case 'planInfo':
        setPlanInfo({ ...planInfo, ...form }); // planInfo still local
        break;
    }

    setEditModalOpen(false);
    setEditingItem(null);
    setForm({});
    toast({ title: "Actualizado", description: "El registro ha sido actualizado exitosamente." });
  };

  // Save new
  const handleSaveNew = async () => {
    const id = generateId();

    switch (addingType) {
      case 'eje':
        const newEje: Eje = {
          id,
          name: form.name,
          color: form.color || '#3b82f6',
          icon: "DollarSign",
          weight: form.weight || 15,
          description: form.description || '',
        };
        await saveEje(newEje as any);
        break;
      case 'objetivo':
        const newObjetivo: Objetivo = {
          id,
          ejeId: form.ejeId,
          code: generateObjetivoCode(form.ejeId, objetivos),
          description: form.description,
          weight: form.weight || 0,
          status: form.status || 'active',
          targetDate: form.targetDate,
          responsible: form.responsible,
        };
        await saveObjetivo(newObjetivo as any);
        break;
      case 'politica':
        const newPolitica: Politica = {
          id,
          ejeId: form.ejeId,
          code: generatePoliticaCode(form.ejeId, politicas),
          description: form.description,
          status: form.status || 'active',
        };
        await savePolitica(newPolitica as any);
        break;
      case 'meta':
        const newMeta: Meta = {
          id,
          ejeId: form.ejeId,
          objetivoId: form.objetivoId,
          description: form.description,
          targetYear: form.targetYear,
          unit: form.unit,
          targetValue: form.targetValue,
          currentValue: form.currentValue || 0,
          progress: form.progress || 0,
        };
        await saveMeta(newMeta as any);
        break;
      case 'estrategia':
        const newEstrategia: Estrategia = {
          id,
          ejeId: form.ejeId,
          code: generateEstrategiaCode(form.ejeId, estrategias),
          description: form.description,
          type: form.type || 'growth',
          status: form.status || 'active',
        };
        await saveEstrategia(newEstrategia as any);
        break;
      case 'plan':
        const planProgress = calculatePlanProgress(form.estrategiasPersonales || []);
        const newPlan: PlanAccion = {
          id,
          ejeId: form.ejeId,
          objectiveId: form.objectiveId,
          politicaId: form.politicaId,
          metaId: form.metaId,
          code: generatePlanCode(planesAccion),
          name: form.personalGoal?.substring(0, 50) || 'Nuevo Plan de Acción',
          description: form.description || '',
          personalGoal: form.personalGoal,
          indicator: form.indicator,
          indicatorType: form.indicatorType || 'CUANTITATIVO',
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status || 'pending',
          progress: planProgress,
          teamId: form.teamId,
          estrategiasPersonales: form.estrategiasPersonales || [],
        };
        await savePlan(newPlan as any);
        break;
      case 'equipo':
        const newEquipo: Equipo = {
          id,
          name: form.name,
          area: form.area,
          description: form.description,
        };
        await saveEquipo(newEquipo as any);
        break;
      case 'empleado':
        const newEmpleado: Empleado = {
          id,
          name: form.name,
          position: form.position,
          email: form.email,
          phone: form.phone,
          teamId: form.teamId,
        };
        await saveEmpleado(newEmpleado as any);
        break;
    }

    setAddModalOpen(false);
    setForm({});
    toast({ title: "Creado", description: "El registro ha sido creado exitosamente." });
  };

  // Delete item
  const handleDelete = async (type: string, id: string) => {
    switch (type) {
      case 'eje':
        await removeEje(id);
        break;
      case 'objetivo':
        await removeObjetivo(id);
        break;
      case 'politica':
        await removePolitica(id);
        break;
      case 'meta':
        await removeMeta(id);
        break;
      case 'estrategia':
        await removeEstrategia(id);
        break;
      case 'plan':
        await removePlan(id);
        break;
      case 'equipo':
        await removeEquipo(id);
        break;
      case 'empleado':
        await removeEmpleado(id);
        break;
    }
    toast({ title: "Eliminado", description: "El registro ha sido eliminado." });
  };

  // Chart data
  const ejeChartData = ejes.map(eje => ({
    name: eje.name.split(' ')[0],
    value: calculateEjeProgress(eje.id),
    color: eje.color,
    weight: eje.weight,
  }));

  // Sidebar navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, colorClass: "icon-cyan" },
    { id: "reportes", label: "Reportes Inteligentes", icon: BarChart3, colorClass: "icon-violet" },
    { id: "ejes", label: "Ejes Estratégicos", icon: Layers, colorClass: "icon-emerald" },
    { id: "objetivos", label: "Objetivos", icon: Target, colorClass: "icon-magenta" },
    { id: "politicas", label: "Políticas", icon: FileText, colorClass: "icon-blue" },
    { id: "metas", label: "Metas", icon: Target, colorClass: "icon-gold" },
    { id: "estrategias", label: "Estrategias", icon: Zap, colorClass: "icon-violet" },
    { id: "planes", label: "Planes de Acción", icon: Briefcase, colorClass: "icon-cyan" },
    { id: "equipos", label: "Equipos", icon: Users, colorClass: "icon-emerald" },
    { id: "empleados", label: "Empleados", icon: UsersRound, colorClass: "icon-magenta" },
    { id: "configuracion", label: "Configuración", icon: Settings, colorClass: "icon-blue" },
  ];

  // Animation variants For staggered entrance
  const dashboardContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 3,
        delayChildren: 0.2
      }
    }
  };

  const dashboardItem = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const yearSelectorPlugin = (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-sm px-4 py-2 hidden sm:flex">
        <Calendar className="w-4 h-4 mr-2" />
        Vigencia: {planInfo.planPeriod}
      </Badge>
      <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Año Fiscal" />
        </SelectTrigger>
        <SelectContent>
          {getPlanYears().map(year => (
            <SelectItem key={year} value={year.toString()}>Año Fiscal {year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex" suppressHydrationWarning>
        {/* Desktop Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="hidden lg:flex flex-col bg-card border-r border-border fixed left-0 top-0 h-full z-40"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm animate-premium-logo">{planInfo.organizationName}</span>
                    <p className="text-xs text-muted-foreground">Plan {planInfo.planPeriod}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>

          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${activeView === item.id
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                        }`}
                      whileHover={{ scale: 1.05, x: 4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-125 group-hover:rotate-6 ${item.colorClass} ${activeView === item.id ? 'animate-neon' : ''}`} />
                      <AnimatePresence mode="wait">
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {sidebarOpen && (
                <span className="text-sm text-muted-foreground font-medium">
                  {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                </span>
              )}
            </Button>
          </div>
        </motion.aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-30 flex items-center justify-between px-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex items-center gap-2 p-4 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold animate-premium-logo">{planInfo.organizationName}</span>
                  <p className="text-xs text-muted-foreground">Plan Estratégico {planInfo.planPeriod}</p>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground"
                      }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.colorClass}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}

                {/* Logout removed */}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="text-center">
            <h1 className="font-bold text-sm animate-premium-logo">{planInfo.organizationName}</h1>
            <p className="text-xs text-muted-foreground">Plan Estratégico {planInfo.planPeriod}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"} pt-16 lg:pt-0 transition-all duration-300`}>
          <div className="p-4 lg:p-6 min-h-screen">
            <AnimatePresence mode="wait">

              {/* Dashboard View */}
              {activeView === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-cyan animate-banner">Dashboard Ejecutivo</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">
                        Plan Estratégico {planInfo.organizationName} {planInfo.planPeriod} - {planInfo.planModel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {yearSelectorPlugin}
                    </div>
                  </div>

                  <motion.div
                    variants={dashboardContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <motion.div variants={dashboardItem}>
                      <Card className={`relative overflow-hidden glass-card hover-shine h-full ${activeMagneticIndex === 0 ? 'animate-magnetic' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Avance General
                            <Activity className={`w-4 h-4 icon-cyan ${activeMagneticIndex === 0 ? 'animate-neon' : ''}`} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{overallProgress()}%</div>
                          <Progress value={overallProgress()} className="mt-2" />
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={dashboardItem}>
                      <Card className={`relative overflow-hidden glass-card hover-shine h-full ${activeMagneticIndex === 1 ? 'animate-magnetic' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Ejes Estratégicos
                            <Layers className={`w-4 h-4 icon-emerald ${activeMagneticIndex === 1 ? 'animate-neon' : ''}`} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{ejes.length}</div>
                          <p className="text-sm text-muted-foreground mt-2">configurados</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={dashboardItem}>
                      <Card className={`relative overflow-hidden glass-card hover-shine h-full ${activeMagneticIndex === 2 ? 'animate-magnetic' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magenta-400 to-purple-600"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Objetivos
                            <Target className={`w-4 h-4 icon-magenta ${activeMagneticIndex === 2 ? 'animate-neon' : ''}`} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{objetivos.length}</div>
                          <p className="text-sm text-muted-foreground mt-2">estratégicos</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={dashboardItem}>
                      <Card className={`relative overflow-hidden glass-card hover-shine h-full ${activeMagneticIndex === 3 ? 'animate-magnetic' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Planes de Acción
                            <Briefcase className={`w-4 h-4 icon-blue ${activeMagneticIndex === 3 ? 'animate-neon' : ''}`} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{planesAccion.length}</div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {planesAccion.filter(pa => pa.status === "in_progress").length} en progreso
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChartIcon className="w-5 h-5" />
                          Avance por Eje
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ejeChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {ejeChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Progreso por Eje
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ejeChartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                              <XAxis type="number" domain={[0, 100]} className="text-xs" />
                              <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                              <RechartsTooltip />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {ejeChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Ejes Estratégicos</CardTitle>
                        <Button size="sm" onClick={() => openAddModal('eje')}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Nuevo Eje
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ejes.map((eje) => {
                          const progress = calculateEjeProgress(eje.id);
                          const trafficLight = getTrafficLight(progress);
                          const TrafficIcon = trafficLight.icon;
                          const ejeObjetivos = objetivos.filter(o => o.ejeId === eje.id);

                          return (
                            <Card
                              key={eje.id}
                              className="relative overflow-hidden border-l-4 hover:shadow-lg transition-shadow"
                              style={{ borderLeftColor: eje.color }}
                            >
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon name={eje.icon} className="w-5 h-5" style={{ color: eje.color }} />
                                    <h4 className="font-semibold text-sm">{eje.name}</h4>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('eje', eje)}>
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('eje', eje.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {ejeObjetivos.length} objetivos • Peso: {eje.weight}%
                                </p>
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Avance</span>
                                    <span className="font-medium">{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Ejes View */}
              {activeView === "ejes" && (
                <motion.div key="ejes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-emerald animate-banner">Ejes Estratégicos</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Los 6 ejes fundamentales de desarrollo y crecimiento solidario</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('eje')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nuevo Eje
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ejes.map((eje) => {
                      const progress = calculateEjeProgress(eje.id);
                      const ejeObjetivos = objetivos.filter(o => o.ejeId === eje.id);
                      const ejePoliticas = politicas.filter(p => p.ejeId === eje.id);
                      const ejeMetas = metas.filter(m => m.ejeId === eje.id);
                      const ejeEstrategias = estrategias.filter(e => e.ejeId === eje.id);

                      return (
                        <Card key={eje.id} className="overflow-hidden">
                          <div className="h-2" style={{ backgroundColor: eje.color }} />
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${eje.color}20` }}>
                                  <Icon name={eje.icon} className="w-6 h-6" style={{ color: eje.color }} />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{eje.name}</CardTitle>
                                  <CardDescription>Peso: {eje.weight}%</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditModal('eje', eje)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete('eje', eje.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{eje.description}</p>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                              <div className="text-center p-2 rounded-lg bg-muted">
                                <p className="text-lg font-bold">{ejeObjetivos.length}</p>
                                <p className="text-xs text-muted-foreground">Objetivos</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-muted">
                                <p className="text-lg font-bold">{ejePoliticas.length}</p>
                                <p className="text-xs text-muted-foreground">Políticas</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-muted">
                                <p className="text-lg font-bold">{ejeMetas.length}</p>
                                <p className="text-xs text-muted-foreground">Metas</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-muted">
                                <p className="text-lg font-bold">{ejeEstrategias.length}</p>
                                <p className="text-xs text-muted-foreground">Estrategias</p>
                              </div>
                            </div>
                            <div className="mb-4">
                              {/* Avance Dual - Ejes */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-amber-500" />
                                    <span className="text-xs">AAF {getCurrentYear()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Progress value={progress} className="w-12 h-1.5" />
                                    <span className="text-xs font-medium">{progress}%</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs">APE</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Progress value={progress} className="w-12 h-1.5" />
                                    <span className="text-xs font-medium">{progress}%</span>
                                  </div>
                                </div>
                                {(() => {
                                  const status = getProgressStatus(progress, calculateExpectedProgress());
                                  const StatusIcon = status.icon;
                                  return (
                                    <div className="flex items-center justify-center gap-1 pt-1 border-t">
                                      <Icon name={status.icon} className={`w-3 h-3 ${status.color}`} />
                                      <span className={`text-xs ${status.color}`}>{status.label}</span>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => openAddModal('objetivo', eje.id)}>
                                <Plus className="w-3 h-3 mr-1" /> Objetivo
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => openAddModal('politica', eje.id)}>
                                <Plus className="w-3 h-3 mr-1" /> Política
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => openAddModal('meta', eje.id)}>
                                <Plus className="w-3 h-3 mr-1" /> Meta
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Objetivos View */}
              {activeView === "objetivos" && (
                <motion.div key="objetivos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-purple animate-banner">Objetivos Estratégicos</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Objetivos por cada eje estratégico</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('objetivo')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nuevo Objetivo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ejes.map((eje) => {
                      const ejeObjetivos = objetivos.filter(o => o.ejeId === eje.id);
                      if (ejeObjetivos.length === 0) return null;

                      // Calcular avance promedio del eje
                      const ejeAvgProgress = ejeObjetivos.length > 0
                        ? Math.round(ejeObjetivos.reduce((sum, obj) => {
                          const objPlanes = planesAccion.filter(pa => pa.objectiveId === obj.id);
                          const objProgress = objPlanes.length > 0
                            ? Math.round(objPlanes.reduce((s, pa) => s + pa.progress, 0) / objPlanes.length)
                            : 0;
                          return sum + objProgress;
                        }, 0) / ejeObjetivos.length)
                        : 0;
                      const ejeStatus = getProgressStatus(ejeAvgProgress, calculateExpectedProgress());
                      const EjeStatusIcon = ejeStatus.icon;
                      const trafficLight = getTrafficLight(ejeAvgProgress);
                      const TrafficIcon = trafficLight.icon;

                      return (
                        <Card key={eje.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="h-2" style={{ backgroundColor: eje.color }} />
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${eje.color}20` }}
                                >
                                  <Icon name={eje.icon} className="w-5 h-5" style={{ color: eje.color }} />
                                </div>
                                <div>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {eje.name}
                                  </CardTitle>
                                  <p className="text-xs text-muted-foreground">{ejeObjetivos.length} objetivos</p>
                                </div>
                              </div>
                              {/* Avance Dual Mini - Eje */}
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-amber-500" />
                                  <Progress value={ejeAvgProgress} className="w-12 h-1.5" />
                                  <span className="text-xs font-medium">{ejeAvgProgress}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3 text-emerald-500" />
                                  <Progress value={ejeAvgProgress} className="w-12 h-1.5" />
                                  <span className="text-xs font-medium">{ejeAvgProgress}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Icon name={ejeStatus.icon} className={`w-3 h-3 ${ejeStatus.color}`} />
                                  <span className={`text-[10px] ${ejeStatus.color}`}>{ejeStatus.label}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {ejeObjetivos.map((obj, objIndex) => {
                                const objPlanes = planesAccion.filter(pa => pa.objectiveId === obj.id);
                                const avgProgress = objPlanes.length > 0 ? Math.round(objPlanes.reduce((s, pa) => s + pa.progress, 0) / objPlanes.length) : 0;
                                const objStatus = getProgressStatus(avgProgress, calculateExpectedProgress());
                                const ObjStatusIcon = objStatus.icon;
                                const objTrafficLight = getTrafficLight(avgProgress);
                                const ObjTrafficIcon = objTrafficLight.icon;

                                return (
                                  <div key={obj.id} className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <div
                                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                                          style={{ backgroundColor: eje.color }}
                                        >
                                          {objIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1">
                                            <Badge variant="outline" className="text-[10px]">{obj.code}</Badge>
                                            <Icon name={objTrafficLight.icon} className="w-3 h-3" style={{ color: objTrafficLight.color }} />
                                          </div>
                                          <p className="text-xs truncate mt-0.5">{obj.description}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-0.5">
                                              <Calendar className="w-2.5 h-2.5 text-amber-500" />
                                              <Progress value={avgProgress} className="w-8 h-1" />
                                              <span className="text-[9px]">{avgProgress}%</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                              <Target className="w-2.5 h-2.5 text-emerald-500" />
                                              <Progress value={avgProgress} className="w-8 h-1" />
                                              <span className="text-[9px]">{avgProgress}%</span>
                                            </div>
                                            <span className="text-[9px] text-muted-foreground">{objPlanes.length} planes</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-0.5 flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditModal('objetivo', obj)}>
                                          <Edit2 className="w-2.5 h-2.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete('objetivo', obj.id)}>
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Mensaje si no hay objetivos */}
                  {ejes.every(eje => objetivos.filter(o => o.ejeId === eje.id).length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay objetivos registrados</p>
                      <p className="text-sm">Haga clic en "Nuevo Objetivo" para comenzar</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Políticas View */}
              {activeView === "politicas" && (
                <motion.div key="politicas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-cyan animate-banner">Políticas Institucionales</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Políticas por cada eje estratégico</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('politica')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nueva Política
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ejes.map((eje) => {
                      const ejePoliticas = politicas.filter(p => p.ejeId === eje.id);
                      if (ejePoliticas.length === 0) return null;

                      return (
                        <Card key={eje.id} className="overflow-hidden">
                          <div className="h-1" style={{ backgroundColor: eje.color }} />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Icon name={eje.icon} className="w-4 h-4" style={{ color: eje.color }} />
                              {eje.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {ejePoliticas.map((pol) => (
                                <div key={pol.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                  <div className="flex items-center gap-2 flex-1">
                                    <Badge variant="outline" className="text-xs">{pol.code}</Badge>
                                    <span className="text-sm">{pol.description}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('politica', pol)}>
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('politica', pol.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Metas View */}
              {activeView === "metas" && (
                <motion.div key="metas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-emerald animate-banner">Metas Corporativas</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Metas agrupadas por Eje Estratégico</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('meta')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nueva Meta
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[650px]">
                    <div className="space-y-4">
                      {ejes.map((eje, ejeIndex) => {
                        // Filtrar metas que pertenecen a este eje (por ejeId directo o a través de objetivos)
                        const metasDelEje = metas.filter(meta => {
                          // Primero verificar si la meta tiene ejeId directo
                          if (meta.ejeId === eje.id) return true;
                          // Si no, buscar a través del objetivo
                          const objetivo = objetivos.find(o => o.id === meta.objetivoId);
                          return objetivo && objetivo.ejeId === eje.id;
                        });

                        if (metasDelEje.length === 0) return null;

                        return (
                          <Card key={eje.id} className="overflow-hidden">
                            {/* Header del Eje con color */}
                            <div
                              className="px-4 py-3 flex items-center gap-3"
                              style={{ backgroundColor: `${eje.color}15` }}
                            >
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: eje.color }}
                              >
                                <Icon name={eje.icon} className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold" style={{ color: eje.color }}>
                                    {eje.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs" style={{ borderColor: eje.color, color: eje.color }}>
                                    {metasDelEje.length} {metasDelEje.length === 1 ? 'meta' : 'metas'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{eje.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium" style={{ color: eje.color }}>
                                  Eje {ejeIndex + 1}
                                </span>
                              </div>
                            </div>

                            {/* Barra de color superior */}
                            <div className="h-1" style={{ backgroundColor: eje.color }} />

                            {/* Lista de Metas del Eje */}
                            <CardContent className="p-0">
                              <div className="divide-y divide-border">
                                {metasDelEje.map((meta, metaIndex) => {
                                  const objetivo = objetivos.find(o => o.id === meta.objetivoId);
                                  const metaProgress = meta.progress || 0;
                                  const metaStatus = getProgressStatus(metaProgress, calculateExpectedProgress());
                                  const MetaStatusIcon = metaStatus.icon;

                                  return (
                                    <div
                                      key={meta.id}
                                      className="p-4 hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-start gap-4">
                                        {/* Indicador de orden */}
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                          style={{ backgroundColor: eje.color }}
                                        >
                                          {metaIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium">{meta.description}</p>
                                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <Badge variant="outline" className="text-xs">
                                              {objetivo?.code || 'N/A'}
                                            </Badge>
                                            <span>Año: {meta.targetYear}</span>
                                            <span>Meta: {meta.targetValue} {meta.unit}</span>
                                            <span>Actual: {meta.currentValue}</span>
                                          </div>

                                          {/* Avance Dual Mini - Metas */}
                                          <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="w-3 h-3 text-amber-500" />
                                              <span className="text-[10px] text-muted-foreground">AAF</span>
                                              <Progress value={metaProgress} className="w-10 h-1" />
                                              <span className="text-[10px] font-medium">{metaProgress}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Target className="w-3 h-3 text-emerald-500" />
                                              <span className="text-[10px] text-muted-foreground">APE</span>
                                              <Progress value={metaProgress} className="w-10 h-1" />
                                              <span className="text-[10px] font-medium">{metaProgress}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Icon name={metaStatus.icon} className={`w-3 h-3 ${metaStatus.color}`} />
                                              <span className={`text-[10px] ${metaStatus.color}`}>{metaStatus.label}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('meta', meta)}>
                                            <Edit2 className="w-3 h-3" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('meta', meta.id)}>
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {/* Mensaje si no hay metas */}
                      {ejes.every(eje => {
                        const metasDelEje = metas.filter(meta => {
                          const objetivo = objetivos.find(o => o.id === meta.objetivoId);
                          return objetivo && objetivo.ejeId === eje.id;
                        });
                        return metasDelEje.length === 0;
                      }) && (
                          <div className="text-center py-12 text-muted-foreground">
                            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No hay metas registradas</p>
                            <p className="text-sm">Haga clic en "Nueva Meta" para comenzar</p>
                          </div>
                        )}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}

              {/* Estrategias View */}
              {activeView === "estrategias" && (
                <motion.div key="estrategias" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-purple animate-banner">Estrategias</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Estrategias por cada eje estratégico</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('estrategia')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nueva Estrategia
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ejes.map((eje) => {
                      const ejeEstrategias = estrategias.filter(e => e.ejeId === eje.id);
                      if (ejeEstrategias.length === 0) return null;

                      return (
                        <Card key={eje.id} className="overflow-hidden">
                          <div className="h-1" style={{ backgroundColor: eje.color }} />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Icon name={eje.icon} className="w-4 h-4" style={{ color: eje.color }} />
                              {eje.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {ejeEstrategias.map((est) => (
                                <div key={est.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                  <div className="flex items-center gap-2 flex-1">
                                    <Badge variant="outline" className="text-xs">{est.code}</Badge>
                                    <span className="text-sm">{est.description}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">{getStrategyTypeLabel(est.type)}</Badge>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('estrategia', est)}>
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('estrategia', est.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Planes de Acción View */}
              {activeView === "planes" && (
                <motion.div key="planes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-cyan animate-banner">Planes de Acción</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Gestione y actualice los planes de acción</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('plan')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nuevo Plan
                      </Button>
                    </div>
                  </div>

                  {/* Filtros Inteligentes para Planes */}
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Filter className="w-4 h-4" /> Filtros:
                      </div>
                      <Select value={planFilterTeamId || ''} onValueChange={(val) => setPlanFilterTeamId(val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Equipo Responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los Equipos</SelectItem>
                          {equipos.map(eq => (
                            <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={planFilterStatus || ''} onValueChange={(val) => setPlanFilterStatus(val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Estado del Plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los Estados</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="in_progress">En Progreso</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="at_risk">En Riesgo</SelectItem>
                          <SelectItem value="delayed">Retrasado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>

                      {(planFilterTeamId || planFilterStatus) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-muted-foreground"
                          onClick={() => { setPlanFilterTeamId(''); setPlanFilterStatus(''); }}
                        >
                          <X className="w-3 h-3 mr-1" /> Limpiar
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planesAccion.filter(plan => {
                      if (planFilterTeamId && plan.teamId !== planFilterTeamId) return false;
                      if (planFilterStatus && plan.status !== planFilterStatus) return false;
                      return true;
                    }).map((plan) => {
                      const objetivo = objetivos.find(o => o.id === plan.objectiveId);
                      const eje = objetivo ? ejes.find(e => e.id === objetivo.ejeId) : null;
                      const planTeam = equipos.find(eq => eq.id === plan.teamId);
                      const trafficLight = getTrafficLight(plan.progress);
                      const TrafficIcon = trafficLight.icon;

                      return (
                        <Card key={plan.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: eje?.color || "#888" }} />
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">{plan.code}</Badge>
                              <div className="flex items-center gap-1">
                                <Badge style={{ backgroundColor: getStatusColor(plan.status), color: "white" }} className="text-xs">
                                  {getStatusLabel(plan.status)}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('plan', plan)}>
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('plan', plan.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <CardTitle className="text-base mt-2">{plan.name}</CardTitle>
                            <CardDescription className="text-xs">{eje?.name}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                            </div>
                            {plan.budget && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <DollarSign className="w-3 h-3" />
                                ${plan.budget.toLocaleString()}
                              </div>
                            )}
                            {planTeam && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <UsersRound className="w-3 h-3" />
                                {planTeam.name}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Avance</span>
                                <div className="flex items-center gap-1">
                                  <TrafficIcon className="w-3 h-3" style={{ color: trafficLight.color }} />
                                  <span className="font-medium">{plan.progress}%</span>
                                </div>
                              </div>
                              <Progress value={plan.progress} className="h-2" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Equipos View */}
              {activeView === "equipos" && (
                <motion.div key="equipos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-emerald animate-banner">Equipos de Trabajo</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Estructura organizacional de la cooperativa</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('equipo')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nuevo Equipo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equipos.map((equipo) => {
                      const equipoEmpleados = empleados.filter(e => e.teamId === equipo.id);
                      const isExpanded = expandedTeamId === equipo.id;

                      const equipoPlanes = planesAccion.filter(p => p.teamId === equipo.id);
                      const equipoAverageProgress = equipoPlanes.length > 0
                        ? Math.round(equipoPlanes.reduce((sum, p) => sum + p.progress, 0) / equipoPlanes.length)
                        : 0;

                      return (
                        <Card key={equipo.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <UsersRound className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm truncate">{equipo.name}</h4>
                                    <p className="text-xs text-muted-foreground">{equipo.area}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('equipo', equipo)}>
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('equipo', equipo.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                {equipo.description && (
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{equipo.description}</p>
                                )}

                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-muted-foreground font-medium">Avance Promedio de Actividades</span>
                                    <span className="font-bold text-primary">{equipoAverageProgress}%</span>
                                  </div>
                                  <Progress value={equipoAverageProgress} className="h-1.5" />
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                    <Users className="w-3 h-3" />
                                    {equipoEmpleados.length} {equipoEmpleados.length === 1 ? 'empleado' : 'empleados'}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setExpandedTeamId(isExpanded ? null : equipo.id)}
                                  >
                                    {isExpanded ? 'Ocultar' : 'Ver miembros'}
                                    <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </Button>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-3 pt-3 border-t space-y-2">
                                        {equipoEmpleados.length > 0 ? (
                                          equipoEmpleados.map((empleado) => (
                                            <div key={empleado.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                              <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                                  {empleado.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs truncate">{empleado.name}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{empleado.position}</p>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEditModal('empleado', empleado)}>
                                                  <Edit2 className="w-2.5 h-2.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => handleDelete('empleado', empleado.id)}>
                                                  <Trash2 className="w-2.5 h-2.5" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center py-3">
                                            <UsersRound className="w-6 h-6 mx-auto text-muted-foreground/50 mb-1" />
                                            <p className="text-xs text-muted-foreground">Sin empleados</p>
                                            <Button variant="outline" size="sm" className="mt-2 h-6 text-[10px]" onClick={() => openAddModal('empleado')}>
                                              <PlusCircle className="w-2.5 h-2.5 mr-1" />
                                              Agregar
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {equipos.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <UsersRound className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No hay equipos registrados</p>
                        <Button variant="outline" className="mt-4" onClick={() => openAddModal('equipo')}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Crear primer equipo
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Empleados View */}
              {activeView === "empleados" && (
                <motion.div key="empleados" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold title-gradient-purple animate-banner">Empleados</h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Listado de colaboradores de la organización</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button onClick={() => openAddModal('empleado')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nuevo Empleado
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {empleados.map((empleado) => (
                      <Card key={empleado.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {empleado.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-sm truncate">{empleado.name}</h4>
                                  <p className="text-xs text-muted-foreground">{empleado.position}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal('empleado', empleado)}>
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete('empleado', empleado.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              {(empleado.email || empleado.phone) && (
                                <div className="mt-2 space-y-1">
                                  {empleado.email && (
                                    <p className="text-xs text-muted-foreground truncate">{empleado.email}</p>
                                  )}
                                  {empleado.phone && (
                                    <p className="text-xs text-muted-foreground">{empleado.phone}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {empleados.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <UsersRound className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No hay empleados registrados</p>
                        <Button variant="outline" className="mt-4" onClick={() => openAddModal('empleado')}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Agregar primer empleado
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {/* Reportes Inteligentes View */}
              {activeView === "reportes" && (
                <motion.div key="reportes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2 title-gradient-cyan animate-banner">
                        <BarChart3 className="w-7 h-7 text-primary" />
                        Reportes Inteligentes
                      </h1>
                      <p className="text-muted-foreground mt-1 animate-banner-delayed">Análisis de avance con filtros corporativos y personales</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {yearSelectorPlugin}
                      <Button variant="outline" onClick={() => {
                        // Reset all filters
                        setSelectedEjeId("");
                        setReportFilter({ tipo: 'corporativo', ejeId: '', objetivoId: '', politicaId: '', metaId: '', estrategiaId: '', estado: '', equipoId: '', empleadoId: '' });
                      }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Limpiar Filtros
                      </Button>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  {/* Filtros */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtros de Análisis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="corporativo" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                          <TabsTrigger value="corporativo" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Corporativo
                          </TabsTrigger>
                          <TabsTrigger value="personal" className="flex items-center gap-2">
                            <UsersRound className="w-4 h-4" />
                            Personal
                          </TabsTrigger>
                        </TabsList>

                        {/* Filtros Corporativos */}
                        <TabsContent value="corporativo" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Eje Estratégico</Label>
                              <Select value={reportFilter.ejeId || ''} onValueChange={(value) => {
                                setReportFilter({ ...reportFilter, ejeId: value === 'all' ? '' : value, objetivoId: '', politicaId: '', metaId: '', estrategiaId: '' });
                              }}>
                                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los ejes</SelectItem>
                                  {ejes.map((eje) => (
                                    <SelectItem key={eje.id} value={eje.id}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: eje.color }} />
                                        {eje.name.substring(0, 15)}...
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Objetivo</Label>
                              <Select value={reportFilter.objetivoId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, objetivoId: value === 'all' ? '' : value })} disabled={!reportFilter.ejeId}>
                                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los objetivos</SelectItem>
                                  {objetivos.filter(o => !reportFilter.ejeId || o.ejeId === reportFilter.ejeId).map((obj) => (
                                    <SelectItem key={obj.id} value={obj.id}>{obj.code}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Política</Label>
                              <Select value={reportFilter.politicaId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, politicaId: value === 'all' ? '' : value })} disabled={!reportFilter.ejeId}>
                                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todas las políticas</SelectItem>
                                  {politicas.filter(p => !reportFilter.ejeId || p.ejeId === reportFilter.ejeId).map((pol) => (
                                    <SelectItem key={pol.id} value={pol.id}>{pol.code}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Meta</Label>
                              <Select value={reportFilter.metaId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, metaId: value === 'all' ? '' : value })} disabled={!reportFilter.objetivoId}>
                                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todas las metas</SelectItem>
                                  {metas.filter(m => !reportFilter.objetivoId || m.objetivoId === reportFilter.objetivoId).map((meta) => (
                                    <SelectItem key={meta.id} value={meta.id}>{meta.description.substring(0, 20)}...</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Estrategia</Label>
                              <Select value={reportFilter.estrategiaId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, estrategiaId: value === 'all' ? '' : value })} disabled={!reportFilter.ejeId}>
                                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todas las estrategias</SelectItem>
                                  {estrategias.filter(e => !reportFilter.ejeId || e.ejeId === reportFilter.ejeId).map((est) => (
                                    <SelectItem key={est.id} value={est.id}>{est.code}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Estado</Label>
                              <Select value={reportFilter.estado || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, estado: value === 'all' ? '' : value })}>
                                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los estados</SelectItem>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="in_progress">En Progreso</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                  <SelectItem value="at_risk">En Riesgo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Filtros Personales */}
                        <TabsContent value="personal" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Equipo de Trabajo</Label>
                              <Select value={reportFilter.equipoId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, equipoId: value === 'all' ? '' : value, empleadoId: '' })}>
                                <SelectTrigger><SelectValue placeholder="Todos los equipos" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los equipos</SelectItem>
                                  {equipos.map((eq) => (
                                    <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Empleado / Responsable</Label>
                              <Select value={reportFilter.empleadoId || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, empleadoId: value === 'all' ? '' : value })}>
                                <SelectTrigger><SelectValue placeholder="Todos los empleados" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los empleados</SelectItem>
                                  {empleados.filter(e => !reportFilter.equipoId || e.teamId === reportFilter.equipoId).map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Estado</Label>
                              <Select value={reportFilter.estado || ''} onValueChange={(value) => setReportFilter({ ...reportFilter, estado: value === 'all' ? '' : value })}>
                                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos los estados</SelectItem>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="in_progress">En Progreso</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                  <SelectItem value="at_risk">En Riesgo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* KPIs Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      // Filtrar planes según los filtros seleccionados
                      const filteredPlanes = planesAccion.filter(plan => {
                        if (reportFilter.ejeId && plan.ejeId !== reportFilter.ejeId) return false;
                        if (reportFilter.objetivoId && plan.objectiveId !== reportFilter.objetivoId) return false;
                        if (reportFilter.politicaId && plan.politicaId !== reportFilter.politicaId) return false;
                        if (reportFilter.metaId && plan.metaId !== reportFilter.metaId) return false;
                        if (reportFilter.estrategiaId && plan.estrategiaId !== reportFilter.estrategiaId) return false;
                        if (reportFilter.estado && plan.status !== reportFilter.estado) return false;
                        if (reportFilter.equipoId && plan.teamId !== reportFilter.equipoId) return false;
                        return true;
                      });

                      const totalPlanes = filteredPlanes.length;
                      const avgProgress = totalPlanes > 0 ? Math.round(filteredPlanes.reduce((s, p) => s + p.progress, 0) / totalPlanes) : 0;
                      const completedPlans = filteredPlanes.filter(p => p.status === 'completed').length;
                      const totalBudget = filteredPlanes.reduce((s, p) => s + (p.budget || 0), 0);

                      return (
                        <>
                          <Card className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Planes Filtrados</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{totalPlanes}</div>
                              <p className="text-xs text-muted-foreground mt-1">de {planesAccion.length} totales</p>
                            </CardContent>
                          </Card>

                          <Card className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Avance Promedio</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{avgProgress}%</div>
                              <Progress value={avgProgress} className="mt-2 h-2" />
                            </CardContent>
                          </Card>

                          <Card className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Completados</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{completedPlans}</div>
                              <p className="text-xs text-muted-foreground mt-1">{totalPlanes > 0 ? Math.round(completedPlans / totalPlanes * 100) : 0}% del total</p>
                            </CardContent>
                          </Card>

                          <Card className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Presupuesto Total</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">${(totalBudget / 1000000).toFixed(1)}M</div>
                              <p className="text-xs text-muted-foreground mt-1">COP</p>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de Avance por Eje */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <PieChartIcon className="w-4 h-4" />
                          Avance por Eje Estratégico
                        </CardTitle>
                        <CardDescription>Distribución del progreso por eje</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ejes.map(eje => {
                              const ejePlanes = planesAccion.filter(p => p.ejeId === eje.id);
                              const progress = ejePlanes.length > 0 ? Math.round(ejePlanes.reduce((s, p) => s + p.progress, 0) / ejePlanes.length) : 0;
                              return {
                                name: eje.name.split(' ')[0].substring(0, 8),
                                avance: progress,
                                planes: ejePlanes.length,
                                color: eje.color
                              };
                            })} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="name" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
                              <RechartsTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                                        <p className="text-sm font-medium">{payload[0].payload.name}</p>
                                        <p className="text-xs text-muted-foreground">Avance: {payload[0].value}%</p>
                                        <p className="text-xs text-muted-foreground">Planes: {payload[0].payload.planes}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar dataKey="avance" radius={[4, 4, 0, 0]}>
                                {ejes.map((eje, index) => (
                                  <Cell key={`cell-${index}`} fill={eje.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico de Estado de Planes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Estado de Planes de Acción
                        </CardTitle>
                        <CardDescription>Distribución por estado actual</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Pendientes', value: planesAccion.filter(p => p.status === 'pending').length, color: '#f59e0b' },
                                  { name: 'En Progreso', value: planesAccion.filter(p => p.status === 'in_progress').length, color: '#3b82f6' },
                                  { name: 'Completados', value: planesAccion.filter(p => p.status === 'completed').length, color: '#10b981' },
                                  { name: 'En Riesgo', value: planesAccion.filter(p => p.status === 'at_risk').length, color: '#ef4444' },
                                ].filter(d => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {[
                                  { color: '#f59e0b' },
                                  { color: '#3b82f6' },
                                  { color: '#10b981' },
                                  { color: '#ef4444' }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                              />
                              <RechartsTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                                        <p className="text-sm font-medium">{payload[0].name}</p>
                                        <p className="text-xs text-muted-foreground">{payload[0].value} planes</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabla de Detalle de Planes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileBarChart className="w-4 h-4" />
                        Detalle de Planes de Acción
                      </CardTitle>
                      <CardDescription>Listado filtrado de planes con indicadores de avance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <div className="divide-y divide-border">
                          {(() => {
                            const filteredPlanes = planesAccion.filter(plan => {
                              if (reportFilter.ejeId && plan.ejeId !== reportFilter.ejeId) return false;
                              if (reportFilter.objetivoId && plan.objectiveId !== reportFilter.objetivoId) return false;
                              if (reportFilter.politicaId && plan.politicaId !== reportFilter.politicaId) return false;
                              if (reportFilter.metaId && plan.metaId !== reportFilter.metaId) return false;
                              if (reportFilter.estrategiaId && plan.estrategiaId !== reportFilter.estrategiaId) return false;
                              if (reportFilter.estado && plan.status !== reportFilter.estado) return false;
                              if (reportFilter.equipoId && plan.teamId !== reportFilter.equipoId) return false;
                              return true;
                            }).sort((a, b) => b.progress - a.progress);

                            if (filteredPlanes.length === 0) {
                              return (
                                <div className="p-8 text-center">
                                  <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                                  <p className="text-muted-foreground">No se encontraron planes con los filtros seleccionados</p>
                                </div>
                              );
                            }

                            return filteredPlanes.map((plan) => {
                              const eje = ejes.find(e => e.id === plan.ejeId);
                              const objetivo = objetivos.find(o => o.id === plan.objectiveId);
                              const equipo = equipos.find(e => e.id === plan.teamId);
                              const trafficLight = getTrafficLight(plan.progress);
                              const TrafficIcon = trafficLight.icon;

                              return (
                                <div key={plan.id} className="p-4 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-start gap-4">
                                    <div className="w-2 h-16 rounded-full shrink-0" style={{ backgroundColor: eje?.color || "#888" }} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">{plan.code}</Badge>
                                        <Badge style={{ backgroundColor: getStatusColor(plan.status), color: "white" }} className="text-xs">
                                          {getStatusLabel(plan.status)}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">{eje?.name.split(' ')[0]}</Badge>
                                      </div>
                                      <h4 className="font-medium text-sm truncate">{plan.name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        {objetivo && <span>Objetivo: {objetivo.code}</span>}
                                        {equipo && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{equipo.name}</span>}
                                        {plan.budget && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${plan.budget.toLocaleString()}</span>}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="flex items-center gap-2 justify-end mb-1">
                                        <TrafficIcon className="w-4 h-4" style={{ color: trafficLight.color }} />
                                        <span className="text-lg font-bold">{plan.progress}%</span>
                                      </div>
                                      <Progress value={plan.progress} className="w-24 h-2" />
                                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(plan.endDate).toLocaleDateString('es-CO')}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Resumen por Eje */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ejes.map((eje) => {
                      const ejePlanes = planesAccion.filter(p => p.ejeId === eje.id);
                      const avgProgress = ejePlanes.length > 0 ? Math.round(ejePlanes.reduce((s, p) => s + p.progress, 0) / ejePlanes.length) : 0;
                      const completedCount = ejePlanes.filter(p => p.status === 'completed').length;
                      const inProgressCount = ejePlanes.filter(p => p.status === 'in_progress').length;
                      const pendingCount = ejePlanes.filter(p => p.status === 'pending').length;

                      return (
                        <Card key={eje.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setReportFilter({ ...reportFilter, ejeId: eje.id })}>
                          <div className="h-1" style={{ backgroundColor: eje.color }} />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              {eje.icon === "DollarSign" && <DollarSign className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.icon === "UsersRound" && <UsersRound className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.icon === "Factory" && <Factory className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.icon === "Lightbulb" && <Lightbulb className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.icon === "Cpu" && <Cpu className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.icon === "Leaf" && <Leaf className="w-4 h-4" style={{ color: eje.color }} />}
                              {(!["DollarSign", "UsersRound", "Factory", "Lightbulb", "Cpu", "Leaf"].includes(eje.icon)) && <DollarSign className="w-4 h-4" style={{ color: eje.color }} />}
                              {eje.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold">{avgProgress}%</span>
                              <Progress value={avgProgress} className="w-20 h-2" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-1 rounded bg-muted">
                                <p className="text-sm font-bold">{pendingCount}</p>
                                <p className="text-[10px] text-muted-foreground">Pend.</p>
                              </div>
                              <div className="p-1 rounded bg-muted">
                                <p className="text-sm font-bold text-blue-500">{inProgressCount}</p>
                                <p className="text-[10px] text-muted-foreground">Progreso</p>
                              </div>
                              <div className="p-1 rounded bg-muted">
                                <p className="text-sm font-bold text-emerald-500">{completedCount}</p>
                                <p className="text-[10px] text-muted-foreground">Compl.</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center">{ejePlanes.length} planes de acción</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Configuración View */}
              {activeView === "configuracion" && (
                <motion.div key="configuracion" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold title-gradient-emerald animate-banner">Configuración</h1>
                    <p className="text-muted-foreground mt-1 animate-banner-delayed">Administración general del sistema de plan estratégico</p>
                  </div>

                  {/* Plan Info Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Información del Plan Estratégico
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => openEditModal('planInfo', planInfo)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Organización</p>
                          <p className="font-semibold text-lg">{planInfo.organizationName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Período del Plan</p>
                          <p className="font-semibold text-lg">{planInfo.planPeriod}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Modelo</p>
                          <p className="font-semibold text-lg">{planInfo.planModel}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Responsable General</p>
                          <p className="font-semibold">{planInfo.generalResponsible}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Fecha Inicio</p>
                          <p className="font-semibold">{new Date(planInfo.startDate).toLocaleDateString('es-CO')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Fecha Fin</p>
                          <p className="font-semibold">{new Date(planInfo.endDate).toLocaleDateString('es-CO')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Estado del Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{ejes.length}</p>
                          <p className="text-sm text-muted-foreground">Ejes Estratégicos</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{objetivos.length}</p>
                          <p className="text-sm text-muted-foreground">Objetivos</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{planesAccion.length}</p>
                          <p className="text-sm text-muted-foreground">Planes de Acción</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{metas.length}</p>
                          <p className="text-sm text-muted-foreground">Metas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appearance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Apariencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Tema de la Aplicación</p>
                          <p className="text-sm text-muted-foreground">Seleccione el tema visual preferido</p>
                        </div>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Oscuro</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Gestión de Datos
                      </CardTitle>
                      <CardDescription>Exporta, importa y gestiona la información del plan estratégico</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Exportar Datos */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Download className="w-4 h-4 text-primary" />
                          Exportar Datos
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                            onClick={() => {
                              const data = {
                                planInfo,
                                ejes: ejes.map(e => ({ ...e, iconName: e.icon?.name || 'DollarSign', icon: undefined })),
                                objetivos,
                                politicas,
                                metas,
                                estrategias,
                                planesAccion,
                                equipos,
                                empleados,
                                exportDate: new Date().toISOString(),
                                version: '1.0'
                              };
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `plan-estrategico-${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast({ title: "Exportado", description: "Datos exportados en formato JSON correctamente" });
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />
                            Exportar JSON
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                            onClick={() => {
                              // Crear CSV de planes de acción
                              const headers = ['Código', 'Nombre', 'Eje', 'Objetivo', 'Estado', 'Avance', 'Fecha Inicio', 'Fecha Fin', 'Presupuesto'];
                              const rows = planesAccion.map(p => {
                                const eje = ejes.find(e => e.id === p.ejeId);
                                const obj = objetivos.find(o => o.id === p.objectiveId);
                                return [
                                  p.code,
                                  p.name,
                                  eje?.name || '',
                                  obj?.code || '',
                                  p.status,
                                  p.progress + '%',
                                  p.startDate,
                                  p.endDate,
                                  p.budget || 0
                                ];
                              });
                              const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `planes-accion-${new Date().toISOString().split('T')[0]}.csv`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast({ title: "Exportado", description: "Planes de acción exportados en formato CSV" });
                            }}
                          >
                            <FileBarChart className="w-4 h-4 mr-2 text-green-500" />
                            Exportar CSV
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                            onClick={() => {
                              // Generar reporte HTML
                              const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Reporte Plan Estratégico - ${planInfo.organizationName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
    h2 { color: #14b8a6; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f0fdf4; }
    .progress { background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .progress-bar { background: linear-gradient(90deg, #10b981, #14b8a6); height: 20px; }
    .status-active { color: #10b981; }
    .status-pending { color: #f59e0b; }
    .status-completed { color: #3b82f6; }
    .kpi { display: inline-block; background: #f0fdf4; padding: 15px 25px; margin: 5px; border-radius: 8px; text-align: center; }
    .kpi-value { font-size: 28px; font-weight: bold; color: #10b981; }
    .kpi-label { font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>📊 ${planInfo.organizationName}</h1>
  <p><strong>Plan Estratégico ${planInfo.planPeriod}</strong> | Modelo: ${planInfo.planModel}</p>
  
  <div style="margin: 30px 0;">
    <div class="kpi"><div class="kpi-value">${ejes.length}</div><div class="kpi-label">Ejes</div></div>
    <div class="kpi"><div class="kpi-value">${objetivos.length}</div><div class="kpi-label">Objetivos</div></div>
    <div class="kpi"><div class="kpi-value">${planesAccion.length}</div><div class="kpi-label">Planes</div></div>
    <div class="kpi"><div class="kpi-value">${overallProgress()}%</div><div class="kpi-label">Avance</div></div>
  </div>

  <h2>📋 Planes de Acción</h2>
  <table>
    <tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Avance</th><th>Fecha Fin</th></tr>
    ${planesAccion.map(p => `
      <tr>
        <td>${p.code}</td>
        <td>${p.name}</td>
        <td class="status-${p.status}">${getStatusLabel(p.status)}</td>
        <td>
          <div class="progress"><div class="progress-bar" style="width: ${p.progress}%"></div></div>
          ${p.progress}%
        </td>
        <td>${new Date(p.endDate).toLocaleDateString('es-CO')}</td>
      </tr>
    `).join('')}
  </table>

  <h2>🎯 Ejes Estratégicos</h2>
  <table>
    <tr><th>Eje</th><th>Peso</th><th>Objetivos</th><th>Avance</th></tr>
    ${ejes.map(e => {
                                const ejeObjetivos = objetivos.filter(o => o.ejeId === e.id);
                                const ejePlanes = planesAccion.filter(p => p.ejeId === e.id);
                                const avgProgress = ejePlanes.length > 0 ? Math.round(ejePlanes.reduce((s, p) => s + p.progress, 0) / ejePlanes.length) : 0;
                                return `
        <tr>
          <td><span style="color: ${e.color}">●</span> ${e.name}</td>
          <td>${e.weight}%</td>
          <td>${ejeObjetivos.length}</td>
          <td>${avgProgress}%</td>
        </tr>
      `;
                              }).join('')}
  </table>

  <p style="margin-top: 40px; color: #666; font-size: 12px;">
    Generado el ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}
  </p>
</body>
</html>`;
                              const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `reporte-plan-estrategico-${new Date().toISOString().split('T')[0]}.html`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast({ title: "Exportado", description: "Reporte HTML generado correctamente" });
                            }}
                          >
                            <FileBarChart className="w-4 h-4 mr-2 text-purple-500" />
                            Reporte HTML
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Importar Datos */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Upload className="w-4 h-4 text-primary" />
                          Importar Datos
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="file"
                              id="import-json"
                              accept=".json"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    try {
                                      const result = event.target?.result;
                                      if (typeof result !== 'string') {
                                        toast({ title: "Error", description: "No se pudo leer el archivo", variant: "destructive" });
                                        return;
                                      }
                                      const data = JSON.parse(result);

                                      // Validar que sea un objeto válido
                                      if (typeof data !== 'object' || data === null) {
                                        toast({ title: "Error", description: "El archivo no contiene datos válidos", variant: "destructive" });
                                        return;
                                      }

                                      // Mapeo de nombres de iconos a componentes
                                      const iconMap: { [key: string]: any } = {
                                        'DollarSign': DollarSign,
                                        'UsersRound': UsersRound,
                                        'Factory': Factory,
                                        'Lightbulb': Lightbulb,
                                        'Cpu': Cpu,
                                        'Leaf': Leaf,
                                      };

                                      // Importar datos con validación y restaurar iconos
                                      if (Array.isArray(data.ejes)) {
                                        const restoredEjes = data.ejes.map((e: any) => ({
                                          ...e,
                                          icon: iconMap[e.iconName] || DollarSign
                                        }));
                                        setEjes(restoredEjes);
                                      }
                                      if (Array.isArray(data.objetivos)) setObjetivos(data.objetivos);
                                      if (Array.isArray(data.politicas)) setPoliticas(data.politicas);
                                      if (Array.isArray(data.metas)) setMetas(data.metas);
                                      if (Array.isArray(data.estrategias)) setEstrategias(data.estrategias);
                                      if (Array.isArray(data.planesAccion)) setPlanesAccion(data.planesAccion);
                                      if (Array.isArray(data.equipos)) setEquipos(data.equipos);
                                      if (Array.isArray(data.empleados)) setEmpleados(data.empleados);
                                      if (data.planInfo && typeof data.planInfo === 'object') setPlanInfo(data.planInfo);

                                      const importedItems = [
                                        data.ejes?.length || 0,
                                        data.objetivos?.length || 0,
                                        data.politicas?.length || 0,
                                        data.planesAccion?.length || 0
                                      ].filter(n => n > 0).length;

                                      toast({
                                        title: "Importado Exitosamente",
                                        description: `Se importaron datos correctamente (${importedItems} categorías)`
                                      });
                                    } catch (err) {
                                      console.error('Import error:', err);
                                      toast({
                                        title: "Error de Importación",
                                        description: `Error: ${err instanceof Error ? err.message : 'Archivo JSON inválido'}`,
                                        variant: "destructive"
                                      });
                                    }
                                  };
                                  reader.onerror = () => {
                                    toast({ title: "Error", description: "Error al leer el archivo", variant: "destructive" });
                                  };
                                  reader.readAsText(file);
                                }
                                e.target.value = '';
                              }}
                            />
                            <Button
                              variant="outline"
                              className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                              onClick={() => document.getElementById('import-json')?.click()}
                            >
                              <FileText className="w-4 h-4 mr-2 text-blue-500" />
                              Importar JSON
                            </Button>
                          </div>
                          <div>
                            <input
                              type="file"
                              id="import-csv"
                              accept=".csv"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    try {
                                      const text = event.target?.result;
                                      if (typeof text !== 'string') {
                                        toast({ title: "Error", description: "No se pudo leer el archivo CSV", variant: "destructive" });
                                        return;
                                      }
                                      const lines = text.split('\n');
                                      const headers = lines[0].split(',');
                                      // Parsear CSV y crear planes
                                      const newPlans = lines.slice(1).filter(l => l.trim()).map(line => {
                                        const values = line.split(',');
                                        return {
                                          id: `pa-import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                          code: values[0] || 'IMP',
                                          name: values[1] || 'Plan Importado',
                                          ejeId: ejes[0]?.id || '',
                                          objectiveId: objetivos[0]?.id || '',
                                          status: values[4] || 'pending',
                                          progress: parseInt(values[5]) || 0,
                                          startDate: values[6] || new Date().toISOString().split('T')[0],
                                          endDate: values[7] || '2030-12-31',
                                          budget: parseFloat(values[8]) || 0,
                                          description: ''
                                        };
                                      });
                                      setPlanesAccion([...planesAccion, ...newPlans]);
                                      toast({ title: "Importado", description: `${newPlans.length} planes importados desde CSV` });
                                    } catch (err) {
                                      toast({ title: "Error", description: "Error al procesar el archivo CSV", variant: "destructive" });
                                    }
                                  };
                                  reader.readAsText(file);
                                }
                                e.target.value = '';
                              }}
                            />
                            <Button
                              variant="outline"
                              className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                              onClick={() => document.getElementById('import-csv')?.click()}
                            >
                              <FileBarChart className="w-4 h-4 mr-2 text-green-500" />
                              Importar CSV
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ⚠️ La importación reemplazará los datos existentes. Asegúrese de crear un respaldo primero.
                        </p>
                      </div>

                      <Separator />

                      {/* Backup y Restauración */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Save className="w-4 h-4 text-primary" />
                          Respaldo y Restauración
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                            onClick={() => {
                              const backup = {
                                planInfo,
                                ejes,
                                objetivos,
                                politicas,
                                metas,
                                estrategias,
                                planesAccion,
                                equipos,
                                empleados,
                                backupDate: new Date().toISOString(),
                                version: '1.0',
                                type: 'full-backup'
                              };
                              const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `backup-completo-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              // Guardar en localStorage también
                              localStorage.setItem('planEstrategico_backup', JSON.stringify(backup));
                              toast({ title: "Respaldo Creado", description: "Se ha creado y descargado el respaldo completo" });
                            }}
                          >
                            <Save className="w-4 h-4 mr-2 text-emerald-500" />
                            Crear Respaldo
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all"
                            onClick={() => {
                              const savedBackup = localStorage.getItem('planEstrategico_backup');
                              if (savedBackup) {
                                try {
                                  const backup = JSON.parse(savedBackup);
                                  if (confirm('¿Desea restaurar el último respaldo guardado?')) {
                                    if (backup.ejes) setEjes(backup.ejes);
                                    if (backup.objetivos) setObjetivos(backup.objetivos);
                                    if (backup.politicas) setPoliticas(backup.politicas);
                                    if (backup.metas) setMetas(backup.metas);
                                    if (backup.estrategias) setEstrategias(backup.estrategias);
                                    if (backup.planesAccion) setPlanesAccion(backup.planesAccion);
                                    if (backup.equipos) setEquipos(backup.equipos);
                                    if (backup.empleados) setEmpleados(backup.empleados);
                                    if (backup.planInfo) setPlanInfo(backup.planInfo);
                                    toast({ title: "Restaurado", description: "Datos restaurados desde el respaldo local" });
                                  }
                                } catch (err) {
                                  toast({ title: "Error", description: "No se pudo restaurar el respaldo", variant: "destructive" });
                                }
                              } else {
                                toast({ title: "Sin Respaldo", description: "No hay respaldo guardado en localStorage" });
                              }
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2 text-orange-500" />
                            Restaurar Local
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              localStorage.setItem('planEstrategico_data', JSON.stringify({
                                planInfo, ejes, objetivos, politicas, metas, estrategias, planesAccion, equipos, empleados
                              }));
                              toast({ title: "Guardado", description: "Datos guardados en localStorage" });
                            }}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Guardar en Navegador
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const saved = localStorage.getItem('planEstrategico_data');
                              if (saved) {
                                const data = JSON.parse(saved);
                                if (data.planInfo) setPlanInfo(data.planInfo);
                                if (data.ejes) setEjes(data.ejes);
                                if (data.objetivos) setObjetivos(data.objetivos);
                                if (data.politicas) setPoliticas(data.politicas);
                                if (data.metas) setMetas(data.metas);
                                if (data.estrategias) setEstrategias(data.estrategias);
                                if (data.planesAccion) setPlanesAccion(data.planesAccion);
                                if (data.equipos) setEquipos(data.equipos);
                                if (data.empleados) setEmpleados(data.empleados);
                                toast({ title: "Cargado", description: "Datos cargados desde localStorage" });
                              } else {
                                toast({ title: "Sin Datos", description: "No hay datos guardados en el navegador" });
                              }
                            }}
                          >
                            <Database className="w-3 h-3 mr-1" />
                            Cargar del Navegador
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Limpiar Datos */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          Zona de Peligro
                        </h4>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm('¿Está seguro de limpiar todos los datos? Esta acción no se puede deshacer.')) {
                                setEjes([]);
                                setObjetivos([]);
                                setPoliticas([]);
                                setMetas([]);
                                setEstrategias([]);
                                setPlanesAccion([]);
                                setEquipos([]);
                                setEmpleados([]);
                                toast({ title: "Datos Limpiados", description: "Todos los datos han sido eliminados" });
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Limpiar Todo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('¿Restablecer a los datos iniciales del plan?')) {
                                setEjes(EJES_INICIALES);
                                setObjetivos(OBJETIVOS_INICIALES);
                                setPoliticas(POLITICAS_INICIALES);
                                setMetas(METAS_INICIALES);
                                setEstrategias(ESTRATEGIAS_INICIALES);
                                setPlanesAccion(PLANES_ACCION_INICIALES);
                                setEquipos(EQUIPOS_INICIALES);
                                setEmpleados(EMPLEADOS_INICIALES);
                                toast({ title: "Restablecido", description: "Datos iniciales cargados correctamente" });
                              }
                            }}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Restablecer Datos Iniciales
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <footer className="mt-auto border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {planInfo.organizationName} - Plan Estratégico {planInfo.planPeriod}</p>
              <span className="text-sm text-muted-foreground">{planInfo.planModel}</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className={`${editingType === 'plan' ? 'sm:max-w-[900px] max-w-[95vw]' : 'sm:max-w-[500px]'} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Editar {editingType === 'eje' ? 'Eje Estratégico' :
                editingType === 'objetivo' ? 'Objetivo' :
                  editingType === 'politica' ? 'Política' :
                    editingType === 'meta' ? 'Meta' :
                      editingType === 'estrategia' ? 'Estrategia' :
                        editingType === 'plan' ? 'Plan de Acción' :
                          editingType === 'equipo' ? 'Equipo' : 'Empleado'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Eje Form */}
            {editingType === 'eje' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={form.color || '#3b82f6'} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-16 h-10" />
                      <Input value={form.color || '#3b82f6'} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Peso (%)</Label>
                    <Input type="number" value={form.weight || 0} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
                  </div>
                </div>
              </>
            )}

            {/* Objetivo Form */}
            {editingType === 'objetivo' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Peso (%)</Label>
                    <Input type="number" value={form.weight || 0} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={form.status || 'active'} onValueChange={(value) => setForm({ ...form, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="at_risk">En Riesgo</SelectItem>
                        <SelectItem value="delayed">Retrasado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Responsable</Label>
                  <Input value={form.responsible || ''} onChange={(e) => setForm({ ...form, responsible: e.target.value })} />
                </div>
              </>
            )}

            {/* Política Form */}
            {editingType === 'politica' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={form.status || 'active'} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Meta Form */}
            {editingType === 'meta' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Objetivo</Label>
                  <Select value={form.objetivoId || ''} onValueChange={(value) => setForm({ ...form, objetivoId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione objetivo" /></SelectTrigger>
                    <SelectContent>
                      {objetivos.filter(o => o.ejeId === form.ejeId).map((o) => (<SelectItem key={o.id} value={o.id}>{o.code} - {o.description.substring(0, 30)}...</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Año Objetivo</Label>
                    <Input value={form.targetYear || ''} onChange={(e) => setForm({ ...form, targetYear: e.target.value })} placeholder="2027" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidad</Label>
                    <Input value={form.unit || ''} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="%" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor Meta</Label>
                    <Input type="number" value={form.targetValue || 0} onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Actual</Label>
                    <Input type="number" value={form.currentValue || 0} onChange={(e) => setForm({ ...form, currentValue: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Avance: {form.progress || 0}%</Label>
                  <Slider value={[form.progress || 0]} onValueChange={(value) => setForm({ ...form, progress: value[0] })} max={100} step={1} />
                </div>
              </>
            )}

            {/* Estrategia Form */}
            {editingType === 'estrategia' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.type || 'growth'} onValueChange={(value) => setForm({ ...form, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="growth">Crecimiento</SelectItem>
                        <SelectItem value="control">Control</SelectItem>
                        <SelectItem value="efficiency">Eficiencia</SelectItem>
                        <SelectItem value="innovation">Innovación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={form.status || 'active'} onValueChange={(value) => setForm({ ...form, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Indicador</Label>
                  <Input
                    value={form.indicator || ''}
                    onChange={(e) => setForm({ ...form, indicator: e.target.value })}
                    placeholder="Ej: Número de reuniones del comité financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Línea Base</Label>
                  <Input
                    value={form.baseline || ''}
                    onChange={(e) => setForm({ ...form, baseline: e.target.value })}
                    placeholder="Ej: 0 reuniones, Sin medición"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Medición de Metas</Label>
                  <Select value={form.measurementPeriod || 'CP'} onValueChange={(value) => setForm({ ...form, measurementPeriod: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione período de medición" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CP">CP - Corto Plazo (1 año)</SelectItem>
                      <SelectItem value="MP">MP - Mediano Plazo (2-3 años)</SelectItem>
                      <SelectItem value="LP">LP - Largo Plazo (4-5 años)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Plan de Acción Form */}
            {editingType === 'plan' && (
              <>
                {/* AVANCE - DOBLE PERSPECTIVA */}
                <div className="p-4 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg text-primary">SISTEMA DE AVANCE AUTOMÁTICO</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Avance Año Fiscal (AAF) */}
                    <div className="p-3 bg-card rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-sm">AAF - Año Fiscal {getCurrentYear()}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">Anual</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={calculateCurrentYearProgress(form.estrategiasPersonales || [])}
                          className="flex-1 h-3"
                        />
                        <span className="font-bold text-xl text-amber-500 min-w-[50px] text-right">
                          {calculateCurrentYearProgress(form.estrategiasPersonales || [])}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Avance de actividades programadas para {getCurrentYear()}
                      </p>
                    </div>

                    {/* Avance Plan Estratégico (APE) */}
                    <div className="p-3 bg-card rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-sm">APE - Plan Estratégico</span>
                        </div>
                        <Badge variant="outline" className="text-xs">2026-2030</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={calculatePlanProgress(form.estrategiasPersonales || [])}
                          className="flex-1 h-3"
                        />
                        <span className="font-bold text-xl text-emerald-500 min-w-[50px] text-right">
                          {calculatePlanProgress(form.estrategiasPersonales || [])}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Avance total del plan estratégico 2026-2030
                      </p>
                    </div>
                  </div>

                  {/* Estado del Plan */}
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const realProgress = calculatePlanProgress(form.estrategiasPersonales || []);
                          const expectedProgress = calculateExpectedProgress();
                          const progressStatus = getProgressStatus(realProgress, expectedProgress);
                          const StatusIcon = progressStatus.icon;
                          return (
                            <>
                              <StatusIcon className={`w-5 h-5 ${progressStatus.color}`} />
                              <span className="font-semibold text-sm">Estado: </span>
                              <Badge
                                variant={progressStatus.status === 'delayed' ? 'destructive' : 'default'}
                                className={`${progressStatus.color} bg-opacity-20`}
                              >
                                {progressStatus.label}
                              </Badge>
                            </>
                          );
                        })()}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Esperado: {calculateExpectedProgress()}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>Real: {calculatePlanProgress(form.estrategiasPersonales || [])}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Línea de tiempo del plan */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Inicio: {planInfo.startDate || '2026-01-01'}</span>
                    <div className="flex-1 mx-4 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${calculateExpectedProgress()}%` }}
                      />
                    </div>
                    <span>Fin: {planInfo.endDate || '2030-12-31'}</span>
                  </div>
                </div>

                {/* ALINEACIÓN CORPORATIVA */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <Layers className="w-5 h-5" />
                    <span>ALINEACIÓN CORPORATIVA</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>1. Eje Estratégico Maestro *</Label>
                      <Select value={form.ejeId || ''} onValueChange={(value) => {
                        setForm({ ...form, ejeId: value, objectiveId: '', politicaId: '', metaId: '' });
                      }}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {ejes.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                                <span className="truncate text-sm">{e.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>2. Objetivo Estratégico *</Label>
                      <Select value={form.objectiveId || ''} onValueChange={(value) => setForm({ ...form, objectiveId: value })} disabled={!form.ejeId}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {objetivos.filter(o => o.ejeId === form.ejeId).map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Badge variant="outline" className="flex-shrink-0 text-xs">{o.code}</Badge>
                                <span className="truncate text-sm">{o.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>3. Política</Label>
                      <Select value={form.politicaId || ''} onValueChange={(value) => setForm({ ...form, politicaId: value })} disabled={!form.ejeId}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {politicas.filter(p => p.ejeId === form.ejeId).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Badge variant="outline" className="flex-shrink-0 text-xs">{p.code}</Badge>
                                <span className="truncate text-sm">{p.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>4. Meta Corporativa</Label>
                      <Select value={form.metaId || ''} onValueChange={(value) => setForm({ ...form, metaId: value })} disabled={!form.objectiveId}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {metas.filter(m => m.objetivoId === form.objectiveId).map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              <span className="truncate text-sm">{m.description}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Equipo</Label>
                      <Select value={form.teamId || ''} onValueChange={(value) => setForm({ ...form, teamId: value === 'none' ? '' : value })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Sin equipo —" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">— Sin equipo —</SelectItem>
                          {equipos.map((equipo) => (
                            <SelectItem key={equipo.id} value={equipo.id}>
                              <span className="truncate text-sm">{equipo.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select value={form.status || 'pending'} onValueChange={(value) => setForm({ ...form, status: value })}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Planificado</SelectItem>
                          <SelectItem value="in_progress">En Progreso</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="delayed">Retrasado</SelectItem>
                          <SelectItem value="at_risk">En Riesgo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* MI COMPROMISO INDIVIDUAL - META PERSONAL */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <Target className="w-5 h-5" />
                    <span>MI COMPROMISO INDIVIDUAL</span>
                  </div>

                  <div className="space-y-2">
                    <Label>¿Cuál es mi Meta Personal? *</Label>
                    <Textarea
                      value={form.personalGoal || ''}
                      onChange={(e) => setForm({ ...form, personalGoal: e.target.value })}
                      placeholder="Describa aquí su meta personal vinculada al objetivo corporativo..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* INDICADOR DE GESTIÓN */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <BarChart3 className="w-5 h-5" />
                    <span>INDICADOR DE GESTIÓN</span>
                  </div>

                  <p className="text-sm text-muted-foreground">Cada estrategia personal tiene su propio indicador — configúralo dentro de cada bloque ↓</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={form.indicatorType || 'CUANTITATIVO'} onValueChange={(value) => setForm({ ...form, indicatorType: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUANTITATIVO">CUANTITATIVO</SelectItem>
                          <SelectItem value="CUALITATIVO">CUALITATIVO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Indicador</Label>
                      <Input
                        value={form.indicator || ''}
                        onChange={(e) => setForm({ ...form, indicator: e.target.value })}
                        placeholder="Ej: 100% cumplimiento / Registros al día"
                      />
                    </div>
                  </div>
                </div>

                {/* ESTRATEGIAS PERSONALES */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                      <Zap className="w-5 h-5" />
                      <span>ESTRATEGIAS PERSONALES</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const estrategiasPersonales = form.estrategiasPersonales || [];
                        const nuevaEstrategia = {
                          id: `est-pers-${Date.now()}`,
                          estrategiaCorporativaId: '',
                          descripcion: '',
                          indicador: '',
                          indicatorType: 'CUANTITATIVO',
                          actividades: []
                        };
                        setForm({ ...form, estrategiasPersonales: [...estrategiasPersonales, nuevaEstrategia] });
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Adicionar Estrategia
                    </Button>
                  </div>

                  {(form.estrategiasPersonales || []).length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground text-sm">NO HAY ESTRATEGIAS PERSONALES — PRESIONA "+ ADICIONAR ESTRATEGIA"</p>
                    </div>
                  )}

                  {(form.estrategiasPersonales || []).map((estrategiaP: any, estIdx: number) => (
                    <Card key={estrategiaP.id} className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            Estrategia Personal #{estIdx + 1}
                          </CardTitle>
                          <div className="flex items-center gap-3">
                            {/* Avance de esta estrategia */}
                            <div className="flex items-center gap-2">
                              <Progress value={calculateEstrategiaPersonalProgress(estrategiaP)} className="w-16 h-2" />
                              <span className="text-xs font-medium text-primary">{calculateEstrategiaPersonalProgress(estrategiaP)}%</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => {
                                const nuevas = (form.estrategiasPersonales || []).filter((_: any, i: number) => i !== estIdx);
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-2">
                        {/* Vincular estrategia corporativa y descripción */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Vincular estrategia corporativa</Label>
                            <Select
                              value={estrategiaP.estrategiaCorporativaId || ''}
                              onValueChange={(value) => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                nuevas[estIdx] = { ...estrategiaP, estrategiaCorporativaId: value };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                              disabled={!form.ejeId}
                            >
                              <SelectTrigger className="w-full"><SelectValue placeholder="— Vincular estrategia —" /></SelectTrigger>
                              <SelectContent className="max-w-[280px]">
                                {estrategias.filter(s => s.ejeId === form.ejeId).map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <Badge variant="outline" className="flex-shrink-0 text-[10px]">{s.code}</Badge>
                                      <span className="truncate text-xs">{s.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Indicador</Label>
                            <Input
                              value={estrategiaP.indicador || ''}
                              onChange={(e) => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                nuevas[estIdx] = { ...estrategiaP, indicador: e.target.value };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                              placeholder="Ej: 100% cumplimiento"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Descripción de la estrategia personal</Label>
                          <Textarea
                            value={estrategiaP.descripcion || ''}
                            onChange={(e) => {
                              const nuevas = [...(form.estrategiasPersonales || [])];
                              nuevas[estIdx] = { ...estrategiaP, descripcion: e.target.value };
                              setForm({ ...form, estrategiasPersonales: nuevas });
                            }}
                            placeholder="Describa su estrategia personal para lograr la meta..."
                            rows={2}
                          />
                        </div>

                        {/* Actividades de esta estrategia */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Actividades</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                const actividades = [...(estrategiaP.actividades || [])];
                                actividades.push({
                                  id: `act-${Date.now()}`,
                                  descripcion: '',
                                  fechaInicio: '',
                                  fechaFin: '',
                                  responsable: '',
                                  presupuesto: 0,
                                  avance: 0,
                                  evidencia: '',
                                  cronograma: Array(12).fill(false)
                                });
                                nuevas[estIdx] = { ...estrategiaP, actividades };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                            >
                              <PlusCircle className="w-3 h-3 mr-1" />
                              Actividad
                            </Button>
                          </div>

                          {(estrategiaP.actividades || []).length > 0 ? (
                            <div className="border rounded-lg overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="p-2 text-left font-semibold">ACTIVIDAD</th>
                                    <th className="p-2 text-left font-semibold">INICIO</th>
                                    <th className="p-2 text-left font-semibold">FIN</th>
                                    <th className="p-2 text-left font-semibold">RESPONSABLE</th>
                                    <th className="p-2 text-center font-semibold">
                                      <div className="text-center text-[10px]">CRONOGRAMA</div>
                                      <div className="flex justify-between text-[9px] font-normal">
                                        <span>EN</span><span>FE</span><span>MA</span><span>AB</span>
                                        <span>MA</span><span>JU</span><span>JL</span><span>AG</span>
                                        <span>SE</span><span>OC</span><span>NO</span><span>DI</span>
                                      </div>
                                    </th>
                                    <th className="p-2 text-left font-semibold">PRESUP.</th>
                                    <th className="p-2 text-left font-semibold">AV%</th>
                                    <th className="p-2 text-left font-semibold">EVIDENCIA</th>
                                    <th className="p-2 w-6"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(estrategiaP.actividades || []).map((actividad: any, actIdx: number) => (
                                    <tr key={actividad.id} className="border-t hover:bg-muted/30">
                                      <td className="p-1">
                                        <Input
                                          value={actividad.descripcion || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, descripcion: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          placeholder={`Act ${actIdx + 1}`}
                                          className="h-7 text-xs"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          type="date"
                                          value={actividad.fechaInicio || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, fechaInicio: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-7 text-xs w-24"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          type="date"
                                          value={actividad.fechaFin || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, fechaFin: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-7 text-xs w-24"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Select
                                          value={actividad.responsable || ''}
                                          onValueChange={(value) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, responsable: value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                        >
                                          <SelectTrigger className="h-7 text-xs w-full"><SelectValue placeholder="—" /></SelectTrigger>
                                          <SelectContent className="max-w-[150px]">
                                            {empleados.map((emp) => (
                                              <SelectItem key={emp.id} value={emp.id}>
                                                <span className="truncate text-xs">{emp.name}</span>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </td>
                                      <td className="p-1">
                                        <div className="flex gap-0.5">
                                          {(actividad.cronograma || Array(12).fill(false)).map((mes: boolean, mesIdx: number) => (
                                            <div
                                              key={mesIdx}
                                              onClick={() => {
                                                const nuevasEst = [...(form.estrategiasPersonales || [])];
                                                const nuevasAct = [...(estrategiaP.actividades || [])];
                                                const cronograma = [...(actividad.cronograma || Array(12).fill(false))];
                                                cronograma[mesIdx] = !cronograma[mesIdx];
                                                nuevasAct[actIdx] = { ...actividad, cronograma };
                                                nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                                setForm({ ...form, estrategiasPersonales: nuevasEst });
                                              }}
                                              className={`w-4 h-4 border cursor-pointer flex items-center justify-center text-[7px] ${mes ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'
                                                }`}
                                            >
                                              {mes ? '✓' : ''}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          type="number"
                                          value={actividad.presupuesto || 0}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, presupuesto: Number(e.target.value) };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-7 text-xs w-16"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          type="number"
                                          value={actividad.avance || 0}
                                          onChange={(e) => {
                                            const value = Math.min(100, Math.max(0, Number(e.target.value)));
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, avance: value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-7 text-xs w-14"
                                          min={0}
                                          max={100}
                                          step={1}
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          value={actividad.evidencia || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, evidencia: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          placeholder="Ref."
                                          className="h-7 text-xs w-16"
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5 text-destructive"
                                          onClick={() => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = (estrategiaP.actividades || []).filter((_: any, i: number) => i !== actIdx);
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-3 border-2 border-dashed rounded text-xs text-muted-foreground">
                              Sin actividades — Presiona "+ Actividad"
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* PRESUPUESTO TOTAL */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-semibold">PRESUPUESTO TOTAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      ${((form.estrategiasPersonales || []).reduce((sum: number, ep: any) =>
                        sum + (ep.actividades || []).reduce((s: number, a: any) => s + (a.presupuesto || 0), 0)
                        , 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Equipo Form */}
            {editingType === 'equipo' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input value={form.area || ''} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </>
            )}

            {/* Empleado Form */}
            {editingType === 'empleado' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre Completo *</Label>
                  <Input
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Carlos Andrés Muñoz"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Posición *</Label>
                  <Input
                    value={form.position || ''}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    placeholder="Ej: Director Financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equipo de Trabajo</Label>
                  <Select value={form.teamId || ''} onValueChange={(value) => setForm({ ...form, teamId: value === 'none' ? '' : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin equipo asignado</SelectItem>
                      {equipos.map((equipo) => (
                        <SelectItem key={equipo.id} value={equipo.id}>
                          {equipo.name} - {equipo.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email || ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@coacremat.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="3001234567"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Plan Info Form */}
            {editingType === 'planInfo' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre de la Organización</Label>
                  <Input value={form.organizationName || ''} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Período del Plan</Label>
                  <Input value={form.planPeriod || ''} onChange={(e) => setForm({ ...form, planPeriod: e.target.value })} placeholder="2026 - 2030" />
                </div>
                <div className="space-y-2">
                  <Label>Modelo de Gestión</Label>
                  <Input value={form.planModel || ''} onChange={(e) => setForm({ ...form, planModel: e.target.value })} placeholder="Economía Solidaria" />
                </div>
                <div className="space-y-2">
                  <Label>Responsable General</Label>
                  <Input value={form.generalResponsible || ''} onChange={(e) => setForm({ ...form, generalResponsible: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <Input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <Input type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}><Save className="w-4 h-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className={`${addingType === 'plan' ? 'sm:max-w-[900px] max-w-[95vw]' : 'sm:max-w-[500px]'} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Nuevo {addingType === 'eje' ? 'Eje Estratégico' :
                addingType === 'objetivo' ? 'Objetivo' :
                  addingType === 'politica' ? 'Política' :
                    addingType === 'meta' ? 'Meta' :
                      addingType === 'estrategia' ? 'Estrategia' :
                        addingType === 'plan' ? 'Plan de Acción' :
                          addingType === 'equipo' ? 'Equipo' : 'Empleado'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Use same forms as edit modal */}
            {editingType === 'eje' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del eje estratégico" />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del eje" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={form.color || '#3b82f6'} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-16 h-10" />
                      <Input value={form.color || '#3b82f6'} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Peso (%)</Label>
                    <Input type="number" value={form.weight || 15} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
                  </div>
                </div>
              </>
            )}

            {editingType === 'objetivo' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico *</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del objetivo" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Peso (%)</Label>
                    <Input type="number" value={form.weight || 0} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={form.status || 'active'} onValueChange={(value) => setForm({ ...form, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="at_risk">En Riesgo</SelectItem>
                        <SelectItem value="delayed">Retrasado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Responsable</Label>
                  <Input value={form.responsible || ''} onChange={(e) => setForm({ ...form, responsible: e.target.value })} placeholder="Nombre del responsable" />
                </div>
              </>
            )}

            {editingType === 'politica' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico *</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la política" />
                </div>
              </>
            )}

            {editingType === 'meta' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico *</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Objetivo *</Label>
                  <Select value={form.objetivoId || ''} onValueChange={(value) => setForm({ ...form, objetivoId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione objetivo" /></SelectTrigger>
                    <SelectContent>
                      {objetivos.filter(o => o.ejeId === form.ejeId).map((o) => (<SelectItem key={o.id} value={o.id}>{o.code} - {o.description.substring(0, 30)}...</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la meta" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Año Objetivo</Label>
                    <Input value={form.targetYear || ''} onChange={(e) => setForm({ ...form, targetYear: e.target.value })} placeholder="2027" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidad</Label>
                    <Input value={form.unit || ''} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="%" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valor Meta</Label>
                  <Input type="number" value={form.targetValue || 0} onChange={(e) => setForm({ ...form, targetValue: Number(e.target.value) })} />
                </div>
              </>
            )}

            {editingType === 'estrategia' && (
              <>
                <div className="space-y-2">
                  <Label>Eje Estratégico *</Label>
                  <Select value={form.ejeId || ''} onValueChange={(value) => setForm({ ...form, ejeId: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione eje" /></SelectTrigger>
                    <SelectContent>
                      {ejes.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la estrategia" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.type || 'growth'} onValueChange={(value) => setForm({ ...form, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="growth">Crecimiento</SelectItem>
                        <SelectItem value="control">Control</SelectItem>
                        <SelectItem value="efficiency">Eficiencia</SelectItem>
                        <SelectItem value="innovation">Innovación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Medición de Metas</Label>
                    <Select value={form.measurementPeriod || 'CP'} onValueChange={(value) => setForm({ ...form, measurementPeriod: value })}>
                      <SelectTrigger><SelectValue placeholder="Seleccione período" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CP">CP - Corto Plazo</SelectItem>
                        <SelectItem value="MP">MP - Mediano Plazo</SelectItem>
                        <SelectItem value="LP">LP - Largo Plazo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Indicador</Label>
                  <Input
                    value={form.indicator || ''}
                    onChange={(e) => setForm({ ...form, indicator: e.target.value })}
                    placeholder="Ej: Número de reuniones del comité financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Línea Base</Label>
                  <Input
                    value={form.baseline || ''}
                    onChange={(e) => setForm({ ...form, baseline: e.target.value })}
                    placeholder="Ej: 0 reuniones, Sin medición"
                  />
                </div>
              </>
            )}

            {editingType === 'plan' && (
              <>
                {/* AVANCE */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-semibold">AVANCE</span>
                  </div>
                  <span className="font-bold text-lg">0%</span>
                </div>

                {/* ALINEACIÓN CORPORATIVA */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Layers className="w-4 h-4" />
                    <span>ALINEACIÓN CORPORATIVA</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>1. Eje Estratégico *</Label>
                      <Select value={form.ejeId || ''} onValueChange={(value) => {
                        setForm({ ...form, ejeId: value, objectiveId: '', politicaId: '', metaId: '' });
                      }}>
                        <SelectTrigger><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {ejes.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                                {e.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>2. Objetivo Estratégico *</Label>
                      <Select value={form.objectiveId || ''} onValueChange={(value) => setForm({ ...form, objectiveId: value })} disabled={!form.ejeId}>
                        <SelectTrigger><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {objetivos.filter(o => o.ejeId === form.ejeId).map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              <Badge variant="outline" className="mr-2">{o.code}</Badge>
                              {o.description.substring(0, 40)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>3. Política</Label>
                      <Select value={form.politicaId || ''} onValueChange={(value) => setForm({ ...form, politicaId: value })} disabled={!form.ejeId}>
                        <SelectTrigger><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {politicas.filter(p => p.ejeId === form.ejeId).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <Badge variant="outline" className="mr-2">{p.code}</Badge>
                              {p.description.substring(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>4. Meta Corporativa</Label>
                      <Select value={form.metaId || ''} onValueChange={(value) => setForm({ ...form, metaId: value })} disabled={!form.objectiveId}>
                        <SelectTrigger><SelectValue placeholder="— Seleccionar —" /></SelectTrigger>
                        <SelectContent>
                          {metas.filter(m => m.objetivoId === form.objectiveId).map((m) => (
                            <SelectItem key={m.id} value={m.id}>{m.description.substring(0, 35)}...</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Equipo</Label>
                      <Select value={form.teamId || ''} onValueChange={(value) => setForm({ ...form, teamId: value === 'none' ? '' : value })}>
                        <SelectTrigger><SelectValue placeholder="— Sin equipo —" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">— Sin equipo —</SelectItem>
                          {equipos.map((equipo) => (
                            <SelectItem key={equipo.id} value={equipo.id}>{equipo.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select value={form.status || 'pending'} onValueChange={(value) => setForm({ ...form, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Planificado</SelectItem>
                          <SelectItem value="in_progress">En Progreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* MI COMPROMISO INDIVIDUAL */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Target className="w-4 h-4" />
                    <span>MI COMPROMISO INDIVIDUAL</span>
                  </div>

                  <div className="space-y-2">
                    <Label>¿Cuál es mi Meta Personal? *</Label>
                    <Textarea
                      value={form.personalGoal || ''}
                      onChange={(e) => setForm({ ...form, personalGoal: e.target.value })}
                      placeholder="Describa aquí su meta personal vinculada al objetivo corporativo..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* INDICADOR DE GESTIÓN */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <BarChart3 className="w-4 h-4" />
                    <span>INDICADOR DE GESTIÓN</span>
                  </div>

                  <p className="text-sm text-muted-foreground">Cada estrategia personal tiene su propio indicador</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={form.indicatorType || 'CUANTITATIVO'} onValueChange={(value) => setForm({ ...form, indicatorType: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUANTITATIVO">CUANTITATIVO</SelectItem>
                          <SelectItem value="CUALITATIVO">CUALITATIVO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Indicador</Label>
                      <Input
                        value={form.indicator || ''}
                        onChange={(e) => setForm({ ...form, indicator: e.target.value })}
                        placeholder="Ej: 100% cumplimiento"
                      />
                    </div>
                  </div>
                </div>

                {/* ESTRATEGIAS PERSONALES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Zap className="w-4 h-4" />
                      <span>ESTRATEGIAS PERSONALES</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const estrategiasPersonales = form.estrategiasPersonales || [];
                        const nuevaEstrategia = {
                          id: `est-pers-${Date.now()}`,
                          estrategiaCorporativaId: '',
                          descripcion: '',
                          indicador: '',
                          indicatorType: 'CUANTITATIVO',
                          actividades: []
                        };
                        setForm({ ...form, estrategiasPersonales: [...estrategiasPersonales, nuevaEstrategia] });
                      }}
                    >
                      <PlusCircle className="w-3 h-3 mr-1" />
                      Adicionar Estrategia
                    </Button>
                  </div>

                  {(form.estrategiasPersonales || []).length === 0 && (
                    <div className="text-center py-4 border-2 border-dashed rounded text-xs text-muted-foreground">
                      NO HAY ESTRATEGIAS PERSONALES — PRESIONA "+ ADICIONAR ESTRATEGIA"
                    </div>
                  )}

                  {(form.estrategiasPersonales || []).map((estrategiaP: any, estIdx: number) => (
                    <Card key={estrategiaP.id} className="border">
                      <CardHeader className="pb-2 pt-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs flex items-center gap-2">
                            <Zap className="w-3 h-3 text-primary" />
                            Estrategia #{estIdx + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => {
                              const nuevas = (form.estrategiasPersonales || []).filter((_: any, i: number) => i !== estIdx);
                              setForm({ ...form, estrategiasPersonales: nuevas });
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Estrategia corporativa</Label>
                            <Select
                              value={estrategiaP.estrategiaCorporativaId || ''}
                              onValueChange={(value) => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                nuevas[estIdx] = { ...estrategiaP, estrategiaCorporativaId: value };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                              disabled={!form.ejeId}
                            >
                              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Vincular" /></SelectTrigger>
                              <SelectContent>
                                {estrategias.filter(s => s.ejeId === form.ejeId).map((s) => (
                                  <SelectItem key={s.id} value={s.id}>{s.code}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Indicador</Label>
                            <Input
                              value={estrategiaP.indicador || ''}
                              onChange={(e) => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                nuevas[estIdx] = { ...estrategiaP, indicador: e.target.value };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                              placeholder="Ej: 100%"
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Descripción</Label>
                          <Textarea
                            value={estrategiaP.descripcion || ''}
                            onChange={(e) => {
                              const nuevas = [...(form.estrategiasPersonales || [])];
                              nuevas[estIdx] = { ...estrategiaP, descripcion: e.target.value };
                              setForm({ ...form, estrategiasPersonales: nuevas });
                            }}
                            placeholder="Describa su estrategia..."
                            rows={2}
                            className="text-xs"
                          />
                        </div>

                        {/* Actividades */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold">Actividades</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs"
                              onClick={() => {
                                const nuevas = [...(form.estrategiasPersonales || [])];
                                const actividades = [...(estrategiaP.actividades || [])];
                                actividades.push({
                                  id: `act-${Date.now()}`,
                                  descripcion: '',
                                  fechaInicio: '',
                                  fechaFin: '',
                                  responsable: '',
                                  presupuesto: 0,
                                  avance: 0,
                                  evidencia: '',
                                  cronograma: Array(12).fill(false)
                                });
                                nuevas[estIdx] = { ...estrategiaP, actividades };
                                setForm({ ...form, estrategiasPersonales: nuevas });
                              }}
                            >
                              <PlusCircle className="w-2 h-2 mr-1" />
                              Act.
                            </Button>
                          </div>

                          {(estrategiaP.actividades || []).length > 0 && (
                            <div className="border rounded overflow-x-auto text-[10px]">
                              <table className="w-full">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="p-1 text-left">ACT.</th>
                                    <th className="p-1 text-left">INICIO</th>
                                    <th className="p-1 text-left">FIN</th>
                                    <th className="p-1 text-left">RESP.</th>
                                    <th className="p-1 text-left">PRES.</th>
                                    <th className="p-1 text-left">AV%</th>
                                    <th className="p-1 w-4"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(estrategiaP.actividades || []).map((actividad: any, actIdx: number) => (
                                    <tr key={actividad.id} className="border-t">
                                      <td className="p-0.5">
                                        <Input
                                          value={actividad.descripcion || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, descripcion: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-5 text-[10px] w-20"
                                        />
                                      </td>
                                      <td className="p-0.5">
                                        <Input
                                          type="date"
                                          value={actividad.fechaInicio || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, fechaInicio: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-5 text-[10px] w-20"
                                        />
                                      </td>
                                      <td className="p-0.5">
                                        <Input
                                          type="date"
                                          value={actividad.fechaFin || ''}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, fechaFin: e.target.value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-5 text-[10px] w-20"
                                        />
                                      </td>
                                      <td className="p-0.5">
                                        <Select
                                          value={actividad.responsable || ''}
                                          onValueChange={(value) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, responsable: value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                        >
                                          <SelectTrigger className="h-5 text-[10px] w-16"><SelectValue placeholder="—" /></SelectTrigger>
                                          <SelectContent>
                                            {empleados.map((emp) => (
                                              <SelectItem key={emp.id} value={emp.id} className="text-xs">{emp.name.split(' ')[0]}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </td>
                                      <td className="p-0.5">
                                        <Input
                                          type="number"
                                          value={actividad.presupuesto || 0}
                                          onChange={(e) => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, presupuesto: Number(e.target.value) };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-5 text-[10px] w-12"
                                        />
                                      </td>
                                      <td className="p-0.5">
                                        <Input
                                          type="number"
                                          value={actividad.avance || 0}
                                          onChange={(e) => {
                                            const value = Math.min(100, Math.max(0, Number(e.target.value)));
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = [...(estrategiaP.actividades || [])];
                                            nuevasAct[actIdx] = { ...actividad, avance: value };
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                          className="h-5 text-[10px] w-12"
                                          min={0}
                                          max={100}
                                          step={1}
                                        />
                                      </td>
                                      <td className="p-0.5">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 text-destructive"
                                          onClick={() => {
                                            const nuevasEst = [...(form.estrategiasPersonales || [])];
                                            const nuevasAct = (estrategiaP.actividades || []).filter((_: any, i: number) => i !== actIdx);
                                            nuevasEst[estIdx] = { ...estrategiaP, actividades: nuevasAct };
                                            setForm({ ...form, estrategiasPersonales: nuevasEst });
                                          }}
                                        >
                                          <Trash2 className="w-2 h-2" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {(estrategiaP.actividades || []).length === 0 && (
                            <div className="text-center py-2 border-2 border-dashed rounded text-[10px] text-muted-foreground">
                              Sin actividades
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* PRESUPUESTO TOTAL */}
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-1 text-xs">
                    <DollarSign className="w-3 h-3 text-primary" />
                    <span className="font-semibold">PRESUPUESTO TOTAL</span>
                  </div>
                  <span className="font-bold text-sm">
                    ${((form.estrategiasPersonales || []).reduce((sum: number, ep: any) =>
                      sum + (ep.actividades || []).reduce((s: number, a: any) => s + (a.presupuesto || 0), 0)
                      , 0)).toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {editingType === 'equipo' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del equipo" />
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input value={form.area || ''} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Área de trabajo" />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del equipo" />
                </div>
              </>
            )}

            {editingType === 'empleado' && (
              <>
                <div className="space-y-2">
                  <Label>Nombre Completo *</Label>
                  <Input
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Carlos Andrés Muñoz"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Posición *</Label>
                  <Input
                    value={form.position || ''}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    placeholder="Ej: Director Financiero"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equipo de Trabajo</Label>
                  <Select value={form.teamId || ''} onValueChange={(value) => setForm({ ...form, teamId: value === 'none' ? '' : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin equipo asignado</SelectItem>
                      {equipos.map((equipo) => (
                        <SelectItem key={equipo.id} value={equipo.id}>
                          {equipo.name} - {equipo.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email || ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@coacremat.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="3001234567"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNew}><PlusCircle className="w-4 h-4 mr-2" />Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatBot />
    </TooltipProvider>
  );
}
