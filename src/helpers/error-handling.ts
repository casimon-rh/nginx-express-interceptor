/* eslint-disable no-unused-vars */
import { Response } from 'express'
import { AxiosResponse } from 'axios'
/* eslint-enable no-unused-vars */

const handleError = (error: any): void => {
  console.log('# 🚨 Err!')
  if (error.isAxiosError) {
    console.log({
      url: error.config.url,
      headers: error.config.headers,
      data: error.config.data,
      status: error.response.status,
      response: error.response.statusText
    })
  } else {
    console.log({ error })
  }
}
const finalErr = (error: any, res: Response) => {
  console.log('# 🚨 Err!')
  console.log({ error })
  return res.status(500).send('Error no esperado')
}

export const handlerBackendResponse = (error: any, res: Response, resultData: AxiosResponse<any> = null, blob = false): Response => {
  let mensaje = 'Error no esperado'
  if (error.isAxiosError) {
    console.log('# 🚨 Err!')
    console.log({ error })
    console.log({ data: (error.response || {}).data })
    try {
      if (((error.config || {}).data || {}).message) {
        mensaje = error.config.data.message
      }
      return res.status(error.response.status).send(mensaje)
    } catch (error) {
      finalErr(error, res)
    }
  } else {
    if (resultData && resultData.data) {
      if (resultData.status === 200) {
        if (!isNaN(resultData.data.length) && resultData.data.length < 1) {
          console.log('# 🚨 Err!')
          return res.status(404).send('No encontrado')
        } else {
          console.log(')) 🌲 OK! ')
          if (blob) {
            res.set(
              'Content-Type', resultData.headers['content-type'].replace(/;.*$/, '')
            )
            console.log('🤖 downloading this')
            res.status(200).download(resultData.data)
            return res
          }
          return res.status(200).send(resultData.data)
        }
      } else {
        console.log('# 🚨 Err!')
        let mensaje = 'Error no esperado'
        if (resultData.data && resultData.data.message) {
          mensaje = resultData.data.message
        }
        return res.status(resultData.status).send(mensaje)
      }
    } else {
      finalErr(error, res)
    }
  }
}
export default handleError
