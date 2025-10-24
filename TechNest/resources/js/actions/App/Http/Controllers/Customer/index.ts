import CustomerController from './CustomerController'
import CartController from './CartController'
import ShippingAddressController from './ShippingAddressController'
import CheckoutController from './CheckoutController'
import OrderController from './OrderController'
import TransactionController from './TransactionController'
const Customer = {
    CustomerController: Object.assign(CustomerController, CustomerController),
CartController: Object.assign(CartController, CartController),
ShippingAddressController: Object.assign(ShippingAddressController, ShippingAddressController),
CheckoutController: Object.assign(CheckoutController, CheckoutController),
OrderController: Object.assign(OrderController, OrderController),
TransactionController: Object.assign(TransactionController, TransactionController),
}

export default Customer