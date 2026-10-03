# stack-control-hello-next

A hello-world Next.js app used to spike repo-defined services in stack-control:
a repo describes how to run itself in `.stack-control/service.yaml`, and
stack-control launches it on a stock runtime image. There is no Dockerfile, no
image build workflow and no ECR repo.

## How it runs on a stack

1. stack-control reads `.stack-control/service.yaml` at the branch you launch.
2. An init container clones this repo at the pinned commit and runs `setup`.
3. The app container runs `start` and is health-checked on `health`.

## Local development

```bash
npm install
npm run dev
```
