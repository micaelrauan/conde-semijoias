import Link from "next/link";

export default function PedidoCanceladoPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
        <h1 className="text-2xl font-light text-black">
          Compra nao finalizada
        </h1>
        <p className="text-gray-600 font-light">
          Voce saiu do checkout. Seu carrinho foi mantido.
        </p>
        <Link
          href="/produtos"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black text-white px-6 hover:bg-gray-800 transition-colors"
        >
          VOLTAR PARA A LOJA
        </Link>
      </div>
    </main>
  );
}
