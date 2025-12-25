// NodeSeek Daily Check-in - Egern/Surge Compatible
const cookieName = 'NodeSeek';
const cookieKey = 'CookieNS';

console.log('[NodeSeek] Check-in script started');

// Get saved cookie data
const cookieData = $persistentStore.read(cookieKey);
console.log('[NodeSeek] Cookie data retrieved: ' + (cookieData ? 'YES' : 'NO'));

if (!cookieData || cookieData === '') {
    console.log('[NodeSeek] No cookie found');
    $notification.post(cookieName + '签到', '❌ Cookie未获取', '请先访问www.nodeseek.com获取Cookie');
    $done();
} else {
    // Parse the cookie data (it might be JSON or raw string)
    let cookie;
    try {
        const parsed = JSON.parse(cookieData);
        cookie = parsed.token || cookieData;
        console.log('[NodeSeek] Cookie parsed from JSON');
    } catch(e) {
        cookie = cookieData;
        console.log('[NodeSeek] Using cookie as raw string');
    }
    
    console.log('[NodeSeek] Cookie length: ' + cookie.length);
    
    const url = 'https://www.nodeseek.com/api/attendance?random=true';
    const headers = {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://www.nodeseek.com/',
        'Origin': 'https://www.nodeseek.com'
    };

    console.log('[NodeSeek] Making POST request to: ' + url);

    $httpClient.post({
        url: url,
        headers: headers
    }, function(error, response, data) {
        console.log('[NodeSeek] Response callback triggered');
        
        if (error) {
            console.log('[NodeSeek] Error: ' + error);
            $notification.post(cookieName + '签到', '❌ 网络错误', String(error));
        } else {
            const statusCode = response.status || response.statusCode;
            console.log('[NodeSeek] Status Code: ' + statusCode);
            console.log('[NodeSeek] Response Data: ' + data);
            
            try {
                const obj = JSON.parse(data);
                if (obj.success) {
                    const reward = obj.data ? JSON.stringify(obj.data) : '签到成功';
                    console.log('[NodeSeek] Check-in successful: ' + reward);
                    $notification.post(cookieName + '签到', '✅ 签到成功', reward);
                } else {
                    const message = obj.message || '未知错误';
                    console.log('[NodeSeek] Check-in failed: ' + message);
                    $notification.post(cookieName + '签到', '⚠️ 签到失败', message);
                }
            } catch(e) {
                console.log('[NodeSeek] JSON parse error: ' + e);
                console.log('[NodeSeek] Raw response: ' + data);
                $notification.post(cookieName + '签到', '❌ 解析错误', data.substring(0, 100));
            }
        }
        $done();
    });
}
