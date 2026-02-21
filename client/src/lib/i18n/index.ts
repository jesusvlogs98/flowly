import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      settings: {
        language: "Language",
        english: "English",
        spanish: "Spanish",
      },
      welcome: {
        title: "Welcome to Flowly",
        description: "Your personal space for growth and productivity.",
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
        reminders: "Enable Reminders",
        reminders_active: "Reminders enabled!"
      },
      daily: {
        title: "Daily Tracker",
        habits: "Daily Habits",
        todos: "To-Do List",
        energy: "Energy Level",
        notes: "Daily Notes",
        save: "Save Log",
        add_habit_placeholder: "Add a task...",
        no_habits: "No habits yet. Go to Monthly Goals to add some!",
      },
      monthly: {
        title: "Monthly Plan",
        subtitle: "Focus and intentions for",
        mantra_title: "Mantra of the Month",
        mantra_placeholder: "e.g., I am disciplined and focused...",
        goal_title: "Main Goal",
        goal_placeholder: "What is your #1 goal this month?",
        top3_title: "Top 3 Priorities",
        top3_placeholder: "Priority",
        habits_title: "Habit Tracker Setup",
        habits_desc: "Add the habits you want to track daily",
        habit_placeholder: "New habit name...",
        add_habit: "Add Habit",
        active_habits: "Active habits",
      },
      stats: {
        title: "Progress & Insights",
        subtitle: "Review your consistency for",
        habit_consistency: "Habit Consistency",
        habit_consistency_desc: "Number of days completed this month",
        energy_title: "Energy Over Time",
        energy_desc: "Your daily energy levels this month",
        no_data: "No data yet for this month.",
        days: "days",
        energy_label: "Energy",
        completions_label: "Completions",
      },
      notes: {
        title: "Notes",
        add: "Add Note",
        new_note: "New Note",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        empty: "No notes yet. Create one!",
        untitled: "Untitled Note",
        content_placeholder: "Write your note here...",
      }
    }
  },
  es: {
    translation: {
      settings: {
        language: "Idioma",
        english: "Inglés",
        spanish: "Español",
      },
      welcome: {
        title: "Bienvenido a Flowly",
        description: "Tu espacio personal para el crecimiento y la productividad.",
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
        reminders: "Activar Recordatorios",
        reminders_active: "¡Recordatorios activados!"
      },
      daily: {
        title: "Seguimiento Diario",
        habits: "Hábitos Diarios",
        todos: "Lista de Tareas",
        energy: "Nivel de Energía",
        notes: "Notas del Día",
        save: "Guardar Registro",
        add_habit_placeholder: "Agregar tarea...",
        no_habits: "Sin hábitos aún. ¡Ve a Metas Mensuales para agregar algunos!",
      },
      monthly: {
        title: "Plan Mensual",
        subtitle: "Enfoque e intenciones para",
        mantra_title: "Mantra del Mes",
        mantra_placeholder: "ej., Soy disciplinado y enfocado...",
        goal_title: "Meta Principal",
        goal_placeholder: "¿Cuál es tu meta #1 este mes?",
        top3_title: "Top 3 Prioridades",
        top3_placeholder: "Prioridad",
        habits_title: "Configurar Hábitos",
        habits_desc: "Agrega los hábitos que quieres seguir diariamente",
        habit_placeholder: "Nombre del nuevo hábito...",
        add_habit: "Agregar Hábito",
        active_habits: "Hábitos activos",
      },
      stats: {
        title: "Progreso e Insights",
        subtitle: "Revisa tu consistencia para",
        habit_consistency: "Consistencia de Hábitos",
        habit_consistency_desc: "Días completados este mes",
        energy_title: "Energía en el Tiempo",
        energy_desc: "Tus niveles de energía diarios este mes",
        no_data: "Sin datos aún para este mes.",
        days: "días",
        energy_label: "Energía",
        completions_label: "Completados",
      },
      notes: {
        title: "Notas",
        add: "Nueva Nota",
        new_note: "Nueva Nota",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        empty: "Sin notas aún. ¡Crea una!",
        untitled: "Nota sin título",
        content_placeholder: "Escribe tu nota aquí...",
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
    detection: {
      // Detecta idioma del navegador/dispositivo, guarda preferencia en localStorage
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
