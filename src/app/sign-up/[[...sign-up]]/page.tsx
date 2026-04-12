import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Criar Conta - Conde Semijoias" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto flex max-w-md justify-center">
        <SignUp forceRedirectUrl="/completar-cadastro" />
      </div>
    </div>
  );
}
