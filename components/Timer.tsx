import moment from 'moment-timezone'
import { useCallback, useEffect, useState } from 'react'

type TimerProps = {
  startTime: Date
  endTime?: Date | null
}

export default function Timer({ startTime, endTime }: TimerProps) {
  const [currentTime, setCurrentTime] = useState('0:00')

  const onTick = useCallback(() => {
    const startMoment = moment.utc(moment(startTime).subtract(2.5, 'h')).local()
    const endMoment = endTime
      ? moment.utc(moment(endTime).subtract(2.5, 'h')).local()
      : moment()
    const diff = moment.duration(endMoment.diff(startMoment))
    const order = [
      diff.hours() + diff.days() * 24 + diff.months() * 24 * 30,
      diff.minutes(),
      diff.seconds(),
    ]
    setCurrentTime(order.map((x) => (x + '').padStart(2, '0')).join(':'))
  }, [endTime, startTime])

  useEffect(() => {
    if (endTime) {
      onTick()
    } else {
      const timer = setInterval(onTick, 500)
      return () => {
        clearInterval(timer)
      }
    }
  }, [onTick, endTime])

  return currentTime
}
