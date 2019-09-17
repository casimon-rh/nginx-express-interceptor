/* eslint-disable no-unused-vars */
import { Method } from 'axios'
/* eslint-enable no-unused-vars */
export interface Intermediate {
  method: Method
}
export const methodWrapper = (method: string): Intermediate => {
  switch (method) {
    case 'POST':
      return { method: 'POST' }
    case 'PUT':
      return { method: 'PUT' }
    case 'DELETE':
      return { method: 'DELETE' }
    case 'GET':
      return { method: 'GET' }
  }
}
