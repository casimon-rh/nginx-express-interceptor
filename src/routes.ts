import { intercept } from './helpers/backend'
/* eslint-disable no-unused-vars */
import { Express } from 'express-serve-static-core'
import handleError from './helpers/error-handling'
/* eslint-enable no-unused-vars */

const handle = (app: Express) => {
  try {
    app.get('/app/download/**', intercept('sinatra', 4567))
  } catch (error) {
    handleError(error)
  }
}
export default handle
