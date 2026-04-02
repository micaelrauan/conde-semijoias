import { mockOrders, mockProfiles } from "../mock-data";
import type { Profile, UpdateProfileDTO } from "../types";

// ============================================
// PERFIL DO USUÁRIO
// ============================================

/**
 * Busca perfil do usuário
 */
export async function getProfile(userId: string) {
  const profile = mockProfiles.find((entry) => entry.id === userId);
  if (!profile) {
    throw new Error("Perfil nao encontrado");
  }
  return profile;
}

/**
 * Atualiza perfil do usuário
 */
export async function updateProfile(userId: string, dto: UpdateProfileDTO) {
  const profile = mockProfiles.find((entry) => entry.id === userId);
  if (!profile) {
    throw new Error("Perfil nao encontrado");
  }

  Object.assign(profile, dto, {
    updated_at: new Date().toISOString(),
  });

  return profile;
}

/**
 * Busca usuário atual com perfil
 */
export async function getCurrentUser() {
  const user = {
    id: "demo-user",
    email: "cliente@demo.com",
  };

  const profile = await getProfile(user.id);

  return {
    ...user,
    profile,
    orders: mockOrders.filter((order) => order.user_id === user.id),
  };
}
