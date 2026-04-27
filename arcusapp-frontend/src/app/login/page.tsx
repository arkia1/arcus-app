import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-layout">
      <section className="auth-panel auth-panel--hero">
        <div className="auth-hero">
          <span className="eyebrow">Arcus</span>
          <h1>Focused courses, cleaner onboarding, zero role friction.</h1>
          <p>
            The auth flow now starts with a simple email-and-password experience,
            with protected learning routes ready behind it.
          </p>
          <div className="hero-points">
            <div>
              <strong>Responsive</strong>
              <span>Built for desktop and mobile from the start.</span>
            </div>
            <div>
              <strong>Protected</strong>
              <span>Signed-in learners move straight into their courses.</span>
            </div>
          </div>
          <Link className="button button--ghost" href="/">
            Back to landing page
          </Link>
        </div>
      </section>
      <section className="auth-panel">
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
