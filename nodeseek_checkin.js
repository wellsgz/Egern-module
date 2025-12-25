// NodeSeek Daily Check-in - Egern/Surge Compatible
const cookieName = 'NodeSeek';
const cookieKey = 'cookie_nodeseek';

const url = 'https://www.nodeseek.com/api/attendance?random=true';

// Get saved cookie
const cookie = $persistentStore.read(cookieKey);

if (!cookie || cookie === '') {
    $notification.post(cookieName + '签到', '❌ Cookie未获取', '请先访问www.nodeseek.com获取Cookie');
    $done();
} else {
    const headers = {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://www.nodeseek.com/',
        'Origin': 'https://www.nodeseek.com'
    };

    const myRequest = {
        url: url,
        headers: headers
    };

    $httpClient.post(myRequest, function(error, response, data) {
        if (error) {
            $notification.post(cookieName + '签到', '❌ 网络错误', error);
            console.log('[NodeSeek] Network error: ' + error);
            $done();
        } else {
            console.log('[NodeSeek] Response: ' + data);
            try {
                const obj = JSON.parse(data);
                if (obj.success) {
                    const reward = obj.data ? JSON.stringify(obj.data) : '签到成功';
                    $notification.post(cookieName + '签到', '✅ 签到成功', reward);
                } else {
                    const message = obj.message || '未知错误';
                    $notification.post(cookieName + '签到', '⚠️ 签到失败', message);
                }
            } catch(e) {
                $notification.post(cookieName + '签到', '❌ 解析错误', data.substring(0, 100));
                console.log('[NodeSeek] Parse error: ' + e);
            }
            $done();
        }
    });
}
