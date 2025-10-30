import PaymentReturnController from './PaymentReturnController'
import PaymentWebhookController from './PaymentWebhookController'
const Payments = {
    PaymentReturnController: Object.assign(PaymentReturnController, PaymentReturnController),
PaymentWebhookController: Object.assign(PaymentWebhookController, PaymentWebhookController),
}

export default Payments