import * as adapters from './adapters'
import * as useCases from './usecases'
import * as decorators from './decorators'

export * from './adapters'
export * from './usecases'
export * from './decorators'

export const Factories = {
  ...adapters,
  ...useCases,
  ...decorators
}
