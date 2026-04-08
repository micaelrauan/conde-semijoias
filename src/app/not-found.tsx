import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-7xl font-light text-[#6B0000]">404</p>
        <h1 className="mt-4 text-3xl font-light text-black">
          Pagina nao encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          A pagina que voce esta procurando nao existe ou foi movida.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            IR PARA A HOME
          </Link>
          <Link
            href="/produtos"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
          >
            VER PRODUTOS
          </Link>
        </div>
      </div>
    </div>
  );
}
