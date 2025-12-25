// NodeSeek Cookie Capture - Egern/Surge Compatible
const cookieName = 'NodeSeek';
const cookieKey = 'cookie_nodeseek';

// Check if this is running in http-request context
if (typeof $request !== 'undefined' && $request.headers) {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    
    if (cookie) {
        $persistentStore.write(cookie, cookieKey);
        $notification.post(cookieName, 'Cookie获取成功 ✅', 'Cookie已保存');
        console.log('[NodeSeek] Cookie saved successfully');
    } else {
        $notification.post(cookieName, 'Cookie获取失败 ❌', '未找到Cookie');
        console.log('[NodeSeek] No cookie found in request');
    }
}

$done({});
