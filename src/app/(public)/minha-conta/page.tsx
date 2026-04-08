import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Minha Conta - Conde Semijoias" };

export default async function MinhaContaPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-light text-black">Minha Conta</h1>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xl font-medium text-black">
            {user.fullName ?? user.firstName ?? "Ola!"}
          </p>
          <p className="mt-2 text-gray-600">
            {user.emailAddresses[0]?.emailAddress}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/meus-pedidos"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
            >
              Meus Pedidos -&gt;
            </Link>
            <Link
              href="/favoritos"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
            >
              Favoritos -&gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
