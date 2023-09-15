import prisma from '@/prisma/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '../..'

export default async function action(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const cabinet = await prisma.cabinet.findFirst({
      where: {
        id: parseInt(req.query.deviceId as string),
      },
      include: {
        batteries: true,
      },
    })

    if (!cabinet) throw new Error('Cabinet not found')
    if (!cabinet.online) throw new Error('Cabinet not offline')

    const { batteries, ...onlyCabinet } = cabinet

    res.json({
      code: 0,
      msg: 'Successful operation',
      data: {
        priceStrategy: {
          depositAmount: 0,
          priceMinute: 0,
          autoRefund: 0,
          timeoutAmount: 0,
          timeoutDay: 0,
          dailyMaxPrice: 0,
          freeMinutes: 0,
          currencySymbol: '',
          price: 0,
          name: '',
          currency: '',
          shopId: '',
        },
        shop: {
          address: '',
          priceMinute: '',
          city: '',
          dailyMaxPrice: 0,
          latitude: '',
          openingTime: '',
          freeMinutes: 0,
          icon: '',
          content: '',
          province: '',
          price: 0,
          name: '',
          deposit: 0,
          logo: '',
          id: '',
          region: '',
          longitude: '',
        },
        batteries: batteries,
        cabinet: onlyCabinet,
      },
    })
  } catch (error: any) {
    res.status(200).send({
      msg: error.message,
      code: 1,
    })
  }
}
