import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Arcus Learning Platform</span>
          <h1>Turn sign-in friction into a clean path from landing page to courses.</h1>
          <p>
            The app now starts with a focused entry experience: discover the
            platform, create an account, sign in, and move into protected course
            content without extra role selectors.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" href="/login">
              Go to login
            </Link>
            <Link className="button button--ghost" href="/signup">
              Create account
            </Link>
          </div>
        </div>

        <div className="landing-panel">
          <div className="stat-card">
            <span>Flow</span>
            <strong>Landing → Login → Courses</strong>
          </div>
          <div className="stat-card">
            <span>Signup fields</span>
            <strong>Email, username, password</strong>
          </div>
          <div className="stat-card">
            <span>Protection</span>
            <strong>Cookie-based route gating</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
