import Link from 'next/link'
import { useRouter } from 'next/router'
import Date from '../../components/date'
import Category from '../../components/category'
import { LinkList } from '../../components/link'
import Layout from '../../components/layout'
import { getSortedContentsData } from '../../lib/contents'
import config from '../../config'

export default function Posts({ allPostsData, anotherLocalePostsData }) {
  const router = useRouter()
  const locale = router.locale
  const anotherLocale = locale === 'en' ? 'ja' : 'en'
  return (
    <Layout title={config.translations.posts[locale]} isTranslated={'true'}>
      <Category
        subDirectory="posts"
        categories={config.postCategories}
        posts={allPostsData}
      />
      <div>
        {allPostsData
          .filter(
            ({ category }) =>
              router.asPath === '/posts' || RegExp(category).test(router.asPath)
          )
          .map(({ id, date, title, category }) => (
            <LinkList
              key={id}
              link={`/posts/${id}`}
              img={`/img/icon/${category}.svg`}
              title={title}
              body={<Date dateString={date} locale={locale} />}
            />
          ))}
      </div>
      <div className="post-related">
        <h3>{config.translations.recentPosts[locale]}</h3>
        <ul>
          {anotherLocalePostsData
            .slice()
            .reverse()
            .slice(-5)
            .reverse()
            .map(({ id, date, title, category }) => (
              <li key={id}>
                {date}&nbsp;
                <Link href={`/posts/${id}`} locale={anotherLocale}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const allPostsData = getSortedContentsData('posts', locale)
  const anotherLocale = locale === 'en' ? 'ja' : 'en'
  const anotherLocalePostsData = getSortedContentsData('posts', anotherLocale)
  return {
    props: {
      allPostsData,
      anotherLocalePostsData,
    },
  }
}
