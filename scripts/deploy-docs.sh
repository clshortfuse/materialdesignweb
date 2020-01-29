if [ -z $(git status --untracked-files=no --porcelain) ];
then
    git add dist/docs -f
    git commit -m "Update Docs"
    git push origin `git subtree split --prefix dist/docs master`:gh-pages --force
    git reset HEAD~
else
    echo "Need clean working directory to publish"
fi