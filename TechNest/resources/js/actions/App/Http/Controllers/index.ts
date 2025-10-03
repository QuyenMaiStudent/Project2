import Auth from './Auth'
import Seller from './Seller'
import Settings from './Settings'
import Admin from './Admin'
import Customer from './Customer'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Seller: Object.assign(Seller, Seller),
Settings: Object.assign(Settings, Settings),
Admin: Object.assign(Admin, Admin),
Customer: Object.assign(Customer, Customer),
}

export default Controllers