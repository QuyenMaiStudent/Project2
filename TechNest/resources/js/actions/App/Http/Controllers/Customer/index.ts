import CustomerReviewController from './CustomerReviewController'
import CustomerController from './CustomerController'
import CartController from './CartController'
import ShippingAddressController from './ShippingAddressController'
import CheckoutController from './CheckoutController'
import OrderController from './OrderController'
import OrderTrackingController from './OrderTrackingController'
import CustomerOrderDeliveryController from './CustomerOrderDeliveryController'
import TransactionController from './TransactionController'
import ViewerController from './ViewerController'
const Customer = {
    CustomerReviewController: Object.assign(CustomerReviewController, CustomerReviewController),
CustomerController: Object.assign(CustomerController, CustomerController),
CartController: Object.assign(CartController, CartController),
ShippingAddressController: Object.assign(ShippingAddressController, ShippingAddressController),
CheckoutController: Object.assign(CheckoutController, CheckoutController),
OrderController: Object.assign(OrderController, OrderController),
OrderTrackingController: Object.assign(OrderTrackingController, OrderTrackingController),
CustomerOrderDeliveryController: Object.assign(CustomerOrderDeliveryController, CustomerOrderDeliveryController),
TransactionController: Object.assign(TransactionController, TransactionController),
ViewerController: Object.assign(ViewerController, ViewerController),
}

export default Customer