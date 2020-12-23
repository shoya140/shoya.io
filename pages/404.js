import { useRouter } from 'next/router'
import Layout from '../components/layout'
import config from '../config'

export default function Page404() {
  const { locale } = useRouter()
  return <Layout title={config.translations.pageNotFound[locale]}></Layout>
}
