import prisma from '@/prisma/prisma'
import moment from 'moment-timezone'
import { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from '../..'
import axios from 'axios'

export default async function action(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    await prisma.$transaction(async (tx) => {
      const body = req.query
      console.log(body);
      const cabinet = await prisma.cabinet.findFirst({
        where: {
          id: parseInt(body.deviceId as string),
        },
        include: {
          batteries: true,
        },
      })

      if (!cabinet) throw Error('Cabinet not found')
      if (!cabinet.online) throw new Error('Cabinet not offline')
      
      if (cabinet.batteries.filter((x) => x.vol == 100).length <= 0)
        throw Error('No powerbanks to issue')
      const battery = cabinet.batteries.sort((a, b) => b.vol - a.vol)[0]

      await prisma.battery.update({
        where: {
          batteryId: battery.batteryId,
        },
        data: {
          cabinetId: null,
          slotNum: null,
        },
      })

      const newTrade = await prisma.order.create({
        data: {
          orderId: (Math.random() + 1).toString(36).substring(7),
          batteryId: battery.batteryId,
          borrowSlot: battery.slotNum || 0,
          borrowTime: moment().utc().add(2.5, 'h').toDate(),
          borrowStatus: 1,
          cabinetId: cabinet.id,
          callbackUrl: body.callbackURL as string,
        },
      })

      setTimeout(() => {
        const form = new FormData()
        form.set('status', '1')
        form.set('tradeNo', newTrade.orderId.toString())
        axios.post(body.callbackURL as string, form)
      }, 2000)

      res.json({
        msg: 'Successful operation',
        code: 0,
        data: {
          tradeNo: newTrade.orderId,
        },
      })
    })
  } catch (error: any) {
    console.log(error);
    res.status(200).send({
      msg: error.message,
      code: 1,
    })
  }
}
