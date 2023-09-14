import AppConfig from '@/config/app'
import { Battery, Cabinet } from '@prisma/client'
import BatterySlot from './BatterySlot'
import { ExternalLink, Power } from 'react-feather'
import axios from 'axios'
import classNames from 'classnames'

export type CabinetWithBatteries = Cabinet & {
  batteries: Battery[]
}

type CabinetProps = {
  data: CabinetWithBatteries
}

export default function Cabinet({ data }: CabinetProps) {

  const powerSwitch = () => axios.post('/api/local/cabinet/power', {deviceId: data.id})

  return (
    <div className="border border-white rounded-md p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <h1 className="text-lg mr-auto font-semibold">#{data.id}</h1>
        <div className={ classNames("border border-white rounded-full h-10 w-10 flex justify-center items-center", data.online ? 'bg-green-500': 'bg-gray-500')} onClick={powerSwitch}>
          <Power/>
        </div>
        <a
          href={`${AppConfig.appUrl}${data.id}`}
          className="border border-white rounded h-10 w-10 flex justify-center items-center"
          target="_blank"
        >
          <ExternalLink/>
        </a>
      </div>
      <div className={classNames("border border-white rounded-md grid grid-cols-2 p-4 gap-2",!data.online ? 'opacity-50': '' )}>
        {Array(data.slots)
          .fill('')
          .map((x, i) => (
            <BatterySlot
              data={data.batteries.find((y) => y.slotNum === i)}
              cabinetId={data.id}
              slotNum={i}
              key={i}
            />
          ))}
      </div>
    </div>
  )
}
