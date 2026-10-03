export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
      <h1>Hello from stack-control</h1>
      <p>
        This Next.js app was launched from its repo&apos;s <code>.stack-control/</code>{" "}
        manifest, with no image of its own.
      </p>
      <dl>
        <dt>Repo</dt>
        <dd>{process.env.SC_REPO ?? "(not set)"}</dd>
        <dt>Commit</dt>
        <dd>{process.env.SC_REPO_COMMIT ?? "(not set)"}</dd>
        <dt>Host</dt>
        <dd>{process.env.HOSTNAME ?? "(unknown)"}</dd>
      </dl>
    </main>
  );
}
