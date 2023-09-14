'use client'

import axios from 'axios'
import { ResponseData } from '@/pages/api'
import useSWR from 'swr'
import { useMemo } from 'react'
import CabinetComponent, { CabinetWithBatteries } from '@/components/Cabinet'
import Rental, { OrderWithBattery } from '@/components/Rental'
import moment from 'moment-timezone'
import Timer from '@/components/Timer'

export default function Home() {
  const { data: cabinetResponse, isLoading: cabinetIsLoading } = useSWR(
    '/api/local/cabinet',
    () => axios.get<ResponseData<CabinetWithBatteries[]>>('/api/local/cabinet'),
  )
  const { data: rentalResponse, isLoading: rentalIsLoading } = useSWR(
    '/api/local/order/query',
    () => axios.get<ResponseData<OrderWithBattery[]>>('/api/local/order/query'),
  )
  const { data: rentalLogResponse, isLoading: rentalLogIsLoading } = useSWR(
    '/api/local/order/log',
    () => axios.get<ResponseData<OrderWithBattery[]>>('/api/local/order/log'),
  )

  const cabinetsWithBatteries = useMemo(
    () => cabinetResponse?.data.data,
    [cabinetResponse],
  )
  const rentalWithBattery = useMemo(
    () => rentalResponse?.data.data,
    [rentalResponse],
  )

  const rentalLogs = useMemo(
    () => rentalLogResponse?.data.data,
    [rentalLogResponse],
  )

  return (
    <div className="p-5 text-sm flex flex-col gap-4">
      <div>
        <div className="text-lg font-semibold mb-2">Cabinets</div>
        <div className="flex gap-2">
          {cabinetsWithBatteries &&
            cabinetsWithBatteries.map((x, i) => (
              <CabinetComponent data={x} key={i} />
            ))}
        </div>
      </div>
      {rentalWithBattery && rentalWithBattery.length > 0 ? (
        <div>
          <div className="text-lg font-semibold my-2">Ongoing Rentals</div>
          <div className="flex gap-4">
            {rentalWithBattery.map((x, i) => (
              <Rental data={x} key={i} />
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <div className="text-lg font-semibold my-2">Rental Logs</div>
        <table
          className="text-center [&_th]:px-2 [&_th]:py-2 [&_td]:px-2 [&_td]:py-2 [&_th]:border [&_th]:border-white [&_td]:border [&_td]:border-white"
          border={1}
        >
          <thead>
            <tr>
              <th>Trade Id</th>
              <th>Cabinet Id</th>
              <th>Borrow Slot</th>
              <th>Start Time</th>
              <th>Return Time</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rentalLogs?.map((x, i) => (
              <tr key={i}>
                <td>{x.orderId}</td>
                <td>{x.cabinetId}</td>
                <td>{x.borrowSlot}</td>
                <td>
                  {moment
                    .utc(moment(x.borrowTime).subtract(2.5, 'h'))
                    .local()
                    .format('YYYY-MM-DD')}{' '}
                  <br />{' '}
                  {moment
                    .utc(moment(x.borrowTime).subtract(2.5, 'h'))
                    .local()
                    .format('hh:mm:ss:a')}{' '}
                </td>
                <td>
                  {moment
                    .utc(moment(x.returnTime).subtract(2.5, 'h'))
                    .local()
                    .format('YYYY-MM-DD')}{' '}
                  <br />{' '}
                  {moment
                    .utc(moment(x.returnTime).subtract(2.5, 'h'))
                    .local()
                    .format('hh:mm:ss:a')}{' '}
                </td>
                <td>
                  <Timer startTime={x.borrowTime} endTime={x.returnTime} />
                </td>
                <td>{x.borrowStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
