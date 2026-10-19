This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Use Node.js 22 (production Docker runtime), or Node.js >=20.9 locally, and Yarn 1.22.22.
Install the locked dependencies and run the development server:

```bash
yarn install --frozen-lockfile
yarn dev
```

Open [http://localhost:4137](http://localhost:4137) with your browser to see the result.

Next.js 16 development and production builds explicitly use Webpack for Sentry compatibility.
Run `yarn lint`, `yarn next typegen`, `yarn tsc --noEmit`, and `yarn build` before release.
The Docker build runs lint separately because Next.js no longer runs it during builds.
Builds require the REST API and DatoCMS environment settings and connectivity for sitemap generation.
See [migration verification and release blockers](docs/next16-migration.md) before deploying Next.js 16.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
