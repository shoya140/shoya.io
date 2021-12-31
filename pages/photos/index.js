import { useRouter } from 'next/router'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery'

import Layout from 'components/layout'
import Category from 'components/category'
import config from 'config'
import photos from 'contents/photos'

export default function Photos() {
  const router = useRouter()
  const locale = router.locale
  return (
    <Layout
      title={config.translations.photos[locale]}
      isTranslated={'true'}
      wideWrapper
    >
      <Category
        subDirectory="photos"
        categories={config.photoCategories}
        posts={photos}
      />
      <div className="photo-thumbnail-container">
        <Gallery
          zoomButton={false}
          shareButton={false}
          fullscreenButton={false}
        >
          {photos
            .filter(
              ({ category, favorite }) =>
                router.asPath === '/photos' ||
                RegExp(category).test(router.asPath) ||
                (RegExp('favorite').test(router.asPath) && favorite)
            )
            .map((photo) => (
              <Item
                original={`${photo.url}/thumb/3000`}
                thumbnail={`${photo.url}/thumb/500`}
                width={1000 * photo.aspect}
                height={1000}
                title={photo.title}
              >
                {({ ref, open }) => (
                  <div className="photo-thumbnail">
                    <img
                      ref={ref}
                      onClick={open}
                      src={`${photo.url}/thumb/500`}
                    />
                  </div>
                )}
              </Item>
            ))}
        </Gallery>
      </div>
    </Layout>
  )
}
