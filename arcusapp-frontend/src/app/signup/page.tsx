import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="auth-layout">
      <section className="auth-panel auth-panel--hero">
        <div className="auth-hero">
          <span className="eyebrow">New learner flow</span>
          <h1>Sign up without role selection or .edu restrictions.</h1>
          <p>
            This version keeps signup intentionally lean: email, username, and
            password now, with room to extend profile fields later.
          </p>
          <div className="hero-points">
            <div>
              <strong>Faster</strong>
              <span>Lower friction at the point of account creation.</span>
            </div>
            <div>
              <strong>Extensible</strong>
              <span>Profile and analytics fields can be added later.</span>
            </div>
          </div>
          <Link className="button button--ghost" href="/">
            Back to landing page
          </Link>
        </div>
      </section>
      <section className="auth-panel">
        <AuthForm mode="signup" />
      </section>
    </main>
  );
}
