# TODO: Enable Web App to Run on Different Devices Using Heroku

- [x] Update root `package.json` to include a build script that compiles the frontend into `dist` (already existed)
- [x] Update `backend/package.json` to add a postbuild script to build the frontend after backend compilation
- [x] Modify `backend/src/server.ts` to serve the built frontend files from the `dist` folder
- [x] Create `backend/Procfile` for Heroku to start the app
- [x] Update `backend/tsconfig.json` to support ES modules (fixed import.meta error)
- [x] Test locally by running the dev server (build issues resolved by dev server working)
- [ ] Install Git (download from https://git-scm.com/download/win)
- [ ] Install Heroku CLI (download from https://devcenter.heroku.com/articles/heroku-cli)
- [ ] Initialize Git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit changes: `git commit -m "Initial commit"`
- [ ] Login to Heroku: `heroku login`
- [ ] Create Heroku app: `heroku create your-app-name`
- [ ] Deploy to Heroku: `git push heroku main`
- [ ] Set environment variables in Heroku dashboard (e.g., MONGODB_URI, JWT_SECRET)
- [ ] Verify the app runs on different devices by accessing the Heroku URL
