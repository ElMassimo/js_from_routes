import { snakeCase, deepConvertKeys } from '@js-from-routes/core'
/**
 * You may customize these options to configure how requests are sent.
 */
export const Config = {
  /**
   * The function used to convert the data before sending it to the server.
   * @default snakeCaseKeys
   */
  serializeData: (data: any) => deepConvertKeys(data, snakeCase),
}
