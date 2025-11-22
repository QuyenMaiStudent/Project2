import Chat from './Chat'
import ProductSearchController from './ProductSearchController'
import Auth from './Auth'
import ProductIndexController from './ProductIndexController'
import Customer from './Customer'
import ProductDetailController from './ProductDetailController'
import Payments from './Payments'
import Subscription from './Subscription'
import CommentController from './CommentController'
import Seller from './Seller'
import Settings from './Settings'
import Admin from './Admin'
import LiveStreamController from './LiveStreamController'
import Shipper from './Shipper'
const Controllers = {
    Chat: Object.assign(Chat, Chat),
ProductSearchController: Object.assign(ProductSearchController, ProductSearchController),
Auth: Object.assign(Auth, Auth),
ProductIndexController: Object.assign(ProductIndexController, ProductIndexController),
Customer: Object.assign(Customer, Customer),
ProductDetailController: Object.assign(ProductDetailController, ProductDetailController),
Payments: Object.assign(Payments, Payments),
Subscription: Object.assign(Subscription, Subscription),
CommentController: Object.assign(CommentController, CommentController),
Seller: Object.assign(Seller, Seller),
Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
LiveStreamController: Object.assign(LiveStreamController, LiveStreamController),
Shipper: Object.assign(Shipper, Shipper),
}

export default Controllers