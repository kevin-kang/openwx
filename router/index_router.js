import Router from 'koa-router';
import util from '../util.js';

const proxy = util.proxy;

const index = new Router();

const renderIndex = async ctx => {

    const data = proxy('http://apis.baidu.com/heweather/weather/free?city=beijing',{
            method: 'GET',
            headers: {
                apikey: '414695ca34d75c3cab1d043c5813d7e5'
            }
        }),
        datajson = await data;

    await ctx.render('index',{shopname: '测试商户'});
};

index.get('/example', async ctx => {
    await ctx.send(ctx, 'example.html', {
        root: 'static'
    });
}).get('/', renderIndex);

export default index;