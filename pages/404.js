import { useRouter } from 'next/router'
import Layout from '../components/layout'

export default function Page404() {
  const { locale } = useRouter()
  return (
    <Layout title={(locale === 'en') ? '404 Page not found' : '404 ページが見つかりません'}>
    </Layout>
  )
}
