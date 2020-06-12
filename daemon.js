/*! 力控科技版权所有 */
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./daemon/bin/www.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../daemon/config/default-config.json":
/*!********************************!*\
  !*** external "./config.json" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./config.json");

/***/ }),

/***/ "./daemon/app.js":
/*!***********************!*\
  !*** ./daemon/app.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Koa = __webpack_require__(/*! koa */ "koa")
const views = __webpack_require__(/*! koa-views */ "koa-views")
const json = __webpack_require__(/*! koa-json */ "koa-json")
const onerror = __webpack_require__(/*! koa-onerror */ "koa-onerror")
const bodyparser = __webpack_require__(/*! koa-bodyparser */ "koa-bodyparser")
const logger = __webpack_require__(/*! koa-logger */ "koa-logger")
const ejs = __webpack_require__(/*! ejs */ "ejs");
const Jwt = __webpack_require__(/*! ./libs/jwt */ "./daemon/libs/jwt.js");
const indexRoute = __webpack_require__(/*! ./routes/index-routes */ "./daemon/routes/index-routes.js");
const serviceRoute = __webpack_require__(/*! ./routes/service-routes */ "./daemon/routes/service-routes.js")
const apiv2Route = __webpack_require__(/*! ./routes/apiv2-routes */ "./daemon/routes/apiv2-routes.js")
const dataServerRoute = __webpack_require__(/*! ./routes/data-server-routes */ "./daemon/routes/data-server-routes.js");
const dataSourceRoute = __webpack_require__(/*! ./routes/data-source-routes */ "./daemon/routes/data-source-routes.js");
const sqlServerRoute = __webpack_require__(/*! ./routes/sql-server-routes */ "./daemon/routes/sql-server-routes.js");
const c2k = __webpack_require__(/*! koa2-connect */ "koa2-connect");
const app = new Koa()
// error handler
//onerror(app)

app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))

app.use(json());


//app.use(logger())
app.use(__webpack_require__(/*! koa-static */ "koa-static")(__dirname + '/views'))
app.use(views(__dirname + '/views', {
	map: { html: 'ejs' }
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

//鉴权中间件
app.use(async (ctx, next) => {
	//不需要鉴权的请求路径
	let ignorePath = ["/login/users", "/"];
	let reqPath = ctx.request.path.replace(/^\/apiv2/, "");
	//不需要鉴权的请求路径正则
	let ignorePathRex = [/\/service/, /\/data/, /\/static\/images/, /\/sql/];
	let isIgnore = false;
	for (let i = 0; i < ignorePathRex.length; i++) {
		if (ignorePathRex[i].test(reqPath)) {
			isIgnore = true;
			break;
		}
	}
	if (ignorePath.indexOf(reqPath) >= 0 || isIgnore) {
		await next();
		return;
	}
	//用户请求token
	let userReqToken = ctx.headers["authorization"];
	if (!userReqToken) {
		ctx.status = 401;
		ctx.body = `{"retCode":0,"error":"非法请求"}`;
		return;
	}
	let jwt = new Jwt(License.pcid.toString());
	//验证token
	let chkToken = jwt.verifyToken(userReqToken);
	if (chkToken == 0) {
		ctx.status = 401;
		//token解析失败，返回非法请求
		ctx.body = `{"retCode":0,"error":"非法请求"}`;
		return;
	} else if (chkToken == 1) {
		ctx.status = 401;
		//token解析登录保留超时
		ctx.body = `{"retCode":-1,"error":"登录超时"}`;
		return;
	}
	await next();
})

/**
 * 解决koa2-connect将express中间件转换为koa2中间件时丢失body数据的bug
 */
app.use((ctx, next) => {
	let methodArr = ['POST', 'PATCH'];
	if (methodArr.indexOf(ctx.method) >= 0 && ctx.request.body) {
		ctx.req.body = ctx.request.body;
	}
	next();
})

//前端文件
app.use(indexRoute.routes(), indexRoute.allowedMethods())
//data-server服务
app.use(dataServerRoute.routes(), dataServerRoute.allowedMethods());
//操作数据源
app.use(dataSourceRoute.routes(), dataSourceRoute.allowedMethods());
//sql-server服务
app.use(sqlServerRoute.routes(), sqlServerRoute.allowedMethods());
//apiv2代理相关
app.use(apiv2Route.routes(), apiv2Route.allowedMethods())
//daemon与下属服务通讯
app.use(serviceRoute.routes(), serviceRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app


/***/ }),

/***/ "./daemon/bin/www.js":
/*!***************************!*\
  !*** ./daemon/bin/www.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */
//daemon全局配置
global.config = __webpack_require__(/*! ../config/default-config.json */ "../../daemon/config/default-config.json");
//debug
global.__debug = ""; //debug模式
if (process.argv[2] && process.argv[2] === "debug") {
	__debug = process.argv[2];
}

const public_modules = __webpack_require__(/*! ../libs/public-modules */ "./daemon/libs/public-modules.js");
const app = __webpack_require__(/*! ../app */ "./daemon/app.js");
const debug = __webpack_require__(/*! debug */ "debug")('demo:server');
const http = __webpack_require__(/*! http */ "http");
const c2k = __webpack_require__(/*! koa2-connect */ "koa2-connect");
const cluster = __webpack_require__(/*! cluster */ "cluster");
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");

//工作进程的最大数量
const MAXSUBCOUNT = __webpack_require__(/*! os */ "os").cpus().length;
process.env.PORT = config.port;
let port = normalizePort(process.env.PORT || '3000');

if (cluster.isMaster) {
	console.log(`[DAEMON-主 进 程${process.pid}] 启动`);
	//启动下属服务
	manager.init();
	//衍生出来的子进程个数不能超过服务器cpu个数
	if (config.subCount > MAXSUBCOUNT) {
		config.subCount = MAXSUBCOUNT;
	}
	for (let i = 0; i < config.subCount; i++) {
		cluster.fork();
	}
	//监听工作进程消息
	Object.keys(cluster.workers).forEach(item => {
		cluster.workers[item].on("message", msg => {
			//主进程分发消息给工作进程
			sendMsgToWorker(msg);
		})
	})
	//处理进程退出
	cluster.on('exit', (worker, code, signal) => {
		console.log(`[DAEMON-工作进程${process.pid}] 退出`);
	});

} else if (cluster.isWorker) {
	License.init();
	//创建http服务
	let server = http.createServer(app.callback());
	//监听端口
	server.listen(port);
	//real-server存在多个，动态创建中间件
	global.createProxy = function (proxyInfo) {
		app.use(c2k(proxyInfo.proxy));
	}
	server.on('upgrade', (response, socket, head) => {
		//real-server名称，decodeURI用于解决中文乱码
		let serverName = decodeURI(response.url.split("/")[2]);
		if (realServer[serverName]) {
			realServer[serverName].proxy.upgrade(response, socket, head);
		}
	});

	server.on('error', onError);
	server.on('listening', onListening);
	//监听主进程消息
	process.on("message", msg => {
		if (!msg.action) return;
		let action = msg.action;
		let data = msg.data;
		let serverName = data.name;
		switch (action) {
			case "updateRealServer":
				//新启动的服务或者是重启的服务
				if (!realServer[serverName] || realServer[serverName].port != data.port) {
					realServer.curPort = data.port;
					//realServer全局对象增加新的server对象
					realServer[serverName] = {
						"port": data.port,
						"proxy": createProxyMiddleware({
							target: `ws://localhost:${data.port}/`,
							changeOrigin: true,
							ws: true
						})
					}
					createProxy(realServer[serverName].proxy);
				}
				break;
			case "updateDataServer":
				//新启动的服务或者是重启的服务
				if (!dataServer[serverName] || dataServer[serverName].port != data.port) {
					//累计端口
					dataServer.curPort = data.port;
					//记录当前服务使用端口
					dataServer[serverName] = data.port;
					createDataServerRouter(data.port);
				}
				break;
			case "updateSqlServer":
				//新启动的服务或者是重启的服务
				if (!sqlServer[serverName] || sqlServer[serverName].port != data.port) {
					console.log(`${process.pid}:${JSON.stringify(sqlServer[serverName])}:${data.port}`);
					//累计端口
					sqlServer.curPort = data.port;
					//记录当前服务使用端口
					sqlServer[serverName] = data.port;
					createSqlServerRouter(data.port, serverName);
				}
				break;
		}
	});
	//http "error"事件监听
	function onError(error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		var bind = typeof port === 'string'
			? 'Pipe ' + port
			: 'Port ' + port;

		//处理已知的监听事件错误
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	//http "listening"事件监听
	function onListening() {
		console.log(`[DAEMON-工作进程${process.pid}] 启动`);
		var addr = server.address();
		var bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port;
		debug('Listening on ' + bind);
	}
}

//规范端口
function normalizePort(val) {
	let port = parseInt(val, 10);
	if (isNaN(port)) return val;
	if (port >= 0) return port;
	return false;
}

function sendMsgToWorker(msg) {
	Object.keys(cluster.workers).forEach(item => {
		cluster.workers[item].send(msg);
	})
}

/***/ }),

/***/ "./daemon/libs/authentication.js":
/*!***************************************!*\
  !*** ./daemon/libs/authentication.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
    创建人:zhangwf
    作用:前台用户相关
*/
module.exports = new class authentication {
    constructor(){

    }
    lonin(){
        
    }
    Verification(){
        //用户登陆验证
    } 
    logout(){

    }
    register(){

    }
}();

/***/ }),

/***/ "./daemon/libs/data-source/data-source.js":
/*!************************************************!*\
  !*** ./daemon/libs/data-source/data-source.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * apiv2的service层
 */
const manager = __webpack_require__(/*! ../manager */ "./daemon/libs/manager.js");

class DataSource {

    /**
     * 创建数据源
     * @param {*} param 
     */
    async dataSourceCreate(param) {
        let cmd = manager.spliceCmdLine([param]);
        let res = manager.startDataSource(cmd);
        return res;
    }

    //更新数据源
    dataSourceUpdate(param) {
        let cmd = "";
        //全局对象中的server对象,不在realServer中就是在sqlServer中
        let server = global["realServer"];
        if (!server) {
            server = global["sqlServer"];
        }
        let res = false;
        let preName = param.preName;
        //删除全局对象中旧的server
        delete server[param.preName];
        //删除旧的realServer进程
        cmd = `pm2 delete ${preName}`;
        res = manager.startServer(cmd);
        //启动新的realServer
        cmd = manager.spliceCmdLine([param]);
        res = manager.startDataSource(cmd);
        return res;
    }

    //删除数据源
    async dataSourceDelete(param) {
        let serverName = param.name;
        //全局对象中的server对象,不在realServer中就是在sqlServer中
        let server = global["realServer"];
        if (!server) {
            server = global["sqlServer"];
        }
        //删除全局对象中旧的realServer
        delete server[serverName];
        //删除旧的realServer进程
        let cmd = `pm2 delete ${serverName}`;
        manager.startServer(cmd);
        return true;
    }
}

let dataSource = null;
if (dataSource === null) {
    dataSource = new DataSource();
}

module.exports = dataSource;

/***/ }),

/***/ "./daemon/libs/jwt.js":
/*!****************************!*\
  !*** ./daemon/libs/jwt.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 引入模块依赖
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
// 创建 token 类
module.exports = class Jwt {
    constructor(key) {
        this.data = null;
        this._id = null; // 用户自定义 存放userid
        this._date = null; // 过期时间
        this._creatDate = null; // 创建时间
        this.cert = key;
        this.beOverdue = 7 * 24 * 60 * 60
    }
    // 重新生成 token
    refreshToken() {
        let data = this.data;
        let created = Math.floor(Date.now() / 1000);
        let token = jwt.sign({
            data,
            exp: created + this.beOverdue, // 过期时间 
            iat: created, // 创建时间
        }, this.cert);
        return token;
    }
    //生成token
    generateToken(data) {
        if (data) {
            this.data = data;
        }
        data = this.data;
        let created = Math.floor(Date.now() / 1000);
        let token = jwt.sign({
            data,
            exp: created + this.beOverdue, // 过期时间
            iat: created, // 创建时间
        }, this.cert);
        return token;
    }
    // 校验token
    verifyToken(data) {
        if (data) {
            this.data = data;
        }
        let token = this.data;
        let res;
        try {
            let result = jwt.verify(token, this.cert) || {};
            this._id = result.data;
            this._date = result.exp;
            this._creatDate = result.iat;
            let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }else{
                res = 1;
            }
        } catch (e) {
            res = 0;
        }
        return res;
    }
}

/***/ }),

/***/ "./daemon/libs/license.js":
/*!********************************!*\
  !*** ./daemon/libs/license.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//http://momentjs.cn/docs/#/query/
//https://www.liangzl.com/get-article-detail-166356.html

const fs = __webpack_require__(/*! fs */ "fs");
const si = __webpack_require__(/*! systeminformation */ "systeminformation");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const moment = __webpack_require__(/*! moment */ "moment");
const { exec } = __webpack_require__(/*! child_process */ "child_process");

class License {
	static async init() {
		return await new Promise(async (resolve, reject) => {
			moment.locale('zh-cn');
			License.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
			if (fs.existsSync('./license.lic')) {
				//打包后读当前
				let info = fs.readFileSync('./license.lic', "utf-8");
				await License.parseContent(info);
				resolve();
			} else if (fs.existsSync('../license.lic')) {
				//源码模式下读取上一级目录文件
				let info = fs.readFileSync('../license.lic', "utf-8");
				await License.parseContent(info);
				resolve();
			} else {
				//文件不存在，无授权，自动生成文件
				//代码干扰
				const key1 = '9vApxLk5G3PAsJrM';
				const iv1 = 'FnJL7EDzjqWjcaY9';
				//真实key
				const key2 = '9vApxLLDFESXCC5G3PAsJrM';
				const iv2 = 'FnJL7Edkfaldsfj9';
				let pcid = await License.getPcid();
				const writeContent1 = License.genSign(pcid.toString(), key2);
				fs.writeFile("./safe-dog.smt", writeContent1, function (err) {
					console.log("未检测到授权,演示运行时间60分钟!");
					console.log("生成授权信息文件:safe-dog.smt,请发送此文件到本公司进行授权操作！");
					resolve();
				});

			}
			//开启授权检查
			License.checkDog();
		})
	}
	//10分钟一检查
	static checkDog() {
		//增加防杀代码，禁止屏蔽settimer
		if (Object.keys(License.dogInfo).length <= 0) {
			//无授权
		} else {
			//授权是否过期 开始日期和有效天数，必须存在
			if (License.dogInfo.beginTime && License.dogInfo.availableDay) {
				//当前时间大于狗里面时间 小于有效期范围
				let begin = moment(License.dogInfo.beginTime, "YYYY-MM-DD HH:mm:ss");
				let end = moment(begin).add(License.dogInfo.availableDay, "days");
				if (moment().isBetween(begin, end, null, '[]')) {
					License.hasLicense = true;
					//周期喂狗，程序内部随机检查，防止爆破
					License.eatDogTime = moment().format("YYYY-MM-DD HH:mm:ss");
				} else {
					//授权到期 用户机器时间小于授权中时间
					License.hasLicense = false;
				}
			}
		}
		if (!License.hasLicense) {
			//授权无效时，当前时间大于启动时间，退出。（如果是中途授权无效，则回立即退出）
			let timeOut = moment(License.startTime).add(1, "hours");
			if (moment().isAfter(timeOut)) {
				//通知其他程序退出
				//授权到期，退出pm2中所有服务
				exec("pm2 delete all", (err, stdout, stderr) => {
					console.log("[DAEMON]授权到期，服务退出");
					//自己退出
					process.exit();

				});
			}
		}
		setTimeout(License.checkDog, 1000 /* * 60 * 10 */);
	}
	//ture 有授权，false无
	static license() {
		return License.hasLicense;
	}
	//上次喂狗时间，不应该超过一小时，超过认为被爆破掉
	static eatTime() {
		return License.eatDogTime
	}
	static async parseContent(content) {
		try {
			//代码干扰
			const key1 = '9vApxLk5G3PAsJrM';
			const iv1 = 'FnJL7EDzjqWjcaY9';
			//真实key
			const key2 = '9vApxLLDFESXCC5G3PAsJrM';
			const iv2 = 'FnJL7Edkfaldsfj9';
			let pcid = await License.getPcid();
			if (pcid > 0) {
				let license = License.deSign(content, pcid.toString(), iv2);
				License.dogInfo = JSON.parse(license);
			}
		} catch (error) {
			console.log(error);
		}
	}
	static async getPcid() {
		if (License.pcid > 0) {
			return License.pcid;
		}
		function convertStringToInt(content, isdisk = true) {
			//最大60字符
			if (content.length > 60) {
				content = content.substring(0, 60);
			}
			let id = 0;
			for (let i = 0; i < content.length; i++) {
				//硬盘字符串长，*2，否则可能溢出，mac由于固定，并且长度较短*10
				id *= isdisk ? 2 : 9;
				switch (content.charAt(i)) {
					case '0': id += 0; break;
					case '1': id += 1; break;
					case '2': id += 2; break;
					case '3': id += 3; break;
					case '4': id += 4; break;
					case '5': id += 5; break;
					case '6': id += 6; break;
					case '7': id += 7; break;
					case '8': id += 8; break;
					case '9': id += 9; break;
					case 'a': case 'A': id += 10; break;
					case 'b': case 'B': id += 11; break;
					case 'c': case 'C': id += 12; break;
					case 'd': case 'D': id += 13; break;
					case 'e': case 'E': id += 14; break;
					case 'f': case 'F': id += 15; break;
					case 'g': case 'G': id += 16; break;
					case 'h': case 'H': id += 17; break;
					case 'i': case 'I': id += 18; break;
					case 'j': case 'J': id += 19; break;
					case 'k': case 'K': id += 20; break;
					case 'l': case 'L': id += 21; break;
					case 'm': case 'M': id += 22; break;
					case 'n': case 'N': id += 23; break;
					case 'o': case 'O': id += 24; break;
					case 'p': case 'P': id += 25; break;
					case 'q': case 'Q': id += 26; break;
					case 'r': case 'R': id += 27; break;
					case 's': case 'S': id += 28; break;
					case 't': case 'T': id += 29; break;
					case 'u': case 'U': id += 30; break;
					case 'v': case 'V': id += 31; break;
					case 'w': case 'W': id += 32; break;
					case 'x': case 'X': id += 33; break;
					case 'y': case 'Y': id += 34; break;
					case 'z': case 'Z': id += 35; break;
				}
			}
			id = Math.abs(id);
			if (id > 268435455) {
				id %= 268435456
			}
			return id;
		}
		return await new Promise(async (resolve, reject) => {
			let disk = await si.diskLayout();
			if (disk.length > 0) {
				//win7 无法拿到硬盘 win10可以
				//取第一个硬盘
				License.pcid = convertStringToInt(disk[0].name + disk[0].firmwareRevision + disk[0].serialNum);
			}
			//硬盘失败查询mac
			if (License.pcid <= 0) {
				let defaultNetName = await si.networkInterfaceDefault();
				let netList = await si.networkInterfaces();
				let defaultNet = netList.find((network) => {
					if (network.iface == defaultNetName || network.ifaceName == defaultNetName) {
						return true;
					}
				});
				if (!defaultNet) {
					//没有找到默认的，取第一个，如果有的话
					if (netList.length > 0) {
						defaultNet = netList[0];
					}
				}
				License.pcid = convertStringToInt(defaultNet.mac, false);
			}
			resolve(License.pcid);
		});
	}
	//加密
	static genSign(src, key, iv) {
		// let sign = '';
		// const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
		// sign += cipher.update(src, 'utf8', 'hex');
		// sign += cipher.final('hex');
		// return sign;
		const cipher = crypto.createCipher('aes192', key);
		var crypted = cipher.update(src, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;

	}
	// 解密
	static deSign(sign, key, iv) {
		// let src = '';
		// const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
		// src += cipher.update(sign, 'hex', 'utf8');
		// src += cipher.final('utf8');
		// return src;
		const decipher = crypto.createDecipher('aes192', key);
		var decrypted = decipher.update(sign, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;

	}
}
//服务的启动时间
License.startTime = {};
License.hasLicense = false;
//防止爆破，喂狗时间
License.eatDogTime = {};
//授权信息
License.dogInfo = {};
License.pcid = 0;
module.exports = License;
module.exports.License = License;
module.exports.default = License;

/***/ }),

/***/ "./daemon/libs/log-manager.js":
/*!************************************!*\
  !*** ./daemon/libs/log-manager.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
    创建人:zhangwf
    作用:集群日志相关操作
*/
module.exports = new class logManager {
    constructor(){

    }
    init(){

    } 
}();

/***/ }),

/***/ "./daemon/libs/manager.js":
/*!********************************!*\
  !*** ./daemon/libs/manager.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
    创建人:zhangwf
    作用:用于命令响应
*/
const { execSync } = __webpack_require__(/*! child_process */ "child_process");
const fs = __webpack_require__(/*! fs */ "fs");
const request = __webpack_require__(/*! request */ "request");
const PgDaemon = __webpack_require__(/*! ./pg-daemon */ "./daemon/libs/pg-daemon.js");

