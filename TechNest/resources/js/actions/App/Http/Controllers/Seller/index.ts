import ProductController from './ProductController'
import SellerController from './SellerController'
import ProductImageController from './ProductImageController'
import ProductSpecController from './ProductSpecController'
import ProductVariantController from './ProductVariantController'
const Seller = {
    ProductController: Object.assign(ProductController, ProductController),
SellerController: Object.assign(SellerController, SellerController),
ProductImageController: Object.assign(ProductImageController, ProductImageController),
ProductSpecController: Object.assign(ProductSpecController, ProductSpecController),
ProductVariantController: Object.assign(ProductVariantController, ProductVariantController),
}

export default Seller