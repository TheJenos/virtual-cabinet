import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '../..'

export default async function action(res: NextApiResponse<ResponseData>) {
  try {
    res.json({
      code: 0,
      msg: 'Successful operation',
      data: [],
    })
  } catch (error: any) {
    res.status(500).send({
      msg: error.message,
      code: 1,
    })
  }
}
