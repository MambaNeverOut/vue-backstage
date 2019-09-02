# vue-backstage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### 
项目简介：后台管理系统

技术栈：less	Element UI	axios	moment 	v-router	vue-cli

1. 创建登录界面，设置账号密码规范。配置全局 axios 请求的 baseURL，利用 axios 发送 post 请求，并将返回的 token 保存到 localStorage 中，跳转到主页。
2. 创建主页，进入主页首先判断是否有 token，如果没有返回登录页面。发送 get 请求获取数据渲染页面，为axios 请求头添加  token 令牌。全局配置axios拦截器，在发请求前为请求头添加token令牌。添加退出功能。
3. 创建用户管理页面，发送 get 请求获取 users 数据，引入 moment 定义全局过滤器，对时间格式进行处理。增加分页功能，增加搜索用户功能，增加添加用户功能，增加删除用户功能，增加编辑用户信息功能，增加修改用户状态功能，增加分配角色功能，创建全局面包屑组件。
4.  创建权限列表页面，发送axios请求获取数据，渲染表格。微表格添加展开按钮，添加三级权限菜单，增加删除权限功能，增加分配权限功能。

