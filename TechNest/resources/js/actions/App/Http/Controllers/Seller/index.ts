import SellerController from './SellerController'
import ProductController from './ProductController'
import ProductImageController from './ProductImageController'
import ProductSpecController from './ProductSpecController'
import ProductVariantController from './ProductVariantController'
const Seller = {
    SellerController: Object.assign(SellerController, SellerController),
ProductController: Object.assign(ProductController, ProductController),
ProductImageController: Object.assign(ProductImageController, ProductImageController),
ProductSpecController: Object.assign(ProductSpecController, ProductSpecController),
ProductVariantController: Object.assign(ProductVariantController, ProductVariantController),
}

export default Seller