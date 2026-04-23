npm run build
cd build
git init
git remote add origin https://github.com/phonetics-spbu/phonetics-spbu.github.io.git
git checkout -b gh-pages
git add .
git commit -m "deploy"
git push -f origin gh-pages