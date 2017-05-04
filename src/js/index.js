import '../scss/style.scss';
import FastClick from 'fastclick';

FastClick.attach(document.body);
document.body.addEventListener('touchstart', () => {});
document.oncontextmenu = () => false;

const rmbstr = '￥';
const $ = str => document.querySelector(str);
const $$ = str => document.querySelectorAll(str);
const btn = $('.number-input');
const inputMoney = $('.money-ipt dd strong');
const patBtn = $('.pay-btn');
let oldTime,
    nowTime,
    timer = null,
    timerout = null;

const clearIpt = () => {
    inputMoney.innerText = inputMoney.innerText.slice(0, -1);
    if (inputMoney.innerText.length == 1) {
        inputMoney.innerText = '';
        patBtn.disabled = true;
    }
}

const isDisabled = () => {
    patBtn.disabled = false;
    if (inputMoney.innerText.indexOf('.') > 0 && inputMoney.innerText.indexOf('.') + 1 == inputMoney.innerText.length) {
        patBtn.disabled = true;
    }
};

const longTap = () => {
    timerout = setTimeout(() => {
        timer = setInterval(() => {
            if (inputMoney.innerText.length == 1) {
                clearInterval(timer);
            }
            clearIpt();
        }, 100);
    }, 600);
    return;
};

btn.addEventListener('click', e => {
    let _this = e.target,
        thisTxt = _this.innerText;

    if (_this.className == 'delete' || _this.className == 'pay-btn') {
        if (_this.className == 'delete' && inputMoney.innerText.length > 0) {
            clearIpt();
            isDisabled();
        }
        if (_this.className == 'pay-btn') {
            //确认支付跳转代码放这个
            console.log('支付中..');
        }
        return;
    }
    if (inputMoney.innerText.indexOf('.') > 0 && _this.className == 'dot') {
        return true;
    }
    if (inputMoney.innerText.indexOf('.') > 0 && inputMoney.innerText.split('.')[1].length > 1) {
        inputMoney.innerText = inputMoney.innerText.slice(0, inputMoney.innerText.indexOf('.') + 3);
        return;
    }

    inputMoney.innerText = rmbstr + inputMoney.innerText.slice(1, inputMoney.innerText.length) + thisTxt;
    isDisabled();
}, false);

btn.addEventListener('touchstart', e => {
    let _this = e.target,
        thisTxt = _this.innerText;

    if (_this.className == 'delete' && inputMoney.innerText.length > 0) {
        longTap();
    }
});

btn.addEventListener('touchend', e => {
    clearTimeout(timerout);
    clearInterval(timer);
});