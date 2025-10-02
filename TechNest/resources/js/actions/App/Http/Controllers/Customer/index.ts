import CustomerController from './CustomerController'
import CartController from './CartController'
const Customer = {
    CustomerController: Object.assign(CustomerController, CustomerController),
CartController: Object.assign(CartController, CartController),
}

export default Customer