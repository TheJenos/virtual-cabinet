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
      const body = req.body
      const cabinet = await prisma.cabinet.findFirst({
        where: {
          id: body.deviceId,
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
          batteryId: battery.batteryId,
          borrowSlot: battery.slotNum || 0,
          borrowTime: moment().utc().add(2.5, 'h').toDate(),
          borrowStatus: 1,
          cabinetId: cabinet.id,
          callbackUrl: body.callbackURL,
        },
      })

      setTimeout(() => {
        const form = new FormData()
        form.set('status', '1')
        form.set('tradeNo', newTrade.orderId.toString())
        axios.post(body.callbackURL, form)
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
    res.status(500).send({
      msg: error.message,
      code: 1,
    })
  }
}
