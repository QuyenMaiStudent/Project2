import Seller from './Seller'
import Settings from './Settings'
import Auth from './Auth'
import Admin from './Admin'
import Customer from './Customer'
const Controllers = {
    Seller: Object.assign(Seller, Seller),
Settings: Object.assign(Settings, Settings),
Auth: Object.assign(Auth, Auth),
Admin: Object.assign(Admin, Admin),
Customer: Object.assign(Customer, Customer),
}

export default Controllers