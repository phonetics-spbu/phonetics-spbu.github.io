@echo off

echo Building React app...
call npm run build

if %errorlevel% neq 0 (
  echo Build failed. Exiting.
  exit /b %errorlevel%
)

echo Moving into build folder...
cd build

echo Initializing temporary git repo...
git init

echo Adding remote...
git remote add origin https://github.com/phonetics-spbu/phonetics-spbu.github.io.git

echo Creating gh-pages branch...
git checkout -b gh-pages

echo Adding files...
git add .

echo Committing...
git commit -m "Deploy to GitHub Pages"

echo Pushing to GitHub...
git push -f origin gh-pages

echo Done!
pause