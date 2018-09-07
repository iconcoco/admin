module.exports = {
    //需要打包的入口，生产上线环境 所有的需要打包的入口都写在这边
    entry:{ 
        admin:["babel-polyfill","./src/main.js"]
    },
    webside:'/'
}