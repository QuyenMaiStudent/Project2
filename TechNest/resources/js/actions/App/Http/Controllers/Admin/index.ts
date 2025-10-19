import AdminController from './AdminController'
import AdminProductController from './AdminProductController'
import CategoryController from './CategoryController'
import BrandController from './BrandController'
const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
AdminProductController: Object.assign(AdminProductController, AdminProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
BrandController: Object.assign(BrandController, BrandController),
}

export default Admin