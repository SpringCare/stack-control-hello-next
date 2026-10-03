import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-dynamic";

const MANIFEST_PATH = ".stack-control/service.yaml";

async function readManifest(): Promise<string | null> {
  try {
    return (await readFile(join(process.cwd(), MANIFEST_PATH), "utf8")).trimEnd();
  } catch {
    return null;
  }
}

function Fact({ label, value }: { label: string; value: string | undefined }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={value ? undefined : "unset"}>{value ?? "not set (running outside a stack)"}</dd>
    </>
  );
}

/** One top-level `key: value` out of the manifest, without a YAML dependency. */
function manifestField(manifest: string | null, key: string): string | null {
  const match = manifest?.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

function launchSteps(setup: string | null, start: string | null) {
  return [
  {
    step: "Read the manifest",
    detail:
      "Pinned the branch to a commit with the developer's own GitHub credential, then read .stack-control/service.yaml at that exact commit.",
  },
  {
    step: "Picked a stock runtime",
    detail:
      "runtime: node-22 maps to the public node:22-bookworm image. No image was built for this repo, and no ECR repository exists for it.",
  },
  {
    step: "Cloned the pinned commit",
    detail: "An init container, workspace-clone, fetched exactly that commit into a scratch volume at /app.",
  },
  {
    step: "Ran setup",
    detail: setup
      ? `The same init container ran the manifest's setup command: ${setup}.`
      : "The manifest has no setup command, so nothing ran before the app.",
  },
  {
    step: "Started the app",
    detail:
      `The app container ran ${start ?? "the start command"} from /app, health-checked on ` +
      "/api/health, behind the stack's own HTTPS hostname.",
  },
  ];
}

export default async function Home() {
  const manifest = await readManifest();
  const repo = process.env.SC_REPO;
  const commit = process.env.SC_REPO_COMMIT;
  const devMode = process.env.NODE_ENV === "development";
  const steps = launchSteps(manifestField(manifest, "setup"), manifestField(manifest, "start"));

  return (
    <main className="screen">
      <div className="window">
        <div className="titlebar" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="title">stack-control: {process.env.HOSTNAME ?? "localhost"}</span>
        </div>

        <div className="body">
          <p className="prompt">
            $ <b>stack-control launch</b> {repo ?? "SpringCare/stack-control-hello-next"}
          </p>
          <h1>
            Hello from stack-control
            <span className="cursor" aria-hidden="true" />
          </h1>
          <p>
            <span className="tag">Tier 0 repo service</span>{" "}
            <span className="tag">{devMode ? "dev mode · hot reload" : "production build"}</span>
          </p>

          <h2>What this demonstrates</h2>
          <p>
            This app was onboarded to stack-control by adding one file to its repository:{" "}
            <code>{MANIFEST_PATH}</code>. It has no Dockerfile, no image build workflow, no ECR
            repository and no entry in stack-control&apos;s service catalog.
          </p>
          <p>
            A developer pasted this repository&apos;s URL on the New Stack page, and stack-control
            worked out how to run it from the manifest alone. That is the Tier 0 path: the repo
            describes itself, and the platform runs it on a stock runtime image.
          </p>

          <h2>How stack-control launched it</h2>
          <ol className="log">
            {steps.map(({ step, detail }) => (
              <li key={step}>
                <span aria-hidden="true">✓</span>
                <span>
                  {step}
                  <span className="detail">{detail}</span>
                </span>
              </li>
            ))}
          </ol>

          <h2>This pod</h2>
          <dl className="facts">
            <Fact label="repository" value={repo} />
            <Fact label="branch" value={process.env.SC_REPO_BRANCH} />
            <Fact label="commit" value={commit} />
            <Fact label="pod" value={process.env.HOSTNAME} />
            <Fact label="node" value={process.version} />
            <Fact label="port" value={process.env.PORT} />
          </dl>

          <h2>The manifest it was launched from</h2>
          {manifest ? (
            <pre aria-label={MANIFEST_PATH}>
              <code>{manifest}</code>
            </pre>
          ) : (
            <p className="prompt">{MANIFEST_PATH} could not be read from this working directory.</p>
          )}

          <h2>Not in Tier 0 yet</h2>
          <ul className="missing">
            <li>
              <span aria-hidden="true">-</span>
              <span>Secrets, databases, and wiring to other services in the stack</span>
            </li>
            <li>
              <span aria-hidden="true">-</span>
              <span>Registering a repo so it appears in the catalog for everyone</span>
            </li>
            <li>
              <span aria-hidden="true">-</span>
              <span>Launching from the stack-control MCP tools, not only the web form</span>
            </li>
          </ul>

          <footer>
            {repo && commit ? (
              <a href={`https://github.com/${repo}/commit/${commit}`}>
                view commit {commit.slice(0, 7)} on GitHub
              </a>
            ) : (
              "Launch this repo from stack-control to see its stack details."
            )}
          </footer>
        </div>
      </div>
    </main>
  );
}
