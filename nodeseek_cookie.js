// NodeSeek Cookie Capture for Egern
const $ = new Env('NodeSeek');

// Get cookie from request headers
const cookieValue = $request.headers['Cookie'] || $request.headers['cookie'];

if (cookieValue) {
    // Save cookie
    $.setdata(cookieValue, 'CookieNS');
    $.msg('NodeSeek', 'Cookie获取成功 ✅', 'Cookie已保存，可以进行签到了');
    console.log('NodeSeek Cookie saved: ' + cookieValue);
} else {
    $.msg('NodeSeek', 'Cookie获取失败 ❌', '未找到Cookie，请确保已登录');
}

$.done({});

// Env class for Egern
function Env(name) {
    this.name = name;
    this.setdata = (val, key) => $persistentStore.write(val, key);
    this.getdata = (key) => $persistentStore.read(key);
    this.msg = (title, subtitle, message) => $notification.post(title, subtitle, message);
    this.done = (obj = {}) => $done(obj);
}
