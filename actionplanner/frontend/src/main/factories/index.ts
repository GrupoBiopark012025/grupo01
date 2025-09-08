import * as cache from './cache'
import * as adapters from './adapters/'

export * from './cache'
export * from './adapters/'

export const Factories = {
  ...cache,
  ...adapters
}
