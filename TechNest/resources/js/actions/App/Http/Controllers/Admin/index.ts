import AdminController from './AdminController'
import AdminProductController from './AdminProductController'
import CategoryController from './CategoryController'
import ManageUserController from './ManageUserController'
import AdminPromotionController from './AdminPromotionController'
import BrandController from './BrandController'
import ManageShipperController from './ManageShipperController'
const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
AdminProductController: Object.assign(AdminProductController, AdminProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
ManageUserController: Object.assign(ManageUserController, ManageUserController),
AdminPromotionController: Object.assign(AdminPromotionController, AdminPromotionController),
BrandController: Object.assign(BrandController, BrandController),
ManageShipperController: Object.assign(ManageShipperController, ManageShipperController),
}

export default Admin