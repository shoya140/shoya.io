import Link from 'next/link'
import Mikan from 'mikanjs'

export function LinkList({ link, img, title, body }) {
  return (
    <div className="list-container">
      <Link href={link}>
        <a />
      </Link>
      <img className="list-img" src={img} />
      <div className="list-text-container">
        <p className="list-body">{m(body)}</p>
        <p className="list-title">{m(title)}</p>
      </div>
    </div>
  )
}

export function LinkCard({ link, img, title, body }) {
  return (
    <div className="card">
      <Link href={link}>
        <a />
      </Link>
      <div className="card-img-container">
        <img className="card-img" src={img} />
      </div>
      <div className="card-text-container">
        <h2 className="card-body">{m(title)}</h2>
        <p className="card-text">{body}</p>
      </div>
    </div>
  )
}

function m(str) {
  return Mikan.split(str).map((text, i) => (
    <span key={i} className="no-break">
      {text.replace(/\s/g, '\u00A0')}
    </span>
  ))
}
