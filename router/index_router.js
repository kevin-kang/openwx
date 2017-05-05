import Router from 'koa-router';
import util from '../utils.js';
import later from 'later';
import crypto from 'crypto';
import fs from 'fs';
import iconv from 'iconv-lite';
import http from 'http';
import https from 'https';
import querystring from 'querystring';

const privatePem = fs.readFileSync('./static/openssl/pkcs8_private_key.pem');
const publicPem = fs.readFileSync('./static/openssl/public_key.pem');
const helpDataDir = fs.readdirSync('./data/文档内容/');
const helpDataJG = fs.readFileSync('./data/文档结构.txt');
const privateKey = privatePem.toString();
const publicKey = publicPem.toString();
const exec = require('child_process').exec;

const proxy = util.proxy;

const index = new Router();

const filterFile = (() => helpDataDir.filter(v => v != '.DS_Store'))();

let cacheToken;

const renderIndex = async ctx => {
    const data = proxy('http://apis.baidu.com/heweather/weather/free?city=beijing', {
            method: 'GET',
            headers: {
                apikey: '414695ca34d75c3cab1d043c5813d7e5'
            }
        }),
        datajson = await data;

    const getTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx114468045abe562e&secret=979d4949e3f5f8dcef6fe01b565f1282';

    if (!cacheToken) {
        cacheToken = await proxy(getTokenUrl);
    }

    if (JSON.parse(cacheToken).expires_in) {
        setTimeout(async() => {
            cacheToken = await proxy(getTokenUrl);
        }, 2000);
    }

    console.log('此处是访问服务时带的cookie：' + ctx.header.cookie);

    await ctx.render('index', {
        shopname: '测试商户'
    });
};

const sign = async ctx => {
    try {
        let signtype = ctx.request.body.signtype.toLocaleUpperCase(),
            rsData = ctx.request.body.charge,
            signStr = '',
            result = {},
            charge = {
                app_id: rsData.appId,
                charge: {
                    order_no: rsData.orderId,
                    amount: rsData.amount.indexOf('.') > -1 ? rsData.amount * 100 : rsData.amount,
                    channel: rsData.channel,
                    subject: rsData.subject,
                    notify_url: rsData.notifyUrl,
                    extra: rsData.extra
                }
            };

        const md5 = 'c9840c899be3ae70892e588c402e22a';

        const isEmportObj = obj => {
                if (typeof obj == 'object') {
                    for (var name in obj) {
                        return false;
                    }
                    return true;
                }
            },
            obj2Str = obj => {
                let keyArr = Object.keys(obj),
                    str = '',
                    startStr = '=',
                    midStr = '',
                    lastStr = '&';
                keyArr.sort();

                keyArr.forEach((v, i) => {
                    if (obj[v] === '' || obj[v] == undefined || isEmportObj(obj[v])) {
                        return;
                    }
                    midStr = obj[v];
                    if (typeof obj[v] == 'object') {
                        midStr = '{' + obj2Str(obj[v]) + '}';
                    }
                    str += (v + startStr + midStr + (i + 1 == keyArr.length ? '' : lastStr));
                });
                return str;
            };

        let chargeStr = obj2Str(charge);

        console.log(chargeStr);

        if (signtype === 'MD5') {
            let signMD5 = crypto.createHash('MD5');

            signStr = signMD5.update(chargeStr + '&key=' + md5).digest('hex');
            console.log('生成MD5签名成功! MD5:' + signStr);
        }
        if (signtype === 'RSA') {

            let sign = crypto.createSign('sha1');

            signStr = sign.update(chargeStr).sign(privateKey, 'hex');

            console.log('生成RSA签名成功! RSA:' + signStr);
        }


        if (!signStr) {
            result.status = 300;
            result.msg = '签名失败';
            throw result;
        }

        if (!signtype || isEmportObj(charge)) {
            result.status = 301;
            result.msg = 'signtype、charge为必填';
            throw result;
        }

        result.status = 200;
        result.msg = signStr;

        ctx.body = result;

    } catch (e) {
        ctx.body = e.toString();
        return;
    }
};

const signsupport = async ctx => {
    try {
        let signtype = ctx.request.body.signtype.toLocaleUpperCase(),
            rsData = ctx.request.body.charge,
            signStr = '',
            result = {},
            charge = {
                app_id: rsData.app_id,
                charset: rsData.charset,
                device: rsData.device,
                order_no: rsData.order_no,
                channel: rsData.channel,
                version: rsData.version
            };

        const md5 = '96e79218965eb72c92a549dd5a330112';

        const isEmportObj = obj => {
                if (typeof obj == 'object') {
                    for (var name in obj) {
                        return false;
                    }
                    return true;
                }
            },
            obj2Str = obj => {
                let keyArr = Object.keys(obj),
                    str = '',
                    startStr = '=',
                    midStr = '',
                    lastStr = '&';
                keyArr.sort();

                keyArr.forEach((v, i) => {
                    if (obj[v] === '' || obj[v] == undefined || isEmportObj(obj[v])) {
                        return;
                    }
                    midStr = obj[v];
                    if (typeof obj[v] == 'object') {
                        midStr = '{' + obj2Str(obj[v]) + '}';
                    }
                    str += (v + startStr + midStr + (i + 1 == keyArr.length ? '' : lastStr));
                });
                return str;
            };

        let chargeStr = obj2Str(charge);

        console.log(chargeStr);

        if (signtype === 'MD5') {
            let signMD5 = crypto.createHash('MD5');

            signStr = signMD5.update(chargeStr + '&key=' + md5).digest('hex');
            console.log('生成MD5签名成功! MD5:' + signStr);
        }
        if (signtype === 'RSA') {

            let sign = crypto.createSign('sha1');

            signStr = sign.update(chargeStr).sign(privateKey, 'hex');

            console.log('生成RSA签名成功! RSA:' + signStr);
        }

        if (!signStr) {
            result.status = 300;
            result.msg = '签名失败';
            throw result;
        }

        if (!signtype || isEmportObj(charge)) {
            result.status = 301;
            result.msg = 'signtype、charge为必填';
            throw result;
        }

        result.status = 200;
        result.msg = signStr;

        ctx.body = result;

    } catch (e) {
        ctx.body = e.toString();
        return;
    }
};

const testCookie = async ctx => {

    ctx.body = ctx.request.body;
    // console.log.log('a');
};

const licaiagent = async ctx => {
    const data = proxy('http://10.100.140.42:8081/enjoyfinance-web' + ctx.request.url.replace(/\/licaiagent/g, ''), {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ctx.request.body)
        }),
        datajson = await data;

    ctx.body = datajson;
};

index.post('/sign', sign)
     .post('/testCookie', testCookie)
     .post('/signsupport', signsupport)
     .post('/licaiagent/*', licaiagent)
     .get('/', renderIndex);

export default index;