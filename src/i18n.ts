import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    sidebar: {
      dashboard: "Dashboard",
      transactions: "Transactions",
      goals: "Goals",
      settings: "Settings",
      addTransaction: "Add Transaction"
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your account preferences, security, and notifications.",
      profileInfo: "Profile Information",
      profileDesc: "Update your personal details and public profile.",
      security: "Security",
      securityDesc: "Manage your password and authentication settings.",
      notifications: "Notifications",
      notificationsDesc: "Choose how you want to be alerted about account activity.",
      preferences: "Preferences",
      preferencesDesc: "Customize your localization and viewing options."
    }
  }
};

// Spanish translations
const es = {
  translation: {
    sidebar: {
      dashboard: "Panel",
      transactions: "Transacciones",
      goals: "Metas",
      settings: "Configuraciones",
      addTransaction: "Añadir Transacción"
    },
    settings: {
      title: "Configuraciones",
      subtitle: "Gestione las preferencias de su cuenta, seguridad y notificaciones.",
      profileInfo: "Información del Perfil",
      profileDesc: "Actualice sus datos personales y perfil público.",
      security: "Seguridad",
      securityDesc: "Administre su contraseña y opciones de autenticación.",
      notifications: "Notificaciones",
      notificationsDesc: "Elija cómo desea recibir alertas sobre la actividad de la cuenta.",
      preferences: "Preferencias",
      preferencesDesc: "Personalice sus opciones de visualización y localización."
    }
  }
};

// French translations
const fr = {
  translation: {
    sidebar: {
      dashboard: "Tableau de Bord",
      transactions: "Transactions",
      goals: "Objectifs",
      settings: "Paramètres",
      addTransaction: "Ajouter une Transaction"
    },
    settings: {
      title: "Paramètres",
      subtitle: "Gérez les préférences de votre compte, la sécurité et les notifications.",
      profileInfo: "Informations de Profil",
      profileDesc: "Mettez à jour vos informations personnelles et votre profil public.",
      security: "Sécurité",
      securityDesc: "Gérez votre mot de passe et vos paramètres d'authentification.",
      notifications: "Notifications",
      notificationsDesc: "Choisissez comment vous souhaitez être alerté de l'activité du compte.",
      preferences: "Préférences",
      preferencesDesc: "Personnalisez vos options de localisation et d'affichage."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
      fr
    },
    lng: "English (United States)", // initial default
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
