"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue your learning journey.",
    endpoint: "/auth/login",
    submitLabel: "Log in",
    altLabel: "Need an account?",
    altHref: "/signup",
    altAction: "Create one",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start learning with a clean email-and-password signup flow.",
    endpoint: "/auth/signup",
    submitLabel: "Create account",
    altLabel: "Already have an account?",
    altHref: "/login",
    altAction: "Log in",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = copy[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload =
      mode === "signup"
        ? {
            email: String(formData.get("email") ?? ""),
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
          }
        : {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}${content.endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { message?: string | string[] }
          | null;

        const message = Array.isArray(body?.message)
          ? body?.message[0]
          : body?.message;

        throw new Error(message ?? "Something went wrong");
      }

      router.push("/courses");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to complete your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-card auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__header">
        <span className="eyebrow">Arcus Learning</span>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>

      {mode === "signup" ? (
        <label className="field">
          <span>Username</span>
          <input
            name="username"
            type="text"
            placeholder="yourname"
            minLength={3}
            maxLength={80}
            required
          />
        </label>
      ) : null}

      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button button--primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Working..." : content.submitLabel}
      </button>

      <p className="auth-switch">
        {content.altLabel} <Link href={content.altHref}>{content.altAction}</Link>
      </p>
    </form>
  );
}
