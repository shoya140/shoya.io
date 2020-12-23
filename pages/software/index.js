import Link from 'next/link'
import { useRouter } from 'next/router'
import Category from '../../components/category'
import Layout from '../../components/layout'
import { LinkList } from '../../components/link'
import { getSortedContentsData } from '../../lib/contents'

const allCategories = [
  { name: 'ios', displayEn: 'iOS', displayJa: 'iOS' },
  { name: 'android', displayEn: 'Android', displayJa: 'Android' },
  { name: 'desktop', displayEn: 'Desktop', displayJa: 'Desktop' },
  { name: 'web', displayEn: 'Web', displayJa: 'Web' },
  { name: 'misc', displayEn: 'Misc', displayJa: 'その他' },
]

export default function Posts({ allPostsData }) {
  const router = useRouter()
  const locale = router.locale
  return (
    <Layout
      title={locale === 'en' ? 'Software' : 'ソフトウェア'}
      isTranslated={'true'}
    >
      <Category
        subDirectory="software"
        categories={allCategories}
        posts={allPostsData}
      />
      <div>
        {allPostsData
          .filter(
            ({ category }) =>
              router.asPath === '/software' || RegExp(category).test(router.asPath)
          )
          .map(({ id, title, link, category, description }) => (
            <LinkList
              key={id}
              link={link}
              img={`/img/icon/${category}.svg`}
              title={title}
              body={description}
            />
          ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const allPostsData = getSortedContentsData('software', locale)
  return {
    props: {
      allPostsData,
    },
  }
}
