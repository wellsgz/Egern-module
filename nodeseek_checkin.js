// NodeSeek Daily Check-in for Egern
const $ = new Env('NodeSeek');

!(async () => {
    // Get saved cookie
    const cookie = $.getdata('CookieNS');
    
    if (!cookie) {
        $.msg('NodeSeek签到', '❌ Cookie未获取', '请先访问www.nodeseek.com获取Cookie');
        return;
    }

    // Check-in request
    const url = 'https://www.nodeseek.com/api/attendance?random=true';
    const headers = {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://www.nodeseek.com/'
    };

    try {
        const response = await $.http.post({ url, headers });
        const body = JSON.parse(response.body);
        
        if (body.success) {
            const reward = body.data || '未知奖励';
            $.msg('NodeSeek签到', '✅ 签到成功', `获得奖励: ${reward}`);
        } else {
            const message = body.message || '未知错误';
            $.msg('NodeSeek签到', '⚠️ 签到失败', message);
        }
    } catch (e) {
        $.msg('NodeSeek签到', '❌ 请求失败', e.toString());
        console.log('NodeSeek error: ' + e);
    }
})().finally(() => $.done());

// Env class for Egern
function Env(name) {
    this.name = name;
    this.setdata = (val, key) => $persistentStore.write(val, key);
    this.getdata = (key) => $persistentStore.read(key);
    this.msg = (title, subtitle, message) => $notification.post(title, subtitle, message);
    this.done = (obj = {}) => $done(obj);
    this.http = {
        post: (opts) => {
            return new Promise((resolve, reject) => {
                $httpClient.post(opts, (error, response, body) => {
                    if (error) reject(error);
                    else resolve({ ...response, body });
                });
            });
        }
    };
}
