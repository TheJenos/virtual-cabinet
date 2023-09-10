import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request: any, {params}: any) {

    switch (params.action) {
        case 'create':
            const newTrade = await prisma.order.create({
                data: {

                }
            });

            return NextResponse.json({
                "msg": "string",
                "code": 0,
                "data": {
                    "tradeNo": "string"
                }
            })
        default:
            break;
    }

}