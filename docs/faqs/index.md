[project]: https://github.com/ElMassimo/js_from_routes
[GitHub Issues]: https://github.com/ElMassimo/js_from_routes/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc
[GitHub Discussions]: https://github.com/ElMassimo/js_from_routes/discussions
[client]: /client/

# Troubleshooting

This section lists a few common gotchas, and bugs introduced in the past.

Please skim through __before__ opening an [issue][GitHub Issues].

## Could not resolve "@js-from-routes/core"

Some package managers do not install `peerDependencies`, while others [do](https://github.com/npm/rfcs/blob/latest/implemented/0025-install-peer-deps.md).

Try adding the missing package explicitly:

```bash
npm install @js-from-routes/core # yarn add @js-from-routes/core
```

## Imports in the generated code are not working

Make sure that you have added one of the [client libraries][client] to your `package.json` and that the packages are installed.

## Changes to my custom templates are not being picked up

Templates are watched in development, so editing one regenerates the helpers on the next reload. If a template reads from other files, those are not watched: regenerate everything by running:

```bash
bin/rake js_from_routes:generate
```

## Contact ✉️

Please visit [GitHub Issues] to report bugs you find, and [GitHub Discussions] to make feature requests, or to get help.

Don't hesitate to [⭐️ star the project][project] if you find it useful!

Using it in production? Always love to hear about it! 😃
