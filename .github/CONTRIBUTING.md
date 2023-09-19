# Contributing

❤️ We love pull requests from everyone. 🎉

The following are a set of guidelines to follow when contributing to this project to ensure that your contributions are accepted as quickly as possible.

## Code of conduct

This project adheres to a [code of conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold this code. Please report unacceptable behavior to the
project maintainers.

## Have a question?

Start by filing an issue. The existing committers on this project work to reach
consensus around project direction and issue solutions within issue threads
(when appropriate).

## Submitting a contribution

All submissions should come in the form of pull requests and need to be reviewed
by project committers.

Start by [forking](https://help.github.com/articles/fork-a-repo/) the repo, then [clone](https://help.github.com/articles/cloning-a-repository/) your fork:

```shell
git clone git@github.com:yourusername/glob-concat-ci.git
```

Set up a branch for your feature or bug fix, push it to your fork, and set up a remote for the upstream repo:

```shell
git checkout -b feat-my-awesome-new-feature-issue-123
git push -u origin feat-my-awesome-new-feature-issue-123
git remote add upstream git@github.com:castastrophe/glob-concat-ci.git
```

It's helpful to prefix your branches with the conventional commit type associated with your work and to postfix the branch with the issue it addresses. Branch naming is not strictly enforced as long as commits follow the format described below.

If you have not done so already, install the package manager [yarn](https://yarnpkg.com/en/docs/install). The below are instructions for macOS, but you can find instructions for other operating systems on the yarn website.

```shell
brew install yarn || curl -o- -L https://yarnpkg.com/install.sh | bash
```

Install dependencies:

```shell
yarn install
```

Make your changes, write your tests. Try to follow the existing style as much as possible and ensure you keep your updates focused on one feature or bug fix per pull request. Doing this will ensure that your pull request is accepted as quickly as possible.

Tests are run with [AVA](https://github.com/avajs/ava) which is a minimal and fast test runner with a simple API that meets the needs of this project.

To run the tests:

```shell
yarn test
```

To validate your test coverage:

```shell
yarn coverage
```

Test coverage will also be run automatically on pull requests and reported in the pull request status.

Commit changes with a [conventional commit message](https://www.conventionalcommits.org), making sure to correctly use `feat:`, `fix:`, and `BREAKING CHANGE` accordingly, and referencing the relevant issue number (if any):

```shell
git commit -m "fix: issue with base64 conversion, fixes #252"
```

Make sure your branch is up to date with the original repo before submitting your pull request. If you're not sure how to do this, check out [this guide](https://help.github.com/articles/syncing-a-fork/).

[Submit a pull request](https://help.github.com/articles/creating-a-pull-request/).

At this point you're waiting on me. I do my best to keep on top of pull requests. I may suggest some changes, improvements or alternatives but it's a conversation and I'll work with you to get your pull request merged as quickly as possible.

Some things that will increase the chance that your pull request is accepted:

- Write a thorough pull request description, include screenshots if applicable.
- Write out your test cases for any new features or bug fixes in as much detail as possible and include them in the pull request description.
- Make sure the PR merges cleanly with the latest main.
- Describe your feature/bugfix and why it's needed/important in the pull request description.
- Make sure your commit messages follow the [conventional commit message](https://www.conventionalcommits.org) format.
- Be kind! We're all here to help and work together to make this project as amazing as possible.
