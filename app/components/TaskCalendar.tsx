'use client'
import { useState } from 'react'
import { StatusChip } from './ui'
import { formatDate, formatTime, todayKey } from '../lib/format'

interface Task {
  id: string
  title: string
  scheduled_date: string
  scheduled_time?: string
  status: string
  price?: number
  profiles?: { full_name?: string } | null
}

interface Props {
  tasks: Task[]
  showOwnerName?: boolean
}

export default function TaskCalendar({ tasks, showOwnerName = false }: Props) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
    setSelectedDate(null)
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' })

  const tasksByDate: Record<string, Task[]> = {}
  tasks.forEach((task) => {
    if (!task.scheduled_date) return
    if (!tasksByDate[task.scheduled_date]) tasksByDate[task.scheduled_date] = []
    tasksByDate[task.scheduled_date].push(task)
  })

  const keyFor = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const todays = todayKey()
  const selectedTasks = selectedDate ? tasksByDate[selectedDate] || [] : []

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} aria-label="Previous month" className="h-9 w-9 grid place-items-center rounded-full text-ink-2 hover:bg-sunk text-xl">
          ‹
        </button>
        <span className="text-[16px] font-semibold" aria-live="polite">
          {monthName} {currentYear}
        </span>
        <button onClick={nextMonth} aria-label="Next month" className="h-9 w-9 grid place-items-center rounded-full text-ink-2 hover:bg-sunk text-xl">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-[12px] text-ink-3 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = keyFor(day)
          const count = (tasksByDate[dateKey] || []).length
          const isToday = dateKey === todays
          const isSelected = dateKey === selectedDate
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              aria-pressed={isSelected}
              aria-label={`${formatDate(dateKey)}${count ? `, ${count} ${count === 1 ? 'visit' : 'visits'}` : ''}`}
              className={`relative h-11 flex flex-col items-center justify-center rounded-xl text-[15px] transition-colors ${
                isSelected ? 'bg-ink text-white' : isToday ? 'bg-lake-tint text-lake-dark font-semibold' : 'hover:bg-sunk'
              }`}
            >
              {day}
              {count > 0 && <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-lake'}`} />}
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[14px] font-medium mb-2">{formatDate(selectedDate)}</p>
          {selectedTasks.length === 0 ? (
            <p className="text-[14px] text-ink-2">Nothing scheduled this day.</p>
          ) : (
            <ul className="divide-y divide-line">
              {selectedTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-[15px] font-medium">{task.title}</p>
                    <p className="text-[13px] text-ink-2">
                      {[showOwnerName ? task.profiles?.full_name : null, task.scheduled_time ? formatTime(task.scheduled_time) : 'Any time']
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                  <StatusChip status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
