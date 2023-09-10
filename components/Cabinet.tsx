import AppConfig from "@/config/app";
import { Battery, Cabinet } from "@prisma/client";
import BatterySlot from "./BatterySlot";

type CabinetWithBatteries = Cabinet & {
    batteries: Battery[]
}

type CabinetProps = {
  data: CabinetWithBatteries;
};

export default function Cabinet({ data }: CabinetProps) {
  return (
    <div className="border border-white rounded-md p-4 flex flex-col gap-4">
      <div className="flex">
        #{data.id}
        <a href={`${AppConfig.appUrl}${data.id}`} className="ml-auto border border-white h-10 w-10 flex justify-center items-center" target="_blank">QR</a>
      </div>
      <div className="border border-white rounded-md grid grid-cols-2 p-4 gap-2">
        {Array(data.slots).fill('').map((x,i) => <BatterySlot data={data.batteries.find(y => y.slotNum === i)} key={i}/>)}
      </div>
    </div>
  );
}
