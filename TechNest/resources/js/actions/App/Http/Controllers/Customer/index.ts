import CustomerController from './CustomerController'
import CartController from './CartController'
import ShippingAddressController from './ShippingAddressController'
const Customer = {
    CustomerController: Object.assign(CustomerController, CustomerController),
CartController: Object.assign(CartController, CartController),
ShippingAddressController: Object.assign(ShippingAddressController, ShippingAddressController),
}

export default Customer