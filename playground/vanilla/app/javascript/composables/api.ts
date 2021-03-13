import apiHelpers from '~/ApiHelpers'

/**
 * Allows to access the api helpers in a Vue component.
 */
export function useApi () {
  // NOTE: Using provide/inject is unnecessary since it's static and globally available.
  return apiHelpers
}
