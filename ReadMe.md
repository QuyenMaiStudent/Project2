# Tên Dự Án

## Mô tả
Giới thiệu ngắn gọn về dự án.

## Hướng dẫn cài đặt

1. Đổi tên file `.env.example` thành `.env`
2. Chạy lệnh cài đặt composer:
   ```
   composer install
   ```
3. Tạo key ứng dụng Laravel:
   ```
   php artisan key:generate
   ```
4. Chỉnh sửa `APP_URL` trong file `.env`:
   ```
   APP_URL=http://localhost:9999
   ```
   ```
   Chỉnh sửa APP_NAME thành Tech_Nest
   ```

5. Thêm `--port=9999` vào script "dev" trong `composer.json`:
   ```json
   "scripts": {
       "dev": "php artisan serve --port=9999"
   }
   ```
6. Cấu hình kết nối MySQL trong file `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

## Tạo Database
Chạy lệnh
```
php artisan migrate --path=database/migrations/2025_09_21_091131_create_roles_table.php
```

Sau đó chạy lệnh 
```
php artisan migrate
```
Chạy ```php artisan db:seed``` để seeder dữ liệu