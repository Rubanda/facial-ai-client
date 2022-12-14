import axios, { AxiosResponse } from "axios"
 export type QueryResponse = {data:any}


export const poster = async (url: string, payload?: unknown): Promise<QueryResponse> => {
    try {
      const response =  axios.post(url, payload)
      const data = await response
      return data
    } catch (error:any) {
      return error
    }
  }
  