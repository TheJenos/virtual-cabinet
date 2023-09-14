import { Battery } from '@prisma/client'

type BatteryProps = {
  data: Battery
}

export default function Battery({ data }: BatteryProps) {
  return (
    <div className="flex-1 flex justify-between">
      <div>Id : {data.batteryId}</div>
      <div>{data.vol}%</div>
    </div>
  )
}
