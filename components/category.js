import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Category({ subDirectory, categories, posts }) {
  const router = useRouter()
  const locale = router.locale

  return (
    <p className="categories">
      <Link href={`/${subDirectory}`}>
        <a
          className={
            'category-container ' +
            (router.asPath === `/${subDirectory}` ? 'category-active' : '')
          }
        >
          {locale === 'en' ? 'All' : 'すべて'} ({posts.length})
        </a>
      </Link>
      {categories.map(({ name, display }) => (
        <Link href={`/${subDirectory}?category=${name}`} key={name}>
          <a
            className={
              'category-container ' +
              (router.asPath === `/${subDirectory}?category=${name}`
                ? 'category-active'
                : '')
            }
          >
            <img
              src={`/img/icon/${name}.svg`}
              width="16px"
              className="category-img"
            />
            {display[locale]} (
            {posts.filter(({ category }) => category === name).length})
          </a>
        </Link>
      ))}
    </p>
  )
}