module.exports = new class Manager {
    constructor() {

    }

    async init() {
        await License.init();
        await this.startSubservice();
    }

    async getRealServerInfo() {
        return await new Promise((resolve, reject) => {
            resolve({ "name": "dd" });
        });
    }

    async startSubservice() {
        try {
            //在此启动下属服务
            console.log(`[DAEMON-主 进 程${process.pid}] 开始通知子服务启动`);
            //postgrest-sql启动相关
            console.log(`[DAEMON-主 进 程${process.pid}] 子服务：postgre-sql 已授权,开始启动`);
            const pgDaemon = new PgDaemon(__debug);
            let isConnect = await pgDaemon.start();
            if (isConnect == false) {
                console.log(`[DAEMON-主 进 程${process.pid}] postgre-sql 启动失败,启动过程停止，请检查配置信息后重新启动！`);
                return;
            }
            console.log(`[DAEMON-主 进 程${process.pid}] postgre-sql启动完成`);
            //授权信息验证
            if ((License && License.dogInfo) && License.dogInfo.server == undefined) {
                console.log(`[DAEMON-主 进 程${process.pid}] 没有服务端相关授权,启动完成`);
                return;
            }
            //生成配置文件夹
            if (!fs.existsSync("./config")) {
                fs.mkdirSync("./config");
            }
            //TODO realServer与sqlServer权限暂时聚集在一块，以后再做拆分
            if ((fs.existsSync("real-server.js") && License.dogInfo.server.realServer) ||
                (License.dogInfo.server.realServer && __debug !== '') ||
                (fs.existsSync("sql-server.js") && License.dogInfo.server.sqlServer) ||
                (License.dogInfo.server.sqlServer && __debug !== '')) {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：real-server与sql-server 已授权,开始启动`);
                let comDataSourceArr = await this.getAllComDataSources();
                let cmdLineArr = await this.spliceCmdLine(comDataSourceArr);
                //启动数据源
                this.startDataSource(cmdLineArr);
            } else {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：real-server与sql-server 无授权`);
            }

            if ((fs.existsSync("data-server.js") && License.dogInfo.server.dataServer) ||
                (License.dogInfo.server.dataServer && __debug !== '')) {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：data-server 已授权,开始启动`);
                let script = './data-server.js';
                if (__debug !== '') {
                    script = '../data-server/bin/www.js';
                }
                let pm2Config = {
                    "apps": [
                        {
                            "name": "data-server",
                            "cwd": "./",
                            "script": `${script}`,
                            "log_date_format": "YYYY-MM-DD HH:mm:ss",
                            "error_file": `./logs/data-server-error.log`,
                            "out_file": `./logs/data-server-log.log`,
                            "max_memory_restart": "1G"
                        }
                    ]
                }
                await fs.writeFileSync("./config/data-server.json", JSON.stringify(pm2Config));
                await this.startServer(`pm2 start ./config/data-server.json`);
            } else {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：data-server 无授权`);
            }

            if (fs.existsSync("io-erver.js") && License.dogInfo.system.ioServer) {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：io-erver 已授权,开始启动`);
                result = await this.startServer("start node io-erver");
                if (result != true) {
                    console.log(result);
                }
            } else {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：io-erver 无授权`);
            }

            if (fs.existsSync("ai-erver.js") && License.dogInfo.system.aiServer) {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：ai-erver 已授权,开始启动`);
                result = await this.startServer("start node ai-erver");
                if (result != true) {
                    console.log(result);
                }
            } else {
                console.log(`[DAEMON-主 进 程${process.pid}] 子服务：ai-erver 无授权`);
            }

        } catch (error) {
            console.log(error);
            process.exit(0);
        }
    }

    /**
     * 由命令启动服务
     * @param {String} cmd 命令
     */
    startServer(cmd) {
        try {
            execSync(cmd);
            return true;
        } catch (error) {
            throw Error(error);
        }
    }

    /**
     * 公司所有的数据源
     * @returns 处理好的数据源object
     */
    async getAllComDataSources() {
        let reqUrl = `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}/companys`;
        let allCompanys = await this.requestGet(reqUrl);
        //数据源数组
        let dataSourceArr = [];
        for (let i = 0; i < allCompanys.length; i++) {
            let curCompany = allCompanys[i];
            if (curCompany.extend === null) continue;
            //数据源
            let allDataSource = curCompany["extend"]["dataSource"];
            if (allDataSource) {
                for (let j = 0; j < allDataSource.length; j++) {
                    let dataSource = allDataSource[j];
                    let dsObj = {};
                    Object.keys(dataSource).forEach(key => {
                        if (dataSource[key]) {
                            dsObj[key] = dataSource[key];
                        }
                    });
                    dataSourceArr.push(dsObj);
                }
            }

        }
        return dataSourceArr;
    }

    /**
     * HTTP GET
     * @param {string} url 请求url
     */
    requestGet(url) {
        return new Promise((resolve, reject) => {
            request.get({ url, json: true }, (err, responce, body) => {
                if (err) return reject(err);
                if (responce.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(body);
                }
            });
        });
    }

    /**
     * 拼接启动命令
     * @param {Array} dataSourceArr 数据源
     * @param {String} platform 平台类型
     */
    spliceCmdLine(dataSourceArr, platform) {
        let cmdLineArr = [];
        //需要拼接参数类型
        let needType = ["ps6", "ef5", "fc7", "mysql", "mssql", "oracle", "pgsql"];
        //启动数据源需要的参数
        let needParam = ["name", "type", "ip", "port", "username", "password", "database"];
        for (let i = 0; i < dataSourceArr.length; i++) {
            let curDataSource = dataSourceArr[i];
            if (needType.indexOf(curDataSource["type"]) >= 0) {
                //过滤走不需要的参数
                let filterParam = {};
                //将数据源名称强制转为小写
                curDataSource["name"] = curDataSource["name"].toLowerCase();
                for (let key in curDataSource) {
                    if (needParam.indexOf(key) >= 0 && curDataSource[key] !== "") {
                        filterParam[key] = curDataSource[key];
                    }
                }
                cmdLineArr.push(filterParam);
            }
        }
        return cmdLineArr;
    }

    /**
     * 启动数据源
     * @param {Array} cmdLineArr 启动命令数组
     */
    startDataSource(cmdLineArr) {
        //realServer
        let realType = ["ps6", "ef5", "fc7"];
        //sqlServer
        let relationType = ["mysql", "mssql", "oracle", "pgsql"];
        try {
            for (let i = 0; i < cmdLineArr.length; i++) {
                let cmdLine = cmdLineArr[i];
                let script = "";
                //realServer
                if (realType.indexOf(cmdLine.type) >= 0) {
                    script = "./real-server.js";
                    //开发环境
                    if (__debug !== "") {
                        script = "../real-server/bin/www.js";
                    }
                }
                //sqlServer
                if (relationType.indexOf(cmdLine.type) >= 0) {
                    script = "./sql-server.js";
                    //开发环境
                    if (__debug !== "") {
                        script = "../sql-server/bin/www.js";
                    }
                }
                let pm2Config = {
                    "apps": [
                        {
                            "name": cmdLine.name,
                            "cwd": "./",
                            "args": Buffer.from(JSON.stringify(cmdLineArr[i])).toString('base64'),
                            "script": `${script}`,
                            "log_date_format": "YYYY-MM-DD HH:mm:ss",
                            "error_file": `./logs/${cmdLine.name}-error.log`,
                            "out_file": `./logs/${cmdLine.name}-log.log`,
                            "max_memory_restart": "1G"
                        }
                    ]
                }
                fs.writeFileSync(`./config/${cmdLine.name}.json`, JSON.stringify(pm2Config));
                //通过pm2启动realServer
                this.startServer(`pm2 start ./config/${cmdLine.name}.json`);
            }
            return true;
        } catch (error) {
            //抛出错误，统一由上层try..catch处理
            throw Error(error);
        }
    }

    filterType() {

    }

    async createReal() {

    }

    async createReal(ctx, next) {

    }
}();

/***/ }),

/***/ "./daemon/libs/pg-daemon.js":
/*!**********************************!*\
  !*** ./daemon/libs/pg-daemon.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var { exec, execFile } = __webpack_require__(/*! child_process */ "child_process");
var path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
module.exports = class PgDaemon {
    constructor(debug) {
        this.debug = debug;
        this.isConnect = false;
        this.createPgsqlCfg();
    }
    /**
     * 生成pgsql配置文件
     */
    createPgsqlCfg() {
        let pgCfg = config.pgsql;
        let cfgStr = "";
        cfgStr += `db-uri = "postgres://${pgCfg.username}:${pgCfg.password}@${pgCfg.pgsqlIp}:5432/${pgCfg.name}"\n`;
        cfgStr += `db-schema = "public"\n`;
        cfgStr += `db-anon-role = "postgres"\n`;
        cfgStr += `server-host = "0.0.0.0"\n`;
        cfgStr += `server-port = ${pgCfg.pgsqlPort}`;
        let targetPath = "";
        //平台差异
        switch (process.platform) {
            case "win32":
            case "darwin":
                if (process.arch == "ia32") {
                    targetPath = "../win32/";
                } else {
                    targetPath = "../x64/";
                }
                break;
            case "linux":
                targetPath = "../linux/";
                break;
            case "aix":
            case "freebsd":
            case "openbsd":
            case "sunos":
                throw new Error(`暂不支持:${process.platform}`);
                break;
        }
        targetPath = path.join(__dirname, targetPath);
        if (this.debug !== "") {
            targetPath += 'defaultServer.conf';
        } else {
            //正式环境
            targetPath = 'defaultServer.conf';
        }
        fs.writeFileSync(targetPath, cfgStr);
        return true;
    }
    /**
     * 不论 postgrest.exe 是否正在运行。都执行一次停止
     */
    async stopPostgrest() {
        return await new Promise((resolve, reject) => {
            let cmd = "";
            switch (process.platform) {
                case "win32":
                case "darwin":
                    cmd = "taskkill /f /im postgrest.exe";
                    break;
                case "linux":
                    cmd = "killall postgrest";
                    break;
                case "aix":
                case "freebsd":
                case "openbsd":
                case "sunos":
                    throw new Error(`暂不支持:${process.platform}`);
                    break;
            }
            exec(cmd, function (err, stdout, stderr) {
                resolve();
            })
        });

    }
    async start() {
        return await new Promise(async (resolve, reject) => {
            await this.stopPostgrest();
            let workerPath = await this.getWorkerPath();
            const build = exec("postgrest defaultServer.conf", { cwd: workerPath }, (err, stdout, stderr) => {
                console.log(`[DAEMON-主 进 程 ${process.pid}] 工程服务器重启`);
                if (err) {
                    console.log(`[DAEMON-主 进 程 ${process.pid}] ${err}`);
                }
                if (stderr) {
                    console.log(`[DAEMON-主 进 程 ${process.pid}] ${stderr}`);
                }
                if (stdout) {
                    console.log(`[DAEMON-主 进 程 ${process.pid}] ${stdout}`);
                }
                this.delayedStart();
            })
            setTimeout(() => {
                if (this.isConnect == false) {
                    resolve(this.isConnect);
                }
            }, 10000);
            build.stdout.on('data', (data) => {
                if (data.indexOf("Connection successful") > -1) {
                    this.isConnect = true;
                    resolve(this.isConnect);
                }
                console.log(`[DAEMON-主 进 程 ${process.pid}] ${data}`)
            })
        })
    }
    delayedStart() {
        setTimeout(() => {
            this.start();
        }, 2000)
    }
    async getWorkerPath() {
        var workerPath = "";
        switch (process.platform) {
            case "win32":
            case "darwin":
                if (process.arch == "ia32") {
                    workerPath = this.debug !== "" ? path.join(__dirname, "/../x64/") : __dirname;
                } else {
                    workerPath = this.debug !== "" ? path.join(__dirname, "/../x64/") : __dirname;
                }
                break;
            case "linux":
                workerPath = this.debug !== "" ? path.join(__dirname, "/../linux/") : __dirname;
                break;
            case "aix":
            case "freebsd":
            case "openbsd":
            case "sunos":
                throw new Error(`暂不支持:${process.platform}`);
                break;
        }
        return workerPath;
    }
}

/***/ }),

/***/ "./daemon/libs/public-modules.js":
/*!***************************************!*\
  !*** ./daemon/libs/public-modules.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//定义的全局变量
global.authentication = __webpack_require__(/*! ./authentication */ "./daemon/libs/authentication.js");
global.License = __webpack_require__(/*! ./license */ "./daemon/libs/license.js");
global.logManager = __webpack_require__(/*! ./log-manager */ "./daemon/libs/log-manager.js");
global.manager = __webpack_require__(/*! ./manager */ "./daemon/libs/manager.js");
//realServer
global.realServer = new Object();
//dataServer
global.dataServer = new Object();
//sqlServer
global.sqlServer = new Object();

/***/ }),

/***/ "./daemon/libs/service-api/service-api-base.js":
/*!*****************************************************!*\
  !*** ./daemon/libs/service-api/service-api-base.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class BaseServiceApi {
	constructor() {
		//各服务默认端口
		this.defaultPort = {
			realServer: [3001, 3499],
			dataServer: [3500, 3999],
			sqlServer: [4001, 4499],
			ioServer: [5000, 5499],
			aiServer: [5500, 5999]
		};
	}

	//可使用端口
	getPort(data, ctx, next) {
		let daemonConfig = global.config;
		//server类型
		let serverType = data.serverType;
		let serverInfoObj = global[serverType];
		//端口范围
		let portRange = [];
		//配置端口优先于默认端口
		if (daemonConfig["defaultPort"][serverType].length > 0) {
			portRange = daemonConfig[serverType];
		} else {
			portRange = this.defaultPort[serverType]
		}
		//可使用的端口
		let canUsedPort = 0;
		//累计使用端口
		let curPort = serverInfoObj["curPort"];
		if (!curPort) {
			canUsedPort = portRange[0];
		} else {
			canUsedPort = Number(curPort) + 1;
		}
		//累计使用端口存储
		serverInfoObj["curPort"] = canUsedPort;
		//端口超过配置范围
		if (canUsedPort > portRange[1]) {
			console.warn(`服务${serverType},当前累计使用端口是${curPort},已超过配置范围！！！`);
		}
		// ctx.set("Content-Type", "application/json");
		ctx.body = { "port": canUsedPort };
	}

	//给主进程发消息
	sendMsgToMaster(msg) {
		process.send(msg);
	}
}

module.exports = BaseServiceApi;

/***/ }),

/***/ "./daemon/libs/service-api/service-api.js":
/*!************************************************!*\
  !*** ./daemon/libs/service-api/service-api.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
    创建人:zhangwf
    作用:服务间通讯，根据参数分发不同服务
*/
const servicerealApi = __webpack_require__(/*! ./service-real-api */ "./daemon/libs/service-api/service-real-api.js");
const serviceDataApi = __webpack_require__(/*! ./service-data-api */ "./daemon/libs/service-api/service-data-api.js");
const serviceSqlApi = __webpack_require__(/*! ./service-sql-api */ "./daemon/libs/service-api/service-sql-api.js");
module.exports = new class ServiceApi {
    constructor() {
        this.servicerealApi = servicerealApi;
        this.serviceDataApi = serviceDataApi;
        this.serviceSqlApi = serviceSqlApi;
    }

    //接收real-server服务消息
    real(ctx, next) {
        let postParam = ctx.request.body;
        if (typeof postParam.type === "string" && postParam.type != "") {
            this.servicerealApi[postParam.type](postParam, ctx, next);
        } else {
            console.log(404);
            ctx.response.status = 404;
            ctx.response.body = postParam.type + "接口不存在";
        }
    }
    //接收data-server服务消息
    data(ctx, next) {
        let postParam = ctx.request.body;
        if (typeof postParam.type === "string" && postParam.type != "") {
            this.serviceDataApi[postParam.type](postParam, ctx, next);
        } else {
            console.log(404);
            ctx.response.status = 404;
            ctx.response.body = postParam.type + "接口不存在";
        }
    }
    //接收sql-server服务消息
    sql(ctx, next) {
        let postParam = ctx.request.body;
        if (typeof postParam.type === "string" && postParam.type != "") {
            this.serviceSqlApi[postParam.type](postParam, ctx, next);
        } else {
            console.log(404);
            ctx.response.status = 404;
            ctx.response.body = postParam.type + "接口不存在";
        }
    }

    //接收io-server服务消息
    io(ctx, next) {
        ctx.response.status = 404;
        ctx.response.body = req_query.type + "暂无需要处理的消息";
    }
    //接收ai-server服务消息
    ai(ctx, next) {
        ctx.response.status = 404;
        ctx.response.body = req_query.type + "暂无需要处理的消息";
    }
    //接收pg-server服务消息
    pgSql(ctx, next) {
        //暂无需要处理的消息 
        ctx.response.status = 404;
        ctx.response.body = req_query.type + "暂无需要处理的消息";
    }
}

/***/ }),

/***/ "./daemon/libs/service-api/service-data-api.js":
/*!*****************************************************!*\
  !*** ./daemon/libs/service-api/service-data-api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const SeviceApiBase = __webpack_require__(/*! ./service-api-base */ "./daemon/libs/service-api/service-api-base.js");

/** data-server服务 */
class ServiceDataApi extends SeviceApiBase {
    constructor() {
        super();
    }

    report(data, ctx, next) {
        let serverInfoObj = global["dataServer"];
        serverInfoObj["curPort"] = data.curUsePort;
        //创建data-server路由
        createDataServerRouter(data.curUsePort);
        this.sendMsgToMaster({action: "updateDataServer", data: {name: data.serverName, port: data.curUsePort}});
        console.log(`[DAEMON-工作进程${process.pid}] data-server 名称:${data.serverName},端口:${data.curUsePort} 启动成功`);
        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify({ result: true });
    }
}

let serviceDataApi = null;
if (serviceDataApi === null) {
    serviceDataApi = new ServiceDataApi();
}

module.exports = serviceDataApi;

/***/ }),

/***/ "./daemon/libs/service-api/service-real-api.js":
/*!*****************************************************!*\
  !*** ./daemon/libs/service-api/service-real-api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ServerApiBase = __webpack_require__(/*! ./service-api-base */ "./daemon/libs/service-api/service-api-base.js");
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");

/** real-server服务 */
class ServiceRealApi extends ServerApiBase {
	constructor() {
		super();
	}

	//realserver端口报告
	report(data, ctx, next) {
		let serverInfoObj = global["realServer"];
		serverInfoObj["curPort"] = data.curUsePort;
		serverInfoObj[data.serverName] = {
			"port": data.curUsePort,
			"proxy": createProxyMiddleware({
				target: `ws://localhost:${data.curUsePort}`,
				changeOrigin: true,
				ws: true
			})
		};
		//向主进程报告realServer名称以及端口
		this.sendMsgToMaster({ action: "updateRealServer", data: {name: data.serverName, port: data.curUsePort} });
		createProxy(serverInfoObj[data.serverName]);
		console.log(`[DAEMON]-工作进程${process.pid} real-server 名称:${data.serverName},端口:${data.curUsePort} 启动成功`);
		ctx.set("Content-Type", "application/json");
		ctx.body = JSON.stringify({ result: true });
	}

	keepAlive(data, ctx, next) {
		ctx.set("Content-Type", "application/json")
		ctx.body = JSON.stringify({ port: 4000 })
	}
}

let serviceRealApi = null;
if (serviceRealApi === null) {
	serviceRealApi = new ServiceRealApi();
}

module.exports = serviceRealApi;

/***/ }),

/***/ "./daemon/libs/service-api/service-sql-api.js":
/*!****************************************************!*\
  !*** ./daemon/libs/service-api/service-sql-api.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ServiceApiBase = __webpack_require__(/*! ./service-api-base */ "./daemon/libs/service-api/service-api-base.js");
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");

class ServiceSqlApi extends ServiceApiBase {
    constructor() {
        super();
    }
    //sqlServer端口报告
    report(data, ctx, next) {
        let serverInfoObj = global["sqlServer"];
        serverInfoObj["curPort"] = data.curUsePort;
        serverInfoObj[data.serverName] = {
            "port": data.curUsePort,
        };
        //创建sql-server路由
        createSqlServerRouter(data.curUsePort, data.serverName);
        //向主进程报告sqlServer名称以及端口
        this.sendMsgToMaster({ action: "updateSqlServer", data: { name: data.serverName, port: data.curUsePort } });
        console.log(`[DAEMON]-工作进程${process.pid} sql-server 名称:${data.serverName},端口:${data.curUsePort} 启动成功`);
        ctx.body = { result: true };
    }
}

let serviceSqlApi = null;
if (serviceSqlApi === null) {
    serviceSqlApi = new ServiceSqlApi();
}

module.exports = serviceSqlApi;

/***/ }),

/***/ "./daemon/routes/apiv2-routes.js":
/*!***************************************!*\
  !*** ./daemon/routes/apiv2-routes.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! koa-router */ "koa-router")();
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");
const c2k = __webpack_require__(/*! koa2-connect */ "koa2-connect");
const jwt = __webpack_require__(/*! ../libs/jwt */ "./daemon/libs/jwt.js");
const urlib = __webpack_require__(/*! url */ "url");
const zlib = __webpack_require__(/*! zlib */ "zlib");

//路径前缀
router.prefix('/apiv2');

let getBody = (proxyRes) => {
    return new Promise(resolve => {
        let body = []
        proxyRes.on('data', function (chunk) {
            body.push(chunk)
        })
        proxyRes.on('end', function () {
            body = Buffer.concat(body)
            resolve(body)
        })
    })
}

/**
 * 代理关闭事件处理
 */
let onClose = function (res, socket, head) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('服务器关闭');
};
/**
 * 代理错误事件处理
 */
let onError = function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('服务器代理错误:' + err.message);
}

/**
 * 代理请求事件处理
 */
let onProxyReq = (proxyReq, req, res) => {
    let bodyData = JSON.stringify(req.body);
    //返回修改后的数据
    proxyReq.setHeader("Prefer", "return=representation");
    //重新计算content-length及写入body数据
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
}

/**
 * 解压数据
 */
let parseData = (data) => {
    return new Promise((resolve, reject) => {
        zlib.unzip(data, function (err, buffer) {
            if (err) {
                reject(`{"result":false,"error":"用户信息解压缩失败"}`);
                return;
            }
            let users = JSON.parse(buffer.toString());
            resolve(users);
        });
    })
}

/**
 * 对比权限，以加密狗的权限为准
 * @param {*} dogPower 加密狗权限
 * @param {*} rolePower 数据库拉取的权限
 * @param {*} newPower 加密狗权限与数据库拉取权限交集出来的实际权限
 */
let comparePower = (dogPower, rolePower, newPower) => {
    for (let key in dogPower) {
        let curKeyLength = Object.keys(dogPower[key]).length;
        if (curKeyLength > 1) {
            //初始化模块本身权限
            newPower[key] = {};
            comparePower(dogPower[key], rolePower[key], newPower[key]);
            continue;
        }
        //模块本身的权限
        if (key === 'enable') {
            newPower['enable'] = dogPower['enable'] && rolePower['enable'] ? true : false;
            continue;
        }
        //狗中的权限在数据库拉取的权限中不存在，不做处理
        if (!rolePower[key]) continue;
        //初始化子模块权限数据
        newPower[key] = {};
        newPower[key]['enable'] = dogPower[key]['enable'] && rolePower[key]['enable'] ? true : false;
    }
    return newPower;
}

//用户登录路由
router.get('/login/users', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    changeOrigin: true,
    logLevel: global.config.proxyLogLevel,
    selfHandleResponse: true,
    pathRewrite: { '^/apiv2/login': '' },
    onProxyRes: async (proxyRes, req, res) => {
        //平台管理员ID
        const ADMINID = "49d531d0-a46d-11e9-9e8e-bf6840000001";
        //获取请求回来的信息
        let data = await getBody(proxyRes);
        let returnData = '';
        try {
            //解压用户数据
            let userData = await parseData(data);
            let urlData = urlib.parse(req.url, true);
            let urlUserName = urlData.query.userName.replace(/^eq./, '');
            let urlPassword = urlData.query.userPassword.replace(/^eq./, '');
            //平台管理员标识
            let isAdmin = false;
            //返回数据为空或者返回数据为管理员账号，去跟狗里的账号以及密码做对比，以狗里的信息为准
            if (!userData.length || (userData.length && userData[0].id === ADMINID)) {
                if (urlUserName != License.dogInfo.userinfo.user
                    || urlPassword != License.dogInfo.userinfo.passWord) {
                    returnData = JSON.stringify({ "result": false, "error": "用户名或密码错误" });
                    res.statusCode = 200;
                    res.end(returnData);
                    return;
                }
                isAdmin = true;
            }
            //加密token
            let token = new jwt(License.pcid.toString()).generateToken({
                userName: urlUserName,
                passWord: urlPassword
            });
            //token
            res.setHeader("authorization", token);
            //是否是平台管理员返回不同的数据
            if (isAdmin) {
                returnData = JSON.stringify([{ "id": "49d531d0-a46d-11e9-9e8e-bf6840000001" }]);
            } else {
                //按照固定的编码解压数据
                res.setHeader("content-encoding", proxyRes["headers"]["content-encoding"]);
                returnData = data;
            }
        } catch (error) {
            returnData += `${error}`;
            //处理throw Error
            if (error.message) {
                returnData = error.message;
            }
        }
        res.statusCode = 200;
        res.end(returnData);
    },
    onClose, onError
})));

