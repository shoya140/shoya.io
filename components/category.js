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
      {subDirectory === 'photos' && (
        <Link href={`/${subDirectory}/?category=favorite`}>
          <a
            className={
              'category-container ' +
              (RegExp('favorite').test(router.asPath) ? 'category-active' : '')
            }
          >
            {locale === 'en' ? 'Favorite' : 'お気に入り'} (
            {posts.filter(({ favorite }) => favorite).length})
          </a>
        </Link>
      )}
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
            {subDirectory !== 'photos' && (
              <img
                src={`/img/icon/${name}.svg`}
                width="16px"
                className="category-img"
              />
            )}
            {display[locale]} (
            {posts.filter(({ category }) => category === name).length})
          </a>
        </Link>
      ))}
    </p>
  )
}
