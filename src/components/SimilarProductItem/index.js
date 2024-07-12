// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {productsDeatils} = props
  const {imageUrl, title, brand, rating, price} = productsDeatils
  return (
    <li className="similar-product-list">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="thumbnail"
      />
      <h1 className="similar-products-title">{title}</h1>
      <p className="similar-products-brand">by {brand}</p>
      <div className="product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
