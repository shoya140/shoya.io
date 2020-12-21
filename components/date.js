import { parseISO, format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'

export default function Date({ dateString, locale }) {
  const date = parseISO(dateString)
  const dateFormatted = (locale === 'ja')
    ? format(date, 'yyyy年M月d日', { locale: ja })
    : format(date, 'LLLL d, yyyy', { locale: enUS })
  return <time dateTime={dateString}>{dateFormatted}</time>
}
