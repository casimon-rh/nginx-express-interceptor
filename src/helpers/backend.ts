/* eslint-disable no-unused-vars */
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
/* eslint-enable no-unused-vars */
import { methodWrapper } from './transform'
import { handlerBackendResponse } from './error-handling'

export const intercept = (alias: string, port: number = 8080): RequestHandler<any> =>
  async (req: Request, res: Response) => {
    const urlfragment: string = req.url.replace(/^.*\/app/, '')
    const axiosConfig: AxiosRequestConfig = {
      url: `http://${alias}:${port}${urlfragment}`,
      ...methodWrapper(req.method),
      headers: { ...req.headers }
    }
    let resultData: AxiosResponse<any>
    try {
      if (['POST', 'PUT'].includes(req.method)) {
        resultData = await axios({
          data: req.body.length ? [...req.body] : { ...req.body },
          ...axiosConfig
        })
      } else {
        if (urlfragment.includes('download')) {
          axiosConfig.responseType = 'arraybuffer'
          axiosConfig.timeout = 300
        }
        console.log('🐈  start request')
        resultData = await axios({
          ...axiosConfig
        })
        console.log('🐢  end request')
      }
      return handlerBackendResponse(
        { isAxiosError: false },
        res,
        resultData,
        urlfragment.includes('download')
      )
    } catch (ex) {
      return handlerBackendResponse(ex, res, resultData)
    }
  }
