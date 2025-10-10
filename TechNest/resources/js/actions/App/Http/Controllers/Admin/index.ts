import AdminController from './AdminController'
import AdminProductController from './AdminProductController'
import CategoryController from './CategoryController'
import ManageUserController from './ManageUserController'
import AdminPromotionController from './AdminPromotionController'
const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
AdminProductController: Object.assign(AdminProductController, AdminProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
ManageUserController: Object.assign(ManageUserController, ManageUserController),
AdminPromotionController: Object.assign(AdminPromotionController, AdminPromotionController),
}

export default Admin