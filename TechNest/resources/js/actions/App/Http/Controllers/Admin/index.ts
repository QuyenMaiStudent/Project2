import AdminController from './AdminController'
import AdminProductController from './AdminProductController'
import CategoryController from './CategoryController'
import ManageUserController from './ManageUserController'
import AdminPromotionController from './AdminPromotionController'
import BrandController from './BrandController'
import ManageLocationController from './ManageLocationController'

const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
    AdminProductController: Object.assign(AdminProductController, AdminProductController),
    CategoryController: Object.assign(CategoryController, CategoryController),
    ManageUserController: Object.assign(ManageUserController, ManageUserController),
    AdminPromotionController: Object.assign(AdminPromotionController, AdminPromotionController),
    BrandController: Object.assign(BrandController, BrandController),
    ManageLocationController: Object.assign(ManageLocationController, ManageLocationController),
}

export default Admin