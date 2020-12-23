import Link from 'next/link'

export function LinkList({ link, img, title, body }) {
  return (
    <div className="list-container">
      <Link href={link}>
        <a />
      </Link>
      <img className="list-img" src={img} />
      <div className="list-body">
        <p className="list-date">{body}</p>
        <p className="list-title">{title}</p>
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
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{body}</p>
      </div>
    </div>
  )
}
