# 安装依赖包
npm install

# 运行项目
npm run dev

# 打包上线
npm run build

#项目目录结构

|___config 线上线下打包的配置文件夹
|
|___node_modules  项目的依赖文件，比如vue
|
|___src 源文件目录
|   |___components  
|   |
|   |___css
|   |
|   |___images
|   |
|   |___page
|       |__login 登录页文件夹
|       |       |__index.js         webapck打包的入口文件
|       |       |__App.vue vue      文件的入口
|       |       |__index.html       页面模板
|       |       |__route.js         前端页面路由
|       |       |__api.js           接口
|       |
|       |__index 首页文件夹
|               |__index.js         webapck打包的入口文件
|               |__App.vue vue      文件的入口
|               |__index.html       页面模板
|               |__route.js         前端页面路由
|               |__api.js           接口
|
|___dist
    |___pages 打包之后的文件目录
        |__index
        |       |__index.html
        |       |__index.js
        |__login
                |__login.html
                |__login.js

