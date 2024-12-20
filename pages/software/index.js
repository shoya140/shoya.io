import { useRouter } from 'next/router'

import Layout from 'components/layout'
import Category from 'components/category'
import { LinkList } from 'components/link'
import { getSortedContentsData } from 'lib/contents'
import config from 'config'

export default function Posts({ allPostsData }) {
  const router = useRouter()
  const locale = router.locale
  const activeCategory = router.query.category

  return (
    <Layout title={config.translations.software[locale]} isTranslated={'true'}>
      <Category
        subDirectory="software"
        categories={config.softwareCategories}
        posts={allPostsData}
      />
      <div>
        {allPostsData
          .filter(
            ({ category }) => !activeCategory || activeCategory === category
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
