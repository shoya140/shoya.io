import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Category({ subDirectory, categories, posts }) {
  const router = useRouter()
  const locale = router.locale

  return (
    <p className="categories">
      <span
        className={
          'category-container ' +
          (router.asPath === `/${subDirectory}` ? 'category-active' : '')
        }
      >
        <Link href={`/${subDirectory}`}>
          <a>
            {locale === 'en' ? 'All' : 'すべて'} ({posts.length})
          </a>
        </Link>
      </span>
      {categories.map(({ name, display }) => (
        <span
          key={name}
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
          <Link href={`/${subDirectory}?category=${name}`}>
            <a>
              {display[locale]} (
              {posts.filter(({ category }) => category === name).length})
            </a>
          </Link>
        </span>
      ))}
    </p>
  )
}
