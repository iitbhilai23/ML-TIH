import { LayoutDashboard, Users, BookOpen, MapPin, FileText, Settings, LogOut, GraduationCap, KeyIcon } from 'lucide-react';

const content = {
  // Global App Config
  appTitle: "Marketplace Literacy Chhattisgarh",
  // appSubtitle: "Marketplace Literacy Chhattisgarh",

  // Navigation 
  nav: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Trainers", path: "/admin/trainers", icon: Users },
    { label: "Locations", path: "/admin/locations", icon: MapPin },
    { label: "Trainings", path: "/admin/trainings", icon: GraduationCap },
    { label: "Participants", path: "/admin/participants", icon: Users },
    { label: "Subjects", path: "/admin/training/subjects", icon: BookOpen },
    { label: "Change Password", path: "/admin/trainee/chngpass", icon: KeyIcon },
    { label: "Logout", path: "/logout", icon: LogOut, bottom: true },
  ],

  common: {
    logout: "Logout",
    loading: "Loading data...",
    error: "Something went wrong. Please try again.",
    save: "Save Details",
    cancel: "Cancel"
  },

  //  Report Section Texts
  reports: {
    pageTitle: "Public Impact Report",
    pageSubtitle: "Live monitoring of skill development programs across the state.",
    sections: {
      charts: "District-wise Performance",
      demographics: "Demographics (Category)",
      map: "Live Training Locations"
    },
    kpi: {
      beneficiaries: "Total Beneficiaries",
      completed: "Trainings Completed",
      districts: "Districts Covered",
      trainers: "Active Trainers"
    }
  }
};

export default content;