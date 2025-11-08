import Chat from './Chat'
import Auth from './Auth'
import ProductIndexController from './ProductIndexController'
import ProductDetailController from './ProductDetailController'
import Payments from './Payments'
import Customer from './Customer'
import CommentController from './CommentController'
import ProductSearchController from './ProductSearchController'
import Settings from './Settings'
import Seller from './Seller'
import Admin from './Admin'
import LiveStreamController from './LiveStreamController'

const Controllers = {
    Chat: Object.assign(Chat, Chat),
    Auth: Object.assign(Auth, Auth),
    ProductIndexController: Object.assign(ProductIndexController, ProductIndexController),
    ProductDetailController: Object.assign(ProductDetailController, ProductDetailController),
    Payments: Object.assign(Payments, Payments),
    Customer: Object.assign(Customer, Customer),
    CommentController: Object.assign(CommentController, CommentController),
    ProductSearchController: Object.assign(ProductSearchController, ProductSearchController),
    Settings: Object.assign(Settings, Settings),
    Seller: Object.assign(Seller, Seller),
    Admin: Object.assign(Admin, Admin),
    LiveStreamController: Object.assign(LiveStreamController, LiveStreamController),
}

export default Controllers