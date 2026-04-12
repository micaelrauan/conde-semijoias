"use client";

import dynamic from "next/dynamic";
import { UserButton, useAuth } from "@clerk/nextjs";

const SignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignInButton })),
  { ssr: false },
);

const SignUpButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignUpButton })),
  { ssr: false },
);

interface UserMenuProps {
  compact?: boolean;
  iconOnly?: boolean;
}

export default function UserMenu({
  compact = false,
  iconOnly = false,
}: UserMenuProps) {
  const { isSignedIn } = useAuth();
  const buttonClasses = compact
    ? "min-h-11 px-4 text-sm"
    : "min-h-11 px-5 text-sm";

  if (iconOnly) {
    return (
      <div className="flex items-center justify-center">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button
              type="button"
              className="flex min-h-11 flex-col items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1112 21a8.96 8.96 0 01-6.879-3.196zM15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="mt-1 text-xs font-light">Perfil</span>
            </button>
          </SignInButton>
        ) : (
          <div className="flex min-h-11 flex-col items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-black">
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Meus Pedidos"
                  labelIcon={<span>MP</span>}
                  href="/meus-pedidos"
                />
                <UserButton.Link
                  label="Favoritos"
                  labelIcon={<span>FV</span>}
                  href="/favoritos"
                />
              </UserButton.MenuItems>
            </UserButton>
            <span className="mt-1 text-xs font-light">Perfil</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn && (
        <div className="flex items-center gap-3">
          <SignInButton mode="modal" forceRedirectUrl="/completar-cadastro">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black transition-colors ${buttonClasses}`}
            >
              Entrar
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/completar-cadastro">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg bg-black text-white font-light hover:bg-gray-800 transition-colors ${buttonClasses}`}
            >
              Registrar
            </button>
          </SignUpButton>
        </div>
      )}

      {isSignedIn && (
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Meus Pedidos"
              labelIcon={<span>MP</span>}
              href="/meus-pedidos"
            />
            <UserButton.Link
              label="Favoritos"
              labelIcon={<span>FV</span>}
              href="/favoritos"
            />
          </UserButton.MenuItems>
        </UserButton>
      )}
    </div>
  );
}
