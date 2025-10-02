import AdminController from './AdminController'
import AdminProductController from './AdminProductController'
import CategoryController from './CategoryController'
const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
AdminProductController: Object.assign(AdminProductController, AdminProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Admin