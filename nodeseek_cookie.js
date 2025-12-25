// NodeSeek Cookie Capture - Egern/Surge Compatible
const cookieKey = 'CookieNS';

// Check if this is running in http-request context
if (typeof $request !== 'undefined' && $request.headers) {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    
    if (cookie) {
        // Save the raw cookie string
        $persistentStore.write(cookie, cookieKey);
        $notification.post('NodeSeek', 'Cookie获取成功 ✅', 'Cookie已保存');
        console.log('[NodeSeek Cookie] Saved successfully');
        console.log('[NodeSeek Cookie] Key: ' + cookieKey);
        console.log('[NodeSeek Cookie] Length: ' + cookie.length);
    } else {
        $notification.post('NodeSeek', 'Cookie获取失败 ❌', '未找到Cookie');
        console.log('[NodeSeek Cookie] No cookie found in request');
    }
}

$done({});
