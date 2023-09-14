import { Battery, Order } from '@prisma/client'
import BatteryComponent from '@/components/Battery'
import moment from 'moment-timezone'
import Timer from './Timer'

export type OrderWithBattery = Order & {
  battery: Battery
}

type RentalProps = {
  data: OrderWithBattery
}

export default function Rental({ data }: RentalProps) {
  return (
    <div className="border border-white rounded-md p-4 flex flex-col items-center gap-4">
      <div className="flex justify-between w-full">
        <div className="text-lg font-semibold">#{data.orderId}</div>{' '}
        <div className="text-lg font-semibold">
          <Timer startTime={data.borrowTime} />
        </div>
      </div>
      <div className="flex flex-col">
        <span>
          Rented Date :{' '}
          {moment
            .utc(moment(data.borrowTime).subtract(2.5, 'h'))
            .local()
            .format('YYYY-MM-DD')}
        </span>
        <span>
          Rented Time :{' '}
          {moment
            .utc(moment(data.borrowTime).subtract(2.5, 'h'))
            .local()
            .format('hh:mm:ss:a')}
        </span>
        <span>Slot Number : {data.borrowSlot}</span>
      </div>
      <div
        className="border border-white rounded-md flex-1 flex justify-center items-center p-2 w-40"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('batteryId', data.batteryId.toString())
        }}
      >
        <BatteryComponent data={data.battery} />
      </div>
    </div>
  )
}
