import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { buildApiUrl } from "@/lib/api";

type CourseResponse = {
  learner: {
    id: string;
    email: string;
    username: string;
  };
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    level: string;
  }>;
};

async function getCourses() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(buildApiUrl("/courses"), {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Unable to load courses");
  }

  return (await response.json()) as CourseResponse;
}

export default async function CoursesPage() {
  const data = await getCourses();

  return (
    <main className="courses-page">
      <section className="courses-hero">
        <div>
          <span className="eyebrow">Protected route</span>
          <h1>Welcome back, {data.learner.username}.</h1>
          <p>
            Your session is active, your routes are protected, and the frontend
            is now wired to the Nest auth backend.
          </p>
        </div>
        <LogoutButton />
      </section>

      <section className="course-grid">
        {data.courses.map((course) => (
          <article className="course-card" key={course.id}>
            <span className="course-level">{course.level}</span>
            <h2>{course.title}</h2>
            <p>{course.progress}% complete</p>
            <div aria-hidden className="course-progress">
              <span style={{ width: `${course.progress}%` }} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
