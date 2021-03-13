/// <reference types="vite/client" />

/**
 *  NOT RECOMMENDED
 *
 *  I've added this example because some people prefer to use a single object.
 *
 *  That said, you lose the benefit of type-safety that is provided by static
 *  analysis tools (or a compiler like tsc), which you get for free when
 *  importing helpers directly (which is also better for code-splitting).
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
