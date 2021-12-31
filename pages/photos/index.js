import { useRouter } from 'next/router'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { Gallery, Item } from 'react-photoswipe-gallery'

import Layout from 'components/layout'
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
      <div className="photo-thumbnail-container">
        <Gallery zoomButton={false} shareButton={false}>
          {photos.map((photo) => (
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
