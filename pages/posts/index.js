import Link from 'next/link'
import { useRouter } from 'next/router'
import Date from '../../components/date'
import Layout from '../../components/layout'
import { getSortedContentsData } from '../../lib/contents'

const allEn = 'All'
const allJa = 'すべての記事'
const allCategories = [
  { name: 'release', displayEn: 'Release', displayJa: 'リリース' },
  { name: 'research', displayEn: 'Research', displayJa: '研究' },
  { name: 'development', displayEn: 'Development', displayJa: '開発' },
  { name: 'sightseeing', displayEn: 'Sightseeing', displayJa: '観光' },
  { name: 'note', displayEn: 'Note', displayJa: 'メモ' },
]

const recentEn = 'Recent posts in English'
const recentJa = '日本語の最新の記事'

export default function Posts({ allPostsData, anotherLocalePostsData }) {
  const router = useRouter()
  const locale = router.locale
  const anotherLocale = locale === 'en' ? 'ja' : 'en'
  return (
    <Layout
      title={locale === 'en' ? 'Blog Posts' : 'ブログ'}
      isTranslated={'true'}
    >
      <p className="categories">
        <span
          className={
            'category-container ' +
            (router.asPath === '/posts' ? 'category-active' : '')
          }
        >
          <Link href="/posts">
            <a>
              {locale === 'en' ? allEn : allJa} ({allPostsData.length})
            </a>
          </Link>
        </span>
        {allCategories.map(({ name, displayEn, displayJa }) => (
          <span
            key={name}
            className={
              'category-container ' +
              (router.asPath === '/posts/?category=' + name
                ? 'category-active'
                : '')
            }
          >
            <img
              src={`/img/twemoji/${name}.svg`}
              width="16px"
              className="category-img"
            />
            <Link href={`/posts?category=${name}`}>
              <a>
                {locale === 'en' ? displayEn : displayJa} (
                {
                  allPostsData.filter(({ category }) => category === name)
                    .length
                }
                )
              </a>
            </Link>
          </span>
        ))}
      </p>
      <div>
        {allPostsData
          .filter(
            ({ category }) =>
              router.asPath === '/posts' || RegExp(category).test(router.asPath)
          )
          .map(({ id, date, title, category }) => (
            <div className="list-container" key={id}>
              <Link href={`/posts/${id}`}>
                <a></a>
              </Link>
              <img className="list-img" src={`/img/twemoji/${category}.svg`} />
              <div className="list-body">
                <p className="list-date">
                  <Date dateString={date} locale={locale} />
                </p>
                <p className="list-title">{title}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="post-related">
        <h3>{anotherLocale === 'ja' ? recentJa : recentEn}</h3>
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