//请求授权
router.get('/Jurisdiction/*', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    changeOrigin: true,
    selfHandleResponse: true,
    logLevel: global.config.proxyLogLevel,
    pathRewrite: { '^/apiv2/Jurisdiction': '/' },
    onProxyRes: async (proxyRes, req, res) => {
        let returnData = '';
        try {
            //拉权限需要刷新token
            let jwtObj = new jwt(License.pcid.toString());
            //更新token
            res.setHeader("authorization", jwtObj.refreshToken());
            //按照固定的编码解压数据
            // res.setHeader("content-type", "application/json");
            //获取请求回来的数据
            let data = await getBody(proxyRes);
            //解压请求回来的数据
            let roleData = await parseData(data);
            //加密狗权限数据
            let dogPower = License.dogInfo.system;
            let rolePower = roleData[0].content.navRouter;
            //对比权限,返回新权限
            let newPower = comparePower(dogPower, rolePower, {});
            //将数据库中的权限数据替换成新的权限数据
            roleData[0].content.navRouter = newPower;
            returnData = roleData;
        } catch (error) {
            returnData += `${error}`;
            //处理throw Error
            if (error.message) {
                returnData = error.message;
            }
        }
        res.statusCode = 200;
        res.end(JSON.stringify(returnData));
    },
    onClose, onError
})));

router.get('/*', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    logLevel: global.config.proxyLogLevel,
    changeOrigin: true,
    pathRewrite: { '^/apiv2': '/' },
    onClose, onError
})));

router.patch('/*', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    logLevel: global.config.proxyLogLevel,
    changeOrigin: true,
    pathRewrite: { '^/apiv2': '' },
    onProxyReq, onClose, onError
}))
);

router.post('/*', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    logLevel: global.config.proxyLogLevel,
    changeOrigin: true,
    pathRewrite: { '^/apiv2': '/' },
    onProxyReq, onClose, onError
})));

router.delete('/*', c2k(createProxyMiddleware({
    target: `http://${config.pgsql.pgsqlIp}:${config.pgsql.pgsqlPort}`,
    logLevel: global.config.proxyLogLevel,
    changeOrigin: true,
    pathRewrite: { '^/apiv2': '/' },
})));

module.exports = router;

/***/ }),

/***/ "./daemon/routes/data-server-routes.js":
/*!*********************************************!*\
  !*** ./daemon/routes/data-server-routes.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! koa-router */ "koa-router")();
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");
const c2k = __webpack_require__(/*! koa2-connect */ "koa2-connect");

let getBody = (proxyRes) => {
    return new Promise(resolve => {
        let body = []
        proxyRes.on('data', function (chunk) {
            body.push(chunk)
        })
        proxyRes.on('end', function () {
            body = new Buffer.concat(body)
            resolve(body)
        })
    })
}

global.createDataServerRouter = function (port) {
    let layerStack = router.stack;
    //删除重复的路由
    for (let i = layerStack.length - 1; i >= 0; i--) {
        if (/\/data\/*/.test(layerStack[i].path)) {
            layerStack.splice(i, 1);
        }
    }
    //所有的文件访问路由
    router.get('/data/*', c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/data': '' },
        selfHandleResponse: true,
        onProxyRes: async (proxyRes, req, res) => {
            res.statusCode = proxyRes.statusCode;
            //重新解析代理返回，让内存回收的快一点
            let data = await getBody(proxyRes);
            //将proxy res的headers设置到client res
            for (let p in proxyRes.headers) {
                res.setHeader(p, proxyRes.headers[p]);
            }
            res.end(data);
        }
    })));
    //删除文件
    router.post("/data/api/v2/deletefiles", c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/data': '' },
        onProxyReq: (proxyReq, req, res) => {
            let bodyData = JSON.stringify(req.body);
            //重新计算content-length及写入body数据
            proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    })));
    //上传文件
    router.post("/data/api/v2/uploadfiles", c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        pathRewrite: { '^/data': '' },
        changeOrigin: true
    })));
}

module.exports = router;

/***/ }),

/***/ "./daemon/routes/data-source-routes.js":
/*!*********************************************!*\
  !*** ./daemon/routes/data-source-routes.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! koa-router */ "koa-router")();
const dataSource = __webpack_require__(/*! ../libs/data-source/data-source */ "./daemon/libs/data-source/data-source.js");
//TODO 由于realServer与sqlServer权限暂时聚集在一块，所以数据源操作也放在一块，以后要做拆分
//路径前缀
router.prefix('/apiv2');
//操作数据源
router.post('/option/dataSource', async (ctx, next) => {
    let result = false;
    //无权限
    if (!License.dogInfo.server.realServer && !License.dogInfo.server.sqlServer) {
        ctx.body = { result };
        return;
    }
    try {
        let bodyParam = ctx.request.body;
        let optionType = bodyParam.optionType;
        switch (optionType) {
            case "create":
                result = await dataSource.dataSourceCreate(bodyParam);
                break;
            case "update":
                result = await dataSource.dataSourceUpdate(bodyParam);
                break;
            case "delete":
                result = await dataSource.dataSourceDelete(bodyParam);
                break;
        }
        ctx.status = 200;
    } catch (error) {
        console.log(`[DAEMON] 操作数据源接口流程出现错误:${error}`);
        ctx.status = 500;
    }
    ctx.body = { result };
});

module.exports = router;

/***/ }),

/***/ "./daemon/routes/index-routes.js":
/*!***************************************!*\
  !*** ./daemon/routes/index-routes.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! koa-router */ "koa-router")();

//前端文件入口
router.get('/', async (ctx, next) => {
    await ctx.render('../views/index.html');
})

module.exports = router;

/***/ }),

/***/ "./daemon/routes/service-routes.js":
/*!*****************************************!*\
  !*** ./daemon/routes/service-routes.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * daemon与服务通讯路由
 */
const router = __webpack_require__(/*! koa-router */ "koa-router")();
const serviceApi = __webpack_require__(/*! ../libs/service-api/service-api */ "./daemon/libs/service-api/service-api.js");
router.prefix('/service')

router.post('/real', async (ctx, next) => {
    await serviceApi.real(ctx, next);
})

router.post('/data', async (ctx, next) => {
    await serviceApi.data(ctx, next);
})

router.post('/sql', async (ctx, next) => {
    await serviceApi.sql(ctx, next);
})

router.post('/io', async (ctx, next) => {
    await serviceApi.io(ctx, next);
})

router.post('/ai', async (ctx, next) => {
    await serviceApi.ai(ctx, next);
})

router.post('/pgSql', (ctx, next) => {
    serviceApi.pgSql(ctx, next);
})
module.exports = router;

/***/ }),

/***/ "./daemon/routes/sql-server-routes.js":
/*!********************************************!*\
  !*** ./daemon/routes/sql-server-routes.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(/*! koa-router */ "koa-router")();
const { createProxyMiddleware } = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");
const c2k = __webpack_require__(/*! koa2-connect */ "koa2-connect");

//路径前缀
router.prefix('/apiv2');

let onProxyReq = (proxyReq, req, res) => {
    let bodyData = JSON.stringify(req.body);
    bodyData = bodyData ? bodyData : JSON.stringify({});
    //重新计算content-length及写入body数据
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
}

/**
 * 增加sqlServer路由
 * @param port sqlServer使用端口
 * @param serverName sqlServer名称
 */
global.createSqlServerRouter = (port, serverName) => {
    let layerStack = router.stack;
    //删除重复的路由
    for (let i = layerStack.length - 1; i >= 0; i--) {
        let reg = new RegExp(`/apiv2/sql/${serverName}/*`);
        if (reg.test(layerStack[i].path)) {
            layerStack.splice(i, 1);
        }
    }
    router.get(`/sql/${serverName}/*`, c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/apiv2': '' }
    })));

    router.post(`/sql/${serverName}/*`, c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/apiv2': '' }, onProxyReq
    })));
    router.patch(`/sql/${serverName}/*`, c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/apiv2': '' }, onProxyReq
    })));
    router.delete(`/sql/${serverName}/*`, c2k(createProxyMiddleware({
        target: `http://127.0.0.1:${port}`,
        logLevel: config.proxyLogLevel,
        changeOrigin: true,
        pathRewrite: { '^/apiv2': '' }, onProxyReq
    })));
}

module.exports = router;

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "ejs":
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ejs");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "http-proxy-middleware":
/*!****************************************!*\
  !*** external "http-proxy-middleware" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-proxy-middleware");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "koa-bodyparser":
/*!*********************************!*\
  !*** external "koa-bodyparser" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),

/***/ "koa-json":
/*!***************************!*\
  !*** external "koa-json" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-json");

/***/ }),

/***/ "koa-logger":
/*!*****************************!*\
  !*** external "koa-logger" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-logger");

/***/ }),

/***/ "koa-onerror":
/*!******************************!*\
  !*** external "koa-onerror" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-onerror");

/***/ }),

/***/ "koa-router":
/*!*****************************!*\
  !*** external "koa-router" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),

/***/ "koa-static":
/*!*****************************!*\
  !*** external "koa-static" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-static");

/***/ }),

/***/ "koa-views":
/*!****************************!*\
  !*** external "koa-views" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-views");

/***/ }),

