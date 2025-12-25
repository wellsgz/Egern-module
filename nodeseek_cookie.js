// NodeSeek Cookie Capture - Following Original Design
// This script captures cookie when you view your profile
const $ = new Env("NodeSeek");
const ckName = "nodeseek_data";

// Get existing cookie data
const userCookie = $.toObj($.getdata(ckName)) || [];

async function getCookie() {
    try {
        if ($request && $request.method === 'OPTIONS') {
            $done({});
            return;
        }
        
        // Get cookie from request headers
        const header = ObjectKeys2LowerCase($request.headers);
        if (!header) {
            $.msg($.name, `⛔️ script run error!`, `无法获取请求头`);
            $done({});
            return;
        }
        
        let token = header.cookie;
        
        // Get user info from response body
        let Body = $.toObj($response.body);
        
        if (!(token && Body)) {
            throw new Error("获取token失败！请检查配置是否正确");
        }
        
        let { member_id, member_name } = Body?.detail ?? {};
        
        if (!member_id) {
            throw new Error("无法获取用户ID，请确保访问了正确的API");
        }
        
        const newData = {
            "userId": member_id,
            "token": token,
            "userName": member_name,
        };
        
        console.log('[NodeSeek Cookie] User ID: ' + member_id);
        console.log('[NodeSeek Cookie] User Name: ' + member_name);
        console.log('[NodeSeek Cookie] Token length: ' + token.length);
        
        // Find and update or add new user
        const index = userCookie.findIndex(e => e.userId == newData.userId);
        if (index !== -1) {
            userCookie[index] = newData;
            console.log('[NodeSeek Cookie] Updated existing user');
        } else {
            userCookie.push(newData);
            console.log('[NodeSeek Cookie] Added new user');
        }
        
        // Save to persistent storage
        $.setjson(userCookie, ckName);
        $.msg($.name, `🎉 ${newData.userName} 更新token成功!`, `用户ID: ${member_id}`);
        
    } catch (e) {
        console.log('[NodeSeek Cookie] Error: ' + e);
        $.msg($.name, `⛔️ 获取Cookie失败`, String(e));
    }
    $done({});
}

// Helper function to convert object keys to lowercase
function ObjectKeys2LowerCase(obj) {
    if (!obj) return {};
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
    );
}

// Execute
getCookie();

// Env class for compatibility
function Env(name) {
    this.name = name;
    this.toObj = (str) => {
        try { return JSON.parse(str); } catch { return null; }
    };
    this.toStr = (obj) => {
        try { return JSON.stringify(obj); } catch { return null; }
    };
    this.getdata = (key) => $persistentStore.read(key);
    this.setjson = (obj, key) => {
        try {
            return $persistentStore.write(JSON.stringify(obj), key);
        } catch {
            return false;
        }
    };
    this.msg = (title, subtitle, message) => {
        $notification.post(title, subtitle, message);
    };
}
