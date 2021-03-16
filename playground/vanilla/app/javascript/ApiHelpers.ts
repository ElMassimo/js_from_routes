/// <reference types="vite/client" />

/**
 *  NOT RECOMMENDED
 *
 *  Starting in 2.0 a `all_helpers` file is generated which also provides the
 *  benefit of autocompletion and type-safety.
 */

// Example: Combine all generated path helpers into a single object.
export default Object.entries(import.meta.globEager('./api/**/*.{js,ts}'))
  .reduce((routes: Record<string, any>, [fileName, module]) => {
    routes[controllerName(fileName)] = module.default
    return routes
  }, {})

/**
 * Removes the leading directory and the suffix, for easier access.
 *
 * NOTE: This is just an example, you could use any conventions, such as
 * lowercase, or combine namespaces into separate objects.
 */
function controllerName (fileName: string) {
  return fileName
    .slice('./api/'.length, fileName.lastIndexOf('.'))
    .replace('/', '_')
    .replace(/Api?$/, '')
    .replace(/^\w/, match => match.toLowerCase())
}
