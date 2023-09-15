import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '../..'

export default async function action(_:any,res: NextApiResponse<ResponseData>) {
  try {
    res.json({
      code: 0,
      msg: 'Successful operation',
      data: [],
    })
  } catch (error: any) {
    res.status(200).send({
      msg: error.message,
      code: 1,
    })
  }
}
