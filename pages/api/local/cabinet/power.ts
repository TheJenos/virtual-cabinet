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
              id: parseInt(req.body.deviceId as string),
            },
            include: {
              batteries: true,
            },
          })
      
        if (!cabinet) throw new Error('Cabinet not found')

        res.json({
            code: 0,
            msg: 'Successful operation',
            data: await prisma.cabinet.update({
                where: {
                    id: cabinet.id,
                },
                data: {
                    online: !cabinet.online
                }
            }),
        })
    } catch (error: any) {
        res.status(200).send({
            msg: error.message,
            code: 1,
        })
    }
}
