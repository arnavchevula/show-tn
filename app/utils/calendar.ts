import * as ics from 'ics'

export const parseShowTime = (show: any) => {
  const calendarDate = show.parsedDate instanceof Date
    ? show.parsedDate
    : new Date(show.parsedDate + 'T00:00:00')
  const rawTime = show.doorsTime || show.showTime
  let startHour = 20
  let startMinute = 0
  if (rawTime) {
    const cleaned = rawTime
      .replace(/doors?\s*time\s*:?\s*|doors?\s*:?\s*/gi, '')
      .replace(/show\s*time\s*:?\s*|show\s*:?\s*/gi, '')
      .trim()
    const isPM = /pm/i.test(cleaned)
    const [hourStr, minuteStr] = cleaned.replace(/[apm\s]/gi, '').split(':')
    let hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10) || 0
    if (isPM && hour < 12) hour += 12
    if (!isPM && hour === 12) hour = 0
    startHour = hour
    startMinute = minute
  }
  return { calendarDate, startHour, startMinute }
}

export const downloadIcs = (show: any) => {
  const { calendarDate, startHour, startMinute } = parseShowTime(show)
  ics.createEvent({
    start: [calendarDate.getFullYear(), calendarDate.getMonth() + 1, calendarDate.getDate(), startHour, startMinute],
    title: show.title,
    description: show.description || '',
    location: show.venue,
    url: show.url,
    duration: { hours: 4 }
  } as ics.EventAttributes, (error, value) => {
    if (error) { console.error(error); return }
    const blob = new Blob([value], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${show.title}.ics`
    a.click()
    URL.revokeObjectURL(url)
  })
}

export const openGoogleCalendar = (show: any) => {
  const { calendarDate, startHour, startMinute } = parseShowTime(show)
  const pad = (n: number) => String(n).padStart(2, '0')

  const endHour = (startHour + 4) % 24
  const endDate = new Date(calendarDate)
  if (startHour + 4 >= 24) endDate.setDate(endDate.getDate() + 1)

  const fmt = (d: Date, h: number, m: number) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: show.title,
    dates: `${fmt(calendarDate, startHour, startMinute)}/${fmt(endDate, endHour, startMinute)}`,
    details: show.description || '',
    location: show.venue || '',
  })
  if (show.url) params.set('sprop', `website:${show.url}`)

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank')
}
