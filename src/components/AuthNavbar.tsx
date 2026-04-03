"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

export default function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="shrink-0">
            <h1 className="text-xl font-light tracking-wider text-black">
              CONDE SEMIJOIAS
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {!isSignedIn && (
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-light text-gray-600 transition-colors hover:border-gray-300 hover:text-black">
                    Entrar
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-light text-white transition-colors hover:bg-gray-800">
                    Criar Conta
                  </button>
                </SignUpButton>
              </div>
            )}
            {isSignedIn && (
              <UserButton />
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-black transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-5">
            <div className="space-y-4">
              {!isSignedIn && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-black">Acesse sua conta</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Entre ou crie uma conta para continuar.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-black"
                      >
                        Entrar
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                      >
                        Criar Conta
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              )}

              {isSignedIn && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-3">
                  <UserButton />
                  <div>
                    <p className="text-sm font-medium text-black">Minha conta</p>
                    <p className="text-sm text-gray-600">Gerencie seu perfil no Clerk.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
