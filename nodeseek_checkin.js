// NodeSeek Daily Check-in - Egern/Surge Compatible
const cookieName = 'NodeSeek';
const cookieKey = 'cookie_nodeseek';

console.log('[NodeSeek] Check-in script started');

// Get saved cookie
const cookie = $persistentStore.read(cookieKey);
console.log('[NodeSeek] Cookie retrieved: ' + (cookie ? 'YES' : 'NO'));

if (!cookie || cookie === '') {
    console.log('[NodeSeek] No cookie found, sending notification');
    $notification.post(cookieName + '签到', '❌ Cookie未获取', '请先访问www.nodeseek.com获取Cookie');
    $done();
} else {
    console.log('[NodeSeek] Cookie found, preparing request');
    
    const url = 'https://www.nodeseek.com/api/attendance?random=true';
    const headers = {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
        'Referer': 'https://www.nodeseek.com/'
    };

    console.log('[NodeSeek] Making POST request to: ' + url);

    $httpClient.post({
        url: url,
        headers: headers
    }, function(error, response, data) {
        console.log('[NodeSeek] Response received');
        
        if (error) {
            console.log('[NodeSeek] Error: ' + error);
            $notification.post(cookieName + '签到', '❌ 网络错误', String(error));
        } else {
            console.log('[NodeSeek] Status: ' + (response.status || response.statusCode));
            console.log('[NodeSeek] Data: ' + data);
            
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
                console.log('[NodeSeek] Parse error: ' + e);
                $notification.post(cookieName + '签到', '❌ 解析错误', String(e));
            }
        }
        $done();
    });
}
