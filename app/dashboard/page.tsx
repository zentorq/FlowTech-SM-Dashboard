export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth";
import { signOut } from "../actions";
import BrandPanel from "../BrandPanel";

// NOTE: these are the static sample metrics from the original design.
// They are placeholders, not live data. Wire real platform APIs in later.
const METRICS = [
  { platform: "Google", icon: "G", iconClass: "google", value: "24.8K", change: "↗ 12.4% this month" },
  { platform: "Meta", icon: "M", iconClass: "meta", value: "18.6K", change: "↗ 8.7% this month" },
  { platform: "Twitter / X", icon: "X", iconClass: "twitter", value: "9.2K", change: "↗ 5.1% this month" },
  { platform: "LinkedIn", icon: "in", iconClass: "linkedin", value: "13.4K", change: "↗ 16.8% this month" },
];

export default async function Dashboard() {
  const auth = await getAuthState();
  if (auth.kind === "none") redirect("/");

  const isGuest = auth.kind === "guest";

  return (
    <main className="page">
      <section className="app-shell">
        <BrandPanel />
        <section className="login-panel">
          <div className="dashboard active">
            {isGuest && (
              <div className="demo-banner">
                You are viewing demo data as a guest. The metrics below are sample
                placeholders, not live account data. Create an account to save a
                real profile.
              </div>
            )}

            <div className="dashboard-top">
              <div>
                <h2>Social Media Overview</h2>
                <p>
                  {isGuest
                    ? "You are viewing demo data as a guest."
                    : `Signed in as ${auth.user.email}`}
                </p>
              </div>

              <div className="dashboard-actions">
                <form action={signOut}>
                  <button className="danger-button" type="submit">
                    Sign out
                  </button>
                </form>
              </div>
            </div>

            <div className="metrics-grid">
              {METRICS.map((m) => (
                <article className="metric-card" key={m.platform}>
                  <div className="platform">
                    <span className={`platform-icon ${m.iconClass}`}>{m.icon}</span>
                    {m.platform}
                  </div>
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-change">{m.change}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
