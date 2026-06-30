(function(){

 // Paste your OAuth 2.0 Client ID here (replace the string below)
    const CLIENT_ID = "422106472304-tqfgj7k52453ks6ivv5meo9lmcre54kf.apps.googleusercontent.com";

const NAMESPACED_KEYS = new Set([
    'stats','gameHistory','settings','achievements','savedGame',
    'whiteTime','blackTime','pieceTheme','theme','volume','mute','gameMode'
]);

let currentUser = null;

function mapKey(key){
    if(!currentUser) return key;
    if(NAMESPACED_KEYS.has(key)) return `${key}_${currentUser.id}`;
    return key;
}

 // Preserve original Storage methods for migration and fallback
const _get = Storage.prototype.getItem;
const _set = Storage.prototype.setItem;
const _remove = Storage.prototype.removeItem;

 // Monkey-patch Storage methods to provide namespaced keys when a user is signed in.
Storage.prototype.getItem = function(key){
    try{
        const mapped = mapKey(key);
        const v = _get.call(this,mapped);
        return v !== null ? v : _get.call(this,key);
    }catch(e){
        return _get.call(this,key);
    }
};

Storage.prototype.setItem = function(key,value){
    try{
        const mapped = mapKey(key);
        return _set.call(this,mapped,value);
    }catch(e){
        return _set.call(this,key,value);
    }
};

Storage.prototype.removeItem = function(key){
    try{
        const mapped = mapKey(key);
        _remove.call(this,mapped);
         // also remove non-namespaced key if exists
        _remove.call(this,key);
    }catch(e){
        _remove.call(this,key);
    }
};

function migrateOldKeysToUser(user){
     // For each namespaced key, if an un-namespaced value exists, copy it to namespaced key.
    NAMESPACED_KEYS.forEach(k => {
        try{
            const raw = _get.call(localStorage, k);
            if(raw !== null){
                const mapped = `${k}_${user.id}`;
                 // Only copy if mapped key doesn't already exist
                const exists = _get.call(localStorage, mapped);
                if(exists === null){
                    _set.call(localStorage, mapped, raw);
                }
            }
        }catch(e){
             // ignore migration errors
        }
    });
}

function saveUser(user){
     // Save user in un-namespaced 'user' key (session info)
    _set.call(localStorage, 'user', JSON.stringify(user));
    currentUser = user;

     // Migrate existing global keys into namespaced keys for this user (do not delete originals)
     try{ migrateOldKeysToUser(user); }catch(e){/* ignore */}
}

function clearUser(){
    _remove.call(localStorage, 'user');
    currentUser = null;
}

function getUser(){
    if(currentUser) return currentUser;
    const raw = _get.call(localStorage, 'user');
    if(!raw) return null;
    try{ currentUser = JSON.parse(raw); return currentUser;}catch(e){return null}
}

function updateLoginUI(){
    const area = document.getElementById('loginArea');
    if(!area) return;
    const user = getUser();
    if(user){
        area.innerHTML = `\n            <img src="${user.picture || 'https://www.gravatar.com/avatar/?d=mp'}" alt="avatar" class="avatar" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;margin-right:8px;">\n            <span style="vertical-align:middle;margin-right:8px;">${user.name}</span>\n            <button id="logoutBtn">Logout</button>\n        `;
        const out = document.getElementById('logoutBtn');
        if(out) out.addEventListener('click', () => { logout(); updateLoginUI(); });
    }else{
        area.innerHTML = `<button id="loginBtn">Login</button>`;
        const btn = document.getElementById('loginBtn');
        if(btn) btn.addEventListener('click', openLogin);
    }
}

function decodeJwt(token){
    try{
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g,'+').replace(/_/g,'/');
        const json = decodeURIComponent(atob(base64).split('').map(function(c){
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(json);
    }catch(e){
        return null;
    }
}

 // GIS callback
function handleCredentialResponse(response){
    const data = decodeJwt(response.credential);
    if(!data) return;
    const user = {
        id: data.sub,
        name: data.name || data.email || 'Unknown',
        email: data.email || '',
        picture: data.picture || ''
    };
    saveUser(user);
    updateLoginUI();
}

function ensureGsiClientLoaded(cb){
    if(window.google && google.accounts && google.accounts.id){
        cb();
        return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = cb;
    document.head.appendChild(s);
}

function openLogin(){
    const cid = (typeof CLIENT_ID === 'string' && CLIENT_ID && CLIENT_ID !== 'PASTE_CLIENT_ID_HERE') ? CLIENT_ID : (window.GOOGLE_CLIENT_ID || null);
    if(!cid){
        alert('Google Client ID not configured. Please paste your Client ID into JS/login.js or set window.GOOGLE_CLIENT_ID before loading the script.');
        return;
    }
    ensureGsiClientLoaded(() => {
        try{
            google.accounts.id.initialize({
                client_id: cid,
                callback: handleCredentialResponse
            });
            google.accounts.id.prompt();
        }catch(e){
            console.error('GIS init error', e);
            alert('Google Sign-In initialization failed. Check console for details.');
        }
    });
}

function logout(){
    clearUser();
     // update UI and allow pages to react
    updateLoginUI();
}

 // public API
window.loginManager = {
    openLogin,
    logout,
    getUser
};

 // expose shorthand functions for compatibility: existing code may call login()/logout()
window.openLogin = openLogin;
window.logout = logout;
window.getCurrentUser = getUser;

 // On DOMContentLoaded attempt to restore session and update UI if loginArea exists
document.addEventListener('DOMContentLoaded', () => {
    getUser();
    updateLoginUI();
});

})();
