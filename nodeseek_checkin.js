// NodeSeek Daily Check-in - Following Original Design
const $ = new Env("NodeSeek");
const ckName = "nodeseek_data";

// Get user cookie data
const userCookie = $.toObj($.getdata(ckName)) || [];

// Configuration
const is_default = 'false'; // 'false' = fixed 5 drumsticks, 'true' = random

async function main() {
    try {
        console.log('[NodeSeek] Check-in script started');
        console.log('[NodeSeek] Found ' + userCookie.length + ' account(s)');
        
        if (!userCookie || userCookie.length === 0) {
            throw new Error("no available accounts found");
        }
        
        // Process each user account
        for (let i = 0; i < userCookie.length; i++) {
            const user = userCookie[i];
            console.log(`[NodeSeek] Processing account ${i + 1}: ${user.userName || user.userId}`);
            
            try {
                // Perform check-in
                const signinResult = await signin(user, is_default);
                console.log(`[NodeSeek] ${user.userName}: ${signinResult}`);
                
                // Get user info
                const userInfo = await getUserInfo(user);
                if (userInfo) {
                    const message = `${user.userName}\n${signinResult}\n当前共${userInfo.coin}个鸡腿🍗`;
                    $notification.post('NodeSeek签到', '✅ 签到成功', message);
                } else {
                    $notification.post('NodeSeek签到', '⚠️ ' + signinResult, user.userName);
                }
                
            } catch (e) {
                console.log(`[NodeSeek] Error for ${user.userName}: ${e}`);
                $notification.post('NodeSeek签到', '❌ 签到失败', `${user.userName}: ${e}`);
            }
        }
        
    } catch (e) {
        console.log('[NodeSeek] Main error: ' + e);
        $notification.post('NodeSeek签到', '❌ 脚本错误', String(e));
    }
    $done();
}

// Sign in function
async function signin(user, isDefault) {
    const url = `https://www.nodeseek.com/api/attendance?random=${isDefault}`;
    const headers = {
        'accept-encoding': 'gzip, deflate, br',
        'sec-fetch-mode': 'cors',
        'origin': 'https://www.nodeseek.com',
        'referer': 'https://www.nodeseek.com/board',
        'accept-language': 'zh-CN,zh-Hans;q=0.9',
        'accept': '*/*',
        'sec-fetch-dest': 'empty',
        'cookie': user.token,
        'content-length': '0',
        'sec-fetch-site': 'same-origin',
    };
    
    return new Promise((resolve, reject) => {
        $httpClient.post({
            url: url,
            headers: headers
        }, function(error, response, data) {
            if (error) {
                reject(error);
            } else {
                try {
                    const result = JSON.parse(data);
                    if (result.success) {
                        resolve(result.message || '签到成功');
                    } else {
                        resolve(result.message || '签到失败');
                    }
                } catch(e) {
                    reject('解析响应失败: ' + e);
                }
            }
        });
    });
}

// Get user info function
async function getUserInfo(user) {
    const url = `https://www.nodeseek.com/api/account/getInfo/${user.userId}?readme=1`;
    const headers = {
        'accept-encoding': 'gzip, deflate, br',
        'sec-fetch-mode': 'cors',
        'origin': 'https://www.nodeseek.com',
        'referer': 'https://www.nodeseek.com/board',
        'accept-language': 'zh-CN,zh-Hans;q=0.9',
        'accept': '*/*',
        'sec-fetch-dest': 'empty',
        'cookie': user.token,
        'sec-fetch-site': 'same-origin',
    };
    
    return new Promise((resolve, reject) => {
        $httpClient.get({
            url: url,
            headers: headers
        }, function(error, response, data) {
            if (error) {
                resolve(null);
            } else {
                try {
                    const result = JSON.parse(data);
                    resolve(result.detail);
                } catch(e) {
                    resolve(null);
                }
            }
        });
    });
}

// Execute main function
main();

// Env class for compatibility
function Env(name) {
    this.name = name;
    this.toObj = (str) => {
        try { return JSON.parse(str); } catch { return null; }
    };
    this.getdata = (key) => $persistentStore.read(key);
}
