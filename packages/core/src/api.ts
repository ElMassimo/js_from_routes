/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */

// NOTE: Allows to change the strategy to obtain the CSRF token.
export let csrfToken = (defaultToken: string | undefined) =>
  defaultToken || document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content || ''
