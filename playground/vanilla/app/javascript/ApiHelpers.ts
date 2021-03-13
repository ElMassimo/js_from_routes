/// <reference types="vite/client" />

// Example: Combine all generated requests into a single object.
export default Object.entries(import.meta.globEager('./requests/**/*.{js,ts}'))
  .reduce((routes: Record<string, any>, [fileName, module]) => {
    routes[controllerName(fileName)] = module.default
    return routes
  }, {})

/**
 * Removes the leading directory and the Requests suffix, for easier access.
 *
 * NOTE: This is just an example, you could use any conventions, such as
 * lowercase, or combine namespaces into separate objects.
 */
function controllerName (fileName: string) {
  return fileName
    .slice('./requests/'.length, fileName.lastIndexOf('.'))
    .replace('/', '_')
    .replace(/Requests?$/, '')
}
