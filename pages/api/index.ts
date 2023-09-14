export type ResponseData<T = any> = {
  msg: string
  code: number
  data?: T
}
