import ProductController from './ProductController'
import SellerController from './SellerController'
import ProductImageController from './ProductImageController'
import ProductSpecController from './ProductSpecController'
import ProductVariantController from './ProductVariantController'
import SellerPromotionController from './SellerPromotionController'
import SellerStoreController from './SellerStoreController'
import SellerLiveController from './SellerLiveController'
const Seller = {
    ProductController: Object.assign(ProductController, ProductController),
SellerController: Object.assign(SellerController, SellerController),
ProductImageController: Object.assign(ProductImageController, ProductImageController),
ProductSpecController: Object.assign(ProductSpecController, ProductSpecController),
ProductVariantController: Object.assign(ProductVariantController, ProductVariantController),
SellerPromotionController: Object.assign(SellerPromotionController, SellerPromotionController),
SellerStoreController: Object.assign(SellerStoreController, SellerStoreController),
SellerLiveController: Object.assign(SellerLiveController, SellerLiveController),
}

export default Seller