import { parseISO, format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'

export function convertDate(dateString, locale) {
  const date = parseISO(dateString)
  const dateFormatted =
    locale === 'ja'
      ? format(date, 'yyyy年M月d日', { locale: ja })
      : format(date, 'LLLL d, yyyy', { locale: enUS })
  return dateFormatted.toString()
}
