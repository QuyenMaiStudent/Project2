import SellerController from './SellerController'
import ProductController from './ProductController'
import ProductImageController from './ProductImageController'
import ProductSpecController from './ProductSpecController'
import ProductVariantController from './ProductVariantController'
import SellerPromotionController from './SellerPromotionController'
import SellerLiveController from './SellerLiveController'

const Seller = {
    SellerController: Object.assign(SellerController, SellerController),
    ProductController: Object.assign(ProductController, ProductController),
    ProductImageController: Object.assign(ProductImageController, ProductImageController),
    ProductSpecController: Object.assign(ProductSpecController, ProductSpecController),
    ProductVariantController: Object.assign(ProductVariantController, ProductVariantController),
    SellerPromotionController: Object.assign(SellerPromotionController, SellerPromotionController),
    SellerLiveController: Object.assign(SellerLiveController, SellerLiveController),
}

export default Seller