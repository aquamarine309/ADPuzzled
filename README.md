
# Antimatter Dimensions

## Run

To run the game locally, you will need to install
[Node.js](https://nodejs.org/) (LTS suggested).

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```
npm ci
```

> If you encounter peer dependency errors, ensure `.npmrc` exists with
> `legacy-peer-deps=true` (already included in the repository) or run
> `npm ci --legacy-peer-deps`.

After all the packages are installed, start up the game in development mode:

```
npm run dev
```

This will make the game served via your localhost, and the playable link will
be displayed in your terminal (default: `http://localhost:8080`).  
The development server supports **Hot Module Replacement (HMR)** – changes to
source files are instantly reflected in the browser without a full reload.

To build for production (output in `dist/`), use:

```
npm run build:release
```

To build for Steam (output in `../AppFiles`), use:

```
npm run build:steam-release
```

For a preview of the built production version, run:

```
npm run preview
```