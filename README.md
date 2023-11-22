# nextjs-template

Template that I use to bootstrap my Next.js projects.

 - Includes `TailwindCSS`, `TypeScript`, and `ESLint` + `stylistic` with some default rules. 
 - Uses `pnpm`.
 - Configured to use `app` router inside the `src` folder.

## Using

You can use this template by either:
 
- Using `create-next-app`:
    ```bash
    pnpm create next-app -e https://github.com/otomir23/nextjs-template [project-name]
    ```
- Clicking on the `Use this template` button on the top right of this page.

## First steps

After creating your project, you should:
- Update project metadata in `package.json`.
- Update website metadata in `src/app/layout.tsx`.
- Update `LICENSE` file.
- Update `README.md` file.

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the app for production.
- `start`: Runs the built app in production mode.
- `lint`: Runs ESLint.
