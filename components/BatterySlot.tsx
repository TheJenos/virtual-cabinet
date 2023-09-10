import { Battery } from "@prisma/client";
import BatteryComponent from "@/components/Battery";

type BatterySlotProps = {
  data?: Battery;
};

export default function BatterySlot({ data }: BatterySlotProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="border border-white rounded-md flex-1 flex justify-center items-center p-2">
        {data ? <BatteryComponent data={data}/> : "Empty slot"}
      </div>
      <div className={"h-2 w-2 rounded-full border border-white " + (data?"bg-blue-600":"")} />
    </div>
  );
}
