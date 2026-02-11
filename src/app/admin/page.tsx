"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  AppWindow,
  FileText,
  Mail,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ChevronRight,
  Inbox,
  MailOpen,
} from "lucide-react";

interface Application {
  id: string;
  name: string;
  logo: string | null;
  summary: string;
  descriptionBut: string;
  descriptionHow: string;
  screenshots: string;
  url: string;
  marketCH: boolean;
  marketFR: boolean;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  linkedinUrl: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type Tab = "dashboard" | "applications" | "content" | "messages";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<Partial<Application> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) {
      router.push("/admin/login");
      return false;
    }
    return true;
  }, [router]);

  const fetchData = useCallback(async () => {
    const authed = await checkAuth();
    if (!authed) return;

    const [appsRes, contentRes, msgsRes] = await Promise.all([
      fetch("/api/applications"),
      fetch("/api/site-content"),
      fetch("/api/messages"),
    ]);

    if (appsRes.ok) setApplications(await appsRes.json());
    if (contentRes.ok) setSiteContent(await contentRes.json());
    if (msgsRes.ok) setMessages(await msgsRes.json());
    setLoading(false);
  }, [checkAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleAppVisibility = async (app: Application) => {
    await fetch(`/api/applications/${app.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !app.isActive }),
    });
    fetchData();
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Supprimer cette application ?")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    fetchData();
  };

  const saveApp = async () => {
    if (!editingApp) return;
    const method = isCreating ? "POST" : "PUT";
    const url = isCreating ? "/api/applications" : `/api/applications/${editingApp.id}`;

    const payload = {
      ...editingApp,
      descriptionHow: typeof editingApp.descriptionHow === "string"
        ? editingApp.descriptionHow
        : JSON.stringify(editingApp.descriptionHow),
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditingApp(null);
    setIsCreating(false);
    fetchData();
  };

  const saveSiteContent = async () => {
    if (!siteContent) return;
    setSavingContent(true);
    await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteContent),
    });
    setSavingContent(false);
  };

  const toggleMessageRead = async (msg: ContactMessage) => {
    await fetch(`/api/messages/${msg.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !msg.isRead }),
    });
    fetchData();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-text-light">Chargement...</div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard" as Tab, label: "Tableau de bord", icon: LayoutDashboard },
    { id: "applications" as Tab, label: "Applications", icon: AppWindow },
    { id: "content" as Tab, label: "Contenu", icon: FileText },
    { id: "messages" as Tab, label: "Messages", icon: Mail, badge: messages.filter((m) => !m.isRead).length },
  ];

  const activeCount = applications.filter((a) => a.isActive).length;
  const inactiveCount = applications.filter((a) => !a.isActive).length;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 hidden lg:block">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-bold">Admin</span>
          <button onClick={handleLogout} className="text-gray-600">
            <LogOut size={18} />
          </button>
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.badge ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pt-24 lg:pt-0 p-6 lg:p-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-text mb-8">Tableau de bord</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AppWindow size={20} className="text-primary" />
                  <span className="text-sm text-gray-500">Total applications</span>
                </div>
                <p className="text-3xl font-bold">{applications.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Eye size={20} className="text-green-500" />
                  <span className="text-sm text-gray-500">Actives</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <EyeOff size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Inactives</span>
                </div>
                <p className="text-3xl font-bold text-gray-400">{inactiveCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-blue-500" />
                  <span className="text-sm text-gray-500">Messages non lus</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Applications</h2>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${app.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                      <span className="font-medium">{app.name}</span>
                      <span className="text-xs text-gray-400">{app.category}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-text">Applications</h1>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingApp({
                    name: "",
                    summary: "",
                    descriptionBut: "",
                    descriptionHow: "[]",
                    url: "",
                    marketCH: false,
                    marketFR: false,
                    category: "",
                    displayOrder: applications.length + 1,
                    isActive: true,
                  });
                }}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Plus size={16} />
                Nouvelle application
              </button>
            </div>

            {/* Edit/Create Form */}
            {editingApp && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {isCreating ? "Nouvelle application" : `Modifier ${editingApp.name}`}
                  </h2>
                  <button onClick={() => { setEditingApp(null); setIsCreating(false); }}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      value={editingApp.name || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input
                      type="url"
                      value={editingApp.url || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categorie</label>
                    <input
                      type="text"
                      value={editingApp.category || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ordre d&apos;affichage</label>
                    <input
                      type="number"
                      value={editingApp.displayOrder || 0}
                      onChange={(e) => setEditingApp({ ...editingApp, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Resume court (120 car.)</label>
                    <input
                      type="text"
                      maxLength={120}
                      value={editingApp.summary || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description - But</label>
                    <textarea
                      rows={3}
                      value={editingApp.descriptionBut || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, descriptionBut: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Fonctionnalites (une par ligne)
                    </label>
                    <textarea
                      rows={4}
                      value={(() => {
                        try {
                          const parsed = JSON.parse(editingApp.descriptionHow || "[]");
                          return Array.isArray(parsed) ? parsed.join("\n") : editingApp.descriptionHow || "";
                        } catch {
                          return editingApp.descriptionHow || "";
                        }
                      })()}
                      onChange={(e) => {
                        const lines = e.target.value.split("\n").filter(Boolean);
                        setEditingApp({ ...editingApp, descriptionHow: JSON.stringify(lines) });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingApp.marketCH || false}
                        onChange={(e) => setEditingApp({ ...editingApp, marketCH: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Suisse</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingApp.marketFR || false}
                        onChange={(e) => setEditingApp({ ...editingApp, marketFR: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">France</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveApp}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Save size={16} />
                    {isCreating ? "Creer" : "Enregistrer"}
                  </button>
                  <button
                    onClick={() => { setEditingApp(null); setIsCreating(false); }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Applications List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Application</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Categorie</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Marche</th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm">{app.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{app.summary}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{app.category}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex gap-1">
                          {app.marketCH && <span className="text-xs">CH</span>}
                          {app.marketFR && <span className="text-xs">FR</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleAppVisibility(app)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            app.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {app.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                          {app.isActive ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditingApp(app); setIsCreating(false); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteApp(app.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && siteContent && (
          <div>
            <h1 className="text-2xl font-bold text-text mb-8">Gestion du contenu</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings size={18} />
                  Section Hero
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                      type="text"
                      value={siteContent.heroTitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sous-titre</label>
                    <input
                      type="text"
                      value={siteContent.heroSubtitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Section A propos</h2>
                <textarea
                  rows={6}
                  value={siteContent.aboutText}
                  onChange={(e) => setSiteContent({ ...siteContent, aboutText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Informations de contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={siteContent.contactEmail}
                      onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telephone</label>
                    <input
                      type="text"
                      value={siteContent.contactPhone}
                      onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresse</label>
                    <input
                      type="text"
                      value={siteContent.contactAddress}
                      onChange={(e) => setSiteContent({ ...siteContent, contactAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={siteContent.linkedinUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveSiteContent}
                disabled={savingContent}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark disabled:opacity-60 transition-colors"
              >
                <Save size={16} />
                {savingContent ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <h1 className="text-2xl font-bold text-text mb-8">
              Messages ({messages.length})
            </h1>
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Inbox size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun message pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white rounded-xl border p-6 ${
                      msg.isRead ? "border-gray-200" : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{msg.name}</span>
                          {!msg.isRead && (
                            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{msg.email}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString("fr-CH", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleMessageRead(msg)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                          title={msg.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                        >
                          {msg.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
