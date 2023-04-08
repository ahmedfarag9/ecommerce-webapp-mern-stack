# ecommerce-webapp-mern-stack

## About project

In this project, We will build an Ecommerce Webapp using MERN Stack (MongoDB, Express, React, Node.js) and Redux for state management.

---

## Project Structure

1. client
2. server
3. admin dashboard
4. docker folder
5. mobile app (Using Flutter - implemented separately in another repo - integration with the webapp server will be done later)

---

## Project Setup Steps

To be determined

---

## Project Documentation

All Project Information is in this notion link --> [notion](https://www.notion.so/ahmed-farag/E-Commerce-Website-Mern-stack-da3c9e4dc31d48459815432d92e533f6?pvs=4)

Trello Board Link --> [trello](https://trello.com/invite/b/81kTWqoe/ATTIb70b2cd35740589b86085a90a96a05f993E23837/ecommerce-webapp-mern-stack)

Database Schema Link --> [db schema](https://lucid.app/documents/view/41dc8682-dbec-40de-8576-ce771a96559a)

---

## Project Workflow:

1. Create a new branch from dev branch
2. Commit your changes
3. Push your changes to the remote branch
4. Create a pull request to dev branch
5. Merge the pull request to dev branch
6. Delete the remote branch
7. Delete the local branch
8. Pull the latest changes from dev branch
9. Repeat steps 1-8

## Project Branches strategy:

1. main branch is for production
2. dev branch is for development
3. feature branch is for feature development (e.g. feature/feature-name)
4. bug branch is for bug fixing (e.g. bug/bug-name)
5. test branch is for testing (e.g. test/test-name)

## How to create new branch

```bash
git checkout dev # switch to dev branch
git pull # pull the latest changes from dev branch
git checkout -b feature/feature-name # create a new branch from dev branch
git push --set-upstream origin feature/feature-name # push the new branch to remote
```

## How to delete a branch

```bash
git checkout dev # switch to dev branch
git pull # pull the latest changes from dev branch
git branch -d feature/feature-name # delete the local branch
git fetch --prune # delete the remote branch
git branch -a # list all branches
```

## Project Commit Message:

```
1. Commit message should be in the following format:
2. type: subject
3. type: feat, fix, docs, style, refactor, test, chore
4. subject: start with a verb (e.g. change, add, remove)
5. subject: use the imperative, present tense: “change” not “changed” nor “changes”
6. subject: do not capitalize first letter
7. subject: do not add a period (.) at the end
8. Examples:
   - feat: add a new feature
   - fix: fix a bug
   - docs: add or update documentation
   - style: improve code style
   - refactor: refactor code
   - test: add or update tests
   - chore: update build tasks, package manager configs, etc
```

## Project Pull Request Message:

Pull request message should be in the following format:
example:

```
# Pull Request Template

## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

## Type of change

Please delete options that are not relevant.

- [] Bug fix (non-breaking change which fixes an issue)
- [] New feature (non-breaking change which adds functionality)
- [] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [] This change requires a documentation update
- [] This change requires a configuration update
- [] This change requires a database migration
- [] This change requires a new dependency
- [] This change requires a new environment variable
- [] This change requires a new dependency in package.json

```

## DevOps Notes

Docker, docker-compose, DockeHub container registry and CICD tool will be configured later
