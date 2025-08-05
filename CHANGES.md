# Các thay đổi đã thực hiện

## Mục tiêu

- Khi click "View all users" thay đổi giá trị table của ListProjects là dữ liệu của tất cả user
- Khi click "View all projects" thì hiển thị dữ liệu của tất cả project mà không re-render lại trang

## Các thay đổi đã thực hiện

### 1. Tạo Redux slices mới

#### `src/redux/userSlice.ts`

- Tạo slice để quản lý state của users
- Có action `fetchUsers` để lấy danh sách users từ API
- Có state `searchTerm` để tìm kiếm users

#### `src/redux/viewSlice.ts`

- Tạo slice để quản lý việc chuyển đổi giữa hiển thị users và projects
- Có action `setCurrentView` để thay đổi view type ("projects" | "users")

### 2. Cập nhật Redux store

- Thêm `userReducer` và `viewReducer` vào store
- Cập nhật type definitions

### 3. Cập nhật component ListProject (`src/components/ListProject/index.tsx`)

- Thêm logic để hiển thị cả users và projects
- Tạo 2 bộ columns riêng biệt: `projectColumns` và `userColumns`
- Thêm state management cho users và view type
- Cập nhật useEffect để fetch dữ liệu dựa trên currentView
- Cập nhật render để hiển thị đúng dữ liệu và columns
- Thêm logic để chỉ hiển thị CreateProjectModal và DeleteDialog khi đang xem projects

### 4. Cập nhật menu components

#### `src/components/AppBar/menu/users/index.tsx`

- Thay thế việc mở modal bằng việc dispatch action để thay đổi view
- Thêm dispatch `setCurrentView("users")` và `fetchUsers()`

#### `src/components/AppBar/menu/project/index.tsx`

- Thêm dispatch `setCurrentView("projects")` khi click "View all projects"
- Đảm bảo không re-render trang

### 5. Tính năng mới

- Chuyển đổi mượt mà giữa hiển thị users và projects
- Không re-render trang khi chuyển đổi
- Tìm kiếm riêng biệt cho users và projects
- Hiển thị đúng UI elements (CreateProjectModal chỉ hiển thị khi xem projects)
- Responsive design với DataGrid

## Cách sử dụng

1. Click vào menu "Users" -> "View all users" để xem danh sách tất cả users
2. Click vào menu "Projects" -> "View all projects" để xem danh sách tất cả projects
3. Dữ liệu sẽ được cập nhật mà không cần re-render trang
4. Có thể tìm kiếm trong cả users và projects

## Files đã thay đổi

- `src/redux/userSlice.ts` (mới)
- `src/redux/viewSlice.ts` (mới)
- `src/redux/store.ts`
- `src/components/ListProject/index.tsx`
- `src/components/AppBar/menu/users/index.tsx`
- `src/components/AppBar/menu/project/index.tsx`

## Cập nhật mới - Thêm chức năng Edit và Delete User

### 1. Tạo components mới

#### `src/components/EditUserForm/index.tsx`

- Form dialog để edit thông tin user
- Hiển thị avatar và thông tin user hiện tại
- Có các field: Name, Email, Phone Number, Password
- Sử dụng API `updateUser` để cập nhật thông tin

#### `src/components/DeleteUserDialog/index.tsx`

- Dialog xác nhận xóa user
- Hiển thị thông tin user sẽ bị xóa
- Sử dụng API `deleteUser` để xóa user

#### `src/components/UserActionMenu/index.tsx`

- Menu dropdown với 2 options: "Edit User" và "Delete User"
- Tương tự như ActionMenu cho projects

### 2. Cập nhật Redux

#### `src/redux/userSlice.ts`

- Thêm action `deleteUserAction` để xóa user
- Cập nhật state khi xóa user thành công

### 3. Cập nhật ListProject

#### `src/components/ListProject/index.tsx`

- Thêm column "Actions" cho user table
- Tích hợp EditUserForm và DeleteUserDialog
- Thêm state management cho edit/delete user
- Thêm handlers cho edit và delete user

### 4. Cập nhật API

#### `src/apis/users.ts`

- Sửa interface `editUser` để có kiểu dữ liệu đúng
- API `updateUser` và `deleteUser` đã có sẵn

### 5. Tính năng mới

- **Edit User**: Click icon edit để mở form edit user với thông tin đã điền sẵn
- **Delete User**: Click icon delete để mở dialog xác nhận xóa user
- **Real-time updates**: Sau khi edit/delete, danh sách users sẽ được cập nhật tự động
- **User-friendly UI**: Avatar và thông tin user được hiển thị trong dialogs
- **Validation**: Form có validation cho các field bắt buộc

## Cập nhật mới - Thêm chức năng Search và Toast Notifications

### 1. Cải thiện chức năng Search

#### `src/components/AppBar/index.tsx`

- Cập nhật để hỗ trợ search cho cả projects và users
- Thêm logic để chuyển đổi search term dựa trên currentView
- Import cả setSearchTerm cho projects và users

#### `src/components/AppBar/menu/search/index.tsx`

- Thêm prop `placeholder` để hiển thị text phù hợp
- Placeholder thay đổi theo view: "Tìm kiếm project..." hoặc "Tìm kiếm user..."

### 2. Tạo Toast Notifications

#### `src/components/Toast/index.tsx` (mới)

- Component Toast để hiển thị thông báo thành công/thất bại
- Sử dụng Material-UI Snackbar và Alert
- Có thể tùy chỉnh severity (success, error, warning, info)
- Auto-hide sau 3 giây mặc định

### 3. Cập nhật EditUserForm

#### `src/components/EditUserForm/index.tsx`

- Thêm Toast notifications cho edit user
- Thông báo thành công: "Cập nhật thông tin user thành công!"
- Thông báo lỗi: "Có lỗi xảy ra khi cập nhật thông tin user!"
- Sửa cấu trúc JSX để tránh lỗi

### 4. Cập nhật DeleteUserDialog

#### `src/components/DeleteUserDialog/index.tsx`

- Thêm Toast notifications cho delete user
- Thông báo thành công: "Xóa user thành công!"
- Thông báo lỗi: "Có lỗi xảy ra khi xóa user!"
- Sửa cấu trúc JSX để tránh lỗi

### 5. Tính năng mới

- **Smart Search**: Search box tự động thay đổi placeholder và search term theo view hiện tại
- **Real-time Search**: Tìm kiếm theo tên user/project ngay lập tức
- **Toast Notifications**: Thông báo rõ ràng cho mọi action thành công/thất bại
- **User-friendly Messages**: Thông báo bằng tiếng Việt
- **Auto-dismiss**: Toast tự động biến mất sau 3 giây
- **Error Handling**: Xử lý lỗi và hiển thị thông báo phù hợp

### 6. Cách sử dụng

1. **Search Users**: Khi đang xem users, search box sẽ có placeholder "Tìm kiếm user..."
2. **Search Projects**: Khi đang xem projects, search box sẽ có placeholder "Tìm kiếm project..."
3. **Edit User**: Sau khi edit thành công/thất bại sẽ có thông báo
4. **Delete User**: Sau khi delete thành công/thất bại sẽ có thông báo
5. **Auto-switch**: Search term tự động chuyển đổi theo view hiện tại
