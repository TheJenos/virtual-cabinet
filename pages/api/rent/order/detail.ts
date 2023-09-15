import prisma from '@/prisma/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '../..'

export default async function action(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    res.json({
      code: 0,
      msg: 'Successful operation',
      data: await prisma.order.findFirst({
        where: {
          orderId: req.query.tradeNo as string,
        },
      }),
    })
  } catch (error: any) {
    res.status(200).send({
      msg: error.message,
      code: 1,
    })
  }
}
