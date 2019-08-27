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
2. 创建主页，进入主页首先判断是否有 token，如果没有返回登录页面。发送 get 请求获取数据渲染页面，为axios 请求头添加  token 令牌。添加退出功能。
3. 创建用户管理页面，发送 get 请求获取 users 数据，引入 moment 定义全局过滤器，对时间格式进行处理。添加分页功能。

创建主页

