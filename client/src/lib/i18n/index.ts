import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: {
        title: "Welcome to Flowly",
        description: "Your personal space for growth and productivity. Let us show you how to flow with your goals.",
        step1_title: "Welcome to Flowly",
        step1_desc: "Your personal space for growth and productivity. Let us show you how to flow with your goals.",
        step2_title: "Monthly Planning",
        step2_desc: "Set your mantras, main goals, and the 3 priorities that will guide your month.",
        step3_title: "Habits and Tasks",
        step3_desc: "Record your daily habits and manage your pending tasks to stay focused.",
        step4_title: "Permanent Notes",
        step4_desc: "Save ideas, thoughts, and reminders in your notes section that will always accompany you.",
        step5_title: "Track Your Progress",
        step5_desc: "Visualize your energy levels and consistency to better understand your work rhythms.",
        back: "Back",
        next: "Next",
        start: "Get Started"
      },
      sidebar: {
        daily: "Daily Tracker",
        monthly: "Monthly Goals",
        stats: "Stats & Progress",
        notes: "Notes",
        reminders: "Enable Reminders"
      },
      daily: {
        title: "Daily Tracker",
        habits: "Daily Habits",
        todos: "To-Do List",
        energy: "Energy Level",
        notes: "Daily Notes",
        save: "Save Log"
      }
    }
  },
  es: {
    translation: {
      welcome: {
        title: "Bienvenido a Flowly",
        description: "Tu espacio personal para el crecimiento y la productividad. Permítenos mostrarte cómo fluir con tus metas.",
        step1_title: "Bienvenido a Flowly",
        step1_desc: "Tu espacio personal para el crecimiento y la productividad. Permítenos mostrarte cómo fluir con tus metas.",
        step2_title: "Planificación Mensual",
        step2_desc: "Establece tus mantras, objetivos principales y las 3 prioridades que guiarán tu mes.",
        step3_title: "Hábitos y Tareas",
        step3_desc: "Registra tus hábitos diarios y gestiona tus tareas pendientes para mantener el enfoque.",
        step4_title: "Notas Permanentes",
        step4_desc: "Guarda ideas, pensamientos y recordatorios en tu sección de notas que te acompañarán siempre.",
        step5_title: "Sigue tu Progreso",
        step5_desc: "Visualiza tus niveles de energía y consistencia para entender mejor tus ritmos de trabajo.",
        back: "Atrás",
        next: "Siguiente",
        start: "Comenzar"
      },
      sidebar: {
        daily: "Seguimiento Diario",
        monthly: "Metas Mensuales",
        stats: "Estadísticas",
        notes: "Notas",
        reminders: "Activar Recordatorios"
      },
      daily: {
        title: "Seguimiento Diario",
        habits: "Hábitos Diarios",
        todos: "Lista de Tareas",
        energy: "Nivel de Energía",
        notes: "Notas del Día",
        save: "Guardar Registro"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;