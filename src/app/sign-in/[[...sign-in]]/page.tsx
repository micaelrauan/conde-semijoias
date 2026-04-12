import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Entrar - Conde Semijoias" };

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto flex max-w-md justify-center">
        <SignIn forceRedirectUrl="/completar-cadastro" />
      </div>
    </div>
  );
}