/***/ "koa2-connect":
/*!*******************************!*\
  !*** external "koa2-connect" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa2-connect");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "systeminformation":
/*!************************************!*\
  !*** external "systeminformation" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("systeminformation");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiLi9jb25maWcuanNvblwiIiwid2VicGFjazovLy8uL2RhZW1vbi9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2Jpbi93d3cuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvYXV0aGVudGljYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvZGF0YS1zb3VyY2UvZGF0YS1zb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvand0LmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9saWJzL2xpY2Vuc2UuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvbG9nLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9kYWVtb24vbGlicy9wZy1kYWVtb24uanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvcHVibGljLW1vZHVsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvc2VydmljZS1hcGkvc2VydmljZS1hcGktYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9kYWVtb24vbGlicy9zZXJ2aWNlLWFwaS9zZXJ2aWNlLWFwaS5qcyIsIndlYnBhY2s6Ly8vLi9kYWVtb24vbGlicy9zZXJ2aWNlLWFwaS9zZXJ2aWNlLWRhdGEtYXBpLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9saWJzL3NlcnZpY2UtYXBpL3NlcnZpY2UtcmVhbC1hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL2xpYnMvc2VydmljZS1hcGkvc2VydmljZS1zcWwtYXBpLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9yb3V0ZXMvYXBpdjItcm91dGVzLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9yb3V0ZXMvZGF0YS1zZXJ2ZXItcm91dGVzLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9yb3V0ZXMvZGF0YS1zb3VyY2Utcm91dGVzLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9yb3V0ZXMvaW5kZXgtcm91dGVzLmpzIiwid2VicGFjazovLy8uL2RhZW1vbi9yb3V0ZXMvc2VydmljZS1yb3V0ZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZGFlbW9uL3JvdXRlcy9zcWwtc2VydmVyLXJvdXRlcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRlYnVnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cC1wcm94eS1taWRkbGV3YXJlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hLWJvZHlwYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2EtanNvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1sb2dnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2Etb25lcnJvclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1yb3V0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2Etc3RhdGljXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hLXZpZXdzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hMi1jb25uZWN0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVxdWVzdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInN5c3RlbWluZm9ybWF0aW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiemxpYlwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsMEM7Ozs7Ozs7Ozs7O0FDQUEsWUFBWSxtQkFBTyxDQUFDLGdCQUFLO0FBQ3pCLGNBQWMsbUJBQU8sQ0FBQyw0QkFBVztBQUNqQyxhQUFhLG1CQUFPLENBQUMsMEJBQVU7QUFDL0IsZ0JBQWdCLG1CQUFPLENBQUMsZ0NBQWE7QUFDckMsbUJBQW1CLG1CQUFPLENBQUMsc0NBQWdCO0FBQzNDLGVBQWUsbUJBQU8sQ0FBQyw4QkFBWTtBQUNuQyxZQUFZLG1CQUFPLENBQUMsZ0JBQUs7QUFDekIsWUFBWSxtQkFBTyxD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Z0JBQWdCO0FBQ3RDLEtBQUs7QUFDTCwwQkFBMEIsV0FBVztBQUNyQyxvQ0FBb0MsS0FBSztBQUN6QztBQUNBO0FBQ0Esc0JBQXNCLGdCQUFnQjtBQUN0QyxLQUFLO0FBQ0w7O0FBRUEsd0I7Ozs7Ozs7Ozs7O0FDeERBLDBDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGtEOzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLDJDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLHNDOzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGlDIiwiZmlsZSI6ImRhZW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vZGFlbW9uL2Jpbi93d3cuanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2NvbmZpZy5qc29uXCIpOyIsImNvbnN0IEtvYSA9IHJlcXVpcmUoJ2tvYScpXG5jb25zdCB2aWV3cyA9IHJlcXVpcmUoJ2tvYS12aWV3cycpXG5jb25zdCBqc29uID0gcmVxdWlyZSgna29hLWpzb24nKVxuY29uc3Qgb25lcnJvciA9IHJlcXVpcmUoJ2tvYS1vbmVycm9yJylcbmNvbnN0IGJvZHlwYXJzZXIgPSByZXF1aXJlKCdrb2EtYm9keXBhcnNlcicpXG5jb25zdCBsb2dnZXIgPSByZXF1aXJlKCdrb2EtbG9nZ2VyJylcbmNvbnN0IGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuY29uc3QgSnd0ID0gcmVxdWlyZSgnLi9saWJzL2p3dCcpO1xuY29uc3QgaW5kZXhSb3V0ZSA9IHJlcXVpcmUoJy4vcm91dGVzL2luZGV4LXJvdXRlcycpO1xuY29uc3Qgc2VydmljZVJvdXRlID0gcmVxdWlyZSgnLi9yb3V0ZXMvc2VydmljZS1yb3V0ZXMnKVxuY29uc3QgYXBpdjJSb3V0ZSA9IHJlcXVpcmUoJy4vcm91dGVzL2FwaXYyLXJvdXRlcycpXG5jb25zdCBkYXRhU2VydmVyUm91dGUgPSByZXF1aXJlKCcuL3JvdXRlcy9kYXRhLXNlcnZlci1yb3V0ZXMnKTtcbmNvbnN0IGRhdGFTb3VyY2VSb3V0ZSA9IHJlcXVpcmUoJy4vcm91dGVzL2RhdGEtc291cmNlLXJvdXRlcycpO1xuY29uc3Qgc3FsU2VydmVyUm91dGUgPSByZXF1aXJlKCcuL3JvdXRlcy9zcWwtc2VydmVyLXJvdXRlcycpO1xuY29uc3QgYzJrID0gcmVxdWlyZSgna29hMi1jb25uZWN0Jyk7XG5jb25zdCBhcHAgPSBuZXcgS29hKClcbi8vIGVycm9yIGhhbmRsZXJcbi8vb25lcnJvcihhcHApXG5cbmFwcC51c2UoYm9keXBhcnNlcih7XG5cdGVuYWJsZVR5cGVzOiBbJ2pzb24nLCAnZm9ybScsICd0ZXh0J11cbn0pKVxuXG5hcHAudXNlKGpzb24oKSk7XG5cblxuLy9hcHAudXNlKGxvZ2dlcigpKVxuYXBwLnVzZShyZXF1aXJlKCdrb2Etc3RhdGljJykoX19kaXJuYW1lICsgJy92aWV3cycpKVxuYXBwLnVzZSh2aWV3cyhfX2Rpcm5hbWUgKyAnL3ZpZXdzJywge1xuXHRtYXA6IHsgaHRtbDogJ2VqcycgfVxufSkpXG5cbi8vIGxvZ2dlclxuLy8gYXBwLnVzZShhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4vLyAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoKVxuLy8gICBhd2FpdCBuZXh0KClcbi8vICAgY29uc3QgbXMgPSBuZXcgRGF0ZSgpIC0gc3RhcnRcbi8vICAgY29uc29sZS5sb2coYCR7Y3R4Lm1ldGhvZH0gJHtjdHgudXJsfSAtICR7bXN9bXNgKVxuLy8gfSlcblxuLy/pibTmnYPkuK3pl7Tku7ZcbmFwcC51c2UoYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuXHQvL+S4jemcgOimgemJtOadg+eahOivt+axgui3r+W+hFxuXHRsZXQgaWdub3JlUGF0aCA9IFtcIi9sb2dpbi91c2Vyc1wiLCBcIi9cIl07XG5cdGxldCByZXFQYXRoID0gY3R4LnJlcXVlc3QucGF0aC5yZXBsYWNlKC9eXFwvYXBpdjIvLCBcIlwiKTtcblx0Ly/kuI3pnIDopoHpibTmnYPnmoTor7fmsYLot6/lvoTmraPliJlcblx0bGV0IGlnbm9yZVBhdGhSZXggPSBbL1xcL3NlcnZpY2UvLCAvXFwvZGF0YS8sIC9cXC9zdGF0aWNcXC9pbWFnZXMvLCAvXFwvc3FsL107XG5cdGxldCBpc0lnbm9yZSA9IGZhbHNlO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlnbm9yZVBhdGhSZXgubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoaWdub3JlUGF0aFJleFtpXS50ZXN0KHJlcVBhdGgpKSB7XG5cdFx0XHRpc0lnbm9yZSA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0aWYgKGlnbm9yZVBhdGguaW5kZXhPZihyZXFQYXRoKSA+PSAwIHx8IGlzSWdub3JlKSB7XG5cdFx0YXdhaXQgbmV4dCgpO1xuXHRcdHJldHVybjtcblx0fVxuXHQvL+eUqOaIt+ivt+axgnRva2VuXG5cdGxldCB1c2VyUmVxVG9rZW4gPSBjdHguaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG5cdGlmICghdXNlclJlcVRva2VuKSB7XG5cdFx0Y3R4LnN0YXR1cyA9IDQwMTtcblx0XHRjdHguYm9keSA9IGB7XCJyZXRDb2RlXCI6MCxcImVycm9yXCI6XCLpnZ7ms5Xor7fmsYJcIn1gO1xuXHRcdHJldHVybjtcblx0fVxuXHRsZXQgand0ID0gbmV3IEp3dChMaWNlbnNlLnBjaWQudG9TdHJpbmcoKSk7XG5cdC8v6aqM6K+BdG9rZW5cblx0bGV0IGNoa1Rva2VuID0gand0LnZlcmlmeVRva2VuKHVzZXJSZXFUb2tlbik7XG5cdGlmIChjaGtUb2tlbiA9PSAwKSB7XG5cdFx0Y3R4LnN0YXR1cyA9IDQwMTtcblx0XHQvL3Rva2Vu6Kej5p6Q5aSx6LSl77yM6L+U5Zue6Z2e5rOV6K+35rGCXG5cdFx0Y3R4LmJvZHkgPSBge1wicmV0Q29kZVwiOjAsXCJlcnJvclwiOlwi6Z2e5rOV6K+35rGCXCJ9YDtcblx0XHRyZXR1cm47XG5cdH0gZWxzZSBpZiAoY2hrVG9rZW4gPT0gMSkge1xuXHRcdGN0eC5zdGF0dXMgPSA0MDE7XG5cdFx0Ly90b2tlbuino+aekOeZu+W9leS/neeVmei2heaXtlxuXHRcdGN0eC5ib2R5ID0gYHtcInJldENvZGVcIjotMSxcImVycm9yXCI6XCLnmbvlvZXotoXml7ZcIn1gO1xuXHRcdHJldHVybjtcblx0fVxuXHRhd2FpdCBuZXh0KCk7XG59KVxuXG4vKipcbiAqIOino+WGs2tvYTItY29ubmVjdOWwhmV4cHJlc3PkuK3pl7Tku7bovazmjaLkuLprb2Ey5Lit6Ze05Lu25pe25Lii5aSxYm9keeaVsOaNrueahGJ1Z1xuICovXG5hcHAudXNlKChjdHgsIG5leHQpID0+IHtcblx0bGV0IG1ldGhvZEFyciA9IFsnUE9TVCcsICdQQVRDSCddO1xuXHRpZiAobWV0aG9kQXJyLmluZGV4T2YoY3R4Lm1ldGhvZCkgPj0gMCAmJiBjdHgucmVxdWVzdC5ib2R5KSB7XG5cdFx0Y3R4LnJlcS5ib2R5ID0gY3R4LnJlcXVlc3QuYm9keTtcblx0fVxuXHRuZXh0KCk7XG59KVxuXG4vL+WJjeerr+aWh+S7tlxuYXBwLnVzZShpbmRleFJvdXRlLnJvdXRlcygpLCBpbmRleFJvdXRlLmFsbG93ZWRNZXRob2RzKCkpXG4vL2RhdGEtc2VydmVy5pyN5YqhXG5hcHAudXNlKGRhdGFTZXJ2ZXJSb3V0ZS5yb3V0ZXMoKSwgZGF0YVNlcnZlclJvdXRlLmFsbG93ZWRNZXRob2RzKCkpO1xuLy/mk43kvZzmlbDmja7mupBcbmFwcC51c2UoZGF0YVNvdXJjZVJvdXRlLnJvdXRlcygpLCBkYXRhU291cmNlUm91dGUuYWxsb3dlZE1ldGhvZHMoKSk7XG4vL3NxbC1zZXJ2ZXLmnI3liqFcbmFwcC51c2Uoc3FsU2VydmVyUm91dGUucm91dGVzKCksIHNxbFNlcnZlclJvdXRlLmFsbG93ZWRNZXRob2RzKCkpO1xuLy9hcGl2MuS7o+eQhuebuOWFs1xuYXBwLnVzZShhcGl2MlJvdXRlLnJvdXRlcygpLCBhcGl2MlJvdXRlLmFsbG93ZWRNZXRob2RzKCkpXG4vL2RhZW1vbuS4juS4i+WxnuacjeWKoemAmuiur1xuYXBwLnVzZShzZXJ2aWNlUm91dGUucm91dGVzKCksIHNlcnZpY2VSb3V0ZS5hbGxvd2VkTWV0aG9kcygpKVxuXG4vLyBlcnJvci1oYW5kbGluZ1xuYXBwLm9uKCdlcnJvcicsIChlcnIsIGN0eCkgPT4ge1xuXHRjb25zb2xlLmVycm9yKCdzZXJ2ZXIgZXJyb3InLCBlcnIsIGN0eClcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcFxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG4vL2RhZW1vbuWFqOWxgOmFjee9rlxuZ2xvYmFsLmNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcvZGVmYXVsdC1jb25maWcuanNvblwiKTtcbi8vZGVidWdcbmdsb2JhbC5fX2RlYnVnID0gXCJcIjsgLy9kZWJ1Z+aooeW8j1xuaWYgKHByb2Nlc3MuYXJndlsyXSAmJiBwcm9jZXNzLmFyZ3ZbMl0gPT09IFwiZGVidWdcIikge1xuXHRfX2RlYnVnID0gcHJvY2Vzcy5hcmd2WzJdO1xufVxuXG5jb25zdCBwdWJsaWNfbW9kdWxlcyA9IHJlcXVpcmUoJy4uL2xpYnMvcHVibGljLW1vZHVsZXMnKTtcbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdkZW1vOnNlcnZlcicpO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbmNvbnN0IGMyayA9IHJlcXVpcmUoJ2tvYTItY29ubmVjdCcpO1xuY29uc3QgY2x1c3RlciA9IHJlcXVpcmUoJ2NsdXN0ZXInKTtcbmNvbnN0IHsgY3JlYXRlUHJveHlNaWRkbGV3YXJlIH0gPSByZXF1aXJlKCdodHRwLXByb3h5LW1pZGRsZXdhcmUnKTtcblxuLy/lt6XkvZzov5vnqIvnmoTmnIDlpKfmlbDph49cbmNvbnN0IE1BWFNVQkNPVU5UID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoO1xucHJvY2Vzcy5lbnYuUE9SVCA9IGNvbmZpZy5wb3J0O1xubGV0IHBvcnQgPSBub3JtYWxpemVQb3J0KHByb2Nlc3MuZW52LlBPUlQgfHwgJzMwMDAnKTtcblxuaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcblx0Y29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIske3Byb2Nlc3MucGlkfV0g5ZCv5YqoYCk7XG5cdC8v5ZCv5Yqo5LiL5bGe5pyN5YqhXG5cdG1hbmFnZXIuaW5pdCgpO1xuXHQvL+ihjeeUn+WHuuadpeeahOWtkOi/m+eoi+S4quaVsOS4jeiDvei2hei/h+acjeWKoeWZqGNwdeS4quaVsFxuXHRpZiAoY29uZmlnLnN1YkNvdW50ID4gTUFYU1VCQ09VTlQpIHtcblx0XHRjb25maWcuc3ViQ291bnQgPSBNQVhTVUJDT1VOVDtcblx0fVxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5zdWJDb3VudDsgaSsrKSB7XG5cdFx0Y2x1c3Rlci5mb3JrKCk7XG5cdH1cblx0Ly/nm5HlkKzlt6XkvZzov5vnqIvmtojmga9cblx0T2JqZWN0LmtleXMoY2x1c3Rlci53b3JrZXJzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdGNsdXN0ZXIud29ya2Vyc1tpdGVtXS5vbihcIm1lc3NhZ2VcIiwgbXNnID0+IHtcblx0XHRcdC8v5Li76L+b56iL5YiG5Y+R5raI5oGv57uZ5bel5L2c6L+b56iLXG5cdFx0XHRzZW5kTXNnVG9Xb3JrZXIobXNnKTtcblx0XHR9KVxuXHR9KVxuXHQvL+WkhOeQhui/m+eoi+mAgOWHulxuXHRjbHVzdGVyLm9uKCdleGl0JywgKHdvcmtlciwgY29kZSwgc2lnbmFsKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coYFtEQUVNT04t5bel5L2c6L+b56iLJHtwcm9jZXNzLnBpZH1dIOmAgOWHumApO1xuXHR9KTtcblxufSBlbHNlIGlmIChjbHVzdGVyLmlzV29ya2VyKSB7XG5cdExpY2Vuc2UuaW5pdCgpO1xuXHQvL+WIm+W7umh0dHDmnI3liqFcblx0bGV0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5jYWxsYmFjaygpKTtcblx0Ly/nm5HlkKznq6/lj6Ncblx0c2VydmVyLmxpc3Rlbihwb3J0KTtcblx0Ly9yZWFsLXNlcnZlcuWtmOWcqOWkmuS4qu+8jOWKqOaAgeWIm+W7uuS4remXtOS7tlxuXHRnbG9iYWwuY3JlYXRlUHJveHkgPSBmdW5jdGlvbiAocHJveHlJbmZvKSB7XG5cdFx0YXBwLnVzZShjMmsocHJveHlJbmZvLnByb3h5KSk7XG5cdH1cblx0c2VydmVyLm9uKCd1cGdyYWRlJywgKHJlc3BvbnNlLCBzb2NrZXQsIGhlYWQpID0+IHtcblx0XHQvL3JlYWwtc2VydmVy5ZCN56ew77yMZGVjb2RlVVJJ55So5LqO6Kej5Yaz5Lit5paH5Lmx56CBXG5cdFx0bGV0IHNlcnZlck5hbWUgPSBkZWNvZGVVUkkocmVzcG9uc2UudXJsLnNwbGl0KFwiL1wiKVsyXSk7XG5cdFx0aWYgKHJlYWxTZXJ2ZXJbc2VydmVyTmFtZV0pIHtcblx0XHRcdHJlYWxTZXJ2ZXJbc2VydmVyTmFtZV0ucHJveHkudXBncmFkZShyZXNwb25zZSwgc29ja2V0LCBoZWFkKTtcblx0XHR9XG5cdH0pO1xuXG5cdHNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKTtcblx0c2VydmVyLm9uKCdsaXN0ZW5pbmcnLCBvbkxpc3RlbmluZyk7XG5cdC8v55uR5ZCs5Li76L+b56iL5raI5oGvXG5cdHByb2Nlc3Mub24oXCJtZXNzYWdlXCIsIG1zZyA9PiB7XG5cdFx0aWYgKCFtc2cuYWN0aW9uKSByZXR1cm47XG5cdFx0bGV0IGFjdGlvbiA9IG1zZy5hY3Rpb247XG5cdFx0bGV0IGRhdGEgPSBtc2cuZGF0YTtcblx0XHRsZXQgc2VydmVyTmFtZSA9IGRhdGEubmFtZTtcblx0XHRzd2l0Y2ggKGFjdGlvbikge1xuXHRcdFx0Y2FzZSBcInVwZGF0ZVJlYWxTZXJ2ZXJcIjpcblx0XHRcdFx0Ly/mlrDlkK/liqjnmoTmnI3liqHmiJbogIXmmK/ph43lkK/nmoTmnI3liqFcblx0XHRcdFx0aWYgKCFyZWFsU2VydmVyW3NlcnZlck5hbWVdIHx8IHJlYWxTZXJ2ZXJbc2VydmVyTmFtZV0ucG9ydCAhPSBkYXRhLnBvcnQpIHtcblx0XHRcdFx0XHRyZWFsU2VydmVyLmN1clBvcnQgPSBkYXRhLnBvcnQ7XG5cdFx0XHRcdFx0Ly9yZWFsU2VydmVy5YWo5bGA5a+56LGh5aKe5Yqg5paw55qEc2VydmVy5a+56LGhXG5cdFx0XHRcdFx0cmVhbFNlcnZlcltzZXJ2ZXJOYW1lXSA9IHtcblx0XHRcdFx0XHRcdFwicG9ydFwiOiBkYXRhLnBvcnQsXG5cdFx0XHRcdFx0XHRcInByb3h5XCI6IGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XG5cdFx0XHRcdFx0XHRcdHRhcmdldDogYHdzOi8vbG9jYWxob3N0OiR7ZGF0YS5wb3J0fS9gLFxuXHRcdFx0XHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXG5cdFx0XHRcdFx0XHRcdHdzOiB0cnVlXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjcmVhdGVQcm94eShyZWFsU2VydmVyW3NlcnZlck5hbWVdLnByb3h5KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1cGRhdGVEYXRhU2VydmVyXCI6XG5cdFx0XHRcdC8v5paw5ZCv5Yqo55qE5pyN5Yqh5oiW6ICF5piv6YeN5ZCv55qE5pyN5YqhXG5cdFx0XHRcdGlmICghZGF0YVNlcnZlcltzZXJ2ZXJOYW1lXSB8fCBkYXRhU2VydmVyW3NlcnZlck5hbWVdLnBvcnQgIT0gZGF0YS5wb3J0KSB7XG5cdFx0XHRcdFx0Ly/ntK/orqHnq6/lj6Ncblx0XHRcdFx0XHRkYXRhU2VydmVyLmN1clBvcnQgPSBkYXRhLnBvcnQ7XG5cdFx0XHRcdFx0Ly/orrDlvZXlvZPliY3mnI3liqHkvb/nlKjnq6/lj6Ncblx0XHRcdFx0XHRkYXRhU2VydmVyW3NlcnZlck5hbWVdID0gZGF0YS5wb3J0O1xuXHRcdFx0XHRcdGNyZWF0ZURhdGFTZXJ2ZXJSb3V0ZXIoZGF0YS5wb3J0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1cGRhdGVTcWxTZXJ2ZXJcIjpcblx0XHRcdFx0Ly/mlrDlkK/liqjnmoTmnI3liqHmiJbogIXmmK/ph43lkK/nmoTmnI3liqFcblx0XHRcdFx0aWYgKCFzcWxTZXJ2ZXJbc2VydmVyTmFtZV0gfHwgc3FsU2VydmVyW3NlcnZlck5hbWVdLnBvcnQgIT0gZGF0YS5wb3J0KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7cHJvY2Vzcy5waWR9OiR7SlNPTi5zdHJpbmdpZnkoc3FsU2VydmVyW3NlcnZlck5hbWVdKX06JHtkYXRhLnBvcnR9YCk7XG5cdFx0XHRcdFx0Ly/ntK/orqHnq6/lj6Ncblx0XHRcdFx0XHRzcWxTZXJ2ZXIuY3VyUG9ydCA9IGRhdGEucG9ydDtcblx0XHRcdFx0XHQvL+iusOW9leW9k+WJjeacjeWKoeS9v+eUqOerr+WPo1xuXHRcdFx0XHRcdHNxbFNlcnZlcltzZXJ2ZXJOYW1lXSA9IGRhdGEucG9ydDtcblx0XHRcdFx0XHRjcmVhdGVTcWxTZXJ2ZXJSb3V0ZXIoZGF0YS5wb3J0LCBzZXJ2ZXJOYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0pO1xuXHQvL2h0dHAgXCJlcnJvclwi5LqL5Lu255uR5ZCsXG5cdGZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcblx0XHRpZiAoZXJyb3Iuc3lzY2FsbCAhPT0gJ2xpc3RlbicpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHZhciBiaW5kID0gdHlwZW9mIHBvcnQgPT09ICdzdHJpbmcnXG5cdFx0XHQ/ICdQaXBlICcgKyBwb3J0XG5cdFx0XHQ6ICdQb3J0ICcgKyBwb3J0O1xuXG5cdFx0Ly/lpITnkIblt7Lnn6XnmoTnm5HlkKzkuovku7bplJnor69cblx0XHRzd2l0Y2ggKGVycm9yLmNvZGUpIHtcblx0XHRcdGNhc2UgJ0VBQ0NFUyc6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYmluZCArICcgcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlcycpO1xuXHRcdFx0XHRwcm9jZXNzLmV4aXQoMSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnRUFERFJJTlVTRSc6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYmluZCArICcgaXMgYWxyZWFkeSBpbiB1c2UnKTtcblx0XHRcdFx0cHJvY2Vzcy5leGl0KDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fVxuXG5cdC8vaHR0cCBcImxpc3RlbmluZ1wi5LqL5Lu255uR5ZCsXG5cdGZ1bmN0aW9uIG9uTGlzdGVuaW5nKCkge1xuXHRcdGNvbnNvbGUubG9nKGBbREFFTU9OLeW3peS9nOi/m+eoiyR7cHJvY2Vzcy5waWR9XSDlkK/liqhgKTtcblx0XHR2YXIgYWRkciA9IHNlcnZlci5hZGRyZXNzKCk7XG5cdFx0dmFyIGJpbmQgPSB0eXBlb2YgYWRkciA9PT0gJ3N0cmluZydcblx0XHRcdD8gJ3BpcGUgJyArIGFkZHJcblx0XHRcdDogJ3BvcnQgJyArIGFkZHIucG9ydDtcblx0XHRkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKTtcblx0fVxufVxuXG4vL+inhOiMg+err+WPo1xuZnVuY3Rpb24gbm9ybWFsaXplUG9ydCh2YWwpIHtcblx0bGV0IHBvcnQgPSBwYXJzZUludCh2YWwsIDEwKTtcblx0aWYgKGlzTmFOKHBvcnQpKSByZXR1cm4gdmFsO1xuXHRpZiAocG9ydCA+PSAwKSByZXR1cm4gcG9ydDtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzZW5kTXNnVG9Xb3JrZXIobXNnKSB7XG5cdE9iamVjdC5rZXlzKGNsdXN0ZXIud29ya2VycykuZm9yRWFjaChpdGVtID0+IHtcblx0XHRjbHVzdGVyLndvcmtlcnNbaXRlbV0uc2VuZChtc2cpO1xuXHR9KVxufSIsIi8qXHJcbiAgICDliJvlu7rkuro6emhhbmd3ZlxyXG4gICAg5L2c55SoOuWJjeWPsOeUqOaIt+ebuOWFs1xyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBjbGFzcyBhdXRoZW50aWNhdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxuICAgIGxvbmluKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBWZXJpZmljYXRpb24oKXtcclxuICAgICAgICAvL+eUqOaIt+eZu+mZhumqjOivgVxyXG4gICAgfSBcclxuICAgIGxvZ291dCgpe1xyXG5cclxuICAgIH1cclxuICAgIHJlZ2lzdGVyKCl7XHJcblxyXG4gICAgfVxyXG59KCk7IiwiLyoqXHJcbiAqIGFwaXYy55qEc2VydmljZeWxglxyXG4gKi9cclxuY29uc3QgbWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXInKTtcclxuXHJcbmNsYXNzIERhdGFTb3VyY2Uge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65pWw5o2u5rqQXHJcbiAgICAgKiBAcGFyYW0geyp9IHBhcmFtIFxyXG4gICAgICovXHJcbiAgICBhc3luYyBkYXRhU291cmNlQ3JlYXRlKHBhcmFtKSB7XHJcbiAgICAgICAgbGV0IGNtZCA9IG1hbmFnZXIuc3BsaWNlQ21kTGluZShbcGFyYW1dKTtcclxuICAgICAgICBsZXQgcmVzID0gbWFuYWdlci5zdGFydERhdGFTb3VyY2UoY21kKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5pu05paw5pWw5o2u5rqQXHJcbiAgICBkYXRhU291cmNlVXBkYXRlKHBhcmFtKSB7XHJcbiAgICAgICAgbGV0IGNtZCA9IFwiXCI7XHJcbiAgICAgICAgLy/lhajlsYDlr7nosaHkuK3nmoRzZXJ2ZXLlr7nosaEs5LiN5ZyocmVhbFNlcnZlcuS4reWwseaYr+WcqHNxbFNlcnZlcuS4rVxyXG4gICAgICAgIGxldCBzZXJ2ZXIgPSBnbG9iYWxbXCJyZWFsU2VydmVyXCJdO1xyXG4gICAgICAgIGlmICghc2VydmVyKSB7XHJcbiAgICAgICAgICAgIHNlcnZlciA9IGdsb2JhbFtcInNxbFNlcnZlclwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBwcmVOYW1lID0gcGFyYW0ucHJlTmFtZTtcclxuICAgICAgICAvL+WIoOmZpOWFqOWxgOWvueixoeS4reaXp+eahHNlcnZlclxyXG4gICAgICAgIGRlbGV0ZSBzZXJ2ZXJbcGFyYW0ucHJlTmFtZV07XHJcbiAgICAgICAgLy/liKDpmaTml6fnmoRyZWFsU2VydmVy6L+b56iLXHJcbiAgICAgICAgY21kID0gYHBtMiBkZWxldGUgJHtwcmVOYW1lfWA7XHJcbiAgICAgICAgcmVzID0gbWFuYWdlci5zdGFydFNlcnZlcihjbWQpO1xyXG4gICAgICAgIC8v5ZCv5Yqo5paw55qEcmVhbFNlcnZlclxyXG4gICAgICAgIGNtZCA9IG1hbmFnZXIuc3BsaWNlQ21kTGluZShbcGFyYW1dKTtcclxuICAgICAgICByZXMgPSBtYW5hZ2VyLnN0YXJ0RGF0YVNvdXJjZShjbWQpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKDpmaTmlbDmja7mupBcclxuICAgIGFzeW5jIGRhdGFTb3VyY2VEZWxldGUocGFyYW0pIHtcclxuICAgICAgICBsZXQgc2VydmVyTmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgICAgICAgLy/lhajlsYDlr7nosaHkuK3nmoRzZXJ2ZXLlr7nosaEs5LiN5ZyocmVhbFNlcnZlcuS4reWwseaYr+WcqHNxbFNlcnZlcuS4rVxyXG4gICAgICAgIGxldCBzZXJ2ZXIgPSBnbG9iYWxbXCJyZWFsU2VydmVyXCJdO1xyXG4gICAgICAgIGlmICghc2VydmVyKSB7XHJcbiAgICAgICAgICAgIHNlcnZlciA9IGdsb2JhbFtcInNxbFNlcnZlclwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/liKDpmaTlhajlsYDlr7nosaHkuK3ml6fnmoRyZWFsU2VydmVyXHJcbiAgICAgICAgZGVsZXRlIHNlcnZlcltzZXJ2ZXJOYW1lXTtcclxuICAgICAgICAvL+WIoOmZpOaXp+eahHJlYWxTZXJ2ZXLov5vnqItcclxuICAgICAgICBsZXQgY21kID0gYHBtMiBkZWxldGUgJHtzZXJ2ZXJOYW1lfWA7XHJcbiAgICAgICAgbWFuYWdlci5zdGFydFNlcnZlcihjbWQpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgZGF0YVNvdXJjZSA9IG51bGw7XHJcbmlmIChkYXRhU291cmNlID09PSBudWxsKSB7XHJcbiAgICBkYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2UoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRhU291cmNlOyIsIi8vIOW8leWFpeaooeWdl+S+nei1llxyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbmNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpO1xyXG4vLyDliJvlu7ogdG9rZW4g57G7XHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSnd0IHtcclxuICAgIGNvbnN0cnVjdG9yKGtleSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsOyAvLyDnlKjmiLfoh6rlrprkuYkg5a2Y5pS+dXNlcmlkXHJcbiAgICAgICAgdGhpcy5fZGF0ZSA9IG51bGw7IC8vIOi/h+acn+aXtumXtFxyXG4gICAgICAgIHRoaXMuX2NyZWF0RGF0ZSA9IG51bGw7IC8vIOWIm+W7uuaXtumXtFxyXG4gICAgICAgIHRoaXMuY2VydCA9IGtleTtcclxuICAgICAgICB0aGlzLmJlT3ZlcmR1ZSA9IDcgKiAyNCAqIDYwICogNjBcclxuICAgIH1cclxuICAgIC8vIOmHjeaWsOeUn+aIkCB0b2tlblxyXG4gICAgcmVmcmVzaFRva2VuKCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGxldCBjcmVhdGVkID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gand0LnNpZ24oe1xyXG4gICAgICAgICAgICBkYXRhLFxyXG4gICAgICAgICAgICBleHA6IGNyZWF0ZWQgKyB0aGlzLmJlT3ZlcmR1ZSwgLy8g6L+H5pyf5pe26Ze0IFxyXG4gICAgICAgICAgICBpYXQ6IGNyZWF0ZWQsIC8vIOWIm+W7uuaXtumXtFxyXG4gICAgICAgIH0sIHRoaXMuY2VydCk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG4gICAgLy/nlJ/miJB0b2tlblxyXG4gICAgZ2VuZXJhdGVUb2tlbihkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBsZXQgY3JlYXRlZCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGp3dC5zaWduKHtcclxuICAgICAgICAgICAgZGF0YSxcclxuICAgICAgICAgICAgZXhwOiBjcmVhdGVkICsgdGhpcy5iZU92ZXJkdWUsIC8vIOi/h+acn+aXtumXtFxyXG4gICAgICAgICAgICBpYXQ6IGNyZWF0ZWQsIC8vIOWIm+W7uuaXtumXtFxyXG4gICAgICAgIH0sIHRoaXMuY2VydCk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG4gICAgLy8g5qCh6aqMdG9rZW5cclxuICAgIHZlcmlmeVRva2VuKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdG9rZW4gPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgbGV0IHJlcztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gand0LnZlcmlmeSh0b2tlbiwgdGhpcy5jZXJ0KSB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5faWQgPSByZXN1bHQuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5fZGF0ZSA9IHJlc3VsdC5leHA7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0RGF0ZSA9IHJlc3VsdC5pYXQ7XHJcbiAgICAgICAgICAgIGxldCB7ZXhwID0gMH0gPSByZXN1bHQsIGN1cnJlbnQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPD0gZXhwKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSByZXN1bHQuZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXMgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXMgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG59IiwiLy9odHRwOi8vbW9tZW50anMuY24vZG9jcy8jL3F1ZXJ5L1xyXG4vL2h0dHBzOi8vd3d3LmxpYW5nemwuY29tL2dldC1hcnRpY2xlLWRldGFpbC0xNjYzNTYuaHRtbFxyXG5cclxuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XHJcbmNvbnN0IHNpID0gcmVxdWlyZSgnc3lzdGVtaW5mb3JtYXRpb24nKTtcclxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCB7IGV4ZWMgfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcclxuXHJcbmNsYXNzIExpY2Vuc2Uge1xyXG5cdHN0YXRpYyBhc3luYyBpbml0KCkge1xyXG5cdFx0cmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bW9tZW50LmxvY2FsZSgnemgtY24nKTtcclxuXHRcdFx0TGljZW5zZS5zdGFydFRpbWUgPSBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIpO1xyXG5cdFx0XHRpZiAoZnMuZXhpc3RzU3luYygnLi9saWNlbnNlLmxpYycpKSB7XHJcblx0XHRcdFx0Ly/miZPljIXlkI7or7vlvZPliY1cclxuXHRcdFx0XHRsZXQgaW5mbyA9IGZzLnJlYWRGaWxlU3luYygnLi9saWNlbnNlLmxpYycsIFwidXRmLThcIik7XHJcblx0XHRcdFx0YXdhaXQgTGljZW5zZS5wYXJzZUNvbnRlbnQoaW5mbyk7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZzLmV4aXN0c1N5bmMoJy4uL2xpY2Vuc2UubGljJykpIHtcclxuXHRcdFx0XHQvL+a6kOeggeaooeW8j+S4i+ivu+WPluS4iuS4gOe6p+ebruW9leaWh+S7tlxyXG5cdFx0XHRcdGxldCBpbmZvID0gZnMucmVhZEZpbGVTeW5jKCcuLi9saWNlbnNlLmxpYycsIFwidXRmLThcIik7XHJcblx0XHRcdFx0YXdhaXQgTGljZW5zZS5wYXJzZUNvbnRlbnQoaW5mbyk7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8v5paH5Lu25LiN5a2Y5Zyo77yM5peg5o6I5p2D77yM6Ieq5Yqo55Sf5oiQ5paH5Lu2XHJcblx0XHRcdFx0Ly/ku6PnoIHlubLmibBcclxuXHRcdFx0XHRjb25zdCBrZXkxID0gJzl2QXB4TGs1RzNQQXNKck0nO1xyXG5cdFx0XHRcdGNvbnN0IGl2MSA9ICdGbkpMN0VEempxV2pjYVk5JztcclxuXHRcdFx0XHQvL+ecn+WunmtleVxyXG5cdFx0XHRcdGNvbnN0IGtleTIgPSAnOXZBcHhMTERGRVNYQ0M1RzNQQXNKck0nO1xyXG5cdFx0XHRcdGNvbnN0IGl2MiA9ICdGbkpMN0Vka2ZhbGRzZmo5JztcclxuXHRcdFx0XHRsZXQgcGNpZCA9IGF3YWl0IExpY2Vuc2UuZ2V0UGNpZCgpO1xyXG5cdFx0XHRcdGNvbnN0IHdyaXRlQ29udGVudDEgPSBMaWNlbnNlLmdlblNpZ24ocGNpZC50b1N0cmluZygpLCBrZXkyKTtcclxuXHRcdFx0XHRmcy53cml0ZUZpbGUoXCIuL3NhZmUtZG9nLnNtdFwiLCB3cml0ZUNvbnRlbnQxLCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIuacquajgOa1i+WIsOaOiOadgyzmvJTnpLrov5DooYzml7bpl7Q2MOWIhumSnyFcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIueUn+aIkOaOiOadg+S/oeaBr+aWh+S7tjpzYWZlLWRvZy5zbXQs6K+35Y+R6YCB5q2k5paH5Lu25Yiw5pys5YWs5Y+46L+b6KGM5o6I5p2D5pON5L2c77yBXCIpO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHQvL+W8gOWQr+aOiOadg+ajgOafpVxyXG5cdFx0XHRMaWNlbnNlLmNoZWNrRG9nKCk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHQvLzEw5YiG6ZKf5LiA5qOA5p+lXHJcblx0c3RhdGljIGNoZWNrRG9nKCkge1xyXG5cdFx0Ly/lop7liqDpmLLmnYDku6PnoIHvvIznpoHmraLlsY/olL1zZXR0aW1lclxyXG5cdFx0aWYgKE9iamVjdC5rZXlzKExpY2Vuc2UuZG9nSW5mbykubGVuZ3RoIDw9IDApIHtcclxuXHRcdFx0Ly/ml6DmjojmnYNcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8v5o6I5p2D5piv5ZCm6L+H5pyfIOW8gOWni+aXpeacn+WSjOacieaViOWkqeaVsO+8jOW/hemhu+WtmOWcqFxyXG5cdFx0XHRpZiAoTGljZW5zZS5kb2dJbmZvLmJlZ2luVGltZSAmJiBMaWNlbnNlLmRvZ0luZm8uYXZhaWxhYmxlRGF5KSB7XHJcblx0XHRcdFx0Ly/lvZPliY3ml7bpl7TlpKfkuo7ni5fph4zpnaLml7bpl7Qg5bCP5LqO5pyJ5pWI5pyf6IyD5Zu0XHJcblx0XHRcdFx0bGV0IGJlZ2luID0gbW9tZW50KExpY2Vuc2UuZG9nSW5mby5iZWdpblRpbWUsIFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcclxuXHRcdFx0XHRsZXQgZW5kID0gbW9tZW50KGJlZ2luKS5hZGQoTGljZW5zZS5kb2dJbmZvLmF2YWlsYWJsZURheSwgXCJkYXlzXCIpO1xyXG5cdFx0XHRcdGlmIChtb21lbnQoKS5pc0JldHdlZW4oYmVnaW4sIGVuZCwgbnVsbCwgJ1tdJykpIHtcclxuXHRcdFx0XHRcdExpY2Vuc2UuaGFzTGljZW5zZSA9IHRydWU7XHJcblx0XHRcdFx0XHQvL+WRqOacn+WWgueLl++8jOeoi+W6j+WGhemDqOmaj+acuuajgOafpe+8jOmYsuatoueIhuegtFxyXG5cdFx0XHRcdFx0TGljZW5zZS5lYXREb2dUaW1lID0gbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbTpzc1wiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly/mjojmnYPliLDmnJ8g55So5oi35py65Zmo5pe26Ze05bCP5LqO5o6I5p2D5Lit5pe26Ze0XHJcblx0XHRcdFx0XHRMaWNlbnNlLmhhc0xpY2Vuc2UgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghTGljZW5zZS5oYXNMaWNlbnNlKSB7XHJcblx0XHRcdC8v5o6I5p2D5peg5pWI5pe277yM5b2T5YmN5pe26Ze05aSn5LqO5ZCv5Yqo5pe26Ze077yM6YCA5Ye644CC77yI5aaC5p6c5piv5Lit6YCU5o6I5p2D5peg5pWI77yM5YiZ5Zue56uL5Y2z6YCA5Ye677yJXHJcblx0XHRcdGxldCB0aW1lT3V0ID0gbW9tZW50KExpY2Vuc2Uuc3RhcnRUaW1lKS5hZGQoMSwgXCJob3Vyc1wiKTtcclxuXHRcdFx0aWYgKG1vbWVudCgpLmlzQWZ0ZXIodGltZU91dCkpIHtcclxuXHRcdFx0XHQvL+mAmuefpeWFtuS7lueoi+W6j+mAgOWHulxyXG5cdFx0XHRcdC8v5o6I5p2D5Yiw5pyf77yM6YCA5Ye6cG0y5Lit5omA5pyJ5pyN5YqhXHJcblx0XHRcdFx0ZXhlYyhcInBtMiBkZWxldGUgYWxsXCIsIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIltEQUVNT05d5o6I5p2D5Yiw5pyf77yM5pyN5Yqh6YCA5Ye6XCIpO1xyXG5cdFx0XHRcdFx0Ly/oh6rlt7HpgIDlh7pcclxuXHRcdFx0XHRcdHByb2Nlc3MuZXhpdCgpO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0c2V0VGltZW91dChMaWNlbnNlLmNoZWNrRG9nLCAxMDAwIC8qICogNjAgKiAxMCAqLyk7XHJcblx0fVxyXG5cdC8vdHVyZSDmnInmjojmnYPvvIxmYWxzZeaXoFxyXG5cdHN0YXRpYyBsaWNlbnNlKCkge1xyXG5cdFx0cmV0dXJuIExpY2Vuc2UuaGFzTGljZW5zZTtcclxuXHR9XHJcblx0Ly/kuIrmrKHlloLni5fml7bpl7TvvIzkuI3lupTor6XotoXov4fkuIDlsI/ml7bvvIzotoXov4forqTkuLrooqvniIbnoLTmjolcclxuXHRzdGF0aWMgZWF0VGltZSgpIHtcclxuXHRcdHJldHVybiBMaWNlbnNlLmVhdERvZ1RpbWVcclxuXHR9XHJcblx0c3RhdGljIGFzeW5jIHBhcnNlQ29udGVudChjb250ZW50KSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHQvL+S7o+eggeW5suaJsFxyXG5cdFx0XHRjb25zdCBrZXkxID0gJzl2QXB4TGs1RzNQQXNKck0nO1xyXG5cdFx0XHRjb25zdCBpdjEgPSAnRm5KTDdFRHpqcVdqY2FZOSc7XHJcblx0XHRcdC8v55yf5a6ea2V5XHJcblx0XHRcdGNvbnN0IGtleTIgPSAnOXZBcHhMTERGRVNYQ0M1RzNQQXNKck0nO1xyXG5cdFx0XHRjb25zdCBpdjIgPSAnRm5KTDdFZGtmYWxkc2ZqOSc7XHJcblx0XHRcdGxldCBwY2lkID0gYXdhaXQgTGljZW5zZS5nZXRQY2lkKCk7XHJcblx0XHRcdGlmIChwY2lkID4gMCkge1xyXG5cdFx0XHRcdGxldCBsaWNlbnNlID0gTGljZW5zZS5kZVNpZ24oY29udGVudCwgcGNpZC50b1N0cmluZygpLCBpdjIpO1xyXG5cdFx0XHRcdExpY2Vuc2UuZG9nSW5mbyA9IEpTT04ucGFyc2UobGljZW5zZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdH1cclxuXHR9XHJcblx0c3RhdGljIGFzeW5jIGdldFBjaWQoKSB7XHJcblx0XHRpZiAoTGljZW5zZS5wY2lkID4gMCkge1xyXG5cdFx0XHRyZXR1cm4gTGljZW5zZS5wY2lkO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gY29udmVydFN0cmluZ1RvSW50KGNvbnRlbnQsIGlzZGlzayA9IHRydWUpIHtcclxuXHRcdFx0Ly/mnIDlpKc2MOWtl+esplxyXG5cdFx0XHRpZiAoY29udGVudC5sZW5ndGggPiA2MCkge1xyXG5cdFx0XHRcdGNvbnRlbnQgPSBjb250ZW50LnN1YnN0cmluZygwLCA2MCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGlkID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Ly/noaznm5jlrZfnrKbkuLLplb/vvIwqMu+8jOWQpuWImeWPr+iDvea6ouWHuu+8jG1hY+eUseS6juWbuuWumu+8jOW5tuS4lOmVv+W6pui+g+efrSoxMFxyXG5cdFx0XHRcdGlkICo9IGlzZGlzayA/IDIgOiA5O1xyXG5cdFx0XHRcdHN3aXRjaCAoY29udGVudC5jaGFyQXQoaSkpIHtcclxuXHRcdFx0XHRcdGNhc2UgJzAnOiBpZCArPSAwOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzEnOiBpZCArPSAxOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzInOiBpZCArPSAyOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzMnOiBpZCArPSAzOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzQnOiBpZCArPSA0OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzUnOiBpZCArPSA1OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzYnOiBpZCArPSA2OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzcnOiBpZCArPSA3OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzgnOiBpZCArPSA4OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJzknOiBpZCArPSA5OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2EnOiBjYXNlICdBJzogaWQgKz0gMTA7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYic6IGNhc2UgJ0InOiBpZCArPSAxMTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdjJzogY2FzZSAnQyc6IGlkICs9IDEyOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2QnOiBjYXNlICdEJzogaWQgKz0gMTM7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnZSc6IGNhc2UgJ0UnOiBpZCArPSAxNDsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdmJzogY2FzZSAnRic6IGlkICs9IDE1OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2cnOiBjYXNlICdHJzogaWQgKz0gMTY7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnaCc6IGNhc2UgJ0gnOiBpZCArPSAxNzsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdpJzogY2FzZSAnSSc6IGlkICs9IDE4OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2onOiBjYXNlICdKJzogaWQgKz0gMTk7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnayc6IGNhc2UgJ0snOiBpZCArPSAyMDsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdsJzogY2FzZSAnTCc6IGlkICs9IDIxOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ20nOiBjYXNlICdNJzogaWQgKz0gMjI7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbic6IGNhc2UgJ04nOiBpZCArPSAyMzsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdvJzogY2FzZSAnTyc6IGlkICs9IDI0OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3AnOiBjYXNlICdQJzogaWQgKz0gMjU7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncSc6IGNhc2UgJ1EnOiBpZCArPSAyNjsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyJzogY2FzZSAnUic6IGlkICs9IDI3OyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3MnOiBjYXNlICdTJzogaWQgKz0gMjg7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndCc6IGNhc2UgJ1QnOiBpZCArPSAyOTsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1JzogY2FzZSAnVSc6IGlkICs9IDMwOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3YnOiBjYXNlICdWJzogaWQgKz0gMzE7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndyc6IGNhc2UgJ1cnOiBpZCArPSAzMjsgYnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd4JzogY2FzZSAnWCc6IGlkICs9IDMzOyBicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3knOiBjYXNlICdZJzogaWQgKz0gMzQ7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAneic6IGNhc2UgJ1onOiBpZCArPSAzNTsgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlkID0gTWF0aC5hYnMoaWQpO1xyXG5cdFx0XHRpZiAoaWQgPiAyNjg0MzU0NTUpIHtcclxuXHRcdFx0XHRpZCAlPSAyNjg0MzU0NTZcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGlzayA9IGF3YWl0IHNpLmRpc2tMYXlvdXQoKTtcclxuXHRcdFx0aWYgKGRpc2subGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdC8vd2luNyDml6Dms5Xmi7/liLDnoaznm5ggd2luMTDlj6/ku6VcclxuXHRcdFx0XHQvL+WPluesrOS4gOS4quehrOebmFxyXG5cdFx0XHRcdExpY2Vuc2UucGNpZCA9IGNvbnZlcnRTdHJpbmdUb0ludChkaXNrWzBdLm5hbWUgKyBkaXNrWzBdLmZpcm13YXJlUmV2aXNpb24gKyBkaXNrWzBdLnNlcmlhbE51bSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly/noaznm5jlpLHotKXmn6Xor6JtYWNcclxuXHRcdFx0aWYgKExpY2Vuc2UucGNpZCA8PSAwKSB7XHJcblx0XHRcdFx0bGV0IGRlZmF1bHROZXROYW1lID0gYXdhaXQgc2kubmV0d29ya0ludGVyZmFjZURlZmF1bHQoKTtcclxuXHRcdFx0XHRsZXQgbmV0TGlzdCA9IGF3YWl0IHNpLm5ldHdvcmtJbnRlcmZhY2VzKCk7XHJcblx0XHRcdFx0bGV0IGRlZmF1bHROZXQgPSBuZXRMaXN0LmZpbmQoKG5ldHdvcmspID0+IHtcclxuXHRcdFx0XHRcdGlmIChuZXR3b3JrLmlmYWNlID09IGRlZmF1bHROZXROYW1lIHx8IG5ldHdvcmsuaWZhY2VOYW1lID09IGRlZmF1bHROZXROYW1lKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmICghZGVmYXVsdE5ldCkge1xyXG5cdFx0XHRcdFx0Ly/msqHmnInmib7liLDpu5jorqTnmoTvvIzlj5bnrKzkuIDkuKrvvIzlpoLmnpzmnInnmoTor51cclxuXHRcdFx0XHRcdGlmIChuZXRMaXN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdE5ldCA9IG5ldExpc3RbMF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdExpY2Vuc2UucGNpZCA9IGNvbnZlcnRTdHJpbmdUb0ludChkZWZhdWx0TmV0Lm1hYywgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc29sdmUoTGljZW5zZS5wY2lkKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvL+WKoOWvhlxyXG5cdHN0YXRpYyBnZW5TaWduKHNyYywga2V5LCBpdikge1xyXG5cdFx0Ly8gbGV0IHNpZ24gPSAnJztcclxuXHRcdC8vIGNvbnN0IGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTEyOC1jYmMnLCBrZXksIGl2KTtcclxuXHRcdC8vIHNpZ24gKz0gY2lwaGVyLnVwZGF0ZShzcmMsICd1dGY4JywgJ2hleCcpO1xyXG5cdFx0Ly8gc2lnbiArPSBjaXBoZXIuZmluYWwoJ2hleCcpO1xyXG5cdFx0Ly8gcmV0dXJuIHNpZ247XHJcblx0XHRjb25zdCBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyKCdhZXMxOTInLCBrZXkpO1xyXG5cdFx0dmFyIGNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHNyYywgJ3V0ZjgnLCAnaGV4Jyk7XHJcblx0XHRjcnlwdGVkICs9IGNpcGhlci5maW5hbCgnaGV4Jyk7XHJcblx0XHRyZXR1cm4gY3J5cHRlZDtcclxuXHJcblx0fVxyXG5cdC8vIOino+WvhlxyXG5cdHN0YXRpYyBkZVNpZ24oc2lnbiwga2V5LCBpdikge1xyXG5cdFx0Ly8gbGV0IHNyYyA9ICcnO1xyXG5cdFx0Ly8gY29uc3QgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0xMjgtY2JjJywga2V5LCBpdik7XHJcblx0XHQvLyBzcmMgKz0gY2lwaGVyLnVwZGF0ZShzaWduLCAnaGV4JywgJ3V0ZjgnKTtcclxuXHRcdC8vIHNyYyArPSBjaXBoZXIuZmluYWwoJ3V0ZjgnKTtcclxuXHRcdC8vIHJldHVybiBzcmM7XHJcblx0XHRjb25zdCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcignYWVzMTkyJywga2V5KTtcclxuXHRcdHZhciBkZWNyeXB0ZWQgPSBkZWNpcGhlci51cGRhdGUoc2lnbiwgJ2hleCcsICd1dGY4Jyk7XHJcblx0XHRkZWNyeXB0ZWQgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKTtcclxuXHRcdHJldHVybiBkZWNyeXB0ZWQ7XHJcblxyXG5cdH1cclxufVxyXG4vL+acjeWKoeeahOWQr+WKqOaXtumXtFxyXG5MaWNlbnNlLnN0YXJ0VGltZSA9IHt9O1xyXG5MaWNlbnNlLmhhc0xpY2Vuc2UgPSBmYWxzZTtcclxuLy/pmLLmraLniIbnoLTvvIzlloLni5fml7bpl7RcclxuTGljZW5zZS5lYXREb2dUaW1lID0ge307XHJcbi8v5o6I5p2D5L+h5oGvXHJcbkxpY2Vuc2UuZG9nSW5mbyA9IHt9O1xyXG5MaWNlbnNlLnBjaWQgPSAwO1xyXG5tb2R1bGUuZXhwb3J0cyA9IExpY2Vuc2U7XHJcbm1vZHVsZS5leHBvcnRzLkxpY2Vuc2UgPSBMaWNlbnNlO1xyXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gTGljZW5zZTsiLCIvKlxyXG4gICAg5Yib5bu65Lq6OnpoYW5nd2ZcclxuICAgIOS9nOeUqDrpm4bnvqTml6Xlv5fnm7jlhbPmk43kvZxcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgY2xhc3MgbG9nTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICB9IFxyXG59KCk7IiwiLypcclxuICAgIOWIm+W7uuS6ujp6aGFuZ3dmXHJcbiAgICDkvZznlKg655So5LqO5ZG95Luk5ZON5bqUXHJcbiovXHJcbmNvbnN0IHsgZXhlY1N5bmMgfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5jb25zdCBQZ0RhZW1vbiA9IHJlcXVpcmUoJy4vcGctZGFlbW9uJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBjbGFzcyBNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBpbml0KCkge1xyXG4gICAgICAgIGF3YWl0IExpY2Vuc2UuaW5pdCgpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc3RhcnRTdWJzZXJ2aWNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0UmVhbFNlcnZlckluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZSh7IFwibmFtZVwiOiBcImRkXCIgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc3RhcnRTdWJzZXJ2aWNlKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8v5Zyo5q2k5ZCv5Yqo5LiL5bGe5pyN5YqhXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOW8gOWni+mAmuefpeWtkOacjeWKoeWQr+WKqGApO1xyXG4gICAgICAgICAgICAvL3Bvc3RncmVzdC1zcWzlkK/liqjnm7jlhbNcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIske3Byb2Nlc3MucGlkfV0g5a2Q5pyN5Yqh77yacG9zdGdyZS1zcWwg5bey5o6I5p2DLOW8gOWni+WQr+WKqGApO1xyXG4gICAgICAgICAgICBjb25zdCBwZ0RhZW1vbiA9IG5ldyBQZ0RhZW1vbihfX2RlYnVnKTtcclxuICAgICAgICAgICAgbGV0IGlzQ29ubmVjdCA9IGF3YWl0IHBnRGFlbW9uLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGlmIChpc0Nvbm5lY3QgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIHBvc3RncmUtc3FsIOWQr+WKqOWksei0pSzlkK/liqjov4fnqIvlgZzmraLvvIzor7fmo4Dmn6XphY3nva7kv6Hmga/lkI7ph43mlrDlkK/liqjvvIFgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTi3kuLsg6L+bIOeoiyR7cHJvY2Vzcy5waWR9XSBwb3N0Z3JlLXNxbOWQr+WKqOWujOaIkGApO1xyXG4gICAgICAgICAgICAvL+aOiOadg+S/oeaBr+mqjOivgVxyXG4gICAgICAgICAgICBpZiAoKExpY2Vuc2UgJiYgTGljZW5zZS5kb2dJbmZvKSAmJiBMaWNlbnNlLmRvZ0luZm8uc2VydmVyID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIske3Byb2Nlc3MucGlkfV0g5rKh5pyJ5pyN5Yqh56uv55u45YWz5o6I5p2DLOWQr+WKqOWujOaIkGApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v55Sf5oiQ6YWN572u5paH5Lu25aS5XHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhcIi4vY29uZmlnXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoXCIuL2NvbmZpZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RPRE8gcmVhbFNlcnZlcuS4jnNxbFNlcnZlcuadg+mZkOaaguaXtuiBmumbhuWcqOS4gOWdl++8jOS7peWQjuWGjeWBmuaLhuWIhlxyXG4gICAgICAgICAgICBpZiAoKGZzLmV4aXN0c1N5bmMoXCJyZWFsLXNlcnZlci5qc1wiKSAmJiBMaWNlbnNlLmRvZ0luZm8uc2VydmVyLnJlYWxTZXJ2ZXIpIHx8XHJcbiAgICAgICAgICAgICAgICAoTGljZW5zZS5kb2dJbmZvLnNlcnZlci5yZWFsU2VydmVyICYmIF9fZGVidWcgIT09ICcnKSB8fFxyXG4gICAgICAgICAgICAgICAgKGZzLmV4aXN0c1N5bmMoXCJzcWwtc2VydmVyLmpzXCIpICYmIExpY2Vuc2UuZG9nSW5mby5zZXJ2ZXIuc3FsU2VydmVyKSB8fFxyXG4gICAgICAgICAgICAgICAgKExpY2Vuc2UuZG9nSW5mby5zZXJ2ZXIuc3FsU2VydmVyICYmIF9fZGVidWcgIT09ICcnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIske3Byb2Nlc3MucGlkfV0g5a2Q5pyN5Yqh77yacmVhbC1zZXJ2ZXLkuI5zcWwtc2VydmVyIOW3suaOiOadgyzlvIDlp4vlkK/liqhgKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb21EYXRhU291cmNlQXJyID0gYXdhaXQgdGhpcy5nZXRBbGxDb21EYXRhU291cmNlcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNtZExpbmVBcnIgPSBhd2FpdCB0aGlzLnNwbGljZUNtZExpbmUoY29tRGF0YVNvdXJjZUFycik7XHJcbiAgICAgICAgICAgICAgICAvL+WQr+WKqOaVsOaNrua6kFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGFTb3VyY2UoY21kTGluZUFycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTi3kuLsg6L+bIOeoiyR7cHJvY2Vzcy5waWR9XSDlrZDmnI3liqHvvJpyZWFsLXNlcnZlcuS4jnNxbC1zZXJ2ZXIg5peg5o6I5p2DYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoZnMuZXhpc3RzU3luYyhcImRhdGEtc2VydmVyLmpzXCIpICYmIExpY2Vuc2UuZG9nSW5mby5zZXJ2ZXIuZGF0YVNlcnZlcikgfHxcclxuICAgICAgICAgICAgICAgIChMaWNlbnNlLmRvZ0luZm8uc2VydmVyLmRhdGFTZXJ2ZXIgJiYgX19kZWJ1ZyAhPT0gJycpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTi3kuLsg6L+bIOeoiyR7cHJvY2Vzcy5waWR9XSDlrZDmnI3liqHvvJpkYXRhLXNlcnZlciDlt7LmjojmnYMs5byA5aeL5ZCv5YqoYCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gJy4vZGF0YS1zZXJ2ZXIuanMnO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9fZGVidWcgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0ID0gJy4uL2RhdGEtc2VydmVyL2Jpbi93d3cuanMnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHBtMkNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcImFwcHNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJkYXRhLXNlcnZlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjd2RcIjogXCIuL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzY3JpcHRcIjogYCR7c2NyaXB0fWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxvZ19kYXRlX2Zvcm1hdFwiOiBcIllZWVktTU0tREQgSEg6bW06c3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JfZmlsZVwiOiBgLi9sb2dzL2RhdGEtc2VydmVyLWVycm9yLmxvZ2AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm91dF9maWxlXCI6IGAuL2xvZ3MvZGF0YS1zZXJ2ZXItbG9nLmxvZ2AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1heF9tZW1vcnlfcmVzdGFydFwiOiBcIjFHXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlRmlsZVN5bmMoXCIuL2NvbmZpZy9kYXRhLXNlcnZlci5qc29uXCIsIEpTT04uc3RyaW5naWZ5KHBtMkNvbmZpZykpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zdGFydFNlcnZlcihgcG0yIHN0YXJ0IC4vY29uZmlnL2RhdGEtc2VydmVyLmpzb25gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOWtkOacjeWKoe+8mmRhdGEtc2VydmVyIOaXoOaOiOadg2ApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhcImlvLWVydmVyLmpzXCIpICYmIExpY2Vuc2UuZG9nSW5mby5zeXN0ZW0uaW9TZXJ2ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOWtkOacjeWKoe+8mmlvLWVydmVyIOW3suaOiOadgyzlvIDlp4vlkK/liqhgKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuc3RhcnRTZXJ2ZXIoXCJzdGFydCBub2RlIGlvLWVydmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOWtkOacjeWKoe+8mmlvLWVydmVyIOaXoOaOiOadg2ApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhcImFpLWVydmVyLmpzXCIpICYmIExpY2Vuc2UuZG9nSW5mby5zeXN0ZW0uYWlTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOWtkOacjeWKoe+8mmFpLWVydmVyIOW3suaOiOadgyzlvIDlp4vlkK/liqhgKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuc3RhcnRTZXJ2ZXIoXCJzdGFydCBub2RlIGFpLWVydmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLJHtwcm9jZXNzLnBpZH1dIOWtkOacjeWKoe+8mmFpLWVydmVyIOaXoOaOiOadg2ApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUseWRveS7pOWQr+WKqOacjeWKoVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNtZCDlkb3ku6RcclxuICAgICAqL1xyXG4gICAgc3RhcnRTZXJ2ZXIoY21kKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZXhlY1N5bmMoY21kKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFrOWPuOaJgOacieeahOaVsOaNrua6kFxyXG4gICAgICogQHJldHVybnMg5aSE55CG5aW955qE5pWw5o2u5rqQb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEFsbENvbURhdGFTb3VyY2VzKCkge1xyXG4gICAgICAgIGxldCByZXFVcmwgPSBgaHR0cDovLyR7Y29uZmlnLnBnc3FsLnBnc3FsSXB9OiR7Y29uZmlnLnBnc3FsLnBnc3FsUG9ydH0vY29tcGFueXNgO1xyXG4gICAgICAgIGxldCBhbGxDb21wYW55cyA9IGF3YWl0IHRoaXMucmVxdWVzdEdldChyZXFVcmwpO1xyXG4gICAgICAgIC8v5pWw5o2u5rqQ5pWw57uEXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VBcnIgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbENvbXBhbnlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJDb21wYW55ID0gYWxsQ29tcGFueXNbaV07XHJcbiAgICAgICAgICAgIGlmIChjdXJDb21wYW55LmV4dGVuZCA9PT0gbnVsbCkgY29udGludWU7XHJcbiAgICAgICAgICAgIC8v5pWw5o2u5rqQXHJcbiAgICAgICAgICAgIGxldCBhbGxEYXRhU291cmNlID0gY3VyQ29tcGFueVtcImV4dGVuZFwiXVtcImRhdGFTb3VyY2VcIl07XHJcbiAgICAgICAgICAgIGlmIChhbGxEYXRhU291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFsbERhdGFTb3VyY2UubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YVNvdXJjZSA9IGFsbERhdGFTb3VyY2Vbal07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRzT2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YVNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVNvdXJjZVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkc09ialtrZXldID0gZGF0YVNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNvdXJjZUFyci5wdXNoKGRzT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2VBcnI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIVFRQIEdFVFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCDor7fmsYJ1cmxcclxuICAgICAqL1xyXG4gICAgcmVxdWVzdEdldCh1cmwpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXF1ZXN0LmdldCh7IHVybCwganNvbjogdHJ1ZSB9LCAoZXJyLCByZXNwb25jZSwgYm9keSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbmNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYm9keSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChib2R5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi7zmjqXlkK/liqjlkb3ku6RcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFTb3VyY2VBcnIg5pWw5o2u5rqQXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGxhdGZvcm0g5bmz5Y+w57G75Z6LXHJcbiAgICAgKi9cclxuICAgIHNwbGljZUNtZExpbmUoZGF0YVNvdXJjZUFyciwgcGxhdGZvcm0pIHtcclxuICAgICAgICBsZXQgY21kTGluZUFyciA9IFtdO1xyXG4gICAgICAgIC8v6ZyA6KaB5ou85o6l5Y+C5pWw57G75Z6LXHJcbiAgICAgICAgbGV0IG5lZWRUeXBlID0gW1wicHM2XCIsIFwiZWY1XCIsIFwiZmM3XCIsIFwibXlzcWxcIiwgXCJtc3NxbFwiLCBcIm9yYWNsZVwiLCBcInBnc3FsXCJdO1xyXG4gICAgICAgIC8v5ZCv5Yqo5pWw5o2u5rqQ6ZyA6KaB55qE5Y+C5pWwXHJcbiAgICAgICAgbGV0IG5lZWRQYXJhbSA9IFtcIm5hbWVcIiwgXCJ0eXBlXCIsIFwiaXBcIiwgXCJwb3J0XCIsIFwidXNlcm5hbWVcIiwgXCJwYXNzd29yZFwiLCBcImRhdGFiYXNlXCJdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVNvdXJjZUFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY3VyRGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VBcnJbaV07XHJcbiAgICAgICAgICAgIGlmIChuZWVkVHlwZS5pbmRleE9mKGN1ckRhdGFTb3VyY2VbXCJ0eXBlXCJdKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL+i/h+a7pOi1sOS4jemcgOimgeeahOWPguaVsFxyXG4gICAgICAgICAgICAgICAgbGV0IGZpbHRlclBhcmFtID0ge307XHJcbiAgICAgICAgICAgICAgICAvL+WwhuaVsOaNrua6kOWQjeensOW8uuWItui9rOS4uuWwj+WGmVxyXG4gICAgICAgICAgICAgICAgY3VyRGF0YVNvdXJjZVtcIm5hbWVcIl0gPSBjdXJEYXRhU291cmNlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGN1ckRhdGFTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmVlZFBhcmFtLmluZGV4T2Yoa2V5KSA+PSAwICYmIGN1ckRhdGFTb3VyY2Vba2V5XSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJQYXJhbVtrZXldID0gY3VyRGF0YVNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNtZExpbmVBcnIucHVzaChmaWx0ZXJQYXJhbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNtZExpbmVBcnI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkK/liqjmlbDmja7mupBcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGNtZExpbmVBcnIg5ZCv5Yqo5ZG95Luk5pWw57uEXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0RGF0YVNvdXJjZShjbWRMaW5lQXJyKSB7XHJcbiAgICAgICAgLy9yZWFsU2VydmVyXHJcbiAgICAgICAgbGV0IHJlYWxUeXBlID0gW1wicHM2XCIsIFwiZWY1XCIsIFwiZmM3XCJdO1xyXG4gICAgICAgIC8vc3FsU2VydmVyXHJcbiAgICAgICAgbGV0IHJlbGF0aW9uVHlwZSA9IFtcIm15c3FsXCIsIFwibXNzcWxcIiwgXCJvcmFjbGVcIiwgXCJwZ3NxbFwiXTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNtZExpbmVBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbWRMaW5lID0gY21kTGluZUFycltpXTtcclxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgLy9yZWFsU2VydmVyXHJcbiAgICAgICAgICAgICAgICBpZiAocmVhbFR5cGUuaW5kZXhPZihjbWRMaW5lLnR5cGUpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JpcHQgPSBcIi4vcmVhbC1zZXJ2ZXIuanNcIjtcclxuICAgICAgICAgICAgICAgICAgICAvL+W8gOWPkeeOr+Wig1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfX2RlYnVnICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdCA9IFwiLi4vcmVhbC1zZXJ2ZXIvYmluL3d3dy5qc1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vc3FsU2VydmVyXHJcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25UeXBlLmluZGV4T2YoY21kTGluZS50eXBlKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0ID0gXCIuL3NxbC1zZXJ2ZXIuanNcIjtcclxuICAgICAgICAgICAgICAgICAgICAvL+W8gOWPkeeOr+Wig1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfX2RlYnVnICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdCA9IFwiLi4vc3FsLXNlcnZlci9iaW4vd3d3LmpzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHBtMkNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcImFwcHNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogY21kTGluZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjd2RcIjogXCIuL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGNtZExpbmVBcnJbaV0pKS50b1N0cmluZygnYmFzZTY0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNjcmlwdFwiOiBgJHtzY3JpcHR9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibG9nX2RhdGVfZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvcl9maWxlXCI6IGAuL2xvZ3MvJHtjbWRMaW5lLm5hbWV9LWVycm9yLmxvZ2AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm91dF9maWxlXCI6IGAuL2xvZ3MvJHtjbWRMaW5lLm5hbWV9LWxvZy5sb2dgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtYXhfbWVtb3J5X3Jlc3RhcnRcIjogXCIxR1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGAuL2NvbmZpZy8ke2NtZExpbmUubmFtZX0uanNvbmAsIEpTT04uc3RyaW5naWZ5KHBtMkNvbmZpZykpO1xyXG4gICAgICAgICAgICAgICAgLy/pgJrov4dwbTLlkK/liqhyZWFsU2VydmVyXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGBwbTIgc3RhcnQgLi9jb25maWcvJHtjbWRMaW5lLm5hbWV9Lmpzb25gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvL+aKm+WHuumUmeivr++8jOe7n+S4gOeUseS4iuWxgnRyeS4uY2F0Y2jlpITnkIZcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJUeXBlKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVSZWFsKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVSZWFsKGN0eCwgbmV4dCkge1xyXG5cclxuICAgIH1cclxufSgpOyIsInZhciB7IGV4ZWMsIGV4ZWNGaWxlIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XHJcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGdEYWVtb24ge1xyXG4gICAgY29uc3RydWN0b3IoZGVidWcpIHtcclxuICAgICAgICB0aGlzLmRlYnVnID0gZGVidWc7XHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVBnc3FsQ2ZnKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOeUn+aIkHBnc3Fs6YWN572u5paH5Lu2XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVBnc3FsQ2ZnKCkge1xyXG4gICAgICAgIGxldCBwZ0NmZyA9IGNvbmZpZy5wZ3NxbDtcclxuICAgICAgICBsZXQgY2ZnU3RyID0gXCJcIjtcclxuICAgICAgICBjZmdTdHIgKz0gYGRiLXVyaSA9IFwicG9zdGdyZXM6Ly8ke3BnQ2ZnLnVzZXJuYW1lfToke3BnQ2ZnLnBhc3N3b3JkfUAke3BnQ2ZnLnBnc3FsSXB9OjU0MzIvJHtwZ0NmZy5uYW1lfVwiXFxuYDtcclxuICAgICAgICBjZmdTdHIgKz0gYGRiLXNjaGVtYSA9IFwicHVibGljXCJcXG5gO1xyXG4gICAgICAgIGNmZ1N0ciArPSBgZGItYW5vbi1yb2xlID0gXCJwb3N0Z3Jlc1wiXFxuYDtcclxuICAgICAgICBjZmdTdHIgKz0gYHNlcnZlci1ob3N0ID0gXCIwLjAuMC4wXCJcXG5gO1xyXG4gICAgICAgIGNmZ1N0ciArPSBgc2VydmVyLXBvcnQgPSAke3BnQ2ZnLnBnc3FsUG9ydH1gO1xyXG4gICAgICAgIGxldCB0YXJnZXRQYXRoID0gXCJcIjtcclxuICAgICAgICAvL+W5s+WPsOW3ruW8glxyXG4gICAgICAgIHN3aXRjaCAocHJvY2Vzcy5wbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICBjYXNlIFwid2luMzJcIjpcclxuICAgICAgICAgICAgY2FzZSBcImRhcndpblwiOlxyXG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuYXJjaCA9PSBcImlhMzJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFBhdGggPSBcIi4uL3dpbjMyL1wiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRQYXRoID0gXCIuLi94NjQvXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImxpbnV4XCI6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRQYXRoID0gXCIuLi9saW51eC9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWl4XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJmcmVlYnNkXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJvcGVuYnNkXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdW5vc1wiOlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmmoLkuI3mlK/mjIE6JHtwcm9jZXNzLnBsYXRmb3JtfWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCB0YXJnZXRQYXRoKTtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0YXJnZXRQYXRoICs9ICdkZWZhdWx0U2VydmVyLmNvbmYnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5q2j5byP546v5aKDXHJcbiAgICAgICAgICAgIHRhcmdldFBhdGggPSAnZGVmYXVsdFNlcnZlci5jb25mJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJnZXRQYXRoLCBjZmdTdHIpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDkuI3orrogcG9zdGdyZXN0LmV4ZSDmmK/lkKbmraPlnKjov5DooYzjgILpg73miafooYzkuIDmrKHlgZzmraJcclxuICAgICAqL1xyXG4gICAgYXN5bmMgc3RvcFBvc3RncmVzdCgpIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY21kID0gXCJcIjtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm9jZXNzLnBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwid2luMzJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXJ3aW5cIjpcclxuICAgICAgICAgICAgICAgICAgICBjbWQgPSBcInRhc2traWxsIC9mIC9pbSBwb3N0Z3Jlc3QuZXhlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibGludXhcIjpcclxuICAgICAgICAgICAgICAgICAgICBjbWQgPSBcImtpbGxhbGwgcG9zdGdyZXN0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYWl4XCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZnJlZWJzZFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm9wZW5ic2RcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdW5vc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5pqC5LiN5pSv5oyBOiR7cHJvY2Vzcy5wbGF0Zm9ybX1gKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24gKGVyciwgc3Rkb3V0LCBzdGRlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0b3BQb3N0Z3Jlc3QoKTtcclxuICAgICAgICAgICAgbGV0IHdvcmtlclBhdGggPSBhd2FpdCB0aGlzLmdldFdvcmtlclBhdGgoKTtcclxuICAgICAgICAgICAgY29uc3QgYnVpbGQgPSBleGVjKFwicG9zdGdyZXN0IGRlZmF1bHRTZXJ2ZXIuY29uZlwiLCB7IGN3ZDogd29ya2VyUGF0aCB9LCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIsgJHtwcm9jZXNzLnBpZH1dIOW3peeoi+acjeWKoeWZqOmHjeWQr2ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFFTU9OLeS4uyDov5sg56iLICR7cHJvY2Vzcy5waWR9XSAke2Vycn1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzdGRlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTi3kuLsg6L+bIOeoiyAke3Byb2Nlc3MucGlkfV0gJHtzdGRlcnJ9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Rkb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIsgJHtwcm9jZXNzLnBpZH1dICR7c3Rkb3V0fWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxheWVkU3RhcnQoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3QgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaXNDb25uZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMDApO1xyXG4gICAgICAgICAgICBidWlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaW5kZXhPZihcIkNvbm5lY3Rpb24gc3VjY2Vzc2Z1bFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pc0Nvbm5lY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT04t5Li7IOi/myDnqIsgJHtwcm9jZXNzLnBpZH1dICR7ZGF0YX1gKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBkZWxheWVkU3RhcnQoKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICB9LCAyMDAwKVxyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0V29ya2VyUGF0aCgpIHtcclxuICAgICAgICB2YXIgd29ya2VyUGF0aCA9IFwiXCI7XHJcbiAgICAgICAgc3dpdGNoIChwcm9jZXNzLnBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3aW4zMlwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiZGFyd2luXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5hcmNoID09IFwiaWEzMlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya2VyUGF0aCA9IHRoaXMuZGVidWcgIT09IFwiXCIgPyBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi8uLi94NjQvXCIpIDogX19kaXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrZXJQYXRoID0gdGhpcy5kZWJ1ZyAhPT0gXCJcIiA/IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLy4uL3g2NC9cIikgOiBfX2Rpcm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImxpbnV4XCI6XHJcbiAgICAgICAgICAgICAgICB3b3JrZXJQYXRoID0gdGhpcy5kZWJ1ZyAhPT0gXCJcIiA/IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLy4uL2xpbnV4L1wiKSA6IF9fZGlybmFtZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWl4XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJmcmVlYnNkXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJvcGVuYnNkXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdW5vc1wiOlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmmoLkuI3mlK/mjIE6JHtwcm9jZXNzLnBsYXRmb3JtfWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB3b3JrZXJQYXRoO1xyXG4gICAgfVxyXG59IiwiLy/lrprkuYnnmoTlhajlsYDlj5jph49cclxuZ2xvYmFsLmF1dGhlbnRpY2F0aW9uID0gcmVxdWlyZSgnLi9hdXRoZW50aWNhdGlvbicpO1xyXG5nbG9iYWwuTGljZW5zZSA9IHJlcXVpcmUoJy4vbGljZW5zZScpO1xyXG5nbG9iYWwubG9nTWFuYWdlciA9IHJlcXVpcmUoJy4vbG9nLW1hbmFnZXInKTtcclxuZ2xvYmFsLm1hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXInKTtcclxuLy9yZWFsU2VydmVyXHJcbmdsb2JhbC5yZWFsU2VydmVyID0gbmV3IE9iamVjdCgpO1xyXG4vL2RhdGFTZXJ2ZXJcclxuZ2xvYmFsLmRhdGFTZXJ2ZXIgPSBuZXcgT2JqZWN0KCk7XHJcbi8vc3FsU2VydmVyXHJcbmdsb2JhbC5zcWxTZXJ2ZXIgPSBuZXcgT2JqZWN0KCk7IiwiY2xhc3MgQmFzZVNlcnZpY2VBcGkge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/lkITmnI3liqHpu5jorqTnq6/lj6NcclxuXHRcdHRoaXMuZGVmYXVsdFBvcnQgPSB7XHJcblx0XHRcdHJlYWxTZXJ2ZXI6IFszMDAxLCAzNDk5XSxcclxuXHRcdFx0ZGF0YVNlcnZlcjogWzM1MDAsIDM5OTldLFxyXG5cdFx0XHRzcWxTZXJ2ZXI6IFs0MDAxLCA0NDk5XSxcclxuXHRcdFx0aW9TZXJ2ZXI6IFs1MDAwLCA1NDk5XSxcclxuXHRcdFx0YWlTZXJ2ZXI6IFs1NTAwLCA1OTk5XVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8v5Y+v5L2/55So56uv5Y+jXHJcblx0Z2V0UG9ydChkYXRhLCBjdHgsIG5leHQpIHtcclxuXHRcdGxldCBkYWVtb25Db25maWcgPSBnbG9iYWwuY29uZmlnO1xyXG5cdFx0Ly9zZXJ2ZXLnsbvlnotcclxuXHRcdGxldCBzZXJ2ZXJUeXBlID0gZGF0YS5zZXJ2ZXJUeXBlO1xyXG5cdFx0bGV0IHNlcnZlckluZm9PYmogPSBnbG9iYWxbc2VydmVyVHlwZV07XHJcblx0XHQvL+err+WPo+iMg+WbtFxyXG5cdFx0bGV0IHBvcnRSYW5nZSA9IFtdO1xyXG5cdFx0Ly/phY3nva7nq6/lj6PkvJjlhYjkuo7pu5jorqTnq6/lj6NcclxuXHRcdGlmIChkYWVtb25Db25maWdbXCJkZWZhdWx0UG9ydFwiXVtzZXJ2ZXJUeXBlXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHBvcnRSYW5nZSA9IGRhZW1vbkNvbmZpZ1tzZXJ2ZXJUeXBlXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBvcnRSYW5nZSA9IHRoaXMuZGVmYXVsdFBvcnRbc2VydmVyVHlwZV1cclxuXHRcdH1cclxuXHRcdC8v5Y+v5L2/55So55qE56uv5Y+jXHJcblx0XHRsZXQgY2FuVXNlZFBvcnQgPSAwO1xyXG5cdFx0Ly/ntK/orqHkvb/nlKjnq6/lj6NcclxuXHRcdGxldCBjdXJQb3J0ID0gc2VydmVySW5mb09ialtcImN1clBvcnRcIl07XHJcblx0XHRpZiAoIWN1clBvcnQpIHtcclxuXHRcdFx0Y2FuVXNlZFBvcnQgPSBwb3J0UmFuZ2VbMF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjYW5Vc2VkUG9ydCA9IE51bWJlcihjdXJQb3J0KSArIDE7XHJcblx0XHR9XHJcblx0XHQvL+e0r+iuoeS9v+eUqOerr+WPo+WtmOWCqFxyXG5cdFx0c2VydmVySW5mb09ialtcImN1clBvcnRcIl0gPSBjYW5Vc2VkUG9ydDtcclxuXHRcdC8v56uv5Y+j6LaF6L+H6YWN572u6IyD5Zu0XHJcblx0XHRpZiAoY2FuVXNlZFBvcnQgPiBwb3J0UmFuZ2VbMV0pIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGDmnI3liqEke3NlcnZlclR5cGV9LOW9k+WJjee0r+iuoeS9v+eUqOerr+WPo+aYryR7Y3VyUG9ydH0s5bey6LaF6L+H6YWN572u6IyD5Zu077yB77yB77yBYCk7XHJcblx0XHR9XHJcblx0XHQvLyBjdHguc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuXHRcdGN0eC5ib2R5ID0geyBcInBvcnRcIjogY2FuVXNlZFBvcnQgfTtcclxuXHR9XHJcblxyXG5cdC8v57uZ5Li76L+b56iL5Y+R5raI5oGvXHJcblx0c2VuZE1zZ1RvTWFzdGVyKG1zZykge1xyXG5cdFx0cHJvY2Vzcy5zZW5kKG1zZyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VTZXJ2aWNlQXBpOyIsIi8qXHJcbiAgICDliJvlu7rkuro6emhhbmd3ZlxyXG4gICAg5L2c55SoOuacjeWKoemXtOmAmuiur++8jOagueaNruWPguaVsOWIhuWPkeS4jeWQjOacjeWKoVxyXG4qL1xyXG5jb25zdCBzZXJ2aWNlcmVhbEFwaSA9IHJlcXVpcmUoJy4vc2VydmljZS1yZWFsLWFwaScpO1xyXG5jb25zdCBzZXJ2aWNlRGF0YUFwaSA9IHJlcXVpcmUoJy4vc2VydmljZS1kYXRhLWFwaScpO1xyXG5jb25zdCBzZXJ2aWNlU3FsQXBpID0gcmVxdWlyZSgnLi9zZXJ2aWNlLXNxbC1hcGknKTtcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgY2xhc3MgU2VydmljZUFwaSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2VyZWFsQXBpID0gc2VydmljZXJlYWxBcGk7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlRGF0YUFwaSA9IHNlcnZpY2VEYXRhQXBpO1xyXG4gICAgICAgIHRoaXMuc2VydmljZVNxbEFwaSA9IHNlcnZpY2VTcWxBcGk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mjqXmlLZyZWFsLXNlcnZlcuacjeWKoea2iOaBr1xyXG4gICAgcmVhbChjdHgsIG5leHQpIHtcclxuICAgICAgICBsZXQgcG9zdFBhcmFtID0gY3R4LnJlcXVlc3QuYm9keTtcclxuICAgICAgICBpZiAodHlwZW9mIHBvc3RQYXJhbS50eXBlID09PSBcInN0cmluZ1wiICYmIHBvc3RQYXJhbS50eXBlICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlcmVhbEFwaVtwb3N0UGFyYW0udHlwZV0ocG9zdFBhcmFtLCBjdHgsIG5leHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDQwNCk7XHJcbiAgICAgICAgICAgIGN0eC5yZXNwb25zZS5zdGF0dXMgPSA0MDQ7XHJcbiAgICAgICAgICAgIGN0eC5yZXNwb25zZS5ib2R5ID0gcG9zdFBhcmFtLnR5cGUgKyBcIuaOpeWPo+S4jeWtmOWcqFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5o6l5pS2ZGF0YS1zZXJ2ZXLmnI3liqHmtojmga9cclxuICAgIGRhdGEoY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgbGV0IHBvc3RQYXJhbSA9IGN0eC5yZXF1ZXN0LmJvZHk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwb3N0UGFyYW0udHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBwb3N0UGFyYW0udHlwZSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZURhdGFBcGlbcG9zdFBhcmFtLnR5cGVdKHBvc3RQYXJhbSwgY3R4LCBuZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyg0MDQpO1xyXG4gICAgICAgICAgICBjdHgucmVzcG9uc2Uuc3RhdHVzID0gNDA0O1xyXG4gICAgICAgICAgICBjdHgucmVzcG9uc2UuYm9keSA9IHBvc3RQYXJhbS50eXBlICsgXCLmjqXlj6PkuI3lrZjlnKhcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL+aOpeaUtnNxbC1zZXJ2ZXLmnI3liqHmtojmga9cclxuICAgIHNxbChjdHgsIG5leHQpIHtcclxuICAgICAgICBsZXQgcG9zdFBhcmFtID0gY3R4LnJlcXVlc3QuYm9keTtcclxuICAgICAgICBpZiAodHlwZW9mIHBvc3RQYXJhbS50eXBlID09PSBcInN0cmluZ1wiICYmIHBvc3RQYXJhbS50eXBlICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlU3FsQXBpW3Bvc3RQYXJhbS50eXBlXShwb3N0UGFyYW0sIGN0eCwgbmV4dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coNDA0KTtcclxuICAgICAgICAgICAgY3R4LnJlc3BvbnNlLnN0YXR1cyA9IDQwNDtcclxuICAgICAgICAgICAgY3R4LnJlc3BvbnNlLmJvZHkgPSBwb3N0UGFyYW0udHlwZSArIFwi5o6l5Y+j5LiN5a2Y5ZyoXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5o6l5pS2aW8tc2VydmVy5pyN5Yqh5raI5oGvXHJcbiAgICBpbyhjdHgsIG5leHQpIHtcclxuICAgICAgICBjdHgucmVzcG9uc2Uuc3RhdHVzID0gNDA0O1xyXG4gICAgICAgIGN0eC5yZXNwb25zZS5ib2R5ID0gcmVxX3F1ZXJ5LnR5cGUgKyBcIuaaguaXoOmcgOimgeWkhOeQhueahOa2iOaBr1wiO1xyXG4gICAgfVxyXG4gICAgLy/mjqXmlLZhaS1zZXJ2ZXLmnI3liqHmtojmga9cclxuICAgIGFpKGN0eCwgbmV4dCkge1xyXG4gICAgICAgIGN0eC5yZXNwb25zZS5zdGF0dXMgPSA0MDQ7XHJcbiAgICAgICAgY3R4LnJlc3BvbnNlLmJvZHkgPSByZXFfcXVlcnkudHlwZSArIFwi5pqC5peg6ZyA6KaB5aSE55CG55qE5raI5oGvXCI7XHJcbiAgICB9XHJcbiAgICAvL+aOpeaUtnBnLXNlcnZlcuacjeWKoea2iOaBr1xyXG4gICAgcGdTcWwoY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgLy/mmoLml6DpnIDopoHlpITnkIbnmoTmtojmga8gXHJcbiAgICAgICAgY3R4LnJlc3BvbnNlLnN0YXR1cyA9IDQwNDtcclxuICAgICAgICBjdHgucmVzcG9uc2UuYm9keSA9IHJlcV9xdWVyeS50eXBlICsgXCLmmoLml6DpnIDopoHlpITnkIbnmoTmtojmga9cIjtcclxuICAgIH1cclxufSIsImNvbnN0IFNldmljZUFwaUJhc2UgPSByZXF1aXJlKCcuL3NlcnZpY2UtYXBpLWJhc2UnKTtcclxuXHJcbi8qKiBkYXRhLXNlcnZlcuacjeWKoSAqL1xyXG5jbGFzcyBTZXJ2aWNlRGF0YUFwaSBleHRlbmRzIFNldmljZUFwaUJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXBvcnQoZGF0YSwgY3R4LCBuZXh0KSB7XHJcbiAgICAgICAgbGV0IHNlcnZlckluZm9PYmogPSBnbG9iYWxbXCJkYXRhU2VydmVyXCJdO1xyXG4gICAgICAgIHNlcnZlckluZm9PYmpbXCJjdXJQb3J0XCJdID0gZGF0YS5jdXJVc2VQb3J0O1xyXG4gICAgICAgIC8v5Yib5bu6ZGF0YS1zZXJ2ZXLot6/nlLFcclxuICAgICAgICBjcmVhdGVEYXRhU2VydmVyUm91dGVyKGRhdGEuY3VyVXNlUG9ydCk7XHJcbiAgICAgICAgdGhpcy5zZW5kTXNnVG9NYXN0ZXIoe2FjdGlvbjogXCJ1cGRhdGVEYXRhU2VydmVyXCIsIGRhdGE6IHtuYW1lOiBkYXRhLnNlcnZlck5hbWUsIHBvcnQ6IGRhdGEuY3VyVXNlUG9ydH19KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTi3lt6XkvZzov5vnqIske3Byb2Nlc3MucGlkfV0gZGF0YS1zZXJ2ZXIg5ZCN56ewOiR7ZGF0YS5zZXJ2ZXJOYW1lfSznq6/lj6M6JHtkYXRhLmN1clVzZVBvcnR9IOWQr+WKqOaIkOWKn2ApO1xyXG4gICAgICAgIGN0eC5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGN0eC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoeyByZXN1bHQ6IHRydWUgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBzZXJ2aWNlRGF0YUFwaSA9IG51bGw7XHJcbmlmIChzZXJ2aWNlRGF0YUFwaSA9PT0gbnVsbCkge1xyXG4gICAgc2VydmljZURhdGFBcGkgPSBuZXcgU2VydmljZURhdGFBcGkoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXJ2aWNlRGF0YUFwaTsiLCJjb25zdCBTZXJ2ZXJBcGlCYXNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlLWFwaS1iYXNlJyk7XHJcbmNvbnN0IHsgY3JlYXRlUHJveHlNaWRkbGV3YXJlIH0gPSByZXF1aXJlKCdodHRwLXByb3h5LW1pZGRsZXdhcmUnKTtcclxuXHJcbi8qKiByZWFsLXNlcnZlcuacjeWKoSAqL1xyXG5jbGFzcyBTZXJ2aWNlUmVhbEFwaSBleHRlbmRzIFNlcnZlckFwaUJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHR9XHJcblxyXG5cdC8vcmVhbHNlcnZlcuerr+WPo+aKpeWRilxyXG5cdHJlcG9ydChkYXRhLCBjdHgsIG5leHQpIHtcclxuXHRcdGxldCBzZXJ2ZXJJbmZvT2JqID0gZ2xvYmFsW1wicmVhbFNlcnZlclwiXTtcclxuXHRcdHNlcnZlckluZm9PYmpbXCJjdXJQb3J0XCJdID0gZGF0YS5jdXJVc2VQb3J0O1xyXG5cdFx0c2VydmVySW5mb09ialtkYXRhLnNlcnZlck5hbWVdID0ge1xyXG5cdFx0XHRcInBvcnRcIjogZGF0YS5jdXJVc2VQb3J0LFxyXG5cdFx0XHRcInByb3h5XCI6IGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcblx0XHRcdFx0dGFyZ2V0OiBgd3M6Ly9sb2NhbGhvc3Q6JHtkYXRhLmN1clVzZVBvcnR9YCxcclxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXHJcblx0XHRcdFx0d3M6IHRydWVcclxuXHRcdFx0fSlcclxuXHRcdH07XHJcblx0XHQvL+WQkeS4u+i/m+eoi+aKpeWRinJlYWxTZXJ2ZXLlkI3np7Dku6Xlj4rnq6/lj6NcclxuXHRcdHRoaXMuc2VuZE1zZ1RvTWFzdGVyKHsgYWN0aW9uOiBcInVwZGF0ZVJlYWxTZXJ2ZXJcIiwgZGF0YToge25hbWU6IGRhdGEuc2VydmVyTmFtZSwgcG9ydDogZGF0YS5jdXJVc2VQb3J0fSB9KTtcclxuXHRcdGNyZWF0ZVByb3h5KHNlcnZlckluZm9PYmpbZGF0YS5zZXJ2ZXJOYW1lXSk7XHJcblx0XHRjb25zb2xlLmxvZyhgW0RBRU1PTl0t5bel5L2c6L+b56iLJHtwcm9jZXNzLnBpZH0gcmVhbC1zZXJ2ZXIg5ZCN56ewOiR7ZGF0YS5zZXJ2ZXJOYW1lfSznq6/lj6M6JHtkYXRhLmN1clVzZVBvcnR9IOWQr+WKqOaIkOWKn2ApO1xyXG5cdFx0Y3R4LnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcblx0XHRjdHguYm9keSA9IEpTT04uc3RyaW5naWZ5KHsgcmVzdWx0OiB0cnVlIH0pO1xyXG5cdH1cclxuXHJcblx0a2VlcEFsaXZlKGRhdGEsIGN0eCwgbmV4dCkge1xyXG5cdFx0Y3R4LnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcclxuXHRcdGN0eC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoeyBwb3J0OiA0MDAwIH0pXHJcblx0fVxyXG59XHJcblxyXG5sZXQgc2VydmljZVJlYWxBcGkgPSBudWxsO1xyXG5pZiAoc2VydmljZVJlYWxBcGkgPT09IG51bGwpIHtcclxuXHRzZXJ2aWNlUmVhbEFwaSA9IG5ldyBTZXJ2aWNlUmVhbEFwaSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNlcnZpY2VSZWFsQXBpOyIsImNvbnN0IFNlcnZpY2VBcGlCYXNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlLWFwaS1iYXNlJyk7XHJcbmNvbnN0IHsgY3JlYXRlUHJveHlNaWRkbGV3YXJlIH0gPSByZXF1aXJlKCdodHRwLXByb3h5LW1pZGRsZXdhcmUnKTtcclxuXHJcbmNsYXNzIFNlcnZpY2VTcWxBcGkgZXh0ZW5kcyBTZXJ2aWNlQXBpQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgLy9zcWxTZXJ2ZXLnq6/lj6PmiqXlkYpcclxuICAgIHJlcG9ydChkYXRhLCBjdHgsIG5leHQpIHtcclxuICAgICAgICBsZXQgc2VydmVySW5mb09iaiA9IGdsb2JhbFtcInNxbFNlcnZlclwiXTtcclxuICAgICAgICBzZXJ2ZXJJbmZvT2JqW1wiY3VyUG9ydFwiXSA9IGRhdGEuY3VyVXNlUG9ydDtcclxuICAgICAgICBzZXJ2ZXJJbmZvT2JqW2RhdGEuc2VydmVyTmFtZV0gPSB7XHJcbiAgICAgICAgICAgIFwicG9ydFwiOiBkYXRhLmN1clVzZVBvcnQsXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WIm+W7unNxbC1zZXJ2ZXLot6/nlLFcclxuICAgICAgICBjcmVhdGVTcWxTZXJ2ZXJSb3V0ZXIoZGF0YS5jdXJVc2VQb3J0LCBkYXRhLnNlcnZlck5hbWUpO1xyXG4gICAgICAgIC8v5ZCR5Li76L+b56iL5oql5ZGKc3FsU2VydmVy5ZCN56ew5Lul5Y+K56uv5Y+jXHJcbiAgICAgICAgdGhpcy5zZW5kTXNnVG9NYXN0ZXIoeyBhY3Rpb246IFwidXBkYXRlU3FsU2VydmVyXCIsIGRhdGE6IHsgbmFtZTogZGF0YS5zZXJ2ZXJOYW1lLCBwb3J0OiBkYXRhLmN1clVzZVBvcnQgfSB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW0RBRU1PTl0t5bel5L2c6L+b56iLJHtwcm9jZXNzLnBpZH0gc3FsLXNlcnZlciDlkI3np7A6JHtkYXRhLnNlcnZlck5hbWV9LOerr+WPozoke2RhdGEuY3VyVXNlUG9ydH0g5ZCv5Yqo5oiQ5YqfYCk7XHJcbiAgICAgICAgY3R4LmJvZHkgPSB7IHJlc3VsdDogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgc2VydmljZVNxbEFwaSA9IG51bGw7XHJcbmlmIChzZXJ2aWNlU3FsQXBpID09PSBudWxsKSB7XHJcbiAgICBzZXJ2aWNlU3FsQXBpID0gbmV3IFNlcnZpY2VTcWxBcGkoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXJ2aWNlU3FsQXBpOyIsImNvbnN0IHJvdXRlciA9IHJlcXVpcmUoJ2tvYS1yb3V0ZXInKSgpO1xyXG5jb25zdCB7IGNyZWF0ZVByb3h5TWlkZGxld2FyZSB9ID0gcmVxdWlyZSgnaHR0cC1wcm94eS1taWRkbGV3YXJlJyk7XHJcbmNvbnN0IGMyayA9IHJlcXVpcmUoJ2tvYTItY29ubmVjdCcpO1xyXG5jb25zdCBqd3QgPSByZXF1aXJlKCcuLi9saWJzL2p3dCcpO1xyXG5jb25zdCB1cmxpYiA9IHJlcXVpcmUoXCJ1cmxcIik7XHJcbmNvbnN0IHpsaWIgPSByZXF1aXJlKFwiemxpYlwiKTtcclxuXHJcbi8v6Lev5b6E5YmN57yAXHJcbnJvdXRlci5wcmVmaXgoJy9hcGl2MicpO1xyXG5cclxubGV0IGdldEJvZHkgPSAocHJveHlSZXMpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICBsZXQgYm9keSA9IFtdXHJcbiAgICAgICAgcHJveHlSZXMub24oJ2RhdGEnLCBmdW5jdGlvbiAoY2h1bmspIHtcclxuICAgICAgICAgICAgYm9keS5wdXNoKGNodW5rKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcHJveHlSZXMub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYm9keSA9IEJ1ZmZlci5jb25jYXQoYm9keSlcclxuICAgICAgICAgICAgcmVzb2x2ZShib2R5KVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5Luj55CG5YWz6Zet5LqL5Lu25aSE55CGXHJcbiAqL1xyXG5sZXQgb25DbG9zZSA9IGZ1bmN0aW9uIChyZXMsIHNvY2tldCwgaGVhZCkge1xyXG4gICAgcmVzLndyaXRlSGVhZCg1MDAsIHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nXHJcbiAgICB9KTtcclxuICAgIHJlcy5lbmQoJ+acjeWKoeWZqOWFs+mXrScpO1xyXG59O1xyXG4vKipcclxuICog5Luj55CG6ZSZ6K+v5LqL5Lu25aSE55CGXHJcbiAqL1xyXG5sZXQgb25FcnJvciA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XHJcbiAgICByZXMud3JpdGVIZWFkKDUwMCwge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbidcclxuICAgIH0pO1xyXG4gICAgcmVzLmVuZCgn5pyN5Yqh5Zmo5Luj55CG6ZSZ6K+vOicgKyBlcnIubWVzc2FnZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDku6PnkIbor7fmsYLkuovku7blpITnkIZcclxuICovXHJcbmxldCBvblByb3h5UmVxID0gKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xyXG4gICAgbGV0IGJvZHlEYXRhID0gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpO1xyXG4gICAgLy/ov5Tlm57kv67mlLnlkI7nmoTmlbDmja5cclxuICAgIHByb3h5UmVxLnNldEhlYWRlcihcIlByZWZlclwiLCBcInJldHVybj1yZXByZXNlbnRhdGlvblwiKTtcclxuICAgIC8v6YeN5paw6K6h566XY29udGVudC1sZW5ndGjlj4rlhpnlhaVib2R55pWw5o2uXHJcbiAgICBwcm94eVJlcS5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChib2R5RGF0YSkpO1xyXG4gICAgcHJveHlSZXEud3JpdGUoYm9keURhdGEpO1xyXG59XHJcblxyXG4vKipcclxuICog6Kej5Y6L5pWw5o2uXHJcbiAqL1xyXG5sZXQgcGFyc2VEYXRhID0gKGRhdGEpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgemxpYi51bnppcChkYXRhLCBmdW5jdGlvbiAoZXJyLCBidWZmZXIpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGB7XCJyZXN1bHRcIjpmYWxzZSxcImVycm9yXCI6XCLnlKjmiLfkv6Hmga/op6PljovnvKnlpLHotKVcIn1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdXNlcnMgPSBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgcmVzb2x2ZSh1c2Vycyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5a+55q+U5p2D6ZmQ77yM5Lul5Yqg5a+G54uX55qE5p2D6ZmQ5Li65YeGXHJcbiAqIEBwYXJhbSB7Kn0gZG9nUG93ZXIg5Yqg5a+G54uX5p2D6ZmQXHJcbiAqIEBwYXJhbSB7Kn0gcm9sZVBvd2VyIOaVsOaNruW6k+aLieWPlueahOadg+mZkFxyXG4gKiBAcGFyYW0geyp9IG5ld1Bvd2VyIOWKoOWvhueLl+adg+mZkOS4juaVsOaNruW6k+aLieWPluadg+mZkOS6pOmbhuWHuuadpeeahOWunumZheadg+mZkFxyXG4gKi9cclxubGV0IGNvbXBhcmVQb3dlciA9IChkb2dQb3dlciwgcm9sZVBvd2VyLCBuZXdQb3dlcikgPT4ge1xyXG4gICAgZm9yIChsZXQga2V5IGluIGRvZ1Bvd2VyKSB7XHJcbiAgICAgICAgbGV0IGN1cktleUxlbmd0aCA9IE9iamVjdC5rZXlzKGRvZ1Bvd2VyW2tleV0pLmxlbmd0aDtcclxuICAgICAgICBpZiAoY3VyS2V5TGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAvL+WIneWni+WMluaooeWdl+acrOi6q+adg+mZkFxyXG4gICAgICAgICAgICBuZXdQb3dlcltrZXldID0ge307XHJcbiAgICAgICAgICAgIGNvbXBhcmVQb3dlcihkb2dQb3dlcltrZXldLCByb2xlUG93ZXJba2V5XSwgbmV3UG93ZXJba2V5XSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+aooeWdl+acrOi6q+eahOadg+mZkFxyXG4gICAgICAgIGlmIChrZXkgPT09ICdlbmFibGUnKSB7XHJcbiAgICAgICAgICAgIG5ld1Bvd2VyWydlbmFibGUnXSA9IGRvZ1Bvd2VyWydlbmFibGUnXSAmJiByb2xlUG93ZXJbJ2VuYWJsZSddID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/ni5fkuK3nmoTmnYPpmZDlnKjmlbDmja7lupPmi4nlj5bnmoTmnYPpmZDkuK3kuI3lrZjlnKjvvIzkuI3lgZrlpITnkIZcclxuICAgICAgICBpZiAoIXJvbGVQb3dlcltrZXldKSBjb250aW51ZTtcclxuICAgICAgICAvL+WIneWni+WMluWtkOaooeWdl+adg+mZkOaVsOaNrlxyXG4gICAgICAgIG5ld1Bvd2VyW2tleV0gPSB7fTtcclxuICAgICAgICBuZXdQb3dlcltrZXldWydlbmFibGUnXSA9IGRvZ1Bvd2VyW2tleV1bJ2VuYWJsZSddICYmIHJvbGVQb3dlcltrZXldWydlbmFibGUnXSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXdQb3dlcjtcclxufVxyXG5cclxuLy/nlKjmiLfnmbvlvZXot6/nlLFcclxucm91dGVyLmdldCgnL2xvZ2luL3VzZXJzJywgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICB0YXJnZXQ6IGBodHRwOi8vJHtjb25maWcucGdzcWwucGdzcWxJcH06JHtjb25maWcucGdzcWwucGdzcWxQb3J0fWAsXHJcbiAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICBsb2dMZXZlbDogZ2xvYmFsLmNvbmZpZy5wcm94eUxvZ0xldmVsLFxyXG4gICAgc2VsZkhhbmRsZVJlc3BvbnNlOiB0cnVlLFxyXG4gICAgcGF0aFJld3JpdGU6IHsgJ14vYXBpdjIvbG9naW4nOiAnJyB9LFxyXG4gICAgb25Qcm94eVJlczogYXN5bmMgKHByb3h5UmVzLCByZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIC8v5bmz5Y+w566h55CG5ZGYSURcclxuICAgICAgICBjb25zdCBBRE1JTklEID0gXCI0OWQ1MzFkMC1hNDZkLTExZTktOWU4ZS1iZjY4NDAwMDAwMDFcIjtcclxuICAgICAgICAvL+iOt+WPluivt+axguWbnuadpeeahOS/oeaBr1xyXG4gICAgICAgIGxldCBkYXRhID0gYXdhaXQgZ2V0Qm9keShwcm94eVJlcyk7XHJcbiAgICAgICAgbGV0IHJldHVybkRhdGEgPSAnJztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL+ino+WOi+eUqOaIt+aVsOaNrlxyXG4gICAgICAgICAgICBsZXQgdXNlckRhdGEgPSBhd2FpdCBwYXJzZURhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIGxldCB1cmxEYXRhID0gdXJsaWIucGFyc2UocmVxLnVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxldCB1cmxVc2VyTmFtZSA9IHVybERhdGEucXVlcnkudXNlck5hbWUucmVwbGFjZSgvXmVxLi8sICcnKTtcclxuICAgICAgICAgICAgbGV0IHVybFBhc3N3b3JkID0gdXJsRGF0YS5xdWVyeS51c2VyUGFzc3dvcmQucmVwbGFjZSgvXmVxLi8sICcnKTtcclxuICAgICAgICAgICAgLy/lubPlj7DnrqHnkIblkZjmoIfor4ZcclxuICAgICAgICAgICAgbGV0IGlzQWRtaW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgLy/ov5Tlm57mlbDmja7kuLrnqbrmiJbogIXov5Tlm57mlbDmja7kuLrnrqHnkIblkZjotKblj7fvvIzljrvot5/ni5fph4znmoTotKblj7fku6Xlj4rlr4bnoIHlgZrlr7nmr5TvvIzku6Xni5fph4znmoTkv6Hmga/kuLrlh4ZcclxuICAgICAgICAgICAgaWYgKCF1c2VyRGF0YS5sZW5ndGggfHwgKHVzZXJEYXRhLmxlbmd0aCAmJiB1c2VyRGF0YVswXS5pZCA9PT0gQURNSU5JRCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh1cmxVc2VyTmFtZSAhPSBMaWNlbnNlLmRvZ0luZm8udXNlcmluZm8udXNlclxyXG4gICAgICAgICAgICAgICAgICAgIHx8IHVybFBhc3N3b3JkICE9IExpY2Vuc2UuZG9nSW5mby51c2VyaW5mby5wYXNzV29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybkRhdGEgPSBKU09OLnN0cmluZ2lmeSh7IFwicmVzdWx0XCI6IGZhbHNlLCBcImVycm9yXCI6IFwi55So5oi35ZCN5oiW5a+G56CB6ZSZ6K+vXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZChyZXR1cm5EYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpc0FkbWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL+WKoOWvhnRva2VuXHJcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IG5ldyBqd3QoTGljZW5zZS5wY2lkLnRvU3RyaW5nKCkpLmdlbmVyYXRlVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgdXNlck5hbWU6IHVybFVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgcGFzc1dvcmQ6IHVybFBhc3N3b3JkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3Rva2VuXHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJhdXRob3JpemF0aW9uXCIsIHRva2VuKTtcclxuICAgICAgICAgICAgLy/mmK/lkKbmmK/lubPlj7DnrqHnkIblkZjov5Tlm57kuI3lkIznmoTmlbDmja5cclxuICAgICAgICAgICAgaWYgKGlzQWRtaW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybkRhdGEgPSBKU09OLnN0cmluZ2lmeShbeyBcImlkXCI6IFwiNDlkNTMxZDAtYTQ2ZC0xMWU5LTllOGUtYmY2ODQwMDAwMDAxXCIgfV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/mjInnhaflm7rlrprnmoTnvJbnoIHop6PljovmlbDmja5cclxuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJjb250ZW50LWVuY29kaW5nXCIsIHByb3h5UmVzW1wiaGVhZGVyc1wiXVtcImNvbnRlbnQtZW5jb2RpbmdcIl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm5EYXRhICs9IGAke2Vycm9yfWA7XHJcbiAgICAgICAgICAgIC8v5aSE55CGdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybkRhdGEgPSBlcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgIHJlcy5lbmQocmV0dXJuRGF0YSk7XHJcbiAgICB9LFxyXG4gICAgb25DbG9zZSwgb25FcnJvclxyXG59KSkpO1xyXG5cclxuLy/or7fmsYLmjojmnYNcclxucm91dGVyLmdldCgnL0p1cmlzZGljdGlvbi8qJywgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICB0YXJnZXQ6IGBodHRwOi8vJHtjb25maWcucGdzcWwucGdzcWxJcH06JHtjb25maWcucGdzcWwucGdzcWxQb3J0fWAsXHJcbiAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICBzZWxmSGFuZGxlUmVzcG9uc2U6IHRydWUsXHJcbiAgICBsb2dMZXZlbDogZ2xvYmFsLmNvbmZpZy5wcm94eUxvZ0xldmVsLFxyXG4gICAgcGF0aFJld3JpdGU6IHsgJ14vYXBpdjIvSnVyaXNkaWN0aW9uJzogJy8nIH0sXHJcbiAgICBvblByb3h5UmVzOiBhc3luYyAocHJveHlSZXMsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldHVybkRhdGEgPSAnJztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL+aLieadg+mZkOmcgOimgeWIt+aWsHRva2VuXHJcbiAgICAgICAgICAgIGxldCBqd3RPYmogPSBuZXcgand0KExpY2Vuc2UucGNpZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgLy/mm7TmlrB0b2tlblxyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiYXV0aG9yaXphdGlvblwiLCBqd3RPYmoucmVmcmVzaFRva2VuKCkpO1xyXG4gICAgICAgICAgICAvL+aMieeFp+WbuuWumueahOe8lueggeino+WOi+aVsOaNrlxyXG4gICAgICAgICAgICAvLyByZXMuc2V0SGVhZGVyKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICAgICAgLy/ojrflj5bor7fmsYLlm57mnaXnmoTmlbDmja5cclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBnZXRCb2R5KHByb3h5UmVzKTtcclxuICAgICAgICAgICAgLy/op6Pljovor7fmsYLlm57mnaXnmoTmlbDmja5cclxuICAgICAgICAgICAgbGV0IHJvbGVEYXRhID0gYXdhaXQgcGFyc2VEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICAvL+WKoOWvhueLl+adg+mZkOaVsOaNrlxyXG4gICAgICAgICAgICBsZXQgZG9nUG93ZXIgPSBMaWNlbnNlLmRvZ0luZm8uc3lzdGVtO1xyXG4gICAgICAgICAgICBsZXQgcm9sZVBvd2VyID0gcm9sZURhdGFbMF0uY29udGVudC5uYXZSb3V0ZXI7XHJcbiAgICAgICAgICAgIC8v5a+55q+U5p2D6ZmQLOi/lOWbnuaWsOadg+mZkFxyXG4gICAgICAgICAgICBsZXQgbmV3UG93ZXIgPSBjb21wYXJlUG93ZXIoZG9nUG93ZXIsIHJvbGVQb3dlciwge30pO1xyXG4gICAgICAgICAgICAvL+WwhuaVsOaNruW6k+S4reeahOadg+mZkOaVsOaNruabv+aNouaIkOaWsOeahOadg+mZkOaVsOaNrlxyXG4gICAgICAgICAgICByb2xlRGF0YVswXS5jb250ZW50Lm5hdlJvdXRlciA9IG5ld1Bvd2VyO1xyXG4gICAgICAgICAgICByZXR1cm5EYXRhID0gcm9sZURhdGE7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuRGF0YSArPSBgJHtlcnJvcn1gO1xyXG4gICAgICAgICAgICAvL+WkhOeQhnRocm93IEVycm9yXHJcbiAgICAgICAgICAgIGlmIChlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5EYXRhID0gZXJyb3IubWVzc2FnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJldHVybkRhdGEpKTtcclxuICAgIH0sXHJcbiAgICBvbkNsb3NlLCBvbkVycm9yXHJcbn0pKSk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvKicsIGMyayhjcmVhdGVQcm94eU1pZGRsZXdhcmUoe1xyXG4gICAgdGFyZ2V0OiBgaHR0cDovLyR7Y29uZmlnLnBnc3FsLnBnc3FsSXB9OiR7Y29uZmlnLnBnc3FsLnBnc3FsUG9ydH1gLFxyXG4gICAgbG9nTGV2ZWw6IGdsb2JhbC5jb25maWcucHJveHlMb2dMZXZlbCxcclxuICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgIHBhdGhSZXdyaXRlOiB7ICdeL2FwaXYyJzogJy8nIH0sXHJcbiAgICBvbkNsb3NlLCBvbkVycm9yXHJcbn0pKSk7XHJcblxyXG5yb3V0ZXIucGF0Y2goJy8qJywgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICB0YXJnZXQ6IGBodHRwOi8vJHtjb25maWcucGdzcWwucGdzcWxJcH06JHtjb25maWcucGdzcWwucGdzcWxQb3J0fWAsXHJcbiAgICBsb2dMZXZlbDogZ2xvYmFsLmNvbmZpZy5wcm94eUxvZ0xldmVsLFxyXG4gICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgcGF0aFJld3JpdGU6IHsgJ14vYXBpdjInOiAnJyB9LFxyXG4gICAgb25Qcm94eVJlcSwgb25DbG9zZSwgb25FcnJvclxyXG59KSlcclxuKTtcclxuXHJcbnJvdXRlci5wb3N0KCcvKicsIGMyayhjcmVhdGVQcm94eU1pZGRsZXdhcmUoe1xyXG4gICAgdGFyZ2V0OiBgaHR0cDovLyR7Y29uZmlnLnBnc3FsLnBnc3FsSXB9OiR7Y29uZmlnLnBnc3FsLnBnc3FsUG9ydH1gLFxyXG4gICAgbG9nTGV2ZWw6IGdsb2JhbC5jb25maWcucHJveHlMb2dMZXZlbCxcclxuICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgIHBhdGhSZXdyaXRlOiB7ICdeL2FwaXYyJzogJy8nIH0sXHJcbiAgICBvblByb3h5UmVxLCBvbkNsb3NlLCBvbkVycm9yXHJcbn0pKSk7XHJcblxyXG5yb3V0ZXIuZGVsZXRlKCcvKicsIGMyayhjcmVhdGVQcm94eU1pZGRsZXdhcmUoe1xyXG4gICAgdGFyZ2V0OiBgaHR0cDovLyR7Y29uZmlnLnBnc3FsLnBnc3FsSXB9OiR7Y29uZmlnLnBnc3FsLnBnc3FsUG9ydH1gLFxyXG4gICAgbG9nTGV2ZWw6IGdsb2JhbC5jb25maWcucHJveHlMb2dMZXZlbCxcclxuICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgIHBhdGhSZXdyaXRlOiB7ICdeL2FwaXYyJzogJy8nIH0sXHJcbn0pKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjsiLCJjb25zdCByb3V0ZXIgPSByZXF1aXJlKCdrb2Etcm91dGVyJykoKTtcclxuY29uc3QgeyBjcmVhdGVQcm94eU1pZGRsZXdhcmUgfSA9IHJlcXVpcmUoJ2h0dHAtcHJveHktbWlkZGxld2FyZScpO1xyXG5jb25zdCBjMmsgPSByZXF1aXJlKCdrb2EyLWNvbm5lY3QnKTtcclxuXHJcbmxldCBnZXRCb2R5ID0gKHByb3h5UmVzKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBbXVxyXG4gICAgICAgIHByb3h5UmVzLm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XHJcbiAgICAgICAgICAgIGJvZHkucHVzaChjaHVuaylcclxuICAgICAgICB9KVxyXG4gICAgICAgIHByb3h5UmVzLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGJvZHkgPSBuZXcgQnVmZmVyLmNvbmNhdChib2R5KVxyXG4gICAgICAgICAgICByZXNvbHZlKGJvZHkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmdsb2JhbC5jcmVhdGVEYXRhU2VydmVyUm91dGVyID0gZnVuY3Rpb24gKHBvcnQpIHtcclxuICAgIGxldCBsYXllclN0YWNrID0gcm91dGVyLnN0YWNrO1xyXG4gICAgLy/liKDpmaTph43lpI3nmoTot6/nlLFcclxuICAgIGZvciAobGV0IGkgPSBsYXllclN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgaWYgKC9cXC9kYXRhXFwvKi8udGVzdChsYXllclN0YWNrW2ldLnBhdGgpKSB7XHJcbiAgICAgICAgICAgIGxheWVyU3RhY2suc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5omA5pyJ55qE5paH5Lu26K6/6Zeu6Lev55SxXHJcbiAgICByb3V0ZXIuZ2V0KCcvZGF0YS8qJywgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9YCxcclxuICAgICAgICBsb2dMZXZlbDogY29uZmlnLnByb3h5TG9nTGV2ZWwsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHBhdGhSZXdyaXRlOiB7ICdeL2RhdGEnOiAnJyB9LFxyXG4gICAgICAgIHNlbGZIYW5kbGVSZXNwb25zZTogdHJ1ZSxcclxuICAgICAgICBvblByb3h5UmVzOiBhc3luYyAocHJveHlSZXMsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gcHJveHlSZXMuc3RhdHVzQ29kZTtcclxuICAgICAgICAgICAgLy/ph43mlrDop6PmnpDku6PnkIbov5Tlm57vvIzorqnlhoXlrZjlm57mlLbnmoTlv6vkuIDngrlcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBnZXRCb2R5KHByb3h5UmVzKTtcclxuICAgICAgICAgICAgLy/lsIZwcm94eSByZXPnmoRoZWFkZXJz6K6+572u5YiwY2xpZW50IHJlc1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIGluIHByb3h5UmVzLmhlYWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIocCwgcHJveHlSZXMuaGVhZGVyc1twXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzLmVuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9KSkpO1xyXG4gICAgLy/liKDpmaTmlofku7ZcclxuICAgIHJvdXRlci5wb3N0KFwiL2RhdGEvYXBpL3YyL2RlbGV0ZWZpbGVzXCIsIGMyayhjcmVhdGVQcm94eU1pZGRsZXdhcmUoe1xyXG4gICAgICAgIHRhcmdldDogYGh0dHA6Ly8xMjcuMC4wLjE6JHtwb3J0fWAsXHJcbiAgICAgICAgbG9nTGV2ZWw6IGNvbmZpZy5wcm94eUxvZ0xldmVsLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBwYXRoUmV3cml0ZTogeyAnXi9kYXRhJzogJycgfSxcclxuICAgICAgICBvblByb3h5UmVxOiAocHJveHlSZXEsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBib2R5RGF0YSA9IEpTT04uc3RyaW5naWZ5KHJlcS5ib2R5KTtcclxuICAgICAgICAgICAgLy/ph43mlrDorqHnrpdjb250ZW50LWxlbmd0aOWPiuWGmeWFpWJvZHnmlbDmja5cclxuICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKFwiQ29udGVudC1MZW5ndGhcIiwgQnVmZmVyLmJ5dGVMZW5ndGgoYm9keURhdGEpKTtcclxuICAgICAgICAgICAgcHJveHlSZXEud3JpdGUoYm9keURhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKSk7XHJcbiAgICAvL+S4iuS8oOaWh+S7tlxyXG4gICAgcm91dGVyLnBvc3QoXCIvZGF0YS9hcGkvdjIvdXBsb2FkZmlsZXNcIiwgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9YCxcclxuICAgICAgICBsb2dMZXZlbDogY29uZmlnLnByb3h5TG9nTGV2ZWwsXHJcbiAgICAgICAgcGF0aFJld3JpdGU6IHsgJ14vZGF0YSc6ICcnIH0sXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXHJcbiAgICB9KSkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjsiLCJjb25zdCByb3V0ZXIgPSByZXF1aXJlKCdrb2Etcm91dGVyJykoKTtcclxuY29uc3QgZGF0YVNvdXJjZSA9IHJlcXVpcmUoJy4uL2xpYnMvZGF0YS1zb3VyY2UvZGF0YS1zb3VyY2UnKTtcclxuLy9UT0RPIOeUseS6jnJlYWxTZXJ2ZXLkuI5zcWxTZXJ2ZXLmnYPpmZDmmoLml7bogZrpm4blnKjkuIDlnZfvvIzmiYDku6XmlbDmja7mupDmk43kvZzkuZ/mlL7lnKjkuIDlnZfvvIzku6XlkI7opoHlgZrmi4bliIZcclxuLy/ot6/lvoTliY3nvIBcclxucm91dGVyLnByZWZpeCgnL2FwaXYyJyk7XHJcbi8v5pON5L2c5pWw5o2u5rqQXHJcbnJvdXRlci5wb3N0KCcvb3B0aW9uL2RhdGFTb3VyY2UnLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAvL+aXoOadg+mZkFxyXG4gICAgaWYgKCFMaWNlbnNlLmRvZ0luZm8uc2VydmVyLnJlYWxTZXJ2ZXIgJiYgIUxpY2Vuc2UuZG9nSW5mby5zZXJ2ZXIuc3FsU2VydmVyKSB7XHJcbiAgICAgICAgY3R4LmJvZHkgPSB7IHJlc3VsdCB9O1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGJvZHlQYXJhbSA9IGN0eC5yZXF1ZXN0LmJvZHk7XHJcbiAgICAgICAgbGV0IG9wdGlvblR5cGUgPSBib2R5UGFyYW0ub3B0aW9uVHlwZTtcclxuICAgICAgICBzd2l0Y2ggKG9wdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZS5kYXRhU291cmNlQ3JlYXRlKGJvZHlQYXJhbSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZS5kYXRhU291cmNlVXBkYXRlKGJvZHlQYXJhbSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImRlbGV0ZVwiOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgZGF0YVNvdXJjZS5kYXRhU291cmNlRGVsZXRlKGJvZHlQYXJhbSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0YXR1cyA9IDIwMDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtEQUVNT05dIOaTjeS9nOaVsOaNrua6kOaOpeWPo+a1geeoi+WHuueOsOmUmeivrzoke2Vycm9yfWApO1xyXG4gICAgICAgIGN0eC5zdGF0dXMgPSA1MDA7XHJcbiAgICB9XHJcbiAgICBjdHguYm9keSA9IHsgcmVzdWx0IH07XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7IiwiY29uc3Qgcm91dGVyID0gcmVxdWlyZSgna29hLXJvdXRlcicpKCk7XG5cbi8v5YmN56uv5paH5Lu25YWl5Y+jXG5yb3V0ZXIuZ2V0KCcvJywgYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgIGF3YWl0IGN0eC5yZW5kZXIoJy4uL3ZpZXdzL2luZGV4Lmh0bWwnKTtcbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gcm91dGVyOyIsIi8qKlxyXG4gKiBkYWVtb27kuI7mnI3liqHpgJrorq/ot6/nlLFcclxuICovXHJcbmNvbnN0IHJvdXRlciA9IHJlcXVpcmUoJ2tvYS1yb3V0ZXInKSgpO1xyXG5jb25zdCBzZXJ2aWNlQXBpID0gcmVxdWlyZSgnLi4vbGlicy9zZXJ2aWNlLWFwaS9zZXJ2aWNlLWFwaScpO1xyXG5yb3V0ZXIucHJlZml4KCcvc2VydmljZScpXHJcblxyXG5yb3V0ZXIucG9zdCgnL3JlYWwnLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICBhd2FpdCBzZXJ2aWNlQXBpLnJlYWwoY3R4LCBuZXh0KTtcclxufSlcclxuXHJcbnJvdXRlci5wb3N0KCcvZGF0YScsIGFzeW5jIChjdHgsIG5leHQpID0+IHtcclxuICAgIGF3YWl0IHNlcnZpY2VBcGkuZGF0YShjdHgsIG5leHQpO1xyXG59KVxyXG5cclxucm91dGVyLnBvc3QoJy9zcWwnLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICBhd2FpdCBzZXJ2aWNlQXBpLnNxbChjdHgsIG5leHQpO1xyXG59KVxyXG5cclxucm91dGVyLnBvc3QoJy9pbycsIGFzeW5jIChjdHgsIG5leHQpID0+IHtcclxuICAgIGF3YWl0IHNlcnZpY2VBcGkuaW8oY3R4LCBuZXh0KTtcclxufSlcclxuXHJcbnJvdXRlci5wb3N0KCcvYWknLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XHJcbiAgICBhd2FpdCBzZXJ2aWNlQXBpLmFpKGN0eCwgbmV4dCk7XHJcbn0pXHJcblxyXG5yb3V0ZXIucG9zdCgnL3BnU3FsJywgKGN0eCwgbmV4dCkgPT4ge1xyXG4gICAgc2VydmljZUFwaS5wZ1NxbChjdHgsIG5leHQpO1xyXG59KVxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjsiLCJjb25zdCByb3V0ZXIgPSByZXF1aXJlKCdrb2Etcm91dGVyJykoKTtcclxuY29uc3QgeyBjcmVhdGVQcm94eU1pZGRsZXdhcmUgfSA9IHJlcXVpcmUoJ2h0dHAtcHJveHktbWlkZGxld2FyZScpO1xyXG5jb25zdCBjMmsgPSByZXF1aXJlKCdrb2EyLWNvbm5lY3QnKTtcclxuXHJcbi8v6Lev5b6E5YmN57yAXHJcbnJvdXRlci5wcmVmaXgoJy9hcGl2MicpO1xyXG5cclxubGV0IG9uUHJveHlSZXEgPSAocHJveHlSZXEsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICBsZXQgYm9keURhdGEgPSBKU09OLnN0cmluZ2lmeShyZXEuYm9keSk7XHJcbiAgICBib2R5RGF0YSA9IGJvZHlEYXRhID8gYm9keURhdGEgOiBKU09OLnN0cmluZ2lmeSh7fSk7XHJcbiAgICAvL+mHjeaWsOiuoeeul2NvbnRlbnQtbGVuZ3Ro5Y+K5YaZ5YWlYm9keeaVsOaNrlxyXG4gICAgcHJveHlSZXEuc2V0SGVhZGVyKFwiQ29udGVudC1MZW5ndGhcIiwgQnVmZmVyLmJ5dGVMZW5ndGgoYm9keURhdGEpKTtcclxuICAgIHByb3h5UmVxLndyaXRlKGJvZHlEYXRhKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWinuWKoHNxbFNlcnZlcui3r+eUsVxyXG4gKiBAcGFyYW0gcG9ydCBzcWxTZXJ2ZXLkvb/nlKjnq6/lj6NcclxuICogQHBhcmFtIHNlcnZlck5hbWUgc3FsU2VydmVy5ZCN56ewXHJcbiAqL1xyXG5nbG9iYWwuY3JlYXRlU3FsU2VydmVyUm91dGVyID0gKHBvcnQsIHNlcnZlck5hbWUpID0+IHtcclxuICAgIGxldCBsYXllclN0YWNrID0gcm91dGVyLnN0YWNrO1xyXG4gICAgLy/liKDpmaTph43lpI3nmoTot6/nlLFcclxuICAgIGZvciAobGV0IGkgPSBsYXllclN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYC9hcGl2Mi9zcWwvJHtzZXJ2ZXJOYW1lfS8qYCk7XHJcbiAgICAgICAgaWYgKHJlZy50ZXN0KGxheWVyU3RhY2tbaV0ucGF0aCkpIHtcclxuICAgICAgICAgICAgbGF5ZXJTdGFjay5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcm91dGVyLmdldChgL3NxbC8ke3NlcnZlck5hbWV9LypgLCBjMmsoY3JlYXRlUHJveHlNaWRkbGV3YXJlKHtcclxuICAgICAgICB0YXJnZXQ6IGBodHRwOi8vMTI3LjAuMC4xOiR7cG9ydH1gLFxyXG4gICAgICAgIGxvZ0xldmVsOiBjb25maWcucHJveHlMb2dMZXZlbCxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcGF0aFJld3JpdGU6IHsgJ14vYXBpdjInOiAnJyB9XHJcbiAgICB9KSkpO1xyXG5cclxuICAgIHJvdXRlci5wb3N0KGAvc3FsLyR7c2VydmVyTmFtZX0vKmAsIGMyayhjcmVhdGVQcm94eU1pZGRsZXdhcmUoe1xyXG4gICAgICAgIHRhcmdldDogYGh0dHA6Ly8xMjcuMC4wLjE6JHtwb3J0fWAsXHJcbiAgICAgICAgbG9nTGV2ZWw6IGNvbmZpZy5wcm94eUxvZ0xldmVsLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBwYXRoUmV3cml0ZTogeyAnXi9hcGl2Mic6ICcnIH0sIG9uUHJveHlSZXFcclxuICAgIH0pKSk7XHJcbiAgICByb3V0ZXIucGF0Y2goYC9zcWwvJHtzZXJ2ZXJOYW1lfS8qYCwgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9YCxcclxuICAgICAgICBsb2dMZXZlbDogY29uZmlnLnByb3h5TG9nTGV2ZWwsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHBhdGhSZXdyaXRlOiB7ICdeL2FwaXYyJzogJycgfSwgb25Qcm94eVJlcVxyXG4gICAgfSkpKTtcclxuICAgIHJvdXRlci5kZWxldGUoYC9zcWwvJHtzZXJ2ZXJOYW1lfS8qYCwgYzJrKGNyZWF0ZVByb3h5TWlkZGxld2FyZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9YCxcclxuICAgICAgICBsb2dMZXZlbDogY29uZmlnLnByb3h5TG9nTGV2ZWwsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHBhdGhSZXdyaXRlOiB7ICdeL2FwaXYyJzogJycgfSwgb25Qcm94eVJlcVxyXG4gICAgfSkpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbHVzdGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwLXByb3h5LW1pZGRsZXdhcmVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtvYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2EtYm9keXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2EtanNvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2EtbG9nZ2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtvYS1vbmVycm9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtvYS1yb3V0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLXN0YXRpY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2Etdmlld3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hMi1jb25uZWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbWVudFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlcXVlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3lzdGVtaW5mb3JtYXRpb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInpsaWJcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==