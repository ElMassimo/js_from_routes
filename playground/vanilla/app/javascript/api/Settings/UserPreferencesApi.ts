// JsFromRoutes CacheKey 595818e71c9c73ec0e4cce2c69d9c08c
//
// DO NOT MODIFY: This file was automatically generated by JsFromRoutes.
import { definePathHelper } from '@js-from-routes/client'

export default {
  switchToClassicNavbar: definePathHelper('patch', '/user_preferences/switch_to_classic_navbar'),
  switchToClassic: definePathHelper('get', '/user_preferences/switch_to_classic/:page'),
  switchToBeta: definePathHelper('get', '/user_preferences/switch_to_beta/:page'),
}