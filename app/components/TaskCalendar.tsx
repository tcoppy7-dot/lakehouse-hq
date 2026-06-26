'use client'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  scheduled_date: string
  scheduled_time?: string
  status: string
  price?: number
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

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })

  const tasksByDate: Record<string, Task[]> = {}
  tasks.forEach(task => {
    if (!task.scheduled_date) return
    const key = task.scheduled_date
    if (!tasksByDate[key]) tasksByDate[key] = []
    tasksByDate[key].push(task)
  })

  const formatDate = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${currentYear}-${month}-${d}`
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${minutes} ${ampm}`
  }

  const statusColor = (status: string) => {
    if (status === 'requested') return 'bg-[#E8A838] text-[#0A2342]'
    if (status === 'confirmed') return 'bg-[#1A7A8A] text-white'
    if (status === 'in_progress') return 'bg-purple-600 text-white'
    if (status === 'completed') return 'bg-green-600 text-white'
    return 'bg-[#1B4F8A] text-white'
  }

  const dotColor = (tasks: Task[]) => {
    if (tasks.some(t => t.status === 'requested')) return 'bg-[#E8A838]'
    if (tasks.some(t => t.status === 'confirmed')) return 'bg-[#1A7A8A]'
    if (tasks.some(t => t.status === 'in_progress')) return 'bg-purple-500'
    return 'bg-green-500'
  }

  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : []

  return (
    <div className="bg-[#1B4F8A] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-[#5BA4CF] hover:text-white transition-colors px-2 py-1">&#8249;</button>
        <span className="text-white font-bold">{monthName} {currentYear}</span>
        <button onClick={nextMonth} className="text-[#5BA4CF] hover:text-white transition-colors px-2 py-1">&#8250;</button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[#5BA4CF] text-xs font-semibold py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateKey = formatDate(day)
          const dayTasks = tasksByDate[dateKey] || []
          const isToday = dateKey === today.toISOString().split('T')[0]
          const isSelected = dateKey === selectedDate
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={`relative flex flex-col items-center py-1 rounded-lg transition-colors
                ${isSelected ? 'bg-[#1A7A8A]' : isToday ? 'bg-[#0A2342]' : 'hover:bg-[#0A2342]'}`}
            >
              <span className={`text-sm ${isToday ? 'text-[#E8A838] font-bold' : 'text-white'}`}>{day}</span>
              {dayTasks.length > 0 && (
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor(dayTasks)}`} />
              )}
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="mt-4 border-t border-[#0A2342] pt-4">
          {selectedTasks.length === 0 ? (
            <p className="text-[#5BA4CF] text-sm text-center">No tasks on this date.</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(task => (
                <div key={task.id} className="bg-[#0A2342] rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{task.title}</p>
                    {task.scheduled_time && (
                      <p className="text-[#5BA4CF] text-xs">{formatTime(task.scheduled_time)}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor(task.status)}`}>
                    {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
