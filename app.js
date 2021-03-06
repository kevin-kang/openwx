import Koa from 'koa';
import views from 'koa-views'; // 模板引擎
import util from './utils'; // 工具类
import staticServer from 'koa-static'; // 静态服务器
import staticServerCache from 'koa-static-cache'; // 静态服务缓存
import send from 'koa-send'; // 发送静态文件。例如index.html
import convert from 'koa-convert'; // koa1 to convert koa2
import bodyParser from 'koa-bodyparser'; // 解析body
import cookie from 'koa-cookie';
// import compress from 'koa-compress'; // 开启zgip
import path from 'path'; // 路径
import cors from 'koa-cors'; // 设置跨域
import logger from 'koa-logger'; // 控制台日志
import index from './router/index_router.js'; //首页相关路由

const app = new Koa();
const KoaErr = util.KoaErr;

//设置渲染引擎
app.use(convert(views(path.join(__dirname, 'views'), {
    extension: 'pug',
    map: {
        html: 'pug'
    }
})));

//使用cookie
app.use(cookie());

// 全局错误处理
app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = err;
        ctx.status = err.status || 500;
    }
});

// 自定义记录执行时间中间件
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} | ${ctx.type} ${ctx.url} - ${ms}ms`);
});

// log
app.use(convert(logger()));

// 处理404 400 500 错误跳首页
app.use(async(ctx, next) => { 
    await next();
    // if (ctx.status === 404) {
    //     ctx.redirect('/index.html');
    // }
});

// 使用自定义错误
app.use(async(ctx, next) => {
    ctx.Err = KoaErr;
    await next();
});

// 设置跨域
app.use(convert(cors({
    origin: true,
    // credentials: true
})));

// 设置Header
app.use(async(ctx, next) => {
    await next();
    ctx.set('X-Powered-By', 'Koa2-Easy');
});

// 设置gzip
app.use(convert(staticServerCache({
    gzip: true,
    maxAge: 3 * 24 * 60 * 60
})));

// 静态文件夹
app.use(convert(staticServer(path.join(__dirname, 'static'))));

// body解析
app.use(convert(bodyParser()));

// 发送文件，如HTML
app.use(async(ctx, next) => {
    ctx.send = send;
    await next();
});

// 首页路由
app.use(index.routes());

// 开启服务
app.listen(process.env.PORT || 3000)
console.log(`Server up and running! On port ${process.env.PORT || 3000}!`);
