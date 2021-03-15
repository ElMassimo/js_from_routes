[project]: https://github.com/ElMassimo/js_from_routes
[GitHub Issues]: https://github.com/ElMassimo/js_from_routes/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc
[GitHub Discussions]: https://github.com/ElMassimo/js_from_routes/discussions
[client]: /client/
[cache key]: /guide/codegen.html#caching-📦

# Troubleshooting

This section lists a few common gotchas, and bugs introduced in the past.

Please skim through __before__ opening an [issue][GitHub Issues].

### Imports in the generated code are not working

Make sure that you have added one of the [client libraries][client] to your `package.json` and that the packages are installed.

### Changes to my custom templates are not being picked up

Modifying the template should change the [cache key], so you might have introduced additional dependencies in your custom template.

Try forcing regeneration by running:

```bash
JS_FROM_ROUTES_FORCE=true bin/rake js_from_routes:generate
```

## Contact ✉️

Please visit [GitHub Issues] to report bugs you find, and [GitHub Discussions] to make feature requests, or to get help.

Don't hesitate to [⭐️ star the project][project] if you find it useful!

Using it in production? Always love to hear about it! 😃
