import Chat from './Chat'
import Auth from './Auth'
import ProductIndexController from './ProductIndexController'
import ProductDetailController from './ProductDetailController'
import Settings from './Settings'
import Seller from './Seller'
import Admin from './Admin'
import Customer from './Customer'
const Controllers = {
    Chat: Object.assign(Chat, Chat),
Auth: Object.assign(Auth, Auth),
ProductIndexController: Object.assign(ProductIndexController, ProductIndexController),
ProductDetailController: Object.assign(ProductDetailController, ProductDetailController),
Settings: Object.assign(Settings, Settings),
Seller: Object.assign(Seller, Seller),
Admin: Object.assign(Admin, Admin),
Customer: Object.assign(Customer, Customer),
}

export default Controllers