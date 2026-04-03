"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

interface UserMenuProps {
  compact?: boolean;
}

export default function UserMenu({ compact = false }: UserMenuProps) {
  const { isSignedIn } = useAuth();
  const buttonClasses = compact
    ? "min-h-11 px-4 text-sm"
    : "min-h-11 px-5 text-sm";

  return (
    <div className="flex items-center gap-3">
      {!isSignedIn && (
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black transition-colors ${buttonClasses}`}
            >
              Entrar
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
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
        <UserButton />
      )}
    </div>
  );
}
