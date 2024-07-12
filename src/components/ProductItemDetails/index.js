// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    similarProductsData: [],
    quantity: 1,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProductsItemDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    title: data.title,
    style: data.style,
    price: data.price,
    description: data.description,
    brand: data.brand,
    rating: data.rating,
    availability: data.availability,
    imageUrl: data.image_url,
    totalReviews: data.total_reviews,
  })

  getProductsItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedsimilarProductsData = fetchedData.similar_products.map(
        eachProductList => this.getFormattedData(eachProductList),
      )
      this.setState({
        productsData: updatedData,
        similarProductsData: updatedsimilarProductsData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onDecrementValue = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementValue = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="errorView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="errorView-image"
      />
      <h1 className="error-view-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="error-view-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {productsData, quantity, similarProductsData} = this.state
    const {
      title,
      style,
      price,
      description,
      brand,
      rating,
      availability,
      imageUrl,
      totalReviews,
    } = productsData
    return (
      <>
        <div className="productDetails-container">
          <img src={imageUrl} className="productDetails-image" alt="product" />
          <div className="products-info-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="products-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="product-Review">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="brand-availability-container">
              <p className="product-available">
                Available: 
              </p>
              <p className="avaliabe-status">{availability}</p>
            </div>
            <div className="brand-availability-container">
              <p className="product-brand">
                Brand: 
              </p>
              <p className="brand-name">{brand}</p>
            </div>
            <hr className="line-break" />
            <div className="count-container">
              <button
                type="button"
                className="icon-button"
                onClick={this.onDecrementValue}
                data-testid="minus"
              >
                <BsDashSquare className="Dash icon" />
              </button>
              <p className="quantity-value">{quantity}</p>
              <button
                type="button"
                className="icon-button"
                onClick={this.onIncrementValue}
                data-testid="plus"
              >
                <BsPlusSquare className="Plus icon" />
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-product-container">
            {similarProductsData.map(eachSimilarProducts => (
              <SimilarProductItem
                productsDeatils={eachSimilarProducts}
                key={eachSimilarProducts.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderAllProductItemView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoaderView()
      default:
        return ''
    }
  }

  render() {
    return (
      <div className="productDetaailsView">
        <Header />
        {this.renderAllProductItemView()}
      </div>
    )
  }
}

export default ProductItemDetails
