import { Battery } from '@prisma/client'
import BatteryComponent from '@/components/Battery'
import { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'

type BatterySlotProps = {
  data?: Battery
  slotNum: number
  cabinetId: number
}

export default function BatterySlot({
  data,
  cabinetId,
  slotNum,
}: BatterySlotProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const dragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const dragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const dragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const drop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    axios.post('/api/local/order/return', {
      cabinetId,
      slotNum,
      batteryId: e.dataTransfer?.getData('batteryId') || '0',
    })
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <div
        className={classNames(
          'border border-white rounded-md flex-1 flex justify-center items-center p-2 w-40',
          isDragOver ? 'bg-gray-900' : '',
        )}
        onDragEnter={data ? null : (dragEnter as any)}
        onDragOver={data ? null : (dragOver as any)}
        onDragLeave={data ? null : (dragLeave as any)}
        onDrop={data ? null : (drop as any)}
      >
        {data ? <BatteryComponent data={data} /> : 'Empty slot'}
      </div>
      <div
        className={
          'h-2 w-2 rounded-full border border-white ' +
          (data ? 'bg-blue-600' : '')
        }
      />
    </div>
  )
}
