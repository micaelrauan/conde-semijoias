import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato - Conde Semijoias",
  description:
    "Fale com a equipe Conde Semijoias por e-mail, WhatsApp e Instagram.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-light text-black">Contato</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-medium text-black">E-mail</h2>
            <p className="mt-2 text-gray-700">condesemijoias.site@gmail.com</p>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-medium text-black">WhatsApp</h2>
            <p className="mt-2 text-gray-700">+55 (85) 9 9839-5280</p>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-medium text-black">Instagram</h2>
            <p className="mt-2 text-gray-700">@condesemijoias</p>
          </article>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-lg font-medium text-black">
            Horario de atendimento
          </h2>
          <p className="mt-2 text-gray-700">Segunda a Sexta, 9h as 18h</p>
        </div>
      </section>
    </div>
  );
}
