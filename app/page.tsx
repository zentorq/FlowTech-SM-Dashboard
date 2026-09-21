export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth";
import BrandPanel from "./BrandPanel";
import LoginForm from "./LoginForm";

export default async function Home() {
  const auth = await getAuthState();
  if (auth.kind !== "none") redirect("/dashboard");

  return (
    <main className="page">
      <section className="app-shell">
        <BrandPanel />
        <section className="login-panel">
          <div className="login-screen">
            <LoginForm />
          </div>
        </section>
      </section>
    </main>
  );
}
