import CustomerController from './CustomerController'
import CartController from './CartController'
import ShippingAddressController from './ShippingAddressController'
import OrderController from './OrderController'

const Customer = {
    CustomerController: Object.assign(CustomerController, CustomerController),
    CartController: Object.assign(CartController, CartController),
    ShippingAddressController: Object.assign(ShippingAddressController, ShippingAddressController),
    OrderController: Object.assign(OrderController, OrderController),
}

export default Customer