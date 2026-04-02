"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile, getOrders } from "@/lib/api";
import type { Profile, Order } from "@/lib/types";

const demoUser = {
  id: "demo-user",
  name: "Cliente Demo",
  email: "cliente@demo.com",
};

export default function ContaPage() {
  const user = demoUser;
  const authLoading = false;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("perfil");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
      if (activeTab === "pedidos") {
        loadOrders();
      }
    }
  }, [user, activeTab]);

  const loadProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const profileData = await getProfile(user.id);
      setProfile(profileData);
      setName(profileData.name || "");
      setPhone(profileData.phone || "");
      setCpf(profileData.cpf || "");
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const ordersData = await getOrders(user.id);
      setOrders(ordersData);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateProfile(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        cpf: cpf.trim(),
      });
      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setErrorMessage("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.push("/");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: "Pendente",
      processing: "Em processamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 mb-8">
          <h1 className="text-4xl font-light tracking-wider text-black mb-2">
            MINHA CONTA
          </h1>
          <p className="text-gray-600 font-light text-lg">
            Olá, {user.name || user.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-16">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab("perfil")}
                  className={`px-6 py-4 text-left font-light transition-all border-b border-gray-100 ${
                    activeTab === "perfil"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Meu Perfil
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("pedidos")}
                  className={`px-6 py-4 text-left font-light transition-all border-b border-gray-100 ${
                    activeTab === "pedidos"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Meus Pedidos
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("seguranca")}
                  className={`px-6 py-4 text-left font-light transition-all border-b border-gray-100 ${
                    activeTab === "seguranca"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Segurança
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-4 text-left font-light text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sair da Conta
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Perfil Tab */}
            {activeTab === "perfil" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-light text-black mb-6">
                  Dados Pessoais
                </h2>

                {successMessage && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-light">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-light">
                    {errorMessage}
                  </div>
                )}

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-light">
                      Carregando perfil...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-light cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1 font-light">
                        O email não pode ser alterado
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pedidos Tab */}
            {activeTab === "pedidos" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-light text-black mb-6">
                  Meus Pedidos
                </h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-light">
                      Carregando pedidos...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-600 font-light mb-4">
                      Você ainda não fez nenhum pedido
                    </p>
                    <button
                      onClick={() => router.push("/home")}
                      className="text-black font-light hover:underline"
                    >
                      Começar a comprar →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-600 font-light">
                              Pedido #{order.id.substring(0, 8)}
                            </p>
                            <p className="text-lg font-light text-black mt-1">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-light border ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 font-light space-y-1">
                          <p>Data: {formatDate(order.created_at)}</p>
                          <p>
                            Entrega: {order.shipping_address_street},{" "}
                            {order.shipping_address_number}
                          </p>
                          <p>
                            {order.shipping_address_city} -{" "}
                            {order.shipping_address_state}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Segurança Tab */}
            {activeTab === "seguranca" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-light text-black mb-6">
                  Segurança
                </h2>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-light text-black mb-2">
                      Senha
                    </h3>
                    <p className="text-gray-600 font-light mb-4">
                      Altere sua senha periodicamente para manter sua conta
                      segura
                    </p>
                    <button
                      onClick={() => router.push("/recuperar-senha")}
                      className="text-black font-light hover:underline"
                    >
                      Alterar senha →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-light text-black mb-2">
                      Autenticação de dois fatores
                    </h3>
                    <p className="text-gray-600 font-light mb-4">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                    <button
                      disabled
                      className="text-gray-400 font-light cursor-not-allowed"
                    >
                      Em breve
                    </button>
                  </div>

                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <h3 className="text-lg font-light text-red-900 mb-2">
                      Excluir conta
                    </h3>
                    <p className="text-red-700 font-light mb-4">
                      Esta ação é irreversível. Todos os seus dados serão
                      permanentemente removidos.
                    </p>
                    <button className="text-red-600 font-light hover:underline">
                      Excluir minha conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
