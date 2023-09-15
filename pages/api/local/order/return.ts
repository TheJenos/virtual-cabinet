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
      const cabinetId = req.body.cabinetId
      const slotNum = req.body.slotNum
      const batteryId = req.body.batteryId

      const cabinet = await prisma.cabinet.findFirst({
        where: {
          id: cabinetId,
        },
      })
  
      if (!cabinet) throw new Error('Cabinet not found')
      if (!cabinet.online) throw new Error('Cabinet not offline')

      const battery = await prisma.battery.findFirst({
        where: {
          batteryId,
        },
      })

      if (battery) {
        const ongoingOrder = await prisma.order.findFirst({
          where: {
            batteryId,
            borrowStatus: 1,
          },
        })

        if (ongoingOrder) {
          ongoingOrder.returnTime = moment().utc().add(2.5, 'h').toDate()
          ongoingOrder.borrowStatus = 3
          await prisma.order.update({
            data: ongoingOrder,
            where: {
              id: ongoingOrder.id,
            },
          })

          if (ongoingOrder.callbackUrl) {
            const form = new FormData()
            form.set('status', '2')
            form.set('tradeNo', ongoingOrder.orderId.toString())
            await axios.post(ongoingOrder.callbackUrl || '', form)
          }
        }

        await prisma.battery.update({
          data: {
            cabinetId,
            slotNum,
          },
          where: {
            batteryId,
          },
        })
      } else {
        await prisma.battery.create({
          data: {
            vol: 100,
            batteryId,
            cabinetId,
            slotNum,
          },
        })
      }

      res.json({
        code: 0,
        msg: 'Successful operation',
      })
    })
  } catch (error: any) {
    res.status(200).send({
      msg: error.message,
      code: 1,
    })
  }
}
