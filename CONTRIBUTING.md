# Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

If you have found an issue or would like to request a new feature, simply create a new issue detailing the request. We also welcome pull requests. See below for information on getting started with development and submitting pull requests.

Please note we have a [code of conduct](https://github.com/design-sparx/mantine-analytics-dashboard/blob/main/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

> This repo uses [changesets](https://github.com/changesets/changesets) to
> make releasing updates easier. For you, the contributor, this means you
> should run `npm run changeset` when you've got your changes ready. For
> more details, see this short document on [adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-single-package-repository).

## Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our [GitHub Repository](https://github.com/design-sparx/mantine-analytics-dashboard/issues/new/choose). Even better you can submit a Pull Request with a fix.

## Submitting a Pull Request

1. Make sure that the contribution you want to make is explained or detailed in a GitHub issue! Find an [existing issue](https://github.com/design-sparx/mantine-analytics-dashboard/issues) or [open a new one](https://github.com/design-sparx/mantine-analytics-dashboard/issues/new/choose).
2. Once done, [fork the repository](https://github.com/design-sparx/mantine-analytics-dashboard/fork) in your own GitHub account.
3. [Create a new Git branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository).
4. Make the changes on your branch.
5. [Submit the branch as a PR](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) pointing to the main branch of the main repository.
   > We do not enforce a naming convention for the PRs, but please use something descriptive of your changes.

## Development Workflow

Install dependencies

```
pnpm install
```

Run dev server

```
pnpm run dev
```

## Linter

Each PR should pass the linter to be accepted. To fix lint and prettier errors, run `pnpm run lint:fix` and `pnpm run prettier:fix`.

## Commit Message

We use [commitlint](https://commitlint.js.org/guides/getting-started) to manage and standardize our commits:

- check [commitlint conventional guides](https://github.com/conventional-changelog/commitlint?tab=readme-ov-file#what-is-commitlint),
- not finish by a dot or any other punctuation character (!,?),
- start with a verb so that we can read your commit message this way: "This commit will ...", where "..." is the commit message. e.g.: "Fix the home page button" or "Add support for dark mode"
