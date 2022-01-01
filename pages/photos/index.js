import { useRouter } from 'next/router'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import LazyLoad from 'react-lazyload'

import Layout from 'components/layout'
import Category from 'components/category'
import config from 'config'
import photos from 'contents/photos'

export default function Photos() {
  const router = useRouter()
  const locale = router.locale
  const activeCategory = router.query.category

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
                !activeCategory ||
                activeCategory === category ||
                (activeCategory === 'favorite' && favorite)
            )
            .map((photo) => (
              <Item
                original={`${photo.url}/thumb/3000`}
                thumbnail={`${photo.url}/thumb/500`}
                width={1000 * photo.aspect}
                height={1000}
                title={photo.title}
                key={photo.url}
              >
                {({ ref, open }) => (
                  <div className="photo-thumbnail" ref={ref} onClick={open}>
                    <LazyLoad height={76} once>
                      <img src={`${photo.url}/thumb/500`} />
                    </LazyLoad>
                  </div>
                )}
              </Item>
            ))}
        </Gallery>
      </div>
    </Layout>
  )
}
