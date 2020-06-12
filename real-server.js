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
/******/ 	return __webpack_require__(__webpack_require__.s = "./real-server/bin/www.js");
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

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./real-server/app.js":
/*!****************************!*\
  !*** ./real-server/app.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { Service } = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
const WebSocket = __webpack_require__(/*! ws */ "ws");
const rpcNode = __webpack_require__(/*! @hprose/rpc-node */ "./real-server/node_modules/@hprose/rpc-node/lib/index.js");
const dataSource = __webpack_require__(/*! ./lib/data-source */ "./real-server/lib/data-source.js");
const communicate = __webpack_require__(/*! ./communicate */ "./real-server/communicate.js");

//提供数据接口定义
module.exports = class realServer {
    constructor(config) {
        this.config = config;
        this.run();
    }
    /*
        功能:启动函数
    */
    run() {
        
        console.log(`[REAL-SERVER ${configJson.name}] 启动服务: ${this.config.name} 端口:${this.config.usedPort}`);
        //初始化rpc
        this.service = new Service();
        this.service.bind(new WebSocket.Server({ port: this.config.usedPort }, async (err, result) => {
            this.service.websocket.compress = true;
            //真正的代理适配器
            console.log(`[REAL-SERVER ${configJson.name}] 开始创建工作模块`);
            this.agentAdapter = new dataSource(this.config);
            console.log(`[REAL-SERVER ${configJson.name}] 开始rpc服务注册`);
            this.registerRpcService();
            console.log(`[REAL-SERVER ${configJson.name}] rpc服务注册成功`);
            await this.agentAdapter.connect();
            console.log(`[REAL-SERVER ${configJson.name}] 创建工作模块成功,服务启动成功`);
            //向daemon报告登录成功
            await communicate.report(this.config.usedPort, this.config.name);
        }));
    }

    registerRpcService() {
        this.service.websocket.onaccept = this.onAccept.bind(this);
        this.service.websocket.onclose = this.onClose.bind(this);
        this.service.add({ method: this.agentAdapter.subRealData.bind(this.agentAdapter), fullname: 'subRealData', passContext: true });
        this.service.add({ method: this.agentAdapter.getRealData.bind(this.agentAdapter), fullname: 'getRealData', passContext: true });
        this.service.add({ method: this.agentAdapter.unSubRealData.bind(this.agentAdapter), fullname: 'unSubRealData', passContext: true });
        this.service.add({ method: this.agentAdapter.getTagData.bind(this.agentAdapter), fullname: 'getTagData', passContext: true });
        this.service.add({ method: this.agentAdapter.getHisData.bind(this.agentAdapter), fullname: 'getHisData', passContext: true });
        this.service.add({ method: this.agentAdapter.getAlmData.bind(this.agentAdapter), fullname: 'getAlmData', passContext: true });
        this.service.add({ method: this.agentAdapter.getTagInfo.bind(this.agentAdapter), fullname: 'getTagInfo', passContext: true });
        this.service.add({ method: this.agentAdapter.getData.bind(this.agentAdapter), fullname: 'getData', passContext: true });
        this.service.add({ method: this.agentAdapter.setData.bind(this.agentAdapter), fullname: 'setData', passContext: true });
        this.service.add({ method: this.isConnected, fullname: 'isConnected', passContext: true });
    }
    isConnected() {
        //服务管理工具调用的接口。只要此服务启动了就返回true。与数据源是否链接无关
        return true;
    }
    //新连接处理
    onAccept(ws) {
        //客户端[ip:port]作为连接的key值
        let clientKey = (ws._socket.remoteAddress + ":" + ws._socket.remotePort).slice(7)
        this.agentAdapter.addClient(clientKey);
    }
    //连接断开
    onClose(ws) {
        //客户端[ip:port]作为连接的key值
        let clientKey = (ws._socket.remoteAddress + ":" + ws._socket.remotePort).slice(7)
        this.agentAdapter.delClient(clientKey);
    }
}

/***/ }),

/***/ "./real-server/bin/www.js":
/*!********************************!*\
  !*** ./real-server/bin/www.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//daemon全局配置
global.daemonConfig = __webpack_require__(/*! ../../daemon/config/default-config.json */ "../../daemon/config/default-config.json");
//debug
global.__debug = false;
const realServer = __webpack_require__(/*! ../app.js */ "./real-server/app.js");
const communicate = __webpack_require__(/*! ../communicate */ "./real-server/communicate.js");
const net = __webpack_require__(/*! net */ "net");

//real-server自己的配置
global.configJson = {};
if (process.argv[2] && process.argv[2] === "debug") {
    configJson = __webpack_require__(/*! ../config/default-config.json */ "../../daemon/config/default-config.json");
    configJson.usedPort = process.argv[3] ? process.argv[3] : 3001;
    __debug = true;
} else {
    if (process.argv[2]) {
        var jsonStr = new Buffer.from(process.argv[2], 'base64').toString();
        try {
            configJson = JSON.parse(jsonStr);
        } catch (e) {
            console.log("错误的配置参数");
            return;
        }
    }
}

/**
 * @description 检测可用端口，并启动server
 * @param {*} config 配置
 */
async function checkPortAndStart(config) {
    try {
        //端口
        let startPort = await communicate.getPort();
        if (startPort && startPort.port) {
            let usedPort = await chkCanUsedPort(startPort.port, 0);
            //real-server使用端口
            config.usedPort = usedPort;
            console.log(`[REAL-SERVER ${configJson.name}] 当前使用端口${usedPort}`);
            //启动
            new realServer(config);
        } else {
            console.log(`[REAL-SERVER] 未找到主服务的链接端口,5秒后重试`);
            setTimeout(() => {
                checkPortAndStart(config);
            }, 5000);
        }
    } catch (error) {
        console.log(`[REAL-SERVER ${configJson.name}] ${error}`);
    }
}

/**
 * 检测可以使用的端口
 * @param {number} port 要检测的端口
 * @param {number} curChkTime 已经检测的次数，最大值是500
 */
function chkCanUsedPort(port, curChkTime) {
    let server = net.createServer().listen(port);
    return new Promise((resolve, reject) => {
        //检测次数最大值
        const MAX_CHK_TIMES = 500;
        //监听到listen事件，说明当前端口可用
        server.on("listening", () => {
            server.close();
            resolve(port);
        });
        server.on("error", error => {
            //端口占用错误，一直递归到可以使用的端口
            if (error.code === 'EADDRINUSE' && curChkTime <= MAX_CHK_TIMES) {
                resolve(chkCanUsedPort(port + 1, curChkTime + 1));
            }
            if (error.code === 'EADDRINUSE' && curChkTime > MAX_CHK_TIMES) {
                error = `已经达到最大端口检测次数`;
            }
            reject(error);
        });
    })
}

//启动realserver
checkPortAndStart(configJson);


/***/ }),

/***/ "./real-server/communicate.js":
/*!************************************!*\
  !*** ./real-server/communicate.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 与daemon通讯的api
 */
const request = __webpack_require__(/*! request */ "request");

class Communicate {
    constructor() {
        this.ip = '127.0.0.1';
        this.port = daemonConfig.port;
        //请求路径前缀
        this.prefix = '/service';
    }

    requestGet(url, callback) {
        request.get({ url, json: true }, (err, responce, body) => {
            if (err) callback(err);
            if (responce && responce.statusCode === 200) {
                callback(null, body)
            } else {
                callback(body);
            }
        });
    }

    requestPost(url, param, callback) {
        request.post({ url, json: true, body: param }, (err, responce, body) => {
            if (err) callback(err);
            if (responce && responce.statusCode === 200) {
                callback(null, body)
            } else {
                callback(body);
            }
        })
    }

    /**
     * 获取服务要使用的初始端口
     */
    getPort() {
        return new Promise((resolve, reject) => {
            let url = `http://${this.ip}:${this.port}${this.prefix}/real`;
            this.requestPost(url, { "type": "getPort", "serverType": "realServer" }, (err, data) => {
                if (err) {
                    console.log(`[REAL-SERVER ${configJson.name}] 获取服务要使用的初始端口:${err}`);
                }
                resolve(data);
            })
        })
    }

    /**
     * 登录成功向daemon报告服务使用的端口
     * @param {*} curUsePort 当前使用的端口
     */
    async report(curUsePort, serverName) {
        return new Promise((resolve, reject) => {
            let url = `http://${this.ip}:${this.port}${this.prefix}/real`;
            this.requestPost(url, { "type": "report", curUsePort, "serverType": "realServer", serverName }, (err, data) => {
                if (err) {
                    console.log("未找到daemon服务器,若本次未启动调试启动请忽略！");
                }
                resolve(data);
            })
        })
    }
}

//单例模式
let communicate = null;
if (communicate === null) {
    communicate = new Communicate();
}
module.exports = communicate;

/***/ }),

/***/ "./real-server/lib/data-source.js":
/*!****************************************!*\
  !*** ./real-server/lib/data-source.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dataFC7 = __webpack_require__(/*! ./source/fc7 */ "./real-server/lib/source/fc7.js");
const dataEF5 = __webpack_require__(/*! ./source/ef5 */ "./real-server/lib/source/ef5.js");
const dataPS6 = __webpack_require__(/*! ./source/ps6 */ "./real-server/lib/source/ps6.js");
module.exports = function(config) {
    switch(config.type){
        case "ef5":
            return new dataEF5(config);
        break;
        case "ps6":
            return new dataPS6(config);
        break;
        case "fc7":
            return new dataFC7(config);
        break;
        default:
            throw new Error('不存在的数据源类型:' + config.type)
        break;
    }
}

/***/ }),

/***/ "./real-server/lib/source/base.js":
/*!****************************************!*\
  !*** ./real-server/lib/source/base.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const _ = __webpack_require__(/*! lodash/core */ "./real-server/node_modules/lodash/core.js");
const FRtdb = __webpack_require__(/*! fcnode */ "fcnode");
module.exports = class dataSourceBase {
    constructor(config) {
        //所有客户端连接信息
        this.webClientRegDataInfo = {};
        //全局轮询请求点列表
        this.GlobalRequestData = {
            /*    
            tagname+parName:{
                    tagName:11,
                    parName:22,
                    prevValue:{}
                    value:{}
                }
            */
        };
        this.connectCount = 0;
        this.config = config;
        //初始化fcnode
        this.db = new FRtdb(
            this.config.ip,
            this.config.port,
            {
                // dialect: this.config.sourceType,
                dialect: this.config.type,
                username: this.config.username,
                password: this.config.password
            });
    }
    addClient(clientKey) {
        //客户端不存在
        if (this.webClientRegDataInfo[clientKey] == undefined) {
            this.webClientRegDataInfo[clientKey] = {
                regData: {},
                shellRegData: {},
                changeData: [],//返回给客户端属性
                lastTime: new Date()
            }
            console.log(`[REAL-SERVER ${configJson.name}] 新增客户端连接:${clientKey}`);
        } else {
            console.log(`[REAL-SERVER ${configJson.name}] 客户端已存在:${clientKey}`);
        }
    }
    delClient(clientKey) {
        //客户端不存在
        if (!this.webClientRegDataInfo[clientKey]) {
            console.log(`[REAL-SERVER ${configJson.name}] 删除客户端失败:${clientKey}`);
        } else {
            //注销客户端所有点
            _.map(this.webClientRegDataInfo[clientKey].regData, (tag, tagName) => {
                _.map(tag, (parObj, parName) => {
                    let uniquekey = tagName + "." + parName;
                    let find = this.GlobalRequestData[uniquekey];
                    if (find) {
                        find.refCount -= parObj.refCount;
                        //引用计数为0时，删除
                        if (find.refCount == 0) {
                            delete this.GlobalRequestData[uniquekey];
                        }
                    }
                })
            })
            delete this.webClientRegDataInfo[clientKey];
            console.log(`[REAL-SERVER ${configJson.name}] 成功删除客户端:${clientKey}`);
        }

    }
    getClient(clientKey) {
        if (!this.webClientRegDataInfo[clientKey]) {
            console.log(`[REAL-SERVER ${configJson.name}] 获取客户端对象失败:${clientKey}`);
        }
        return this.webClientRegDataInfo[clientKey]
    }
    /*
        功能:注册点
        参数:clientKey:注册到的连接标示
            json : 注册的信息
            reference : 是否注册。false标示只取当前值并不注册
        返回值:注册点的当前值
    */
    async register(clientKey, json, reference) {
        //本地是否先请求一次，获取初值
        let currentRequest = [];
        //处理当前连接引用计数
        json.map((requestData) => {
            let tagInfo = this.webClientRegDataInfo[clientKey].regData[requestData.tagName];
            if (tagInfo) {
                //当前注册属性若存在+1，不存在创建
                let parObj = tagInfo[requestData.parName];
                if (parObj) {
                    if (reference) {
                        parObj.refCount += 1;
                    }
                } else {
                    tagInfo[requestData.parName] = {
                        data: {
                            value: -9999,
                            time: "",
                            quality: ""
                        },
                        refCount: 1
                    }
                }
            } else {
                //创建点对象以及属性
                this.webClientRegDataInfo[clientKey].regData[requestData.tagName] = {
                    [requestData.parName]: {
                        data: {
                            value: -9999,
                            time: "",
                            quality: ""
                        },
                        refCount: 1
                    }
                };
            }
            //当前请求点信息，是否在全局列表中存在 存在引用+1
            let uniquekey = requestData.tagName + "." + (requestData.parName || "pv");
            let find = this.GlobalRequestData[uniquekey];
            if (find) {
                if (reference) {
                    find.refCount++;
                }
            } else {
                //不存在需要加到全局列表，等待下一次统一请求
                this.GlobalRequestData[uniquekey] = {
                    tagName: requestData.tagName,
                    parName: requestData.parName,
                    extName: requestData.extName,
                    data: {},
                    refCount: 1
                };
                currentRequest.push(requestData);
            }
        });
        return currentRequest;
    }
    /*
        功能:注销点
        参数:clientKey:需要注销的连接标示
            json : 注销的信息
            reference : 是否注销。false标示只取当前值并不注销
        返回值:注册点的当前值
    */
    unRegister(clientKey, json, reference) {
        let result = {
            error: "",
            data: {}
        }
        //客户端不存在
        if (!this.webClientRegDataInfo[clientKey]) {
            console.log(`[REAL-SERVER ${configJson.name}] client not exist.clientinfo::${clientKey}`);
            result.error = "client not exist";
            return result;
        }
        //处理当前连接引用计数
        json.map((requestData) => {
            let tagInfo = this.webClientRegDataInfo[clientKey].regData[requestData.tagName];
            if (tagInfo) {
                //当前注销属性若存在 计数-1，计数为0 删除属性
                let parObj = tagInfo[requestData.parName];
                if (parObj) {
                    if (reference) {
                        parObj.refCount -= 1;
                    }
                    //计数为0时，删除属性
                    if (parObj.refCount == 0) delete tagInfo[requestData.parName];
                } else {
                    var error = "error:tag prop not exist in client when unSubRealData.clientInfo:";
                    error += clientKey;
                    error += " taginfo: ";
                    error += requestData;
                    console.log(`[REAL-SERVER ${configJson.name}] ${error}`);
                }
                //点所有属性计数为0时，删除点
                if (_.isEmpty(tagInfo)) {
                    delete this.webClientRegDataInfo[clientKey].regData[requestData.tagName];
                }
            } else {
                var error = "error:tag not exist in client when unSubRealData.clientInfo:";
                error += clientKey;
                error += " taginfo: ";
                error += requestData;
                console.log(`[REAL-SERVER ${configJson.name}] ${error}`);
            }
            //当前请求点信息，是否在全局列表中存在 存在引用-1
            let uniquekey = requestData.tagName + "." + (requestData.parName || "pv");
            let find = this.GlobalRequestData[uniquekey];
            if (find) {
                if (reference) {
                    find.refCount--;
                }
                //引用计数为0时，删除
                if (find.refCount == 0) {
                    delete this.GlobalRequestData[uniquekey];
                }
            } else {
                var error = "error:tag not exist in global when unSubRealData.clientInfo:";
                error += clientKey;
                error += " taginfo: ";
                error += requestData;
                console.log(`[REAL-SERVER ${configJson.name}] ${error}`);
            }
        });
        return result;
    }
    /*
        功能:初始化数据源连接
        参数:无
        返回值:无
    */
    async connect(isReConnect = false) {
        //连接实时库
        if (isReConnect) {
            console.log(`[REAL-SERVER ${configJson.name}] 数据源第 ${this.connectCount} 次重新连接`);
        }
        let ret = await this.db.login();
        if (ret) {
            this.connectCount = 0;
            //连接成功,周期请求实时数据
            setTimeout(this.pollRequest.bind(this), 1000);
            setTimeout(this.managerCache.bind(this),3600000);
            await this.loadAllTags();
        } else {
            //重新连接
            this.connectCount++;
            setTimeout(() => {
                this.connect(true);
            }, 30000);
            console.log(`[REAL-SERVER ${configJson.name}] 实时库:${this.config.ip} 类型: ${this.config.type} 状态: 等待重新连接`);
        }
    }

    /*
        功能:加载数据库点表
        参数:无
        返回值:无
    */
    async loadAllTags() {

    }
    /*
        功能:获取所有应请求点
        参数:连接名称
        返回值:所有应请求点
    */
    getTags(clientKey) {
        if (typeof clientKey == "string" && clientKey !== "") {
            return this.webClientRegDataInfo[clientKey];
        }
    }
    /*
        功能:缓存变化点信息
        参数:responeData请求实时结果
            requestData请求信息
        返回值:无
    */
    cacheData(responeData, requestData) {
        responeData.map((data, index) => {
            if(requestData[index].globalRef){
                requestData[index].globalRef.data = data;
            }else{
                for (let key in this.webClientRegDataInfo) {
                    let client = this.webClientRegDataInfo[key];
                    for (let tagName in client.shellRegData){
                        if(tagName == data.tagName){
                            client.shellRegData[tagName].value = responeData;
                        }
                        
                    }
                }
            }
        });
        //将值更新到各个客户端中
        for (let key in this.webClientRegDataInfo) {
            //单个客户端
            const client = this.webClientRegDataInfo[key];
            //regData 每个客户端存的点名josn
            for (let tagName in client.regData) {
                //每个点下保存所有属性名称
                for (let parName in client.regData[tagName]) {
                    //从全局中获取最新值
                    let latestData = this.GlobalRequestData[tagName + "." + parName];
                    //暂时看值，时间戳 质量戳未考虑
                    if (client.regData[tagName][parName].data.value != latestData.data.value) {
                        client.regData[tagName][parName].data.value = latestData.data.value;
                        client.regData[tagName][parName].data.time = latestData.data.time;
                        client.regData[tagName][parName].data.quality = latestData.data.quality;
                        if (client.changeData.length > 16) {
                            client.changeData.shift();
                        }
                        //值不相等，更新，并且保存到更新礼拜中
                        client.changeData.push({
                            extName: latestData.extName,
                            parName: parName,
                            data: latestData.data
                        });
                    }
                }
            }

            

        }

    }
    /*
        功能:准备实时数据请求,缓存一次数据,根据reference决定是否注册点
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
            reference:是否注册
        返回值:未注册点的第一次缓存值
    */
    async prepareRealData(json, token, context, reference = true) {
        let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7);
        let currentRequest = await this.register(clientKey, json, reference);
        //请求回来数据刷新到全局列表中
        if (currentRequest.length > 0) {
            //加到本地列表，先请求一次
            let requestList = [];
            for (let i = 0; i < currentRequest.length; i++) {
                let requestData = currentRequest[i];
                let uniquekey = requestData.tagName + "." + (requestData.parName || "pv");
                requestList.push({
                    tagName: requestData.tagName,
                    parId: this.ModeProperty[requestData.parName].id || 13,
                    globalRef: this.GlobalRequestData[uniquekey]
                });
            }
            let responeData = await this.db.getData(requestList);
            if (this.isError(responeData.retCode)) {
                if (responeData.retCode == -19997) {
                    //当前fcNode无法返回 -19997 错误
                    console.log(`[REAL-SERVER ${configJson.name}] 部分错误`);
                    return [];
                } else if (responeData.data) {
                    responeData.data.map((data, index) => {
                        requestList[index].globalRef.data = data;
                    });
                } else {
                    console.log(`[REAL-SERVER ${configJson.name}] ${responeData.retCode}`);
                    return [];
                }
            } else {
                this.isReConnect(responeData.retCode);
            }
        }
        //再从全局列表中，把当前变量筛选回来
        let resultData = json.map((requestData) => {
            let uniquekey = requestData.tagName + "." + (requestData.parName || "pv");

            return {
                parName: requestData.parName,
                extName: this.GlobalRequestData[uniquekey].extName,
                data: this.GlobalRequestData[uniquekey].data
            };
        });
        return resultData;
    }
    /*
        功能:注销点（可视为注销点函数对外提供的函数别名）
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
            reference:是否注销
        返回值:无
    */
    async unprepareRealData(json, token, context, reference = true) {
        let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7)
        this.unRegister(clientKey, json, reference);
    }
    /*
        功能:获取当前连接的变化实时值
        参数:
        token:暂未使用
        context:连接信息
        返回值:
    */
    getRealData(token, context) {
        let responeData = [];
        let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7);
        let tags = this.getTags(clientKey);
        if (tags) {
            if (tags.changeData.length > 0) {
                //克隆返回
                responeData = _.clone(tags.changeData);
                //请求一次后清空
                tags.changeData = [];
            }
        }
        return responeData;
    }
    /*
        功能:暂未实现
        参数:   name:点名称
                token:暂未使用
                context:连接信息
        返回值:暂未确定
    */
    //轮询查点值
    getTagData(name, token, context) {
        let tmp = [];
        return tmp;
    }
    /*
        功能:注册点
        参数:   json:点名称
                token:暂未使用
                context:连接信息
        返回值:
    */
    async subRealData(json, token, context) {
        return await this.prepareRealData(json, token, context);
    }
    /*
        功能:注销点
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:
    */
    async unSubRealData(json, token, context) {
        return await this.unprepareRealData(json, token, context);
    }
    /*
        功能:获取历史数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:历史数据
    */
    async getHisData(json, token, context) {
        console.warn("子类必须完成此 getHisData 接口");
    }
    /*
        功能:获取报警数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:报警数据
    */
    async getAlmData(json, token, context) {
        console.warn("子类必须完成此 getAlmData 接口");
    }
    /*
        功能:获取点信息
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:点信息
    */
    async getTagInfo(json, token, context) {
        return this.tagTree;
    }
    /*
        功能:获取实时数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:此链接的变化实时值
    */
    async getData(arrJson, token, context) {
        console.warn("子类必须完成此 getData 接口");
    }
    /*
        功能:数据下置
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:
    */
    async setData(json, token, context) {
        console.warn("子类必须完成此 setData 接口");
    }
    /*
        功能:周期从数据源查询数据
        参数:无
        返回值:无
    */
    async pollRequest() {
        //构造请求结构
        let requestData = [];
        for (let key in this.GlobalRequestData) {
            const requestInfo = this.GlobalRequestData[key];
            requestData.push({
                tagName: requestInfo.tagName,
                parId: this.ModeProperty[requestInfo.parName].id || 13,
                globalRef: requestInfo
            })
        }
        for (let client in this.webClientRegDataInfo) {
            for (let cacheKey in this.webClientRegDataInfo[client].shellRegData) {
                let shellRegDataInfo = this.webClientRegDataInfo[client].shellRegData[cacheKey];
                requestData.push({
                    tagName: cacheKey,
                    parId: shellRegDataInfo.parId || 13
                });
            }
        }
        if (requestData.length > 0) {
            //向服务端请求            
            let responeData = await this.db.getData(requestData);
            if (this.isError(responeData.retCode)) {
                if (responeData.retCode == -19997) {
                    //当前fcNode无法返回 -19997 错误
                    console.log(`[REAL-SERVER ${configJson.name}] 部分错误`);
                    return [];
                } else if (responeData.data) {
                    this.cacheData(responeData.data, requestData);
                } else {
                    console.log(`[REAL-SERVER ${configJson.name}] ${responeData.retCode}`);
                    return [];
                }
            } else {
                this.isReConnect(responeData.retCode);
            }
        }
        setTimeout(this.pollRequest.bind(this), 1000);
    }

    managerCache(){
        for (let key in this.webClientRegDataInfo) {
            let client = this.webClientRegDataInfo[key];
            for (let tagName in client.shellRegData){
                if(new Date().getTime() - client.shellRegData[tagName].liveTime > 24 * 60 * 60 * 1000){
                    delete client.shellRegData[tagName];
                }
            }
        }
        setTimeout(this.managerCache.bind(this),3600000);
    }

    isReConnect(retCode) {
        if (retCode == -19795 //连接失败
            || retCode == -19791 //没有连接
            || retCode == -19998 //参数错误
            || retCode == -19788 /*pSpace重启，需要冲洗连接*/
            || retCode == -19799) {
            console.log("错误: " + retCode + "重新连接");
            this.connect(true);
        } else {
            console.log("错误: " + retCode);
        }
    }

    isError(retCode) {
        if (typeof retCode == "number") {
            if (retCode == 0 || retCode == -19997) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
}

/***/ }),

/***/ "./real-server/lib/source/ef5.js":
/*!***************************************!*\
  !*** ./real-server/lib/source/ef5.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dataSourceBase = __webpack_require__(/*! ./base */ "./real-server/lib/source/base.js");
const _ = __webpack_require__(/*! lodash/core */ "./real-server/node_modules/lodash/core.js");
//数据操作请求
module.exports = class agentAdapter extends dataSourceBase {
    constructor(config) {
        super(config);
        this.connectCount = 0;
        this.tagTree = {};
    }
    /*
        功能:加载数据库点表
        参数:无
        返回值:无
    */
    async loadAllTags() {

    }
    /*
        功能:获取历史数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:历史数据
    */
    async getHisData(json, token, context) {
        return await this.db.getHisData(json);
    }
    /*
        功能:获取报警数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:报警数据
    */
    async getAlmData(json, token, context) {
        let layInfo = this.db.getLayer();
        let layIds = [];
        if (layInfo && layInfo.data) {
            layInfo.data.map((lay) => {
                layIds.push(parseInt(lay.layerId));
            });
        }
        return await this.db.getAlarmByArea(layIds);
    }
    /*
        功能:获取实时数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:此链接的变化实时值
    */
    async getData(arrJson, token, context) {
        let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7);
        let regNameData = this.webClientRegDataInfo[clientKey].shellRegData;
        let requestList = [];
        //在缓存中的数据点
        let cacheResponeData = [];
        arrJson.map((tag) => {
            //在数据点缓存中存在
            if (regNameData[tag.tagName]) {
                regNameData[tag.tagName].liveTime = new Date().getTime();
                cacheResponeData.push(regNameData[tag.tagName].value);
            } else {
                requestList.push({
                    tagName: tag.tagName,
                    parId: this.ModeProperty[tag.parName].id || 13
                });
                regNameData[tag.tagName] = {
                    liveTime: new Date().getTime(),
                    parId: this.ModeProperty[tag.parName].id || 13,
                    value: null
                };
            }
        })
        if (requestList.length === 0) return cacheResponeData;
        let responeData = await this.db.getData(requestList);
        if (this.isError(responeData.retCode)) {
            if (responeData.retCode == -19997) {
                //当前fcNode无法返回 -19997 错误
                console.log("部分错误");
                return [];
            } else if (responeData.data) {
                for (let i = 0; i < responeData.data.length; i++) {
                    regNameData[responeData.data[i].tagName].value = responeData.data[i];
                }
                return [...responeData.data, ...cacheResponeData];
            } else {
                console.log(responeData.retCode, { type: "error" });
                return [];
            }
        } else {
            this.isReConnect(responeData.retCode);
        }
    }
    /*
        功能:数据下置
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:
    */
    async setData(json, token, context) {
        return await this.db.setData(json);
    }
}

/***/ }),

/***/ "./real-server/lib/source/fc7.js":
/*!***************************************!*\
  !*** ./real-server/lib/source/fc7.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dataSourceBase = __webpack_require__(/*! ./base */ "./real-server/lib/source/base.js");
const _ = __webpack_require__(/*! lodash/core */ "./real-server/node_modules/lodash/core.js");
//数据操作请求
module.exports = class agentAdapter extends dataSourceBase {
    constructor(config) {
        super(config);
        this.connectCount = 0;
        this.config = config;
        //支持的模型属性
        this.ModeProperty = {
            name: {
                id: 1
            },
            pv: {
                id: 13
            },
            desc: {
                id: 12
            }
        }
        this.tagTree = {};
    }
    /*
        功能:加载数据库点表
        参数:无
        返回值:无
    */
    async loadAllTags() {
        let tagInfos = this.db.getTagInfoEx(-1);
        //拼接所有点id，以及desc参数信息，获取点描述
        let tagIds = [];
        tagInfos.data.map((tag) => {
            tagIds.push({
                tagId: tag.tagId
            });
        });
        //获取点描述
        let tagDescs = await this.db.getData(tagIds);
        this.tagTree = {};
        if (tagDescs.data.length == tagInfos.data.length) {
            tagInfos.data.map((tag, tagIndex) => {
                let index = tag.tagName.indexOf("\\");
                if (index <= 0) {
                    //根节点下测点,直接注册
                    this.tagTree[tag.tagName] = {
                        name: tag.tagName,
                        desc: tagDescs.data[tagIndex].value,
                        longName: tag.tagName,
                        id: tag.tagId,
                        pv: {
                            value: 0,
                            time: 0,
                            quality: 0,
                        }
                    }
                } else {
                    let layInfos = tag.tagName.split("\\");
                    let root = this.tagTree;
                    //最后一级是点名
                    for (let i = 0; i < layInfos.length - 1; i++) {
                        const layName = layInfos[i];
                        if (!root[layName]) {
                            root[layName] = {};
                        }
                        root = root[layName];
                    }
                    //挂接点名
                    root[layInfos[layInfos.length - 1]] = {
                        name: layInfos[layInfos.length - 1],
                        desc: tagDescs.data[tagIndex].value,
                        longName: tag.tagName,
                        id: tag.tagId,
                        pv: {
                            value: 0,
                            time: 0,
                            quality: 0,
                        }
                    };
                }
            });
            console.log("实时库: " + this.config.ip + "  类型: " + this.config.type + " 连接成功，测点加载成功", { type: "start" });
        } else {

        }
    }
    /*
        功能:获取历史数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:历史数据
    */
    async getHisData(json, token, context) {
        return await this.db.getHisData(json);
    }
    /*
        功能:获取报警数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:报警数据
    */
    async getAlmData(json, token, context) {
        let layInfo = this.db.getLayer();
        let layIds = [];
        if (layInfo && layInfo.data) {
            layInfo.data.map((lay) => {
                layIds.push(parseInt(lay.layerId));
            });
        }
        return await this.db.getAlarmByArea(layIds);
    }
    /*
        功能:获取实时数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:此链接的变化实时值
    */
    async getData(arrJson, token, context) {
        let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7);
        let regNameData = this.webClientRegDataInfo[clientKey].shellRegData;
        let requestList = [];
        //在缓存中的数据点
        let cacheResponeData = [];
        arrJson.map((tag) => {
            //在数据点缓存中存在
            if (regNameData[tag.tagName]) {
                regNameData[tag.tagName].liveTime = new Date().getTime();
                cacheResponeData.push(regNameData[tag.tagName].value);
            } else {
                requestList.push({
                    tagName: tag.tagName,
                    parId: this.ModeProperty[tag.parName].id || 13
                });
                regNameData[tag.tagName] = {
                    liveTime: new Date().getTime(),
                    parId: this.ModeProperty[tag.parName].id || 13,
                    value: null
                };
            }
        })
        if (requestList.length === 0) return cacheResponeData;
        let responeData = await this.db.getData(requestList);
        if (this.isError(responeData.retCode)) {
            if (responeData.retCode == -19997) {
                //当前fcNode无法返回 -19997 错误
                console.log("部分错误");
                return [];
            } else if (responeData.data) {
                for (let i = 0; i < responeData.data.length; i++) {
                    regNameData[responeData.data[i].tagName].value = responeData.data[i];
                }
                return [...responeData.data, ...cacheResponeData];
            } else {
                console.log(responeData.retCode, { type: "error" });
                return [];
            }
        } else {
            this.isReConnect(responeData.retCode);
        }
    }
    /*
        功能:数据下置
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:
    */
    async setData(json, token, context) {
        return await this.db.setData(json);
    }
    /*
        功能:周期从数据源查询数据
        参数:无
        返回值:无
    */
    async pollRequest() {
        //构造请求结构
        let requestData = [];
        for (let key in this.GlobalRequestData) {
            const requestInfo = this.GlobalRequestData[key];
            requestData.push({
                tagName: requestInfo.tagName,
                parId: this.ModeProperty[requestInfo.parName].id || 13,
                globalRef: requestInfo
            })
        }
        if (requestData.length > 0) {
            //向服务端请求            
            let responeData = await this.db.getData(requestData);
            if (responeData && this.isError(responeData.retCode)) {
                if (responeData.retCode == -19997) {
                    //当前fcNode无法返回 -19997 错误
                    console.log("部分错误");
                    return [];
                } else if (responeData.data) {
                    this.cacheData(responeData.data, requestData);
                } else {
                    console.log(responeData.retCode, { type: "error" });
                    return [];
                }
            } else if (responeData) {
                this.isReConnect(responeData.retCode);
            }
        }
        setTimeout(this.pollRequest.bind(this), 1000);
    }
}


/***/ }),

/***/ "./real-server/lib/source/ps6.js":
/*!***************************************!*\
  !*** ./real-server/lib/source/ps6.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dataSourceBase = __webpack_require__(/*! ./base */ "./real-server/lib/source/base.js");
const _ = __webpack_require__(/*! lodash/core */ "./real-server/node_modules/lodash/core.js");
//数据操作请求
module.exports = class agentAdapter extends dataSourceBase {
	constructor(config) {
		super(config);
		//支持的模型属性
		this.ModeProperty = {
			name: {
				id: 1
			},
			pv: {
				id: 13
			},
			desc: {
				id: 12
			}
		}

		this.propIds = [0, 1, 2, 3, 5, 7, 11, 37, 39, 40];
		this.tagTree = {};
		this.nodeIdToTags = {};
	}
    /*
        功能:加载数据库点表
        参数:无
        返回值:无
    */
	async loadAllTags() {
		let result = await this.db.getTagQueryIds({
			'tagId': 0,
			'queryLevel': 0
		});
		if (this.isError(result.retCode)) {
			let tags = await this.db.getTagListProps({
				'tagIds': result.ids,
				'propIds': this.propIds
			})
			if (this.isError(tags.retCode)) {
				this.createTagTree(tags);
				console.log("实时库: " + this.config.ip + "  类型: " + this.config.type + "  状态: 已登录,测点加载成功", { type: "start" });
			}
		}
	}
    /*
        功能:构造点树结构
        参数:所有点及节点数组
        返回值:无
    */
	createTagTree(tags) {
		this.tagTree = {};
		if (tags.tagPropList) {
			//循环所有点数组。返回的为所有点和节点的一维数组。构造为已点id为树形名称的树形结构。
			for (let i = 0; i < tags.tagPropList.length; i++) {
				let once = tags.tagPropList[i];
				//once数组的下标由 this.propIds 请求的顺序和内容决定 
				if (once[6].data == 1) {
					if (this.nodeIdToTags[once[0].data]) {
						this.nodeIdToTags[once[0].data].name = once[2].data;
						this.nodeIdToTags[once[0].data].id = once[0].data;
						this.nodeIdToTags[once[0].data].type = once[1].data;
						this.nodeIdToTags[once[0].data].desc = once[4].data;
						this.nodeIdToTags[once[0].data].longName = once[3].data;
						this.nodeIdToTags[once[0].data].parentId = once[5].data;
					} else {
						this.nodeIdToTags[once[0].data] = {
							name: once[2].data,
							id: once[0].data,
							type: once[1].data,
							desc: once[4].data,
							longName: once[3].data,
							parentId: once[5].data,
							children: {}
						}
					}
				} else {
					if (this.nodeIdToTags[once[5].data]) {
						this.nodeIdToTags[once[5].data].children[once[2].data] = {
							name: once[2].data,
							id: once[0].data,
							type: once[1].data,
							desc: once[4].data,
							longName: once[3].data,
							parentId: once[5].data,
							alarmState: false,
							pv: {
								value: once[7].data,
								time: once[8].data,
								quality: once[9].data
							}
						};
					} else {
						if (once[5].data == 0) {
							this.nodeIdToTags[once[5].data] = {
								parentId: 0,
								children: {}
							}
						} else {
							this.nodeIdToTags[once[5].data] = {
								children: {}
							}
						}

						this.nodeIdToTags[once[5].data].children[once[2].data] = {
							name: once[2].data,
							id: once[0].data,
							type: once[1].data,
							desc: once[4].data,
							longName: once[3].data,
							parentId: once[5].data,
							alarmState: false,
							pv: {
								value: once[7].data,
								time: once[8].data,
								quality: once[9].data
							}
						}
					}
				}
			}
		}
		//由点id为树形名称的树结构构造为已点名称为树形名称的树结构
		//之所以不在上一步使用点名称构造树时应为不同节点下的点名称可以重名
		for (let p in this.nodeIdToTags) {
			//p == "0" 标示跟节点下的点。需要特殊处理
			if (p == "0" && this.nodeIdToTags[p].parentId == 0) {
				for (let p1 in this.nodeIdToTags[p].children) {
					var tempOne = this.nodeIdToTags[p].children[p1];
					this.tagTree[tempOne.name] = tempOne;
				}
			} else if (this.nodeIdToTags[p].parentId == 0) {
				this.tagTree[this.nodeIdToTags[p].name] = {
					desc: this.nodeIdToTags[p].desc,
					id: this.nodeIdToTags[p].id
				};
				for (let p1 in this.nodeIdToTags[p].children) {
					var tempOne = this.nodeIdToTags[p].children[p1];
					this.tagTree[this.nodeIdToTags[p].name][tempOne.name] = tempOne;
				}
			} else {
				var nameNodes = this.nodeIdToTags[p].longName.split("\\");
				var temp = this.tagTree;
				for (let j = 1; j < nameNodes.length - 1; j++) {
					if (temp[nameNodes[j]] == undefined) {
						temp[nameNodes[j]] = {
							desc: "",
							id: -1
						}
					}
					temp = temp[nameNodes[j]];
				}
				temp[this.nodeIdToTags[p].name] = {
					desc: this.nodeIdToTags[p].desc,
					id: this.nodeIdToTags[p].id
				}

				for (let p1 in this.nodeIdToTags[p].children) {
					var tempOne = this.nodeIdToTags[p].children[p1];
					temp[this.nodeIdToTags[p].name][tempOne.name] = tempOne;
				}
			}
		}
	}
    /*
        功能:获取历史数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:历史数据
    */
	async getHisData(json, token, context) {
		return await this.db.getHisData(json);
	}
    /*
        功能:获取报警数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:报警数据
    */
	async getAlmData(json, token, context) {
		let layInfo = await this.db.getLayer();
		let layIds = [];
		if (layInfo.length > 0) {
			layInfo.map((lay) => {
				layIds.push(parseInt(lay.layerId));
			});
		}
		return this.db.getAlarmByArea(layIds);

	}

    /*
        功能:获取实时数据
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:此链接的变化实时值
    */
	async getData(arrJson, token, context) {
		let clientKey = (context.remoteAddress.address + ":" + context.remoteAddress.port).slice(7);
		let regNameData = this.webClientRegDataInfo[clientKey].shellRegData;
		let requestList = [];
		//在缓存中的数据点
		let cacheResponeData = [];
		arrJson.map((tag) => {
			//在数据点缓存中存在
			if (regNameData[tag.tagName]) {
				regNameData[tag.tagName].liveTime = new Date().getTime();
				cacheResponeData.push(regNameData[tag.tagName].value);
			} else {
				requestList.push({
					tagName: tag.tagName,
					parId: this.ModeProperty[tag.parName].id || 13
				});
				regNameData[tag.tagName] = {
					liveTime: new Date().getTime(),
					parId: this.ModeProperty[tag.parName].id || 13,
					value: null
				};
			}
		})
		if (requestList.length === 0) return cacheResponeData;
		let responeData = await this.db.getData(requestList);
		if (this.isError(responeData.retCode)) {
			if (responeData.retCode == -19997) {
				//当前fcNode无法返回 -19997 错误
				console.log("部分错误");
				return [];
			} else if (responeData.data) {
				for (let i = 0; i < responeData.data.length; i++) {
					regNameData[responeData.data[i].tagName].value = responeData.data[i];
				}
				return [...responeData.data, ...cacheResponeData];
			} else {
				console.log(responeData.retCode, { type: "error" });
				return [];
			}
		} else {
			this.isReConnect(responeData.retCode);
		}
	}
    /*
        功能:数据下置
        参数:json:请求信息。
            token:暂未起效。
            context:连接信息。
        返回值:
    */
	async setData(json, token, context) {
		return await this.db.setData(json);
	}
}

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/ByteStream.js":
/*!***************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/ByteStream.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ByteStream.ts                                            |
|                                                          |
| hprose ByteStream for TypeScript.                        |
|                                                          |
| LastModified: Jan 15, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var EMPTY_BYTES = new Uint8Array(0);
var INIT_SIZE = 1024;
function writeInt32BE(bytes, offset, value) {
    bytes[offset++] = value >>> 24 & 0xFF;
    bytes[offset++] = value >>> 16 & 0xFF;
    bytes[offset++] = value >>> 8 & 0xFF;
    bytes[offset++] = value & 0xFF;
    return offset;
}
exports.writeInt32BE = writeInt32BE;
function writeInt32LE(bytes, offset, value) {
    bytes[offset++] = value & 0xFF;
    bytes[offset++] = value >>> 8 & 0xFF;
    bytes[offset++] = value >>> 16 & 0xFF;
    bytes[offset++] = value >>> 24 & 0xFF;
    return offset;
}
exports.writeInt32LE = writeInt32LE;
function pow2roundup(value) {
    --value;
    value |= value >> 1;
    value |= value >> 2;
    value |= value >> 4;
    value |= value >> 8;
    value |= value >> 16;
    return value + 1;
}
var arrayLikeObjectArgumentsEnabled = true;
try {
    fromCharCode(new Uint8Array([1, 2]));
}
catch (e) {
    arrayLikeObjectArgumentsEnabled = false;
}
function toArray(arraylike) {
    var n = arraylike.length;
    var array = new Array(n);
    for (var i = 0; i < n; ++i) {
        array[i] = arraylike[i];
    }
    return array;
}
function fromCharCode(charCodes) {
    if (arrayLikeObjectArgumentsEnabled) {
        return String.fromCharCode.apply(String, charCodes);
    }
    return String.fromCharCode.apply(String, toArray(charCodes));
}
function readString(bytes, charLength) {
    if (charLength < 0)
        charLength = bytes.length;
    if (charLength === 0)
        return ['', 0];
    var charOffset = 0;
    var byteOffset = 0;
    var n = (charLength < 0x7FFF) ? charLength : 0x7FFF;
    var charCodes = new Uint16Array(n + 1);
    var byteLength = bytes.length;
    var buf = [];
    do {
        for (; charOffset < n && byteOffset < byteLength; charOffset++) {
            var unit = bytes[byteOffset++];
            switch (unit >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    charCodes[charOffset] = unit;
                    break;
                case 12:
                case 13:
                    if (byteOffset < byteLength) {
                        charCodes[charOffset] = ((unit & 0x1F) << 6)
                            | (bytes[byteOffset++] & 0x3F);
                        break;
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                case 14:
                    if (byteOffset + 1 < byteLength) {
                        charCodes[charOffset] = ((unit & 0x0F) << 12)
                            | ((bytes[byteOffset++] & 0x3F) << 6)
                            | (bytes[byteOffset++] & 0x3F);
                        break;
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                case 15:
                    if (byteOffset + 2 < byteLength) {
                        var rune = (((unit & 0x07) << 18)
                            | ((bytes[byteOffset++] & 0x3F) << 12)
                            | ((bytes[byteOffset++] & 0x3F) << 6)
                            | (bytes[byteOffset++] & 0x3F)) - 0x10000;
                        if (0 <= rune && rune <= 0xFFFFF) {
                            charCodes[charOffset++] = (((rune >> 10) & 0x03FF) | 0xD800);
                            charCodes[charOffset] = ((rune & 0x03FF) | 0xDC00);
                            break;
                        }
                        throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                default:
                    throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        buf.push(fromCharCode(charCodes.subarray(0, charOffset)));
        charLength -= charOffset;
        charOffset = 0;
        if (n > charLength)
            n = charLength;
    } while (charOffset < charLength && byteOffset < byteLength);
    return [buf.length === 1 ? buf[0] : buf.join(''), byteOffset];
}
function fromUint8Array(bytes) {
    return readString(bytes, bytes.length)[0];
}
exports.fromUint8Array = fromUint8Array;
function toBinaryString(bytes) {
    var data = (bytes instanceof Uint8Array) ? bytes : new Uint8Array(bytes);
    var n = data.length;
    if (n === 0)
        return '';
    if (n < 0xFFFF)
        return fromCharCode(data);
    var remain = n & 0x7FFF;
    var count = n >> 15;
    var buf = new Array(remain ? count + 1 : count);
    for (var i = 0; i < count; ++i)
        buf[i] = fromCharCode(data.subarray(i << 15, (i + 1) << 15));
    if (remain)
        buf[count] = fromCharCode(data.subarray(count << 15, n));
    return buf.join('');
}
exports.toBinaryString = toBinaryString;
var ByteStream = /** @class */ (function () {
    function ByteStream(value) {
        this.buffer = EMPTY_BYTES;
        this.size = 0;
        this.offset = 0;
        this.rmark = 0;
        this.wmark = 0;
        if (value) {
            if (typeof value === 'number') {
                this.buffer = new Uint8Array(value);
            }
            else if (typeof value === 'string') {
                this.writeString(value);
            }
            else {
                if (value instanceof ByteStream) {
                    this.buffer = value.toBytes();
                }
                else if (value instanceof Uint8Array) {
                    this.buffer = value;
                }
                else if (value instanceof Uint8ClampedArray) {
                    this.buffer = new Uint8Array(value.buffer, value.byteOffset, value.length);
                }
                else {
                    this.buffer = new Uint8Array(value);
                }
                this.size = value.length;
            }
            this.mark();
        }
    }
    /**
     * Decodes data to a string according to the Type.
     * @param data to be decoded to a string.
     */
    ByteStream.toString = function (data) {
        if (data === undefined)
            return Object.toString.apply(ByteStream);
        if (typeof data === 'string')
            return data;
        if (data instanceof ByteStream)
            return data.toString();
        if (data instanceof Uint8Array)
            return fromUint8Array(data);
        if (data instanceof ArrayBuffer)
            return fromUint8Array(new Uint8Array(data, 0));
        return fromCharCode(data);
    };
    ByteStream.prototype.grow = function (n) {
        var capacity = this.capacity;
        n = this.size + n;
        if (n > capacity) {
            if (capacity > 0) {
                var buf = new Uint8Array(pow2roundup(n));
                buf.set(this.buffer);
                this.buffer = buf;
            }
            else {
                this.buffer = new Uint8Array(Math.max(pow2roundup(n), INIT_SIZE));
            }
        }
    };
    Object.defineProperty(ByteStream.prototype, "capacity", {
        /**
         * Returns the current capacity of this stream.
         */
        get: function () {
            return this.buffer.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteStream.prototype, "length", {
        /**
         * Returns the current length of the data in this stream.
         */
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteStream.prototype, "position", {
        /**
         * Returns the position of the next reading operation in this stream.
         */
        get: function () {
            return this.offset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteStream.prototype, "bytes", {
        /**
         * Returns all bytes data in this stream.
         * If the returned data is changed, the data in this stream will be also changed.
         */
        get: function () {
            return this.buffer.subarray(0, this.size);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteStream.prototype, "remains", {
        /**
         * Returns all bytes data in this stream that has not been read.
         * If the returned data is changed, the data in this stream will be also changed.
         */
        get: function () {
            return this.buffer.subarray(this.offset, this.size);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets this stream's mark at its reading and writing position.
     */
    ByteStream.prototype.mark = function () {
        this.wmark = this.size;
        this.rmark = this.offset;
    };
    /**
     * Resets this stream's reading and writing position to the previously-marked position.
     * Invoking this method neither changes nor discards the mark's value.
     */
    ByteStream.prototype.reset = function () {
        this.size = this.wmark;
        this.offset = this.rmark;
    };
    /**
     * Clears this stream.
     * The position is set to zero, the limit is set to the capacity, and the mark is discarded.
     */
    ByteStream.prototype.clear = function () {
        this.buffer = EMPTY_BYTES;
        this.size = 0;
        this.offset = 0;
        this.wmark = 0;
        this.rmark = 0;
    };
    /**
     * Writes a byte to the stream as a 1-byte value.
     * @param byte a byte value to be written.
     */
    ByteStream.prototype.writeByte = function (byte) {
        this.grow(1);
        this.buffer[this.size++] = byte;
    };
    /**
     * Writes value to this stream with big endian format.
     * @param value number to be written to this stream. value should be a valid signed 32-bit integer.
     * TypeError will be throwed when value is anything other than a signed 32-bit integer.
     */
    ByteStream.prototype.writeInt32BE = function (value) {
        if (value !== (value | 0)) {
            throw new TypeError('value is out of bounds');
        }
        this.grow(4);
        this.size = writeInt32BE(this.buffer, this.size, value);
    };
    /**
     * Writes value to this stream with big endian format.
     * @param value number to be written to this stream. value should be a valid unsigned 32-bit integer.
     * TypeError will be throwed when value is anything other than an unsigned 32-bit integer.
     */
    ByteStream.prototype.writeUInt32BE = function (value) {
        if (value < 0 || value !== (value | 0) && (value & 0x7FFFFFFF) + 0x80000000 !== value) {
            throw new TypeError('value is out of bounds');
        }
        this.grow(4);
        this.size = writeInt32BE(this.buffer, this.size, value | 0);
    };
    /**
     * Writes value to this stream with little endian format.
     * @param value number to be written to this stream. value should be a valid signed 32-bit integer.
     * TypeError will be throwed when value is anything other than a signed 32-bit integer.
     */
    ByteStream.prototype.writeInt32LE = function (value) {
        if (value !== (value | 0)) {
            throw new TypeError('value is out of bounds');
        }
        this.grow(4);
        this.size = writeInt32LE(this.buffer, this.size, value);
    };
    /**
     * Writes value to this stream with little endian format.
     * @param value number to be written to this stream. value should be a valid unsigned 32-bit integer.
     * TypeError will be throwed when value is anything other than an unsigned 32-bit integer.
     */
    ByteStream.prototype.writeUInt32LE = function (value) {
        if (value < 0 || value !== (value | 0) && (value & 0x7FFFFFFF) + 0x80000000 !== value) {
            throw new TypeError('value is out of bounds');
        }
        this.grow(4);
        this.size = writeInt32LE(this.buffer, this.size, value | 0);
    };
    /**
     * Writes binary data to this stream.
     * @param data to be written to this stream.
     */
    ByteStream.prototype.write = function (data) {
        var n = (data instanceof ArrayBuffer) ? data.byteLength : data.length;
        if (n === 0)
            return;
        this.grow(n);
        var bytes = this.buffer;
        var offset = this.size;
        if (data instanceof ByteStream) {
            bytes.set(data.bytes, offset);
        }
        else if (data instanceof ArrayBuffer) {
            bytes.set(new Uint8Array(data), offset);
        }
        else {
            bytes.set(data, offset);
        }
        this.size += n;
    };
    /**
     * Writes str to this stream with ascii encoding.
     * @param str to be written to this stream.
     */
    ByteStream.prototype.writeAsciiString = function (str) {
        var n = str.length;
        if (n === 0)
            return;
        this.grow(n);
        var bytes = this.buffer.subarray(this.size);
        for (var i = 0; i < n; ++i) {
            bytes[i] = str.charCodeAt(i);
        }
        this.size += n;
    };
    /**
     * Writes str to this stream with utf8 encoding.
     * @param str to be written to this stream.
     */
    ByteStream.prototype.writeString = function (str) {
        var n = str.length;
        if (n === 0)
            return;
        // The single code unit occupies up to 3 bytes.
        this.grow(n * 3);
        var bytes = this.buffer;
        var offset = this.size;
        for (var i = 0; i < n; ++i) {
            var charCode = str.charCodeAt(i);
            if (charCode < 0x80) {
                bytes[offset++] = charCode;
            }
            else if (charCode < 0x800) {
                bytes[offset++] = 0xC0 | (charCode >> 6);
                bytes[offset++] = 0x80 | (charCode & 0x3F);
            }
            else if (charCode < 0xD800 || charCode > 0xDFFF) {
                bytes[offset++] = 0xE0 | (charCode >> 12);
                bytes[offset++] = 0x80 | ((charCode >> 6) & 0x3F);
                bytes[offset++] = 0x80 | (charCode & 0x3F);
            }
            else {
                if (i + 1 < n) {
                    var nextCharCode = str.charCodeAt(i + 1);
                    if (charCode < 0xDC00 && 0xDC00 <= nextCharCode && nextCharCode <= 0xDFFF) {
                        var rune = (((charCode & 0x03FF) << 10) | (nextCharCode & 0x03FF)) + 0x010000;
                        bytes[offset++] = 0xF0 | (rune >> 18);
                        bytes[offset++] = 0x80 | ((rune >> 12) & 0x3F);
                        bytes[offset++] = 0x80 | ((rune >> 6) & 0x3F);
                        bytes[offset++] = 0x80 | (rune & 0x3F);
                        ++i;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        this.size = offset;
    };
    /**
     * Reads and returns a single byte.
     * If no byte is available, returns -1.
     */
    ByteStream.prototype.readByte = function () {
        if (this.offset >= this.size)
            return -1;
        return this.buffer[this.offset++];
    };
    /**
     * Reads a signed 32-bit integer from this stream with the big endian format.
     * If the remaining data is less than 4 bytes, Error('EOF') will be throw.
     */
    ByteStream.prototype.readInt32BE = function () {
        var bytes = this.buffer;
        var offset = this.offset;
        if (offset + 3 >= this.size) {
            throw new Error('EOF');
        }
        var result = bytes[offset++] << 24 | bytes[offset++] << 16 | bytes[offset++] << 8 | bytes[offset++];
        this.offset = offset;
        return result;
    };
    /**
     * Reads an unsigned 32-bit integer from this stream with the big endian format.
     * If the remaining data is less than 4 bytes, Error('EOF') will be throw.
     */
    ByteStream.prototype.readUInt32BE = function () {
        var result = this.readInt32BE();
        if (result >= 0)
            return result;
        return (result & 0x7FFFFFFF) + 0x80000000;
    };
    /**
     * Reads a signed 32-bit integer from this stream with the little endian format.
     * If the remaining data is less than 4 bytes, Error('EOF') will be throw.
     */
    ByteStream.prototype.readInt32LE = function () {
        var bytes = this.buffer;
        var offset = this.offset;
        if (offset + 3 >= this.size) {
            throw new Error('EOF');
        }
        var result = bytes[offset++] | bytes[offset++] << 8 | bytes[offset++] << 16 | bytes[offset++] << 24;
        this.offset = offset;
        return result;
    };
    /**
     * Reads an unsigned 32-bit integer from this stream with the little endian format.
     * If the remaining data is less than 4 bytes, Error('EOF') will be throw.
     */
    ByteStream.prototype.readUInt32LE = function () {
        var result = this.readInt32LE();
        if (result >= 0)
            return result;
        return (result & 0x7FFFFFFF) + 0x80000000;
    };
    /**
     * Reads n bytes of data from this stream and returns the result as a Uint8Array.
     * If n is negative, reads to the end of this stream.
     * @param n The maximum number of bytes to read.
     */
    ByteStream.prototype.read = function (n) {
        if (n < 0 || this.offset + n > this.size)
            n = this.size - this.offset;
        if (n === 0)
            return EMPTY_BYTES;
        return this.buffer.subarray(this.offset, this.offset += n);
    };
    /**
     * Skips over and discards n bytes of data from this stream.
     * The actual number of bytes skipped is returned.
     * If n is negative, all remaining bytes are skipped.
     * @param n the number of bytes to be skipped.
     */
    ByteStream.prototype.skip = function (n) {
        if (n === 0)
            return 0;
        if (n < 0 || this.offset + n > this.size) {
            n = this.size - this.offset;
            this.offset = this.size;
        }
        else {
            this.offset += n;
        }
        return n;
    };
    /**
     * Returns a Uint8Array from the current position to the delimiter. The result includes delimiter.
     * Returns all remaining data if no delimiter is found.
     * After this method is called, The new position is after the delimiter.
     * @param delimiter a byte, which represents the end of reading data.
     */
    ByteStream.prototype.readBytes = function (delimiter) {
        var pos = this.buffer.indexOf(delimiter, this.offset);
        var result;
        if (pos === -1) {
            result = this.buffer.subarray(this.offset, this.size);
            this.offset = this.size;
        }
        else {
            result = this.buffer.subarray(this.offset, pos + 1);
            this.offset = pos + 1;
        }
        return result;
    };
    /**
     * Returns a string from the current position to the delimiter. The result doesn't include delimiter.
     * Returns all remaining data if no delimiter is found.
     * After this method is called, the new position is after the delimiter.
     * @param delimiter a byte, which represents the end of reading data.
     */
    ByteStream.prototype.readUntil = function (delimiter) {
        var pos = this.buffer.indexOf(delimiter, this.offset);
        var result = '';
        if (pos === this.offset) {
            this.offset++;
        }
        else if (pos === -1) {
            result = fromUint8Array(this.buffer.subarray(this.offset, this.size));
            this.offset = this.size;
        }
        else {
            result = fromUint8Array(this.buffer.subarray(this.offset, pos));
            this.offset = pos + 1;
        }
        return result;
    };
    /**
     * Reads n bytes of data from this stream and returns the result as an ascii string.
     * If n is negative, reads to the end of this stream.
     * @param n The maximum number of bytes to read.
     */
    ByteStream.prototype.readAsciiString = function (n) {
        return toBinaryString(this.read(n));
    };
    /**
     * Returns a Uint8Array containing a string of length n.
     * If n is negative, reads to the end of this stream.
     * @param n is the string(UTF16) length.
     */
    ByteStream.prototype.readStringAsBytes = function (n) {
        if (n === 0)
            return EMPTY_BYTES;
        var bytes = this.buffer.subarray(this.offset, this.size);
        if (n < 0) {
            this.offset = this.size;
            return bytes;
        }
        var offset = 0;
        for (var i = 0, length_1 = bytes.length; i < n && offset < length_1; i++) {
            var unit = bytes[offset++];
            switch (unit >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                case 12:
                case 13:
                    if (offset < length_1) {
                        offset++;
                        break;
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                case 14:
                    if (offset + 1 < length_1) {
                        offset += 2;
                        break;
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                case 15:
                    if (offset + 2 < length_1) {
                        var rune = (((unit & 0x07) << 18)
                            | ((bytes[offset++] & 0x3F) << 12)
                            | ((bytes[offset++] & 0x3F) << 6)
                            | (bytes[offset++] & 0x3F)) - 0x10000;
                        if (0 <= rune && rune <= 0xFFFFF) {
                            i++;
                            break;
                        }
                        throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                    }
                    throw new Error('Unfinished UTF-8 octet sequence');
                default:
                    throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        this.offset += offset;
        return bytes.subarray(0, offset);
    };
    /**
     * Returns a string of length n.
     * If n is negative, reads to the end of this stream.
     * @param n is the string(UTF16) length.
     */
    ByteStream.prototype.readString = function (n) {
        var _a = readString(this.buffer.subarray(this.offset, this.size), n), str = _a[0], length = _a[1];
        this.offset += length;
        return str;
    };
    /**
     * Returns a view of the the internal buffer and clears `this`.
     */
    ByteStream.prototype.takeBytes = function () {
        var bytes = this.bytes;
        this.clear();
        return bytes;
    };
    /**
     * Returns a copy of the current contents and leaves `this` intact.
     */
    ByteStream.prototype.toBytes = function () {
        return new Uint8Array(this.bytes);
    };
    /**
     * Returns a string representation of this stream.
     */
    ByteStream.prototype.toString = function () {
        return fromUint8Array(this.bytes);
    };
    /**
     * Creates an exact copy of this stream.
     */
    ByteStream.prototype.clone = function () {
        return new ByteStream(this.toBytes());
    };
    /**
     * Truncates this stream, only leaves the unread data.
     * The position is reset to 0.
     * The mark is cleared.
     */
    ByteStream.prototype.trunc = function () {
        this.buffer = this.remains;
        this.size = this.buffer.length;
        this.offset = 0;
        this.wmark = 0;
        this.rmark = 0;
    };
    return ByteStream;
}());
exports.ByteStream = ByteStream;
//# sourceMappingURL=ByteStream.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/Deserializer.js":
/*!*****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/Deserializer.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Deserializer.ts                                          |
|                                                          |
| hprose Deserializer for TypeScript.                      |
|                                                          |
| LastModified: Mar 29, 2029                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ./ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var ArrayDeserializer_1 = __webpack_require__(/*! ./deserializers/ArrayDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/ArrayDeserializer.js");
var TypedArrayDeserializer_1 = __webpack_require__(/*! ./deserializers/TypedArrayDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/TypedArrayDeserializer.js");
var FunctionDeserializer_1 = __webpack_require__(/*! ./deserializers/FunctionDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/FunctionDeserializer.js");
var NumberDeserializer_1 = __webpack_require__(/*! ./deserializers/NumberDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/NumberDeserializer.js");
var BooleanDeserializer_1 = __webpack_require__(/*! ./deserializers/BooleanDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BooleanDeserializer.js");
var StringDeserializer_1 = __webpack_require__(/*! ./deserializers/StringDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/StringDeserializer.js");
var DateDeserializer_1 = __webpack_require__(/*! ./deserializers/DateDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/DateDeserializer.js");
var ByteStreamDeserializer_1 = __webpack_require__(/*! ./deserializers/ByteStreamDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/ByteStreamDeserializer.js");
var SetDeserializer_1 = __webpack_require__(/*! ./deserializers/SetDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/SetDeserializer.js");
var MapDeserializer_1 = __webpack_require__(/*! ./deserializers/MapDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/MapDeserializer.js");
var GuidDeserializer_1 = __webpack_require__(/*! ./deserializers/GuidDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/GuidDeserializer.js");
var ErrorDeserializer_1 = __webpack_require__(/*! ./deserializers/ErrorDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/ErrorDeserializer.js");
var NullDeserializer_1 = __webpack_require__(/*! ./deserializers/NullDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/NullDeserializer.js");
var DefaultDeserializer_1 = __webpack_require__(/*! ./deserializers/DefaultDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/DefaultDeserializer.js");
var guid_typescript_1 = __webpack_require__(/*! guid-typescript */ "guid-typescript");
var deserializers = new Map();
function register(type, deserializer) {
    deserializers.set(type, deserializer);
}
exports.register = register;
function getInstance(type) {
    if (type) {
        switch (type) {
            case Function: return FunctionDeserializer_1.FunctionDeserializer.instance;
            case Number: return NumberDeserializer_1.NumberDeserializer.instance;
            case Boolean: return BooleanDeserializer_1.BooleanDeserializer.instance;
            case String: return StringDeserializer_1.StringDeserializer.instance;
            case Date: return DateDeserializer_1.DateDeserializer.instance;
            case Array: return ArrayDeserializer_1.ArrayDeserializer.instance;
            case ByteStream_1.ByteStream: return ByteStreamDeserializer_1.ByteStreamDeserializer.instance;
            case Uint8Array: return TypedArrayDeserializer_1.Uint8ArrayDeserializer.instance;
            case Uint8ClampedArray: return TypedArrayDeserializer_1.Uint8ClampedArrayDeserializer.instance;
            case Uint16Array: return TypedArrayDeserializer_1.Uint16ArrayDeserializer.instance;
            case Uint32Array: return TypedArrayDeserializer_1.Uint32ArrayDeserializer.instance;
            case Int8Array: return TypedArrayDeserializer_1.Int8ArrayDeserializer.instance;
            case Int16Array: return TypedArrayDeserializer_1.Int16ArrayDeserializer.instance;
            case Int32Array: return TypedArrayDeserializer_1.Int32ArrayDeserializer.instance;
            case Float32Array: return TypedArrayDeserializer_1.Float32ArrayDeserializer.instance;
            case Float64Array: return TypedArrayDeserializer_1.Float64ArrayDeserializer.instance;
            case Set: return SetDeserializer_1.SetDeserializer.instance;
            case Map: return MapDeserializer_1.MapDeserializer.instance;
            case guid_typescript_1.Guid: return GuidDeserializer_1.GuidDeserializer.instance;
            case Error: return ErrorDeserializer_1.ErrorDeserializer.instance;
        }
        var deserializer = deserializers.get(type);
        if (deserializer !== undefined)
            return deserializer;
    }
    if (type === null)
        return NullDeserializer_1.NullDeserializer.instance;
    return DefaultDeserializer_1.DefaultDeserializer.instance;
}
exports.getInstance = getInstance;
//# sourceMappingURL=Deserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/Formatter.js":
/*!**************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/Formatter.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Formatter.ts                                             |
|                                                          |
| hprose Formatter for TypeScript.                         |
|                                                          |
| LastModified: Feb 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ./ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var Writer_1 = __webpack_require__(/*! ./Writer */ "./real-server/node_modules/@hprose/io/lib/Writer.js");
var Reader_1 = __webpack_require__(/*! ./Reader */ "./real-server/node_modules/@hprose/io/lib/Reader.js");
function serialize(value, simple, utc) {
    var stream = new ByteStream_1.ByteStream();
    var writer = new Writer_1.Writer(stream, simple, utc);
    writer.serialize(value);
    return stream.bytes;
}
exports.serialize = serialize;
function deserialize(stream, type, simple) {
    if (!(stream instanceof ByteStream_1.ByteStream)) {
        stream = new ByteStream_1.ByteStream(stream);
    }
    var reader = new Reader_1.Reader(stream, simple);
    return reader.deserialize(type);
}
exports.deserialize = deserialize;
//# sourceMappingURL=Formatter.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/Reader.js":
/*!***********************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/Reader.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Reader.ts                                                |
|                                                          |
| hprose Reader for TypeScript.                            |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ValueReader_1 = __webpack_require__(/*! ./ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js");
var TypeManager = __importStar(__webpack_require__(/*! ./TypeManager */ "./real-server/node_modules/@hprose/io/lib/TypeManager.js"));
var Deserializer = __importStar(__webpack_require__(/*! ./Deserializer */ "./real-server/node_modules/@hprose/io/lib/Deserializer.js"));
__webpack_require__(/*! ./deserializers/BigIntDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BigIntDeserializer.js");
__webpack_require__(/*! ./deserializers/BigIntArrayDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BigIntArrayDeserializer.js");
var ReaderRefer = /** @class */ (function () {
    function ReaderRefer() {
        this.ref = [];
    }
    Object.defineProperty(ReaderRefer.prototype, "lastIndex", {
        get: function () {
            return this.ref.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    ReaderRefer.prototype.add = function (value) {
        this.ref.push(value);
    };
    ReaderRefer.prototype.set = function (index, value) {
        this.ref[index] = value;
    };
    ReaderRefer.prototype.read = function (index) {
        return this.ref[index];
    };
    ReaderRefer.prototype.reset = function () {
        this.ref.length = 0;
    };
    return ReaderRefer;
}());
var Reader = /** @class */ (function () {
    function Reader(stream, simple) {
        if (simple === void 0) { simple = false; }
        this.stream = stream;
        this.ref = [];
        this.longType = 'number';
        this.dictType = 'object';
        this.simple = simple;
    }
    Object.defineProperty(Reader.prototype, "simple", {
        get: function () {
            return this.refer === undefined;
        },
        set: function (value) {
            this.refer = value ? undefined : new ReaderRefer();
        },
        enumerable: true,
        configurable: true
    });
    Reader.prototype.deserialize = function (type) {
        return Deserializer.getInstance(type).deserialize(this);
    };
    Reader.prototype.read = function (tag, type) {
        return Deserializer.getInstance(type).read(this, tag);
    };
    Reader.prototype.readClass = function () {
        var stream = this.stream;
        var name = ValueReader_1.readString(stream);
        var count = ValueReader_1.readCount(stream);
        var names = new Array(count);
        var strDeserialize = Deserializer.getInstance(String);
        for (var i = 0; i < count; ++i) {
            names[i] = strDeserialize.deserialize(this);
        }
        stream.readByte();
        this.ref.push({
            name: name,
            names: names,
            type: TypeManager.getType(name)
        });
    };
    Reader.prototype.getTypeInfo = function (index) {
        return this.ref[index];
    };
    Reader.prototype.readReference = function () {
        return this.refer ? this.refer.read(ValueReader_1.readInt(this.stream)) : undefined;
    };
    Reader.prototype.addReference = function (value) {
        if (this.refer)
            this.refer.add(value);
    };
    Reader.prototype.setReference = function (index, value) {
        if (this.refer)
            this.refer.set(index, value);
    };
    Object.defineProperty(Reader.prototype, "lastReferenceIndex", {
        get: function () {
            return this.refer ? this.refer.lastIndex : -1;
        },
        enumerable: true,
        configurable: true
    });
    Reader.prototype.reset = function () {
        if (this.refer)
            this.refer.reset();
        this.ref.length = 0;
    };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=Reader.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js":
/*!********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/ReferenceReader.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ReferenceReader.ts                                       |
|                                                          |
| hprose reference reader for TypeScript.                  |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ValueReader = __importStar(__webpack_require__(/*! ./ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
function readBytes(reader) {
    var result = ValueReader.readBytes(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readBytes = readBytes;
function readAsciiString(reader) {
    var result = ValueReader.readAsciiString(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readAsciiString = readAsciiString;
function readString(reader) {
    var result = ValueReader.readString(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readString = readString;
function readGuid(reader) {
    var result = ValueReader.readGuid(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readGuid = readGuid;
function readDateTime(reader) {
    var result = ValueReader.readDateTime(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readDateTime = readDateTime;
function readTime(reader) {
    var result = ValueReader.readTime(reader.stream);
    reader.addReference(result);
    return result;
}
exports.readTime = readTime;
function readArray(reader) {
    var stream = reader.stream;
    var count = ValueReader.readCount(stream);
    var a = new Array(count);
    reader.addReference(a);
    for (var i = 0; i < count; ++i) {
        a[i] = reader.deserialize();
    }
    stream.readByte();
    return a;
}
exports.readArray = readArray;
function readSet(reader) {
    var stream = reader.stream;
    var count = ValueReader.readCount(stream);
    var a = new Set();
    reader.addReference(a);
    for (var i = 0; i < count; ++i) {
        a.add(reader.deserialize());
    }
    stream.readByte();
    return a;
}
exports.readSet = readSet;
function readMap(reader) {
    var stream = reader.stream;
    var map = new Map();
    reader.addReference(map);
    var count = ValueReader.readCount(stream);
    for (; count > 0; --count) {
        var key = reader.deserialize();
        var value = reader.deserialize();
        map.set(key, value);
    }
    stream.readByte();
    return map;
}
exports.readMap = readMap;
function readObject(reader) {
    var stream = reader.stream;
    var index = ValueReader.readInt(stream, 123 /* TagOpenbrace */);
    var typeInfo = reader.getTypeInfo(index);
    var type = typeInfo.type;
    var obj = (type) ? new type() : {};
    reader.addReference(obj);
    var names = typeInfo.names;
    var count = names.length;
    for (var i = 0; i < count; ++i) {
        obj[names[i]] = reader.deserialize();
    }
    stream.readByte();
    return obj;
}
exports.readObject = readObject;
function readObjectAsMap(reader) {
    var stream = reader.stream;
    var index = ValueReader.readInt(stream, 123 /* TagOpenbrace */);
    var typeInfo = reader.getTypeInfo(index);
    var map = new Map();
    reader.addReference(map);
    var names = typeInfo.names;
    var count = names.length;
    for (var i = 0; i < count; ++i) {
        map.set(names[i], reader.deserialize());
    }
    stream.readByte();
    return map;
}
exports.readObjectAsMap = readObjectAsMap;
//# sourceMappingURL=ReferenceReader.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/Serializer.js":
/*!***************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/Serializer.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Serializer.ts                                            |
|                                                          |
| hprose Serializer for TypeScript.                        |
|                                                          |
| LastModified: Dec 18, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ./ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var BaseSerializer_1 = __webpack_require__(/*! ./serializers/BaseSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js");
var NumberSerializer_1 = __webpack_require__(/*! ./serializers/NumberSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/NumberSerializer.js");
var BooleanSerializer_1 = __webpack_require__(/*! ./serializers/BooleanSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BooleanSerializer.js");
var StringSerializer_1 = __webpack_require__(/*! ./serializers/StringSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/StringSerializer.js");
var DateSerializer_1 = __webpack_require__(/*! ./serializers/DateSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/DateSerializer.js");
var BytesSerializer_1 = __webpack_require__(/*! ./serializers/BytesSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BytesSerializer.js");
var GuidSerializer_1 = __webpack_require__(/*! ./serializers/GuidSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/GuidSerializer.js");
var TypedArraySerializer_1 = __webpack_require__(/*! ./serializers/TypedArraySerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/TypedArraySerializer.js");
var ArraySerializer_1 = __webpack_require__(/*! ./serializers/ArraySerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ArraySerializer.js");
var SetSerializer_1 = __webpack_require__(/*! ./serializers/SetSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/SetSerializer.js");
var MapSerializer_1 = __webpack_require__(/*! ./serializers/MapSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/MapSerializer.js");
var DictionarySerializer_1 = __webpack_require__(/*! ./serializers/DictionarySerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/DictionarySerializer.js");
var ObjectSerializer_1 = __webpack_require__(/*! ./serializers/ObjectSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ObjectSerializer.js");
var ErrorSerializer_1 = __webpack_require__(/*! ./serializers/ErrorSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ErrorSerializer.js");
var TypeManager = __importStar(__webpack_require__(/*! ./TypeManager */ "./real-server/node_modules/@hprose/io/lib/TypeManager.js"));
var ValueWriter_1 = __webpack_require__(/*! ./ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var guid_typescript_1 = __webpack_require__(/*! guid-typescript */ "guid-typescript");
var serializers = new Map();
var nullSerializer = new BaseSerializer_1.BaseSerializer();
var numberSerializer = new NumberSerializer_1.NumberSerializer();
var booleanSerializer = new BooleanSerializer_1.BooleanSerializer();
var stringSerializer = new StringSerializer_1.StringSerializer();
var dateSerializer = new DateSerializer_1.DateSerializer();
var bytesSerializer = new BytesSerializer_1.BytesSerializer();
var guidSerializer = new GuidSerializer_1.GuidSerializer();
var intArraySerializer = new TypedArraySerializer_1.TypedArraySerializer(ValueWriter_1.writeInteger);
var doubleArraySerializer = new TypedArraySerializer_1.TypedArraySerializer(ValueWriter_1.writeDouble);
var arraySerializer = new ArraySerializer_1.ArraySerializer();
var setSerializer = new SetSerializer_1.SetSerializer();
var mapSerializer = new MapSerializer_1.MapSerializer();
var dictionarySerializer = new DictionarySerializer_1.DictionarySerializer();
var errorSerializer = new ErrorSerializer_1.ErrorSerializer();
function register(type, serializer) {
    serializers.set(type, serializer);
}
exports.register = register;
function getInstance(value) {
    var type = value.constructor;
    switch (type) {
        case Function: return nullSerializer;
        case Number: return numberSerializer;
        case Boolean: return booleanSerializer;
        case String: return stringSerializer;
        case Date: return dateSerializer;
        case guid_typescript_1.Guid: return guidSerializer;
        case Array: return arraySerializer;
        case Set: return setSerializer;
        case Map: return mapSerializer;
        case ArrayBuffer:
        case Uint8Array:
        case Uint8ClampedArray:
        case ByteStream_1.ByteStream: return bytesSerializer;
        case Int8Array:
        case Int16Array:
        case Int32Array:
        case Uint16Array:
        case Uint32Array: return intArraySerializer;
        case Float32Array:
        case Float64Array: return doubleArraySerializer;
        case Error: return errorSerializer;
    }
    var serializer = serializers.get(type);
    if (serializer !== undefined)
        return serializer;
    if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Arguments]')
        return arraySerializer;
    if (value instanceof Error) {
        register(type, errorSerializer);
        return errorSerializer;
    }
    var name = TypeManager.getName(type);
    if (name === '')
        return dictionarySerializer;
    if (name === 'GeneratorFunction')
        return nullSerializer;
    if (name === 'AsyncFunction')
        return nullSerializer;
    var objectSerializer = new ObjectSerializer_1.ObjectSerializer(value, name);
    register(type, objectSerializer);
    return objectSerializer;
}
exports.getInstance = getInstance;
//# sourceMappingURL=Serializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/TypeManager.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/TypeManager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| TypeManager.ts                                           |
|                                                          |
| hprose TypeManager for TypeScript.                       |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var typeCache = Object.create(null);
var nameCache = new WeakMap();
if (!('name' in Function.prototype)) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            var ctor = this.toString();
            return ctor.substr(0, ctor.indexOf('(')).replace(/(^\s*function\s*)|(\s*$)/ig, '');
        },
        writable: false,
        enumerable: false,
        configurable: true
    });
}
/**
 * Registers a type.
 */
function register(type, name) {
    if (name === undefined)
        name = type.name;
    nameCache.set(type, name);
    typeCache[name] = type;
}
exports.register = register;
/**
 * Returns whether the name has been registered.
 */
function isRegistered(name) {
    return name in typeCache;
}
exports.isRegistered = isRegistered;
/**
 * Gets name by type.
 */
function getName(type) {
    if (!type)
        return '';
    var name = nameCache.get(type);
    if (name)
        return name;
    name = type.name;
    if (name === '' || name === 'Object')
        return '';
    nameCache.set(type, name);
    typeCache[name] = type;
    return name;
}
exports.getName = getName;
var root = null;
try {
    root = typeof global === 'object' ? global : window;
}
catch (e) { }
function loadType(name) {
    if (!root)
        return undefined;
    var obj = root;
    var names = name.split('.');
    for (var i = 0; i < names.length; i++) {
        obj = obj[names[i]];
        if (obj === undefined) {
            return undefined;
        }
    }
    if (typeof (obj) !== 'function')
        return undefined;
    return obj;
}
function findType(alias, positions, i, c) {
    if (i < positions.length) {
        alias[positions[i++]] = c;
        var type = findType(alias, positions, i, '.');
        if (type === undefined && i < positions.length) {
            type = findType(alias, positions, i, '_');
        }
        return type;
    }
    return loadType(alias.join(''));
}
/**
 * Gets type by name.
 */
function getType(name) {
    var type = typeCache[name];
    if (type)
        return type;
    type = loadType(name);
    if (type) {
        register(type, name);
        return type;
    }
    var positions = [];
    var pos = name.indexOf('_');
    while (pos >= 0) {
        positions[positions.length] = pos;
        pos = name.indexOf('_', pos + 1);
    }
    if (positions.length > 0) {
        var alias = name.split('');
        type = findType(alias, positions, 0, '.');
        if (type === undefined) {
            type = findType(alias, positions, 0, '_');
        }
        if (type) {
            register(type, name);
            return type;
        }
    }
    type = function () { };
    Object.defineProperty(type, 'name', { value: name });
    register(type, name);
    return type;
}
exports.getType = getType;
//# sourceMappingURL=TypeManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/ValueReader.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/ValueReader.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ValueReader.ts                                           |
|                                                          |
| hprose value reader for TypeScript.                      |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var guid_typescript_1 = __webpack_require__(/*! guid-typescript */ "guid-typescript");
function readInt(stream, tag) {
    if (tag === void 0) { tag = 59 /* TagSemicolon */; }
    var s = stream.readUntil(tag);
    if (s.length === 0)
        return 0;
    return parseInt(s, 10);
}
exports.readInt = readInt;
function readDouble(stream) {
    return parseFloat(stream.readUntil(59 /* TagSemicolon */));
}
exports.readDouble = readDouble;
function readInfinity(stream) {
    return ((stream.readByte() === 45 /* TagNeg */) ? -Infinity : Infinity);
}
exports.readInfinity = readInfinity;
function readCount(stream) {
    return readInt(stream, 123 /* TagOpenbrace */);
}
exports.readCount = readCount;
function readLength(stream) {
    return readInt(stream, 34 /* TagQuote */);
}
exports.readLength = readLength;
function readString(stream) {
    var n = readLength(stream);
    var result = stream.readString(n);
    stream.readByte();
    return result;
}
exports.readString = readString;
function readBytes(stream) {
    var n = readLength(stream);
    var result = stream.read(n);
    stream.readByte();
    return result;
}
exports.readBytes = readBytes;
function readAsciiString(stream) {
    var n = readLength(stream);
    var result = stream.readAsciiString(n);
    stream.readByte();
    return result;
}
exports.readAsciiString = readAsciiString;
function readGuid(stream) {
    stream.readByte();
    var result = guid_typescript_1.Guid.parse(stream.readAsciiString(36));
    stream.readByte();
    return result;
}
exports.readGuid = readGuid;
function read4Digit(stream) {
    var n = stream.readByte() - 0x30;
    n = n * 10 + stream.readByte() - 0x30;
    n = n * 10 + stream.readByte() - 0x30;
    return n * 10 + stream.readByte() - 0x30;
}
function read2Digit(stream) {
    var n = stream.readByte() - 0x30;
    return n * 10 + stream.readByte() - 0x30;
}
function readMillisecond(stream) {
    var millisecond = stream.readByte() - 0x30;
    millisecond = millisecond * 10 + stream.readByte() - 0x30;
    millisecond = millisecond * 10 + stream.readByte() - 0x30;
    var tag = stream.readByte();
    if ((tag >= 0x30) && (tag <= 0x39)) {
        stream.skip(2);
        tag = stream.readByte();
        if ((tag >= 0x30) && (tag <= 0x39)) {
            stream.skip(2);
            tag = stream.readByte();
        }
    }
    return [millisecond, tag];
}
function readTime(stream) {
    var _a;
    var hour = read2Digit(stream);
    var minute = read2Digit(stream);
    var second = read2Digit(stream);
    var millisecond = 0;
    var tag = stream.readByte();
    if (tag === 46 /* TagPoint */) {
        _a = readMillisecond(stream), millisecond = _a[0], tag = _a[1];
    }
    if (tag === 90 /* TagUTC */) {
        return new Date(Date.UTC(1970, 0, 1, hour, minute, second, millisecond));
    }
    return new Date(1970, 0, 1, hour, minute, second, millisecond);
}
exports.readTime = readTime;
function readDateTime(stream) {
    var _a;
    var year = read4Digit(stream);
    var month = read2Digit(stream) - 1;
    var day = read2Digit(stream);
    var tag = stream.readByte();
    if (tag === 84 /* TagTime */) {
        var hour = read2Digit(stream);
        var minute = read2Digit(stream);
        var second = read2Digit(stream);
        var millisecond = 0;
        tag = stream.readByte();
        if (tag === 46 /* TagPoint */) {
            _a = readMillisecond(stream), millisecond = _a[0], tag = _a[1];
        }
        if (tag === 90 /* TagUTC */) {
            return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
        }
        return new Date(year, month, day, hour, minute, second, millisecond);
    }
    if (tag === 90 /* TagUTC */) {
        return new Date(Date.UTC(year, month, day));
    }
    return new Date(year, month, day);
}
exports.readDateTime = readDateTime;
//# sourceMappingURL=ValueReader.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/ValueWriter.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ValueWriter.ts                                           |
|                                                          |
| hprose value writer for TypeScript.                      |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
function writeInteger(stream, value) {
    if (0 <= value && value <= 9) {
        stream.writeByte(0x30 + value);
    }
    else {
        if (value === (value | 0)) {
            stream.writeByte(105 /* TagInteger */);
        }
        else {
            stream.writeByte(108 /* TagLong */);
        }
        stream.writeAsciiString('' + value);
        stream.writeByte(59 /* TagSemicolon */);
    }
}
exports.writeInteger = writeInteger;
function writeDouble(stream, value) {
    if (isNaN(value)) {
        stream.writeByte(78 /* TagNaN */);
    }
    else if (isFinite(value)) {
        stream.writeByte(100 /* TagDouble */);
        stream.writeAsciiString('' + value);
        stream.writeByte(59 /* TagSemicolon */);
    }
    else {
        stream.writeByte(73 /* TagInfinity */);
        stream.writeByte((value > 0) ? 43 /* TagPos */ : 45 /* TagNeg */);
    }
}
exports.writeDouble = writeDouble;
function writeBigInt(stream, value) {
    if (0 <= value && value <= 9) {
        stream.writeByte(0x30 + Number(value));
    }
    else {
        stream.writeByte(108 /* TagLong */);
        stream.writeAsciiString('' + value);
        stream.writeByte(59 /* TagSemicolon */);
    }
}
exports.writeBigInt = writeBigInt;
function writeStringBody(stream, value) {
    var n = value.length;
    if (n > 0)
        stream.writeAsciiString('' + n);
    stream.writeByte(34 /* TagQuote */);
    stream.writeString(value);
    stream.writeByte(34 /* TagQuote */);
}
exports.writeStringBody = writeStringBody;
function writeUTCDate(stream, value) {
    var year = value.getUTCFullYear();
    var month = value.getUTCMonth() + 1;
    var day = value.getUTCDate();
    var hour = value.getUTCHours();
    var minute = value.getUTCMinutes();
    var second = value.getUTCSeconds();
    var millisecond = value.getUTCMilliseconds();
    writeDateTime(stream, year, month, day, hour, minute, second, millisecond, true);
}
exports.writeUTCDate = writeUTCDate;
function writeLocalDate(stream, value) {
    var year = value.getFullYear();
    var month = value.getMonth() + 1;
    var day = value.getDate();
    var hour = value.getHours();
    var minute = value.getMinutes();
    var second = value.getSeconds();
    var millisecond = value.getMilliseconds();
    writeDateTime(stream, year, month, day, hour, minute, second, millisecond, false);
}
exports.writeLocalDate = writeLocalDate;
function writeDateTime(stream, year, month, day, hour, minute, second, millisecond, utc) {
    if ((hour === 0) && (minute === 0) && (second === 0) && (millisecond === 0)) {
        writeDate(stream, year, month, day);
    }
    else if ((year === 1970) && (month === 1) && (day === 1)) {
        writeTime(stream, hour, minute, second, millisecond);
    }
    else {
        writeDate(stream, year, month, day);
        writeTime(stream, hour, minute, second, millisecond);
    }
    stream.writeByte(utc ? 90 /* TagUTC */ : 59 /* TagSemicolon */);
}
exports.writeDateTime = writeDateTime;
function writeDate(stream, year, month, day) {
    stream.writeByte(68 /* TagDate */);
    stream.writeAsciiString(('0000' + year).slice(-4));
    stream.writeAsciiString(('00' + month).slice(-2));
    stream.writeAsciiString(('00' + day).slice(-2));
}
exports.writeDate = writeDate;
function writeTime(stream, hour, minute, second, millisecond) {
    stream.writeByte(84 /* TagTime */);
    stream.writeAsciiString(('00' + hour).slice(-2));
    stream.writeAsciiString(('00' + minute).slice(-2));
    stream.writeAsciiString(('00' + second).slice(-2));
    if (millisecond > 0) {
        stream.writeByte(46 /* TagPoint */);
        stream.writeAsciiString(('000' + millisecond).slice(-3));
    }
}
exports.writeTime = writeTime;
//# sourceMappingURL=ValueWriter.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/Writer.js":
/*!***********************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/Writer.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Writer.ts                                                |
|                                                          |
| hprose Writer for TypeScript.                            |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Serializer = __importStar(__webpack_require__(/*! ./Serializer */ "./real-server/node_modules/@hprose/io/lib/Serializer.js"));
__webpack_require__(/*! ./serializers/BigIntSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BigIntSerializer.js");
__webpack_require__(/*! ./serializers/BigIntArraySerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BigIntArraySerializer.js");
var WriterRefer = /** @class */ (function () {
    function WriterRefer() {
        this.ref = new Map();
        this.last = 0;
    }
    WriterRefer.prototype.addCount = function (count) {
        this.last += count;
    };
    WriterRefer.prototype.set = function (value) {
        this.ref.set(value, this.last++);
    };
    WriterRefer.prototype.write = function (stream, value) {
        var index = this.ref.get(value);
        if (index !== undefined) {
            stream.writeByte(114 /* TagRef */);
            stream.writeAsciiString('' + index);
            stream.writeByte(59 /* TagSemicolon */);
            return true;
        }
        return false;
    };
    WriterRefer.prototype.reset = function () {
        this.ref.clear();
        this.last = 0;
    };
    return WriterRefer;
}());
var Writer = /** @class */ (function () {
    function Writer(stream, simple, utc) {
        if (simple === void 0) { simple = false; }
        if (utc === void 0) { utc = false; }
        this.stream = stream;
        this.utc = utc;
        this.ref = new Map();
        this.last = 0;
        this.simple = simple;
    }
    Object.defineProperty(Writer.prototype, "simple", {
        get: function () {
            return this.refer === undefined;
        },
        set: function (value) {
            this.refer = value ? undefined : new WriterRefer();
        },
        enumerable: true,
        configurable: true
    });
    Writer.prototype.serialize = function (value) {
        if (value === undefined || value === null) {
            this.stream.writeByte(110 /* TagNull */);
        }
        else {
            Serializer.getInstance(value).serialize(this, value);
        }
    };
    Writer.prototype.write = function (value) {
        if (value === undefined || value === null) {
            this.stream.writeByte(110 /* TagNull */);
        }
        else {
            Serializer.getInstance(value).write(this, value);
        }
    };
    Writer.prototype.writeReference = function (value) {
        return this.refer ? this.refer.write(this.stream, value) : false;
    };
    Writer.prototype.setReference = function (value) {
        if (this.refer)
            this.refer.set(value);
    };
    Writer.prototype.addReferenceCount = function (count) {
        if (this.refer)
            this.refer.addCount(count);
    };
    Writer.prototype.reset = function () {
        if (this.refer)
            this.refer.reset();
        this.ref.clear();
        this.last = 0;
    };
    Writer.prototype.writeClass = function (type, action) {
        var r = this.ref.get(type);
        if (r === undefined) {
            action();
            r = this.last++;
            this.ref.set(type, r);
        }
        return r;
    };
    return Writer;
}());
exports.Writer = Writer;
//# sourceMappingURL=Writer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/ArrayDeserializer.js":
/*!************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/ArrayDeserializer.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ArrayDeserializer.ts                                     |
|                                                          |
| hprose array deserializer for TypeScript.                |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var ArrayDeserializer = /** @class */ (function (_super) {
    __extends(ArrayDeserializer, _super);
    function ArrayDeserializer() {
        return _super.call(this, 'Array') || this;
    }
    ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 97 /* TagList */: return ReferenceReader.readArray(reader);
            case 101 /* TagEmpty */: return [];
            case 115 /* TagString */: return ReferenceReader.readString(reader).split('');
            case 98 /* TagBytes */: return Array.from(ReferenceReader.readBytes(reader));
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Uint8Array) {
                    return Array.from(result);
                }
                else if (result instanceof String) {
                    return result.split('');
                }
                else {
                    return result;
                }
            }
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    ArrayDeserializer.instance = new ArrayDeserializer();
    return ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.ArrayDeserializer = ArrayDeserializer;
//# sourceMappingURL=ArrayDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js":
/*!***********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BaseDeserializer.ts                                      |
|                                                          |
| hprose base deserializer for TypeScript.                 |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
function tagToString(tag) {
    switch (tag) {
        case 0x30:
        case 0x31:
        case 0x32:
        case 0x33:
        case 0x34:
        case 0x35:
        case 0x36:
        case 0x37:
        case 0x38:
        case 0x39:
        case 105 /* TagInteger */: return 'int32 number';
        case 108 /* TagLong */: return 'long number';
        case 100 /* TagDouble */: return 'double number';
        case 110 /* TagNull */: return 'null | undefined';
        case 101 /* TagEmpty */: return 'empty string';
        case 116 /* TagTrue */: return 'true';
        case 102 /* TagFalse */: return 'false';
        case 78 /* TagNaN */: return 'NaN';
        case 73 /* TagInfinity */: return 'Infinity';
        case 68 /* TagDate */:
        case 84 /* TagTime */: return 'Date';
        case 98 /* TagBytes */: return 'Uint8Array';
        case 117 /* TagUTF8Char */:
        case 115 /* TagString */: return 'string';
        case 103 /* TagGuid */: return 'guid string';
        case 97 /* TagList */: return 'Array';
        case 109 /* TagMap */: return 'object | Map';
        case 99 /* TagClass */: return 'class';
        case 111 /* TagObject */: return 'Object';
        case 114 /* TagRef */: return 'Reference';
        case 69 /* TagError */: return 'Error';
        default: throw new Error('Unexpected Tag: 0x' + (tag & 0xFF).toString(16));
    }
}
var BaseDeserializer = /** @class */ (function () {
    function BaseDeserializer(type) {
        if (type === void 0) { type = 'undefined'; }
        this.type = type;
    }
    BaseDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 110 /* TagNull */: return undefined;
            case 114 /* TagRef */: return reader.readReference();
            case 99 /* TagClass */:
                reader.readClass();
                return this.deserialize(reader);
            case 69 /* TagError */:
                throw new Error(reader.deserialize(String));
        }
        throw new Error('Cannot convert ' + tagToString(tag) + ' to ' + this.type + '.');
    };
    BaseDeserializer.prototype.deserialize = function (reader) {
        return this.read(reader, reader.stream.readByte());
    };
    return BaseDeserializer;
}());
exports.BaseDeserializer = BaseDeserializer;
//# sourceMappingURL=BaseDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/BigIntArrayDeserializer.js":
/*!******************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/BigIntArrayDeserializer.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BigIntArrayDeserializer.ts                               |
|                                                          |
| hprose bigint Array deserializer for TypeScript.         |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var Deserializer_1 = __webpack_require__(/*! ../Deserializer */ "./real-server/node_modules/@hprose/io/lib/Deserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
function readBigIntArray(reader, type) {
    var stream = reader.stream;
    var count = ValueReader.readCount(stream);
    var a = new type(count);
    reader.addReference(a);
    var deserializer = Deserializer_1.getInstance(BigInt);
    for (var i = 0; i < count; ++i) {
        a[i] = deserializer.deserialize(reader);
    }
    stream.readByte();
    return a;
}
if (typeof BigInt64Array !== 'undefined') {
    var empty_1 = new BigInt64Array(0);
    var BigInt64ArrayDeserializer = /** @class */ (function (_super) {
        __extends(BigInt64ArrayDeserializer, _super);
        function BigInt64ArrayDeserializer() {
            return _super.call(this, 'BigInt64Array') || this;
        }
        BigInt64ArrayDeserializer.prototype.read = function (reader, tag) {
            switch (tag) {
                case 101 /* TagEmpty */: return empty_1;
                case 97 /* TagList */: return readBigIntArray(reader, BigInt64Array);
                default:
                    return _super.prototype.read.call(this, reader, tag);
            }
        };
        BigInt64ArrayDeserializer.instance = new BigInt64ArrayDeserializer();
        return BigInt64ArrayDeserializer;
    }(BaseDeserializer_1.BaseDeserializer));
    Deserializer_1.register(BigInt64Array, BigInt64ArrayDeserializer.instance);
}
if (typeof BigUint64Array !== 'undefined') {
    var empty_2 = new BigUint64Array(0);
    var BigUint64ArrayDeserializer = /** @class */ (function (_super) {
        __extends(BigUint64ArrayDeserializer, _super);
        function BigUint64ArrayDeserializer() {
            return _super.call(this, 'BigUint64Array') || this;
        }
        BigUint64ArrayDeserializer.prototype.read = function (reader, tag) {
            switch (tag) {
                case 101 /* TagEmpty */: return empty_2;
                case 97 /* TagList */: return readBigIntArray(reader, BigUint64Array);
                default:
                    return _super.prototype.read.call(this, reader, tag);
            }
        };
        BigUint64ArrayDeserializer.instance = new BigUint64ArrayDeserializer();
        return BigUint64ArrayDeserializer;
    }(BaseDeserializer_1.BaseDeserializer));
    Deserializer_1.register(BigUint64Array, BigUint64ArrayDeserializer.instance);
}
//# sourceMappingURL=BigIntArrayDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/BigIntDeserializer.js":
/*!*************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/BigIntDeserializer.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BigIntDeserializer.ts                                    |
|                                                          |
| hprose bigint deserializer for TypeScript.               |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var Deserializer_1 = __webpack_require__(/*! ../Deserializer */ "./real-server/node_modules/@hprose/io/lib/Deserializer.js");
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
if (typeof BigInt !== 'undefined') {
    var BigIntDeserializer = /** @class */ (function (_super) {
        __extends(BigIntDeserializer, _super);
        function BigIntDeserializer() {
            return _super.call(this, 'bigint') || this;
        }
        BigIntDeserializer.prototype.read = function (reader, tag) {
            if (tag >= 0x30 && tag <= 0x39) {
                return BigInt(tag - 0x30);
            }
            var stream = reader.stream;
            switch (tag) {
                case 105 /* TagInteger */:
                case 108 /* TagLong */:
                case 100 /* TagDouble */: return BigInt(stream.readUntil(59 /* TagSemicolon */));
                case 116 /* TagTrue */: return BigInt(1);
                case 102 /* TagFalse */:
                case 101 /* TagEmpty */: return BigInt(0);
                case 115 /* TagString */: return BigInt(ReferenceReader.readString(reader));
                case 117 /* TagUTF8Char */: return BigInt(stream.readString(1).charCodeAt(1));
                case 68 /* TagDate */: return BigInt(ReferenceReader.readDateTime(reader).getTime());
                case 84 /* TagTime */: return BigInt(ReferenceReader.readTime(reader).getTime());
                case 114 /* TagRef */: {
                    var result = reader.readReference();
                    if (result instanceof Date) {
                        return BigInt(result.getTime());
                    }
                    else {
                        return BigInt(result.toString());
                    }
                }
                default: return _super.prototype.read.call(this, reader, tag);
            }
        };
        BigIntDeserializer.instance = new BigIntDeserializer();
        return BigIntDeserializer;
    }(BaseDeserializer_1.BaseDeserializer));
    Deserializer_1.register(BigInt, BigIntDeserializer.instance);
}
//# sourceMappingURL=BigIntDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/BooleanDeserializer.js":
/*!**************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/BooleanDeserializer.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BooleanDeserializer.ts                                   |
|                                                          |
| hprose boolean deserializer for TypeScript.              |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var BooleanDeserializer = /** @class */ (function (_super) {
    __extends(BooleanDeserializer, _super);
    function BooleanDeserializer() {
        return _super.call(this, 'boolean') || this;
    }
    BooleanDeserializer.prototype.read = function (reader, tag) {
        var stream = reader.stream;
        switch (tag) {
            case 116 /* TagTrue */: return true;
            case 102 /* TagFalse */:
            case 101 /* TagEmpty */:
            case 78 /* TagNaN */:
            case 0x30: return false;
            case 105 /* TagInteger */:
            case 108 /* TagLong */: return ValueReader.readInt(stream) !== 0;
            case 100 /* TagDouble */: return ValueReader.readDouble(stream) !== 0;
            case 115 /* TagString */: return Boolean(ReferenceReader.readString(reader));
            case 117 /* TagUTF8Char */: return '0\0'.indexOf(stream.readString(1)) === -1;
            case 73 /* TagInfinity */:
                stream.readByte();
                return true;
            case 114 /* TagRef */: return Boolean(reader.readReference().toString());
            default:
                if (tag >= 0x31 && tag <= 0x39) {
                    return true;
                }
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    BooleanDeserializer.instance = new BooleanDeserializer();
    return BooleanDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.BooleanDeserializer = BooleanDeserializer;
//# sourceMappingURL=BooleanDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/ByteStreamDeserializer.js":
/*!*****************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/ByteStreamDeserializer.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ByteStreamDeserializer.ts                                |
|                                                          |
| hprose ByteStream deserializer for TypeScript.           |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ../ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var TypedArrayDeserializer_1 = __webpack_require__(/*! ./TypedArrayDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/TypedArrayDeserializer.js");
var ReferenceReader_1 = __webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js");
var ByteStreamDeserializer = /** @class */ (function (_super) {
    __extends(ByteStreamDeserializer, _super);
    function ByteStreamDeserializer() {
        return _super.call(this, 'ByteStream') || this;
    }
    ByteStreamDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 98 /* TagBytes */: return new ByteStream_1.ByteStream(ReferenceReader_1.readBytes(reader));
            case 101 /* TagEmpty */: return new ByteStream_1.ByteStream(0);
            case 97 /* TagList */: return new ByteStream_1.ByteStream(TypedArrayDeserializer_1.readIntArray(reader, Uint8Array));
            case 117 /* TagUTF8Char */: return new ByteStream_1.ByteStream(reader.stream.readString(1));
            case 115 /* TagString */: return new ByteStream_1.ByteStream(ReferenceReader_1.readString(reader));
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Uint8Array) {
                    return new ByteStream_1.ByteStream(result);
                }
                else {
                    return new ByteStream_1.ByteStream(result.toString());
                }
            }
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    ByteStreamDeserializer.instance = new ByteStreamDeserializer();
    return ByteStreamDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.ByteStreamDeserializer = ByteStreamDeserializer;
//# sourceMappingURL=ByteStreamDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/DateDeserializer.js":
/*!***********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/DateDeserializer.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| DateDeserializer.ts                                      |
|                                                          |
| hprose date deserializer for TypeScript.                 |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var DateDeserializer = /** @class */ (function (_super) {
    __extends(DateDeserializer, _super);
    function DateDeserializer() {
        return _super.call(this, 'Date') || this;
    }
    DateDeserializer.prototype.read = function (reader, tag) {
        var stream = reader.stream;
        switch (tag) {
            case 68 /* TagDate */: return ReferenceReader.readDateTime(reader);
            case 84 /* TagTime */: return ReferenceReader.readTime(reader);
            case 105 /* TagInteger */: return new Date(ValueReader.readInt(stream));
            case 108 /* TagLong */: return new Date(ValueReader.readInt(stream));
            case 100 /* TagDouble */: return new Date(Math.floor(ValueReader.readDouble(stream)));
            case 115 /* TagString */: return new Date(ReferenceReader.readString(reader));
            case 116 /* TagTrue */: return new Date(1);
            case 102 /* TagFalse */:
            case 101 /* TagEmpty */: return new Date(0);
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Date) {
                    return result;
                }
                else {
                    return new Date(result.toString());
                }
            }
            default:
                if (tag >= 0x30 && tag <= 0x39) {
                    return new Date(tag - 0x30);
                }
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    DateDeserializer.instance = new DateDeserializer();
    return DateDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.DateDeserializer = DateDeserializer;
//# sourceMappingURL=DateDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/DefaultDeserializer.js":
/*!**************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/DefaultDeserializer.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| DefaultDeserializer.ts                                   |
|                                                          |
| hprose DefaultDeserializer for TypeScript.               |
|                                                          |
| LastModified: Feb 8, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var StringDeserializer_1 = __webpack_require__(/*! ./StringDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/StringDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var DefaultDeserializer = /** @class */ (function (_super) {
    __extends(DefaultDeserializer, _super);
    function DefaultDeserializer() {
        return _super.call(this, 'any') || this;
    }
    DefaultDeserializer.prototype.read = function (reader, tag) {
        if (tag >= 0x30 && tag <= 0x39) {
            return tag - 0x30;
        }
        var stream = reader.stream;
        switch (tag) {
            case 105 /* TagInteger */: return ValueReader.readInt(stream);
            case 115 /* TagString */: return ReferenceReader.readString(reader);
            case 98 /* TagBytes */: return ReferenceReader.readBytes(reader);
            case 116 /* TagTrue */: return true;
            case 102 /* TagFalse */: return false;
            case 101 /* TagEmpty */: return '';
            case 111 /* TagObject */: return ReferenceReader.readObject(reader);
            case 68 /* TagDate */: return ReferenceReader.readDateTime(reader);
            case 84 /* TagTime */: return ReferenceReader.readTime(reader);
            case 103 /* TagGuid */: return ReferenceReader.readGuid(reader);
            case 108 /* TagLong */:
                switch (reader.longType) {
                    case 'number':
                        return ValueReader.readInt(stream);
                    case 'bigint':
                        if (typeof BigInt !== 'undefined') {
                            return BigInt(stream.readUntil(59 /* TagSemicolon */));
                        }
                    // tslint:disable-next-line:no-switch-case-fall-through
                    case 'string':
                        return stream.readUntil(59 /* TagSemicolon */);
                }
                break;
            case 100 /* TagDouble */: return ValueReader.readDouble(stream);
            case 78 /* TagNaN */: return NaN;
            case 73 /* TagInfinity */: return ValueReader.readInfinity(stream);
            case 117 /* TagUTF8Char */: return stream.readString(1);
            case 97 /* TagList */: return ReferenceReader.readArray(reader);
            case 109 /* TagMap */: return (reader.dictType === 'map') ? ReferenceReader.readMap(reader) : readDict(reader);
            case 69 /* TagError */: return new Error(reader.deserialize(String));
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    DefaultDeserializer.instance = new DefaultDeserializer();
    return DefaultDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.DefaultDeserializer = DefaultDeserializer;
function readDict(reader) {
    var stream = reader.stream;
    var dict = Object.create(null);
    reader.addReference(dict);
    var count = ValueReader.readCount(stream);
    var strDeserializer = StringDeserializer_1.StringDeserializer.instance;
    var deserializer = DefaultDeserializer.instance;
    for (; count > 0; --count) {
        var key = strDeserializer.deserialize(reader);
        var value = deserializer.deserialize(reader);
        dict[key] = value;
    }
    stream.readByte();
    return dict;
}
//# sourceMappingURL=DefaultDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/ErrorDeserializer.js":
/*!************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/ErrorDeserializer.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ErrorDeserializer.ts                                     |
|                                                          |
| hprose Error deserializer for TypeScript.                |
|                                                          |
| LastModified: Feb 8, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ErrorDeserializer = /** @class */ (function (_super) {
    __extends(ErrorDeserializer, _super);
    function ErrorDeserializer() {
        return _super.call(this, 'Error') || this;
    }
    ErrorDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 69 /* TagError */: return new Error(reader.deserialize(String));
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    ErrorDeserializer.instance = new ErrorDeserializer();
    return ErrorDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.ErrorDeserializer = ErrorDeserializer;
//# sourceMappingURL=ErrorDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/FunctionDeserializer.js":
/*!***************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/FunctionDeserializer.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| FunctionDeserializer.ts                                  |
|                                                          |
| hprose function deserializer for TypeScript.             |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var FunctionDeserializer = /** @class */ (function (_super) {
    __extends(FunctionDeserializer, _super);
    function FunctionDeserializer() {
        return _super.call(this, 'function') || this;
    }
    FunctionDeserializer.instance = new FunctionDeserializer();
    return FunctionDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.FunctionDeserializer = FunctionDeserializer;
//# sourceMappingURL=FunctionDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/GuidDeserializer.js":
/*!***********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/GuidDeserializer.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| GuidDeserializer.ts                                      |
|                                                          |
| hprose Guid deserializer for TypeScript.                 |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var guid_typescript_1 = __webpack_require__(/*! guid-typescript */ "guid-typescript");
var GuidDeserializer = /** @class */ (function (_super) {
    __extends(GuidDeserializer, _super);
    function GuidDeserializer() {
        return _super.call(this, 'Guid') || this;
    }
    GuidDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 103 /* TagGuid */: return ReferenceReader.readGuid(reader);
            case 115 /* TagString */: return guid_typescript_1.Guid.parse(ReferenceReader.readString(reader));
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof guid_typescript_1.Guid) {
                    return result;
                }
                else {
                    return guid_typescript_1.Guid.parse(result.toString());
                }
            }
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    GuidDeserializer.instance = new GuidDeserializer();
    return GuidDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.GuidDeserializer = GuidDeserializer;
//# sourceMappingURL=GuidDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/IntDeserializer.js":
/*!**********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/IntDeserializer.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| IntDeserializer.ts                                       |
|                                                          |
| hprose int deserializer for TypeScript.                  |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var IntDeserializer = /** @class */ (function (_super) {
    __extends(IntDeserializer, _super);
    function IntDeserializer() {
        return _super.call(this, 'int') || this;
    }
    IntDeserializer.prototype.read = function (reader, tag) {
        if (tag >= 0x30 && tag <= 0x39) {
            return tag - 0x30;
        }
        var stream = reader.stream;
        switch (tag) {
            case 105 /* TagInteger */:
            case 108 /* TagLong */: return ValueReader.readInt(stream);
            case 100 /* TagDouble */: return Math.floor(ValueReader.readDouble(stream));
            case 116 /* TagTrue */: return 1;
            case 102 /* TagFalse */:
            case 101 /* TagEmpty */: return 0;
            case 115 /* TagString */: return parseInt(ReferenceReader.readString(reader));
            case 117 /* TagUTF8Char */: return stream.readString(1).charCodeAt(1);
            case 68 /* TagDate */: return ReferenceReader.readDateTime(reader).getTime();
            case 84 /* TagTime */: return ReferenceReader.readTime(reader).getTime();
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Date) {
                    return result.getTime();
                }
                else {
                    return parseInt(result.toString());
                }
            }
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    IntDeserializer.instance = new IntDeserializer();
    return IntDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.IntDeserializer = IntDeserializer;
//# sourceMappingURL=IntDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/MapDeserializer.js":
/*!**********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/MapDeserializer.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MapDeserializer.ts                                       |
|                                                          |
| hprose Map deserializer for TypeScript.                  |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var MapDeserializer = /** @class */ (function (_super) {
    __extends(MapDeserializer, _super);
    function MapDeserializer() {
        return _super.call(this, 'Map') || this;
    }
    MapDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return new Map();
            case 109 /* TagMap */: return ReferenceReader.readMap(reader);
            case 111 /* TagObject */: return ReferenceReader.readObjectAsMap(reader);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    MapDeserializer.instance = new MapDeserializer();
    return MapDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.MapDeserializer = MapDeserializer;
//# sourceMappingURL=MapDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/NullDeserializer.js":
/*!***********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/NullDeserializer.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| NullDeserializer.ts                                      |
|                                                          |
| hprose null deserializer for TypeScript.                 |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultDeserializer_1 = __webpack_require__(/*! ./DefaultDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/DefaultDeserializer.js");
var NullDeserializer = /** @class */ (function (_super) {
    __extends(NullDeserializer, _super);
    function NullDeserializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullDeserializer.prototype.read = function (reader, tag) {
        if (tag === 110 /* TagNull */)
            return null;
        return _super.prototype.read.call(this, reader, tag);
    };
    NullDeserializer.instance = new NullDeserializer();
    return NullDeserializer;
}(DefaultDeserializer_1.DefaultDeserializer));
exports.NullDeserializer = NullDeserializer;
//# sourceMappingURL=NullDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/NumberDeserializer.js":
/*!*************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/NumberDeserializer.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| NumberDeserializer.ts                                    |
|                                                          |
| hprose number deserializer for TypeScript.               |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var NumberDeserializer = /** @class */ (function (_super) {
    __extends(NumberDeserializer, _super);
    function NumberDeserializer() {
        return _super.call(this, 'number') || this;
    }
    NumberDeserializer.prototype.read = function (reader, tag) {
        if (tag >= 0x30 && tag <= 0x39) {
            return tag - 0x30;
        }
        var stream = reader.stream;
        switch (tag) {
            case 105 /* TagInteger */:
            case 108 /* TagLong */: return ValueReader.readInt(stream);
            case 100 /* TagDouble */: return ValueReader.readDouble(stream);
            case 78 /* TagNaN */: return NaN;
            case 73 /* TagInfinity */: return ValueReader.readInfinity(stream);
            case 116 /* TagTrue */: return 1;
            case 102 /* TagFalse */:
            case 101 /* TagEmpty */: return 0;
            case 115 /* TagString */: return Number(ReferenceReader.readString(reader));
            case 117 /* TagUTF8Char */: return stream.readString(1).charCodeAt(1);
            case 68 /* TagDate */: return ReferenceReader.readDateTime(reader).getTime();
            case 84 /* TagTime */: return ReferenceReader.readTime(reader).getTime();
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Date) {
                    return result.getTime();
                }
                else {
                    return Number(result.toString());
                }
            }
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    NumberDeserializer.instance = new NumberDeserializer();
    return NumberDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.NumberDeserializer = NumberDeserializer;
//# sourceMappingURL=NumberDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/SetDeserializer.js":
/*!**********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/SetDeserializer.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| SetDeserializer.ts                                       |
|                                                          |
| hprose Set deserializer for TypeScript.                  |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ReferenceReader_1 = __webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js");
var SetDeserializer = /** @class */ (function (_super) {
    __extends(SetDeserializer, _super);
    function SetDeserializer() {
        return _super.call(this, 'Set') || this;
    }
    SetDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return new Set();
            case 97 /* TagList */: return ReferenceReader_1.readSet(reader);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    SetDeserializer.instance = new SetDeserializer();
    return SetDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.SetDeserializer = SetDeserializer;
//# sourceMappingURL=SetDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/StringDeserializer.js":
/*!*************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/StringDeserializer.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| StringDeserializer.ts                                    |
|                                                          |
| hprose string deserializer for TypeScript.               |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader = __importStar(__webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
var ReferenceReader = __importStar(__webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
var StringDeserializer = /** @class */ (function (_super) {
    __extends(StringDeserializer, _super);
    function StringDeserializer() {
        return _super.call(this, 'string') || this;
    }
    StringDeserializer.prototype.read = function (reader, tag) {
        if (tag >= 0x30 && tag <= 0x39) {
            return String.fromCharCode(tag);
        }
        var stream = reader.stream;
        switch (tag) {
            case 105 /* TagInteger */:
            case 108 /* TagLong */:
            case 100 /* TagDouble */: return stream.readUntil(59 /* TagSemicolon */);
            case 115 /* TagString */: return ReferenceReader.readString(reader);
            case 98 /* TagBytes */: return ReferenceReader.readAsciiString(reader);
            case 116 /* TagTrue */: return 'true';
            case 102 /* TagFalse */: return 'false';
            case 101 /* TagEmpty */: return '';
            case 68 /* TagDate */: return ReferenceReader.readDateTime(reader).toString();
            case 84 /* TagTime */: return ReferenceReader.readTime(reader).toTimeString();
            case 103 /* TagGuid */: return ReferenceReader.readGuid(reader).toString();
            case 78 /* TagNaN */: return 'NaN';
            case 73 /* TagInfinity */: return ValueReader.readInfinity(stream).toString();
            case 117 /* TagUTF8Char */: return stream.readString(1);
            case 97 /* TagList */: return ReferenceReader.readArray(reader).join('');
            case 114 /* TagRef */: return reader.readReference().toString();
            default: return _super.prototype.read.call(this, reader, tag);
        }
    };
    StringDeserializer.instance = new StringDeserializer();
    return StringDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.StringDeserializer = StringDeserializer;
//# sourceMappingURL=StringDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/deserializers/TypedArrayDeserializer.js":
/*!*****************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/deserializers/TypedArrayDeserializer.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| TypedArrayDeserializer.ts                                |
|                                                          |
| hprose TypedArray deserializer for TypeScript.           |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ../ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var IntDeserializer_1 = __webpack_require__(/*! ./IntDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/IntDeserializer.js");
var NumberDeserializer_1 = __webpack_require__(/*! ./NumberDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/NumberDeserializer.js");
var BaseDeserializer_1 = __webpack_require__(/*! ./BaseDeserializer */ "./real-server/node_modules/@hprose/io/lib/deserializers/BaseDeserializer.js");
var ValueReader_1 = __webpack_require__(/*! ../ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js");
var ReferenceReader_1 = __webpack_require__(/*! ../ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js");
function readIntArray(reader, type) {
    var stream = reader.stream;
    var count = ValueReader_1.readCount(stream);
    var a = new type(count);
    reader.addReference(a);
    var deserializer = IntDeserializer_1.IntDeserializer.instance;
    for (var i = 0; i < count; ++i) {
        a[i] = deserializer.deserialize(reader);
    }
    stream.readByte();
    return a;
}
exports.readIntArray = readIntArray;
function readNumberArray(reader, type) {
    var stream = reader.stream;
    var count = ValueReader_1.readCount(stream);
    var a = new type(count);
    reader.addReference(a);
    var deserializer = NumberDeserializer_1.NumberDeserializer.instance;
    for (var i = 0; i < count; ++i) {
        a[i] = deserializer.deserialize(reader);
    }
    stream.readByte();
    return a;
}
exports.readNumberArray = readNumberArray;
var emptyInt8Array = new Int8Array(0);
var Int8ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Int8ArrayDeserializer, _super);
    function Int8ArrayDeserializer() {
        return _super.call(this, 'Int8Array') || this;
    }
    Int8ArrayDeserializer.prototype.read = function (reader, tag) {
        var bytes;
        switch (tag) {
            case 101 /* TagEmpty */: return emptyInt8Array;
            case 97 /* TagList */: return readIntArray(reader, Int8Array);
            case 98 /* TagBytes */:
                bytes = ReferenceReader_1.readBytes(reader);
                break;
            case 117 /* TagUTF8Char */:
                bytes = new ByteStream_1.ByteStream(reader.stream.readString(1)).bytes;
                break;
            case 115 /* TagString */:
                bytes = new ByteStream_1.ByteStream(ReferenceReader_1.readString(reader)).bytes;
                break;
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
        return new Int8Array(bytes.buffer, bytes.byteOffset, bytes.length);
    };
    Int8ArrayDeserializer.instance = new Int8ArrayDeserializer();
    return Int8ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Int8ArrayDeserializer = Int8ArrayDeserializer;
var emptyInt16Array = new Int16Array(0);
var Int16ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Int16ArrayDeserializer, _super);
    function Int16ArrayDeserializer() {
        return _super.call(this, 'Int16Array') || this;
    }
    Int16ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyInt16Array;
            case 97 /* TagList */: return readIntArray(reader, Int16Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Int16ArrayDeserializer.instance = new Int16ArrayDeserializer();
    return Int16ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Int16ArrayDeserializer = Int16ArrayDeserializer;
var emptyInt32Array = new Int32Array(0);
var Int32ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Int32ArrayDeserializer, _super);
    function Int32ArrayDeserializer() {
        return _super.call(this, 'Int32Array') || this;
    }
    Int32ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyInt32Array;
            case 97 /* TagList */: return readIntArray(reader, Int32Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Int32ArrayDeserializer.instance = new Int32ArrayDeserializer();
    return Int32ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Int32ArrayDeserializer = Int32ArrayDeserializer;
var emptyUint8Array = new Uint8Array(0);
var Uint8ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Uint8ArrayDeserializer, _super);
    function Uint8ArrayDeserializer() {
        return _super.call(this, 'Uint8Array') || this;
    }
    Uint8ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 98 /* TagBytes */: return ReferenceReader_1.readBytes(reader);
            case 101 /* TagEmpty */: return emptyUint8Array;
            case 97 /* TagList */: return readIntArray(reader, Uint8Array);
            case 117 /* TagUTF8Char */: return new ByteStream_1.ByteStream(reader.stream.readString(1)).bytes;
            case 115 /* TagString */: return new ByteStream_1.ByteStream(ReferenceReader_1.readString(reader)).bytes;
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Uint8Array) {
                    return result;
                }
                else {
                    return new ByteStream_1.ByteStream(result.toString()).bytes;
                }
            }
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Uint8ArrayDeserializer.instance = new Uint8ArrayDeserializer();
    return Uint8ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Uint8ArrayDeserializer = Uint8ArrayDeserializer;
var emptyUint8ClampedArray = new Uint8ClampedArray(0);
var Uint8ClampedArrayDeserializer = /** @class */ (function (_super) {
    __extends(Uint8ClampedArrayDeserializer, _super);
    function Uint8ClampedArrayDeserializer() {
        return _super.call(this, 'Uint8ClampedArray') || this;
    }
    Uint8ClampedArrayDeserializer.prototype.read = function (reader, tag) {
        var bytes;
        switch (tag) {
            case 101 /* TagEmpty */: return emptyUint8ClampedArray;
            case 97 /* TagList */: return readIntArray(reader, Uint8ClampedArray);
            case 98 /* TagBytes */:
                bytes = ReferenceReader_1.readBytes(reader);
                break;
            case 117 /* TagUTF8Char */:
                bytes = new ByteStream_1.ByteStream(reader.stream.readString(1)).bytes;
                break;
            case 115 /* TagString */:
                bytes = new ByteStream_1.ByteStream(ReferenceReader_1.readString(reader)).bytes;
                break;
            case 114 /* TagRef */: {
                var result = reader.readReference();
                if (result instanceof Uint8ClampedArray) {
                    return result;
                }
                if (result instanceof Uint8Array) {
                    bytes = result;
                }
                else {
                    bytes = new ByteStream_1.ByteStream(result.toString()).bytes;
                }
                break;
            }
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
        return new Uint8ClampedArray(bytes.buffer, bytes.byteOffset, bytes.length);
    };
    Uint8ClampedArrayDeserializer.instance = new Uint8ClampedArrayDeserializer();
    return Uint8ClampedArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Uint8ClampedArrayDeserializer = Uint8ClampedArrayDeserializer;
var emptyUint16Array = new Uint16Array(0);
var Uint16ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Uint16ArrayDeserializer, _super);
    function Uint16ArrayDeserializer() {
        return _super.call(this, 'Uint16Array') || this;
    }
    Uint16ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyUint16Array;
            case 97 /* TagList */: return readIntArray(reader, Uint16Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Uint16ArrayDeserializer.instance = new Uint16ArrayDeserializer();
    return Uint16ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Uint16ArrayDeserializer = Uint16ArrayDeserializer;
var emptyUint32Array = new Uint32Array(0);
var Uint32ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Uint32ArrayDeserializer, _super);
    function Uint32ArrayDeserializer() {
        return _super.call(this, 'Uint32Array') || this;
    }
    Uint32ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyUint32Array;
            case 97 /* TagList */: return readIntArray(reader, Uint32Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Uint32ArrayDeserializer.instance = new Uint32ArrayDeserializer();
    return Uint32ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Uint32ArrayDeserializer = Uint32ArrayDeserializer;
var emptyFloat32Array = new Float32Array(0);
var Float32ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Float32ArrayDeserializer, _super);
    function Float32ArrayDeserializer() {
        return _super.call(this, 'Float32Array') || this;
    }
    Float32ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyFloat32Array;
            case 97 /* TagList */: return readNumberArray(reader, Float32Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Float32ArrayDeserializer.instance = new Float32ArrayDeserializer();
    return Float32ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Float32ArrayDeserializer = Float32ArrayDeserializer;
var emptyFloat64Array = new Float64Array(0);
var Float64ArrayDeserializer = /** @class */ (function (_super) {
    __extends(Float64ArrayDeserializer, _super);
    function Float64ArrayDeserializer() {
        return _super.call(this, 'Float64Array') || this;
    }
    Float64ArrayDeserializer.prototype.read = function (reader, tag) {
        switch (tag) {
            case 101 /* TagEmpty */: return emptyFloat64Array;
            case 97 /* TagList */: return readNumberArray(reader, Float64Array);
            default:
                return _super.prototype.read.call(this, reader, tag);
        }
    };
    Float64ArrayDeserializer.instance = new Float64ArrayDeserializer();
    return Float64ArrayDeserializer;
}(BaseDeserializer_1.BaseDeserializer));
exports.Float64ArrayDeserializer = Float64ArrayDeserializer;
//# sourceMappingURL=TypedArrayDeserializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/index.js":
/*!**********************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| hprose.io.ts                                             |
|                                                          |
| @hprose/io for TypeScript.                               |
|                                                          |
| LastModified: Jan 22, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ./ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
exports.ByteStream = ByteStream_1.ByteStream;
exports.writeInt32BE = ByteStream_1.writeInt32BE;
exports.writeInt32LE = ByteStream_1.writeInt32LE;
exports.fromUint8Array = ByteStream_1.fromUint8Array;
exports.toBinaryString = ByteStream_1.toBinaryString;
var Writer_1 = __webpack_require__(/*! ./Writer */ "./real-server/node_modules/@hprose/io/lib/Writer.js");
exports.Writer = Writer_1.Writer;
var Reader_1 = __webpack_require__(/*! ./Reader */ "./real-server/node_modules/@hprose/io/lib/Reader.js");
exports.Reader = Reader_1.Reader;
var TypeManager = __importStar(__webpack_require__(/*! ./TypeManager */ "./real-server/node_modules/@hprose/io/lib/TypeManager.js"));
exports.TypeManager = TypeManager;
var Serializer = __importStar(__webpack_require__(/*! ./Serializer */ "./real-server/node_modules/@hprose/io/lib/Serializer.js"));
exports.Serializer = Serializer;
var Deserializer = __importStar(__webpack_require__(/*! ./Deserializer */ "./real-server/node_modules/@hprose/io/lib/Deserializer.js"));
exports.Deserializer = Deserializer;
var Formatter = __importStar(__webpack_require__(/*! ./Formatter */ "./real-server/node_modules/@hprose/io/lib/Formatter.js"));
exports.Formatter = Formatter;
var ReferenceReader = __importStar(__webpack_require__(/*! ./ReferenceReader */ "./real-server/node_modules/@hprose/io/lib/ReferenceReader.js"));
exports.ReferenceReader = ReferenceReader;
var ValueReader = __importStar(__webpack_require__(/*! ./ValueReader */ "./real-server/node_modules/@hprose/io/lib/ValueReader.js"));
exports.ValueReader = ValueReader;
var ValueWriter = __importStar(__webpack_require__(/*! ./ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js"));
exports.ValueWriter = ValueWriter;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/ArraySerializer.js":
/*!********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/ArraySerializer.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ArraySerializer.ts                                       |
|                                                          |
| hprose array serializer for TypeScript.                  |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ArraySerializer = /** @class */ (function (_super) {
    __extends(ArraySerializer, _super);
    function ArraySerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArraySerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(97 /* TagList */);
        var n = value.length;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        for (var i = 0; i < n; i++) {
            writer.serialize(value[i]);
        }
        stream.writeByte(125 /* TagClosebrace */);
    };
    return ArraySerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.ArraySerializer = ArraySerializer;
//# sourceMappingURL=ArraySerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js":
/*!*******************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BaseSerializer.ts                                        |
|                                                          |
| hprose BaseSerializer for TypeScript.                    |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSerializer = /** @class */ (function () {
    function BaseSerializer() {
    }
    BaseSerializer.prototype.write = function (writer, value) {
        writer.stream.writeByte(110 /* TagNull */);
    };
    BaseSerializer.prototype.serialize = function (writer, value) {
        this.write(writer, value);
    };
    return BaseSerializer;
}());
exports.BaseSerializer = BaseSerializer;
//# sourceMappingURL=BaseSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/BigIntArraySerializer.js":
/*!**************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/BigIntArraySerializer.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BigIntArraySerializer.ts                                 |
|                                                          |
| hprose bigint array serializer for TypeScript.           |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var Serializer_1 = __webpack_require__(/*! ../Serializer */ "./real-server/node_modules/@hprose/io/lib/Serializer.js");
if ((typeof BigInt64Array !== 'undefined') && (typeof BigUint64Array !== 'undefined')) {
    var BigIntArraySerializer = /** @class */ (function (_super) {
        __extends(BigIntArraySerializer, _super);
        function BigIntArraySerializer() {
            return _super.call(this) || this;
        }
        BigIntArraySerializer.prototype.write = function (writer, value) {
            _super.prototype.write.call(this, writer, value);
            var stream = writer.stream;
            stream.writeByte(97 /* TagList */);
            var n = value.length;
            if (n > 0)
                stream.writeAsciiString('' + n);
            stream.writeByte(123 /* TagOpenbrace */);
            for (var i = 0; i < n; i++) {
                ValueWriter_1.writeBigInt(stream, value[i]);
            }
            stream.writeByte(125 /* TagClosebrace */);
        };
        return BigIntArraySerializer;
    }(ReferenceSerializer_1.ReferenceSerializer));
    var bigintArraySerializer = new BigIntArraySerializer();
    Serializer_1.register(BigInt64Array, bigintArraySerializer);
    Serializer_1.register(BigUint64Array, bigintArraySerializer);
}
//# sourceMappingURL=BigIntArraySerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/BigIntSerializer.js":
/*!*********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/BigIntSerializer.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BigIntSerializer.ts                                      |
|                                                          |
| hprose bigint serializer for TypeScript.                 |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var BaseSerializer_1 = __webpack_require__(/*! ./BaseSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js");
var Serializer_1 = __webpack_require__(/*! ../Serializer */ "./real-server/node_modules/@hprose/io/lib/Serializer.js");
if (typeof BigInt !== 'undefined') {
    var BigIntSerializer = /** @class */ (function (_super) {
        __extends(BigIntSerializer, _super);
        function BigIntSerializer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BigIntSerializer.prototype.write = function (writer, value) {
            ValueWriter_1.writeBigInt(writer.stream, value);
        };
        return BigIntSerializer;
    }(BaseSerializer_1.BaseSerializer));
    Serializer_1.register(BigInt, new BigIntSerializer());
}
//# sourceMappingURL=BigIntSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/BooleanSerializer.js":
/*!**********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/BooleanSerializer.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BooleanSerializer.ts                                     |
|                                                          |
| hprose boolean serializer for TypeScript.                |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSerializer_1 = __webpack_require__(/*! ./BaseSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js");
var BooleanSerializer = /** @class */ (function (_super) {
    __extends(BooleanSerializer, _super);
    function BooleanSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanSerializer.prototype.write = function (writer, value) {
        writer.stream.writeByte(value.valueOf() ? 116 /* TagTrue */ : 102 /* TagFalse */);
    };
    return BooleanSerializer;
}(BaseSerializer_1.BaseSerializer));
exports.BooleanSerializer = BooleanSerializer;
//# sourceMappingURL=BooleanSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/BytesSerializer.js":
/*!********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/BytesSerializer.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| BytesSerializer.ts                                       |
|                                                          |
| hprose bytes serializer for TypeScript.                  |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var BytesSerializer = /** @class */ (function (_super) {
    __extends(BytesSerializer, _super);
    function BytesSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BytesSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(98 /* TagBytes */);
        var n = (value instanceof ArrayBuffer) ? value.byteLength : value.length;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(34 /* TagQuote */);
        stream.write(value);
        stream.writeByte(34 /* TagQuote */);
    };
    return BytesSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.BytesSerializer = BytesSerializer;
//# sourceMappingURL=BytesSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/DateSerializer.js":
/*!*******************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/DateSerializer.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| DateSerializer.ts                                        |
|                                                          |
| hprose Date serializer for TypeScript.                   |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var DateSerializer = /** @class */ (function (_super) {
    __extends(DateSerializer, _super);
    function DateSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        writer.utc ? ValueWriter_1.writeUTCDate(stream, value) : ValueWriter_1.writeLocalDate(stream, value);
    };
    return DateSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.DateSerializer = DateSerializer;
//# sourceMappingURL=DateSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/DictionarySerializer.js":
/*!*************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/DictionarySerializer.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| DictionarySerializer.ts                                  |
|                                                          |
| hprose dictionary serializer for TypeScript.             |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var DictionarySerializer = /** @class */ (function (_super) {
    __extends(DictionarySerializer, _super);
    function DictionarySerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DictionarySerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        var fields = [];
        if (value.hasOwnProperty === undefined) {
            for (var key in value) {
                if (typeof value[key] !== 'function') {
                    fields[fields.length] = key;
                }
            }
        }
        else {
            for (var key in value) {
                if (value.hasOwnProperty(key) && typeof value[key] !== 'function') {
                    fields[fields.length] = key;
                }
            }
        }
        var n = fields.length;
        stream.writeByte(109 /* TagMap */);
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        for (var i = 0; i < n; i++) {
            writer.serialize(fields[i]);
            writer.serialize(value[fields[i]]);
        }
        stream.writeByte(125 /* TagClosebrace */);
    };
    return DictionarySerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.DictionarySerializer = DictionarySerializer;
//# sourceMappingURL=DictionarySerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/ErrorSerializer.js":
/*!********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/ErrorSerializer.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ErrorSerializer.ts                                       |
|                                                          |
| hprose error serializer for TypeScript.                  |
|                                                          |
| LastModified: Feb 8, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var ErrorSerializer = /** @class */ (function (_super) {
    __extends(ErrorSerializer, _super);
    function ErrorSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorSerializer.prototype.write = function (writer, value) {
        // No reference to Error
        writer.addReferenceCount(1);
        var stream = writer.stream;
        stream.writeByte(69 /* TagError */);
        stream.writeByte(115 /* TagString */);
        ValueWriter_1.writeStringBody(stream, value.message);
    };
    return ErrorSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.ErrorSerializer = ErrorSerializer;
//# sourceMappingURL=ErrorSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/GuidSerializer.js":
/*!*******************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/GuidSerializer.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| GuidSerializer.ts                                        |
|                                                          |
| hprose Guid serializer for TypeScript.                   |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var GuidSerializer = /** @class */ (function (_super) {
    __extends(GuidSerializer, _super);
    function GuidSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GuidSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(103 /* TagGuid */);
        stream.writeByte(123 /* TagOpenbrace */);
        stream.writeAsciiString(value.toString());
        stream.writeByte(125 /* TagClosebrace */);
    };
    return GuidSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.GuidSerializer = GuidSerializer;
//# sourceMappingURL=GuidSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/MapSerializer.js":
/*!******************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/MapSerializer.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MapSerializer.ts                                         |
|                                                          |
| hprose Map serializer for TypeScript.                    |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var MapSerializer = /** @class */ (function (_super) {
    __extends(MapSerializer, _super);
    function MapSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(109 /* TagMap */);
        var n = value.size;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        value.forEach(function (v, k) {
            writer.serialize(k);
            writer.serialize(v);
        });
        stream.writeByte(125 /* TagClosebrace */);
    };
    return MapSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.MapSerializer = MapSerializer;
//# sourceMappingURL=MapSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/NumberSerializer.js":
/*!*********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/NumberSerializer.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| NumberSerializer.ts                                      |
|                                                          |
| hprose number serializer for TypeScript.                 |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSerializer_1 = __webpack_require__(/*! ./BaseSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var NumberSerializer = /** @class */ (function (_super) {
    __extends(NumberSerializer, _super);
    function NumberSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberSerializer.prototype.write = function (writer, value) {
        value = value.valueOf();
        if (Number.isSafeInteger(value)) {
            ValueWriter_1.writeInteger(writer.stream, value);
        }
        else {
            ValueWriter_1.writeDouble(writer.stream, value);
        }
    };
    return NumberSerializer;
}(BaseSerializer_1.BaseSerializer));
exports.NumberSerializer = NumberSerializer;
//# sourceMappingURL=NumberSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/ObjectSerializer.js":
/*!*********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/ObjectSerializer.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ObjectSerializer.ts                                      |
|                                                          |
| hprose object serializer for TypeScript.                 |
|                                                          |
| LastModified: Dec 18, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ByteStream_1 = __webpack_require__(/*! ../ByteStream */ "./real-server/node_modules/@hprose/io/lib/ByteStream.js");
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var ObjectSerializer = /** @class */ (function (_super) {
    __extends(ObjectSerializer, _super);
    function ObjectSerializer(obj, name, fields) {
        if (fields === void 0) { fields = []; }
        var _this = _super.call(this) || this;
        _this.type = obj.constructor;
        if (fields.length === 0) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function') {
                    fields[fields.length] = key.toString();
                }
            }
        }
        _this.fields = fields;
        var stream = new ByteStream_1.ByteStream();
        stream.writeByte(99 /* TagClass */);
        ValueWriter_1.writeStringBody(stream, name);
        var n = fields.length;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        for (var i = 0; i < n; i++) {
            stream.writeByte(115 /* TagString */);
            ValueWriter_1.writeStringBody(stream, fields[i]);
        }
        stream.writeByte(125 /* TagClosebrace */);
        _this.metadata = stream.takeBytes();
        return _this;
    }
    ObjectSerializer.prototype.write = function (writer, value) {
        var stream = writer.stream;
        var fields = this.fields;
        var metadata = this.metadata;
        var n = fields.length;
        var r = writer.writeClass(this.type, function () {
            stream.write(metadata);
            writer.addReferenceCount(n);
        });
        _super.prototype.write.call(this, writer, value);
        stream.writeByte(111 /* TagObject */);
        stream.writeAsciiString('' + r);
        stream.writeByte(123 /* TagOpenbrace */);
        for (var i = 0; i < n; i++) {
            writer.serialize(value[fields[i]]);
        }
        stream.writeByte(125 /* TagClosebrace */);
    };
    return ObjectSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.ObjectSerializer = ObjectSerializer;
//# sourceMappingURL=ObjectSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js":
/*!************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ReferenceSerializer.ts                                   |
|                                                          |
| hprose reference serializer for TypeScript.              |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSerializer_1 = __webpack_require__(/*! ./BaseSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/BaseSerializer.js");
var ReferenceSerializer = /** @class */ (function (_super) {
    __extends(ReferenceSerializer, _super);
    function ReferenceSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReferenceSerializer.prototype.write = function (writer, value) {
        writer.setReference(value);
    };
    ReferenceSerializer.prototype.serialize = function (writer, value) {
        if (!writer.writeReference(value))
            this.write(writer, value);
    };
    return ReferenceSerializer;
}(BaseSerializer_1.BaseSerializer));
exports.ReferenceSerializer = ReferenceSerializer;
//# sourceMappingURL=ReferenceSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/SetSerializer.js":
/*!******************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/SetSerializer.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| SetSerializer.ts                                         |
|                                                          |
| hprose Set serializer for TypeScript.                    |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var SetSerializer = /** @class */ (function (_super) {
    __extends(SetSerializer, _super);
    function SetSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(97 /* TagList */);
        var n = value.size;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        value.forEach(function (v) { return writer.serialize(v); });
        stream.writeByte(125 /* TagClosebrace */);
    };
    return SetSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.SetSerializer = SetSerializer;
//# sourceMappingURL=SetSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/StringSerializer.js":
/*!*********************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/StringSerializer.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| StringSerializer.ts                                      |
|                                                          |
| hprose string serializer for TypeScript.                 |
|                                                          |
| LastModified: Jan 11, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var ValueWriter_1 = __webpack_require__(/*! ../ValueWriter */ "./real-server/node_modules/@hprose/io/lib/ValueWriter.js");
var StringSerializer = /** @class */ (function (_super) {
    __extends(StringSerializer, _super);
    function StringSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringSerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(115 /* TagString */);
        ValueWriter_1.writeStringBody(stream, value);
    };
    StringSerializer.prototype.serialize = function (writer, value) {
        var stream = writer.stream;
        switch (value.length) {
            case 0:
                stream.writeByte(101 /* TagEmpty */);
                break;
            case 1:
                stream.writeByte(117 /* TagUTF8Char */);
                stream.writeString(value);
                break;
            default:
                _super.prototype.serialize.call(this, writer, value);
                break;
        }
    };
    return StringSerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.StringSerializer = StringSerializer;
//# sourceMappingURL=StringSerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/io/lib/serializers/TypedArraySerializer.js":
/*!*************************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/io/lib/serializers/TypedArraySerializer.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| TypedArraySerializer.ts                                  |
|                                                          |
| hprose typed array serializer for TypeScript.            |
|                                                          |
| LastModified: Jan 6, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceSerializer_1 = __webpack_require__(/*! ./ReferenceSerializer */ "./real-server/node_modules/@hprose/io/lib/serializers/ReferenceSerializer.js");
var TypedArraySerializer = /** @class */ (function (_super) {
    __extends(TypedArraySerializer, _super);
    function TypedArraySerializer(writeNumber) {
        var _this = _super.call(this) || this;
        _this.writeNumber = writeNumber;
        return _this;
    }
    TypedArraySerializer.prototype.write = function (writer, value) {
        _super.prototype.write.call(this, writer, value);
        var stream = writer.stream;
        stream.writeByte(97 /* TagList */);
        var n = value.length;
        if (n > 0)
            stream.writeAsciiString('' + n);
        stream.writeByte(123 /* TagOpenbrace */);
        for (var i = 0; i < n; i++) {
            this.writeNumber(stream, value[i]);
        }
        stream.writeByte(125 /* TagClosebrace */);
    };
    return TypedArraySerializer;
}(ReferenceSerializer_1.ReferenceSerializer));
exports.TypedArraySerializer = TypedArraySerializer;
//# sourceMappingURL=TypedArraySerializer.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Client.js":
/*!*****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Client.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Client.ts                                                |
|                                                          |
| Client for TypeScript.                                   |
|                                                          |
| LastModified: Mar 28, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ClientCodec_1 = __webpack_require__(/*! ./ClientCodec */ "./real-server/node_modules/@hprose/rpc-core/lib/ClientCodec.js");
var ClientContext_1 = __webpack_require__(/*! ./ClientContext */ "./real-server/node_modules/@hprose/rpc-core/lib/ClientContext.js");
var InvokeManager_1 = __webpack_require__(/*! ./InvokeManager */ "./real-server/node_modules/@hprose/rpc-core/lib/InvokeManager.js");
var IOManager_1 = __webpack_require__(/*! ./IOManager */ "./real-server/node_modules/@hprose/rpc-core/lib/IOManager.js");
var Utils_1 = __webpack_require__(/*! ./Utils */ "./real-server/node_modules/@hprose/rpc-core/lib/Utils.js");
function makeInvoke(client, name) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        var context = (args.length > 0 && args[args.length - 1] instanceof ClientContext_1.ClientContext) ? args.pop() : new ClientContext_1.ClientContext();
        return client.invoke(name, args, context);
    };
}
function setMethods(client, service, namespace, name, methods) {
    if (service[name] !== undefined) {
        return;
    }
    service[name] = Object.create(null);
    if (!Array.isArray(methods)) {
        methods = [methods];
    }
    namespace = namespace + name + '_';
    for (var i = 0; i < methods.length; i++) {
        var node = methods[i];
        if (typeof node === 'string') {
            service[name][node] = makeInvoke(client, namespace + node);
        }
        else {
            for (var n in node) {
                setMethods(client, service[name], namespace, n, node[n]);
            }
        }
    }
}
function useService(client, functions) {
    var root = Utils_1.normalize(functions);
    var service = Object.create(null);
    for (var i = 0; i < root.length; i++) {
        var node = root[i];
        if (typeof node === 'string') {
            if (service[node] === undefined) {
                service[node] = makeInvoke(client, node);
            }
        }
        else {
            for (var name_1 in node) {
                setMethods(client, service, '', name_1, node[name_1]);
            }
        }
    }
    return service;
}
var ServiceProxyHandler = /** @class */ (function () {
    function ServiceProxyHandler(client, namespace) {
        this.client = client;
        this.namespace = namespace;
    }
    ServiceProxyHandler.prototype.get = function (target, p, receiver) {
        if (typeof p === 'symbol') {
            return undefined;
        }
        if (p === 'then') {
            return undefined;
        }
        if (!(p in target)) {
            target[p] = new Proxy(function () { }, new ServiceProxyHandler(this.client, this.namespace ? this.namespace + '_' + p : '' + p));
        }
        return target[p];
    };
    ServiceProxyHandler.prototype.apply = function (target, thisArg, args) {
        if (this.namespace) {
            var context = (args.length > 0 && args[args.length - 1] instanceof ClientContext_1.ClientContext) ? args.pop() : new ClientContext_1.ClientContext();
            return this.client.invoke(this.namespace, args, context);
        }
        throw new TypeError("target is not a function");
    };
    return ServiceProxyHandler;
}());
var Client = /** @class */ (function () {
    function Client(uri) {
        var _a;
        var _this = this;
        this.returnTypes = Object.create(null);
        this.requestHeaders = Object.create(null);
        this.codec = ClientCodec_1.DefaultClientCodec.instance;
        this.timeout = 30000;
        this.urilist = [];
        this.transports = Object.create(null);
        this.invokeManager = new InvokeManager_1.InvokeManager(this.call.bind(this));
        this.ioManager = new IOManager_1.IOManager(this.transport.bind(this));
        Client.transports.forEach(function (_a) {
            var name = _a.name, ctor = _a.ctor;
            var transport = new ctor();
            _this.transports[name] = transport;
            Object.defineProperty(_this, name, {
                get: function () { return transport; },
                set: function (value) {
                    transport = value;
                    _this.transports[name] = value;
                },
                enumerable: false,
                configurable: false
            });
        });
        if (uri) {
            if (typeof uri === 'string') {
                this.urilist.push(uri);
            }
            else {
                (_a = this.urilist).push.apply(_a, uri);
            }
        }
    }
    Client.register = function (name, ctor) {
        Client.transports.push({ name: name, ctor: ctor });
        ctor.schemes.forEach(function (scheme) { return Client.protocols[scheme + ':'] = name; });
    };
    Object.defineProperty(Client.prototype, "uris", {
        get: function () {
            return this.urilist;
        },
        set: function (value) {
            if (value.length > 0) {
                this.urilist = value.slice(0);
                this.urilist.sort(function () { return Math.random() - 0.5; });
            }
        },
        enumerable: true,
        configurable: true
    });
    Client.prototype.useService = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var namespace;
        var returnTypes;
        switch (args.length) {
            case 1:
                if (Array.isArray(args[0])) {
                    return useService(this, args[0]);
                }
                else if (typeof args[0] === 'string') {
                    namespace = args[0];
                }
                else {
                    returnTypes = args[0];
                }
                break;
            case 2:
                namespace = args[0];
                returnTypes = args[1];
                break;
        }
        var service = Object.create(null);
        if (returnTypes) {
            for (var name_2 in returnTypes) {
                var fullname = '' + name_2;
                if (namespace) {
                    fullname = namespace + '_' + name_2;
                }
                this.returnTypes[fullname] = returnTypes[name_2];
                service[name_2] = makeInvoke(this, fullname);
            }
            return service;
        }
        return new Proxy(service, new ServiceProxyHandler(this, namespace));
    };
    Client.prototype.useServiceAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var names;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke('~')];
                    case 1:
                        names = _a.sent();
                        return [2 /*return*/, useService(this, names)];
                }
            });
        });
    };
    Client.prototype.use = function () {
        var _a, _b;
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        if (handlers.length <= 0)
            return this;
        switch (handlers[0].length) {
            case 4:
                (_a = this.invokeManager).use.apply(_a, handlers);
                break;
            case 3:
                (_b = this.ioManager).use.apply(_b, handlers);
                break;
            default: throw new TypeError('Invalid parameter type');
        }
        return this;
    };
    Client.prototype.unuse = function () {
        var _a, _b;
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        if (handlers.length <= 0)
            return this;
        switch (handlers[0].length) {
            case 4:
                (_a = this.invokeManager).unuse.apply(_a, handlers);
                break;
            case 3:
                (_b = this.ioManager).unuse.apply(_b, handlers);
                break;
            default: throw new TypeError('Invalid parameter type');
        }
        return this;
    };
    Client.prototype.invoke = function (name, args, context) {
        if (args === void 0) { args = []; }
        if (context === void 0) { context = new ClientContext_1.ClientContext(); }
        return __awaiter(this, void 0, void 0, function () {
            var clientContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (args === null) {
                            args = [];
                        }
                        if (!(args.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(args)];
                    case 1:
                        args = _a.sent();
                        _a.label = 2;
                    case 2:
                        clientContext = (context instanceof ClientContext_1.ClientContext) ? context : new ClientContext_1.ClientContext(context);
                        clientContext.init(this, this.returnTypes[name]);
                        return [2 /*return*/, this.invokeManager.handler(name, args, clientContext)];
                }
            });
        });
    };
    Client.prototype.call = function (name, args, context) {
        return __awaiter(this, void 0, void 0, function () {
            var codec, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codec = this.codec;
                        request = codec.encode(name, args, context);
                        return [4 /*yield*/, this.request(request, context)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, codec.decode(response, context)];
                }
            });
        });
    };
    Client.prototype.request = function (request, context) {
        return this.ioManager.handler(request, context);
    };
    Client.prototype.transport = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, name;
            return __generator(this, function (_a) {
                uri = Utils_1.parseURI(context.uri);
                name = Client.protocols[uri.protocol];
                if (name !== undefined) {
                    return [2 /*return*/, this.transports[name].transport(request, context)];
                }
                throw new Error("The protocol \"" + uri.protocol + "\" is not supported.");
            });
        });
    };
    Client.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, name_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        for (name_3 in this.transports) {
                            results.push(this.transports[name_3].abort());
                        }
                        return [4 /*yield*/, Promise.all(results)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.transports = [];
    Client.protocols = Object.create(null);
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/ClientCodec.js":
/*!**********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/ClientCodec.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ClientCodec.ts                                           |
|                                                          |
| ClientCodec for TypeScript.                              |
|                                                          |
| LastModified: Jan 27, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var DefaultClientCodec = /** @class */ (function () {
    function DefaultClientCodec() {
        this.simple = false;
        this.utc = false;
        this.longType = 'number';
        this.dictType = 'object';
    }
    DefaultClientCodec.prototype.encode = function (name, args, context) {
        var stream = new io_1.ByteStream();
        var writer = new io_1.Writer(stream, this.simple, this.utc);
        var headers = context.requestHeaders;
        if (this.simple) {
            headers.simple = true;
        }
        var size = 0;
        for (var _ in headers) {
            size++;
        }
        if (size > 0) {
            stream.writeByte(72 /* TagHeader */);
            writer.serialize(headers);
            writer.reset();
        }
        stream.writeByte(67 /* TagCall */);
        writer.serialize(name);
        if (args.length > 0) {
            writer.reset();
            writer.serialize(args);
        }
        stream.writeByte(122 /* TagEnd */);
        return stream.takeBytes();
    };
    DefaultClientCodec.prototype.decode = function (response, context) {
        var stream = new io_1.ByteStream(response);
        var reader = new io_1.Reader(stream, false);
        reader.longType = this.longType;
        reader.dictType = this.dictType;
        var tag = stream.readByte();
        if (tag === 72 /* TagHeader */) {
            var headers = reader.deserialize();
            for (var name_1 in headers) {
                context.responseHeaders[name_1] = headers[name_1];
            }
            reader.reset();
            tag = stream.readByte();
        }
        switch (tag) {
            case 82 /* TagResult */:
                if (context.responseHeaders.simple) {
                    reader.simple = true;
                }
                return reader.deserialize(context.returnType);
            case 69 /* TagError */:
                throw new Error(reader.deserialize(String));
            case 122 /* TagEnd */:
                return context.type === null ? null : undefined;
            default:
                throw new Error('Invalid response:\r\n' + stream.toString());
        }
    };
    DefaultClientCodec.instance = new DefaultClientCodec();
    return DefaultClientCodec;
}());
exports.DefaultClientCodec = DefaultClientCodec;
//# sourceMappingURL=ClientCodec.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/ClientContext.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/ClientContext.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ClientContext.ts                                         |
|                                                          |
| ClientContext for TypeScript.                            |
|                                                          |
| LastModified: Dec 30, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Context_1 = __webpack_require__(/*! ./Context */ "./real-server/node_modules/@hprose/rpc-core/lib/Context.js");
var ClientContext = /** @class */ (function (_super) {
    __extends(ClientContext, _super);
    function ClientContext(items) {
        var _this = _super.call(this) || this;
        if (!!items) {
            _this.copy(items, _this);
            if ('requestHeaders' in items) {
                _this.copy(items['requestHeaders'], _this.requestHeaders);
            }
        }
        return _this;
    }
    ClientContext.prototype.init = function (client, returnType) {
        this.client = client;
        if (client.uris.length > 0)
            this.uri = client.uris[0];
        if (this.returnType === undefined)
            this.returnType = returnType;
        if (this.timeout === undefined)
            this.timeout = client.timeout;
        this.copy(client.requestHeaders, this.requestHeaders);
    };
    return ClientContext;
}(Context_1.Context));
exports.ClientContext = ClientContext;
//# sourceMappingURL=ClientContext.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Context.js":
/*!******************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Context.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Context.ts                                               |
|                                                          |
| Context for TypeScript.                                  |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var Context = /** @class */ (function () {
    function Context() {
        this.requestHeaders = Object.create(null);
        this.responseHeaders = Object.create(null);
    }
    Context.prototype.copy = function (src, dist) {
        if (src) {
            for (var name_1 in src) {
                if ((name_1 !== 'requestHeaders') &&
                    (name_1 !== 'responseHeaders') &&
                    (!src.hasOwnProperty || src.hasOwnProperty(name_1))) {
                    dist[name_1] = src[name_1];
                }
            }
        }
    };
    Context.prototype.clone = function () {
        var result = Object.create(this.constructor.prototype);
        this.copy(this, result);
        this.copy(this.requestHeaders, result.requestHeaders);
        this.copy(this.responseHeaders, result.responseHeaders);
        return result;
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=Context.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/CookieManager.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/CookieManager.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| CookieManager.ts                                         |
|                                                          |
| CookieManager for TypeScript.                            |
|                                                          |
| LastModified: Dec 18, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var cookieManager = Object.create(null);
function setCookie(headers, host) {
    if (host === void 0) { host = '@'; }
    function _setCookie(value) {
        var _a;
        if (value === undefined)
            return;
        var cookies = value.trim().split(';');
        var cookie = Object.create(null);
        _a = cookies[0].trim().split('=', 2), cookie.name = _a[0], cookie.value = _a[1];
        for (var i = 1; i < cookies.length; i++) {
            var _b = cookies[i].trim().split('=', 2), k = _b[0], v = _b[1];
            cookie[k.toUpperCase()] = v;
        }
        // Tomcat can return SetCookie2 with path wrapped in "
        if (cookie.PATH) {
            var n = cookie.PATH.length;
            if (n > 2 && cookie.PATH.charAt(0) === '"' && cookie.PATH.charAt(n - 1) === '"') {
                cookie.PATH = cookie.PATH.substr(1, n - 2);
            }
        }
        else {
            cookie.PATH = '/';
        }
        if (cookie.EXPIRES) {
            cookie.EXPIRES = Date.parse(cookie.EXPIRES);
        }
        if (cookie.DOMAIN) {
            cookie.DOMAIN = cookie.DOMAIN.toLowerCase();
        }
        else {
            cookie.DOMAIN = host;
        }
        cookie.SECURE = (cookie.SECURE !== undefined);
        if (cookieManager[cookie.DOMAIN] === undefined) {
            cookieManager[cookie.DOMAIN] = Object.create(null);
        }
        cookieManager[cookie.DOMAIN][cookie.name] = cookie;
    }
    for (var name_1 in headers) {
        name_1 = name_1.toLowerCase();
        if ((name_1 === 'set-cookie') || (name_1 === 'set-cookie2')) {
            var value = headers[name_1];
            (Array.isArray(value) ? value : [value]).forEach(_setCookie);
        }
    }
}
exports.setCookie = setCookie;
function getCookie(host, path, secure) {
    host = (host !== null && host !== void 0 ? host : '@');
    path = (path !== null && path !== void 0 ? path : '/');
    var cookies = [];
    for (var domain in cookieManager) {
        if (host.indexOf(domain) > -1) {
            var names = [];
            for (var name_2 in cookieManager[domain]) {
                var cookie = cookieManager[domain][name_2];
                if (cookie.EXPIRES && ((new Date()).getTime() > cookie.EXPIRES)) {
                    names.push(name_2);
                }
                else if (path.indexOf(cookie.PATH) === 0) {
                    if ((secure === cookie.SECURE) && (cookie.value !== null)) {
                        cookies.push(cookie.name + '=' + cookie.value);
                    }
                }
            }
            for (var i = 0, n = names.length; i < n; ++i) {
                delete cookieManager[domain][names[i]];
            }
        }
    }
    if (cookies.length > 0) {
        return cookies.join('; ');
    }
    return '';
}
exports.getCookie = getCookie;
//# sourceMappingURL=CookieManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Deferred.js":
/*!*******************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Deferred.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Deferred.ts                                              |
|                                                          |
| Deferred for TypeScript.                                 |
|                                                          |
| LastModified: Jan 10, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
function defer() {
    var deferred = Object.create(null);
    deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}
exports.defer = defer;
//# sourceMappingURL=Deferred.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/IOManager.js":
/*!********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/IOManager.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| IOManager.ts                                             |
|                                                          |
| IOManager for TypeScript.                                |
|                                                          |
| LastModified: Feb 16, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PluginManager_1 = __webpack_require__(/*! ./PluginManager */ "./real-server/node_modules/@hprose/rpc-core/lib/PluginManager.js");
var IOManager = /** @class */ (function (_super) {
    __extends(IOManager, _super);
    function IOManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IOManager.prototype.getNextHandler = function (handler, next) {
        return function (request, context) { return handler(request, context, next); };
    };
    return IOManager;
}(PluginManager_1.PluginManager));
exports.IOManager = IOManager;
//# sourceMappingURL=IOManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/InvokeManager.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/InvokeManager.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| InvokeManager.ts                                         |
|                                                          |
| InvokeManager for TypeScript.                            |
|                                                          |
| LastModified: Feb 16, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PluginManager_1 = __webpack_require__(/*! ./PluginManager */ "./real-server/node_modules/@hprose/rpc-core/lib/PluginManager.js");
var InvokeManager = /** @class */ (function (_super) {
    __extends(InvokeManager, _super);
    function InvokeManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InvokeManager.prototype.getNextHandler = function (handler, next) {
        return function (name, args, context) { return handler(name, args, context, next); };
    };
    return InvokeManager;
}(PluginManager_1.PluginManager));
exports.InvokeManager = InvokeManager;
//# sourceMappingURL=InvokeManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Method.js":
/*!*****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Method.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Method.ts                                                |
|                                                          |
| Method for TypeScript.                                   |
|                                                          |
| LastModified: Mar 28, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var Method = /** @class */ (function () {
    function Method(method, name, target, paramTypes) {
        this.method = method;
        this.name = name;
        this.target = target;
        this.paramTypes = paramTypes;
        if (name === '' || name === undefined) {
            if (method.name === '') {
                throw new Error('name must not be empty');
            }
            name = method.name;
        }
    }
    return Method;
}());
exports.Method = Method;
//# sourceMappingURL=Method.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/MethodManager.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/MethodManager.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MethodManager.ts                                         |
|                                                          |
| MethodManager for TypeScript.                            |
|                                                          |
| LastModified: Mar 28, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var Method_1 = __webpack_require__(/*! ./Method */ "./real-server/node_modules/@hprose/rpc-core/lib/Method.js");
var MethodManager = /** @class */ (function () {
    function MethodManager() {
        this.methods = Object.create(null);
        this.names = [];
    }
    MethodManager.prototype.getNames = function () {
        return this.names;
    };
    MethodManager.prototype.get = function (name) {
        name = name.toLowerCase();
        return (name in this.methods) ? this.methods[name] : this.methods['*'];
    };
    MethodManager.prototype.remove = function (name) {
        delete this.methods[name.toLowerCase()];
        var index = this.names.indexOf(name);
        if (index > -1) {
            this.names.splice(index, 1);
        }
    };
    MethodManager.prototype.add = function (method) {
        var name = method.name;
        if (name === '' || name === undefined) {
            name = method.fullname;
            if (name === '' || name === undefined) {
                name = method.method.name;
                if (name === '') {
                    throw new Error('name must not be empty');
                }
            }
            method.name = name;
        }
        this.methods[name.toLowerCase()] = method;
        if (this.names.indexOf(name) === -1) {
            this.names.push(name);
        }
    };
    MethodManager.prototype.addFunction = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                this.add(new Method_1.Method(fn));
                break;
            case 1:
                if (typeof args[0] === 'string') {
                    this.add(new Method_1.Method(fn, args[0]));
                }
                else {
                    this.add(new Method_1.Method(fn, undefined, undefined, args[0]));
                }
                break;
            case 2:
                this.add(new Method_1.Method(fn, args[0], undefined, args[1]));
                break;
        }
    };
    MethodManager.prototype.addMethod = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof args[0] === 'string') {
            var method = args[1][args[0]];
            if (typeof method === 'function') {
                this.add(new Method_1.Method(method, args[0], args[1], args[2]));
            }
            else {
                throw new Error('obj[name] must be a function');
            }
        }
        else {
            switch (args.length) {
                case 2:
                    this.add(new Method_1.Method(args[0], undefined, args[1]));
                    break;
                case 3:
                    if (typeof args[2] === 'string') {
                        this.add(new Method_1.Method(args[0], args[2], args[1]));
                    }
                    else {
                        this.add(new Method_1.Method(args[0], undefined, args[1], args[2]));
                    }
                    break;
                case 4:
                    this.add(new Method_1.Method(args[0], args[2], args[1], args[3]));
            }
        }
    };
    MethodManager.prototype.addMissingMethod = function (fn, target) {
        var method = new Method_1.Method(fn, '*', target);
        method.missing = true;
        if (fn.length === 3) {
            method.passContext = true;
        }
        this.add(method);
    };
    MethodManager.prototype.addFunctions = function (functions) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var names;
        var paramTypes;
        switch (args.length) {
            case 1:
                if ((args[0].length > 1) && (typeof args[0][0] === 'string')) {
                    names = args[0];
                }
                else {
                    paramTypes = args[0];
                }
                break;
            case 2:
                names = args[0];
                paramTypes = args[1];
                break;
        }
        var n = functions.length;
        if (names && names.length !== n) {
            throw new Error('names.length must be equal to functions.length');
        }
        for (var i = 0; i < n; ++i) {
            this.add(new Method_1.Method(functions[i], names ? names[i] : undefined, undefined, paramTypes));
        }
    };
    MethodManager.prototype.addMethods = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var n = args[0].length;
        if (n === 0)
            return;
        var methods;
        var target = args[1];
        var names;
        var paramTypes;
        if (typeof args[0][0] === 'string') {
            names = args[0];
            paramTypes = args[2];
            for (var i = 0; i < n; ++i) {
                var method = target[names[i]];
                if (typeof method === 'function') {
                    this.add(new Method_1.Method(method, names[i], target, paramTypes));
                }
                else {
                    throw new Error('obj[name] must be a function');
                }
            }
            return;
        }
        else {
            methods = args[0];
        }
        switch (args.length) {
            case 3:
                if (args[2].length > 0 && typeof args[2][0] === 'string') {
                    names = args[2];
                }
                else {
                    paramTypes = args[2];
                }
                break;
            case 4:
                names = args[2];
                paramTypes = args[3];
        }
        if (names && names.length !== n) {
            throw new Error('names.length must be equal to functions.length');
        }
        for (var i = 0; i < n; ++i) {
            this.add(new Method_1.Method(methods[i], names ? names[i] : undefined, target, paramTypes));
        }
    };
    MethodManager.prototype.addInstanceMethods = function (target, namespace) {
        for (var name_1 in target) {
            if ((!target.hasOwnProperty || target.hasOwnProperty(name_1)) && typeof target[name_1] === 'function') {
                var fullname = namespace ? namespace + '_' + name_1 : name_1;
                this.add(new Method_1.Method(target[name_1], fullname, target));
            }
        }
    };
    return MethodManager;
}());
exports.MethodManager = MethodManager;
//# sourceMappingURL=MethodManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/MockAgent.js":
/*!********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/MockAgent.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MockAgent.ts                                             |
|                                                          |
| MockAgent for TypeScript.                                |
|                                                          |
| LastModified: Feb 27, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MockAgent = /** @class */ (function () {
    function MockAgent() {
    }
    MockAgent.register = function (address, handler) {
        MockAgent.handlers[address] = handler;
    };
    MockAgent.cancel = function (address) {
        delete MockAgent.handlers[address];
    };
    MockAgent.handler = function (address, request) {
        return __awaiter(this, void 0, void 0, function () {
            var handler;
            return __generator(this, function (_a) {
                handler = MockAgent.handlers[address];
                if (handler) {
                    return [2 /*return*/, handler(address, request)];
                }
                throw new Error('Server is stopped');
            });
        });
    };
    MockAgent.handlers = Object.create(null);
    return MockAgent;
}());
exports.MockAgent = MockAgent;
//# sourceMappingURL=MockAgent.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/MockHandler.js":
/*!**********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/MockHandler.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MockHandler.ts                                           |
|                                                          |
| MockHandler for TypeScript.                              |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceContext_1 = __webpack_require__(/*! ./ServiceContext */ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceContext.js");
var Service_1 = __webpack_require__(/*! ./Service */ "./real-server/node_modules/@hprose/rpc-core/lib/Service.js");
var MockAgent_1 = __webpack_require__(/*! ./MockAgent */ "./real-server/node_modules/@hprose/rpc-core/lib/MockAgent.js");
var MockServer = /** @class */ (function () {
    function MockServer(address) {
        this.address = address;
    }
    MockServer.prototype.close = function () {
        MockAgent_1.MockAgent.cancel(this.address);
    };
    return MockServer;
}());
exports.MockServer = MockServer;
var MockHandler = /** @class */ (function () {
    function MockHandler(service) {
        var _this = this;
        this.service = service;
        this.handler = function (address, request) { return __awaiter(_this, void 0, void 0, function () {
            var context, addressInfo;
            return __generator(this, function (_a) {
                if (request.length > this.service.maxRequestLength) {
                    throw new Error('Request entity too large');
                }
                context = new ServiceContext_1.ServiceContext(this.service);
                addressInfo = { 'family': 'mock', 'address': address, 'port': 0 };
                context.remoteAddress = addressInfo;
                context.localAddress = addressInfo;
                context.handler = this;
                return [2 /*return*/, this.service.handle(request, context)];
            });
        }); };
    }
    MockHandler.prototype.bind = function (server) {
        MockAgent_1.MockAgent.register(server.address, this.handler);
    };
    MockHandler.serverTypes = [MockServer];
    return MockHandler;
}());
exports.MockHandler = MockHandler;
Service_1.Service.register('mock', MockHandler);
//# sourceMappingURL=MockHandler.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/MockTransport.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/MockTransport.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| MockTransport.ts                                         |
|                                                          |
| MockTransport for TypeScript.                            |
|                                                          |
| LastModified: Feb 27, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = __webpack_require__(/*! ./Client */ "./real-server/node_modules/@hprose/rpc-core/lib/Client.js");
var Utils_1 = __webpack_require__(/*! ./Utils */ "./real-server/node_modules/@hprose/rpc-core/lib/Utils.js");
var MockAgent_1 = __webpack_require__(/*! ./MockAgent */ "./real-server/node_modules/@hprose/rpc-core/lib/MockAgent.js");
var Deferred_1 = __webpack_require__(/*! ./Deferred */ "./real-server/node_modules/@hprose/rpc-core/lib/Deferred.js");
var TimeoutError_1 = __webpack_require__(/*! ./TimeoutError */ "./real-server/node_modules/@hprose/rpc-core/lib/TimeoutError.js");
var MockTransport = /** @class */ (function () {
    function MockTransport() {
    }
    MockTransport.prototype.transport = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, result, timeoutId_1;
            return __generator(this, function (_a) {
                uri = Utils_1.parseURI(context.uri);
                result = Deferred_1.defer();
                if (context.timeout > 0) {
                    timeoutId_1 = setTimeout(function () {
                        result.reject(new TimeoutError_1.TimeoutError());
                    }, context.timeout);
                    result.promise.then(function () {
                        clearTimeout(timeoutId_1);
                    }, function () {
                        clearTimeout(timeoutId_1);
                    });
                }
                MockAgent_1.MockAgent.handler(uri.hostname, request).then(function (value) { return result.resolve(value); }, function (reason) { return result.reject(reason); });
                return [2 /*return*/, result.promise];
            });
        });
    };
    MockTransport.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    MockTransport.schemes = ['mock'];
    return MockTransport;
}());
exports.MockTransport = MockTransport;
Client_1.Client.register('mock', MockTransport);
//# sourceMappingURL=MockTransport.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/PluginManager.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/PluginManager.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| PluginManager.ts                                         |
|                                                          |
| PluginManager for TypeScript.                            |
|                                                          |
| LastModified: Feb 16, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var PluginManager = /** @class */ (function () {
    function PluginManager(defaultHandler) {
        this.defaultHandler = defaultHandler;
        this.handlers = [];
        this.firstHandler = defaultHandler;
    }
    PluginManager.prototype.rebuildHandler = function () {
        var handlers = this.handlers;
        var next = this.defaultHandler;
        var n = handlers.length;
        for (var i = n - 1; i >= 0; --i) {
            next = this.getNextHandler(handlers[i], next);
        }
        this.firstHandler = next;
    };
    Object.defineProperty(PluginManager.prototype, "handler", {
        get: function () {
            return this.firstHandler;
        },
        enumerable: true,
        configurable: true
    });
    PluginManager.prototype.use = function () {
        var _a;
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        (_a = this.handlers).push.apply(_a, handlers);
        this.rebuildHandler();
    };
    PluginManager.prototype.unuse = function () {
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        var rebuild = false;
        for (var i = 0, n = handlers.length; i < n; ++i) {
            var index = this.handlers.indexOf(handlers[i]);
            if (index >= 0) {
                this.handlers.splice(index, 1);
                rebuild = true;
            }
        }
        if (rebuild)
            this.rebuildHandler();
    };
    return PluginManager;
}());
exports.PluginManager = PluginManager;
//# sourceMappingURL=PluginManager.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Service.js":
/*!******************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Service.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Service.ts                                               |
|                                                          |
| Service for TypeScript.                                  |
|                                                          |
| LastModified: Mar 28, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceCodec_1 = __webpack_require__(/*! ./ServiceCodec */ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceCodec.js");
var InvokeManager_1 = __webpack_require__(/*! ./InvokeManager */ "./real-server/node_modules/@hprose/rpc-core/lib/InvokeManager.js");
var IOManager_1 = __webpack_require__(/*! ./IOManager */ "./real-server/node_modules/@hprose/rpc-core/lib/IOManager.js");
var Method_1 = __webpack_require__(/*! ./Method */ "./real-server/node_modules/@hprose/rpc-core/lib/Method.js");
var MethodManager_1 = __webpack_require__(/*! ./MethodManager */ "./real-server/node_modules/@hprose/rpc-core/lib/MethodManager.js");
var Service = /** @class */ (function () {
    function Service() {
        var _this = this;
        this.codec = ServiceCodec_1.DefaultServiceCodec.instance;
        this.maxRequestLength = 0x7FFFFFFF;
        this.invokeManager = new InvokeManager_1.InvokeManager(this.execute.bind(this));
        this.ioManager = new IOManager_1.IOManager(this.process.bind(this));
        this.methodManager = new MethodManager_1.MethodManager();
        this.handlers = Object.create(null);
        this.options = Object.create(null);
        var _loop_1 = function (name_1) {
            var ctor = Service.handlers[name_1];
            var handler = new ctor(this_1);
            this_1.handlers[name_1] = handler;
            Object.defineProperty(this_1, name_1, {
                get: function () { return handler; },
                set: function (value) {
                    handler = value;
                    _this.handlers[name_1] = value;
                },
                enumerable: true,
                configurable: true
            });
        };
        var this_1 = this;
        for (var name_1 in Service.handlers) {
            _loop_1(name_1);
        }
        this.add(new Method_1.Method(this.methodManager.getNames.bind(this.methodManager), '~'));
    }
    Service.register = function (name, ctor) {
        Service.handlers[name] = ctor;
        ctor.serverTypes.forEach(function (type) {
            if (Service.serverTypes.has(type)) {
                Service.serverTypes.get(type).push(name);
            }
            else {
                Service.serverTypes.set(type, [name]);
            }
        });
    };
    Object.defineProperty(Service.prototype, "names", {
        get: function () {
            return this.methodManager.getNames();
        },
        enumerable: true,
        configurable: true
    });
    Service.prototype.bind = function (server, name) {
        var type = server.constructor;
        var serverTypes = Service.serverTypes;
        if (serverTypes.has(type)) {
            var names = serverTypes.get(type);
            for (var i = 0, n = names.length; i < n; ++i) {
                if ((name === undefined) || (name === names[i])) {
                    this.handlers[names[i]].bind(server);
                }
            }
        }
        else {
            throw new Error('This type server is not supported.');
        }
        return this;
    };
    Service.prototype.handle = function (request, context) {
        return this.ioManager.handler(request, context);
    };
    Service.prototype.process = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var codec, result, _a, name_2, args, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        codec = this.codec;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = codec.decode(request, context), name_2 = _a[0], args = _a[1];
                        return [4 /*yield*/, this.invokeManager.handler(name_2, args, context)];
                    case 2:
                        result = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        result = e_1;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, codec.encode(result, context)];
                }
            });
        });
    };
    Service.prototype.execute = function (name, args, context) {
        return __awaiter(this, void 0, void 0, function () {
            var method, func;
            return __generator(this, function (_a) {
                method = context.method;
                func = method.method;
                if (method.missing) {
                    if (method.passContext) {
                        return [2 /*return*/, func.apply(method.target, [name, args, context])];
                    }
                    return [2 /*return*/, func.apply(method.target, [name, args])];
                }
                if (method.passContext) {
                    args.push(context);
                }
                return [2 /*return*/, func.apply(method.target, args)];
            });
        });
    };
    Service.prototype.use = function () {
        var _a, _b;
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        if (handlers.length <= 0)
            return this;
        switch (handlers[0].length) {
            case 4:
                (_a = this.invokeManager).use.apply(_a, handlers);
                break;
            case 3:
                (_b = this.ioManager).use.apply(_b, handlers);
                break;
            default: throw new TypeError('Invalid parameter type');
        }
        return this;
    };
    Service.prototype.unuse = function () {
        var _a, _b;
        var handlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handlers[_i] = arguments[_i];
        }
        if (handlers.length <= 0)
            return this;
        switch (handlers[0].length) {
            case 4:
                (_a = this.invokeManager).unuse.apply(_a, handlers);
                break;
            case 3:
                (_b = this.ioManager).unuse.apply(_b, handlers);
                break;
            default: throw new TypeError('Invalid parameter type');
        }
        return this;
    };
    Service.prototype.get = function (name) {
        return this.methodManager.get(name);
    };
    Service.prototype.add = function (method) {
        this.methodManager.add(method);
        return this;
    };
    Service.prototype.remove = function (name) {
        this.methodManager.remove(name);
        return this;
    };
    Service.prototype.addFunction = function (fn) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.methodManager).addFunction.apply(_a, __spreadArrays([fn], args));
        return this;
    };
    Service.prototype.addMethod = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.methodManager).addMethod.apply(_a, __spreadArrays([args[0], args[1]], args.slice(2)));
        return this;
    };
    Service.prototype.addMissingMethod = function (fn, target) {
        this.methodManager.addMissingMethod(fn, target);
        return this;
    };
    Service.prototype.addFunctions = function (functions) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.methodManager).addFunctions.apply(_a, __spreadArrays([functions], args));
        return this;
    };
    Service.prototype.addMethods = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.methodManager).addMethods.apply(_a, __spreadArrays([args[0], args[1]], args.slice(2)));
        return this;
    };
    Service.prototype.addInstanceMethods = function (target, prefix) {
        this.methodManager.addInstanceMethods(target, prefix);
        return this;
    };
    Service.handlers = Object.create(null);
    Service.serverTypes = new Map();
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=Service.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceCodec.js":
/*!***********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/ServiceCodec.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ServiceCodec.ts                                          |
|                                                          |
| ServiceCodec for TypeScript.                             |
|                                                          |
| LastModified: Mar 28, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var DefaultServiceCodec = /** @class */ (function () {
    function DefaultServiceCodec() {
        this.debug = false;
        this.simple = false;
        this.utc = false;
        this.longType = 'number';
        this.dictType = 'object';
        this.nullType = undefined;
    }
    DefaultServiceCodec.prototype.encode = function (result, context) {
        var stream = new io_1.ByteStream();
        var writer = new io_1.Writer(stream, this.simple, this.utc);
        var headers = context.responseHeaders;
        if (this.simple) {
            headers.simple = true;
        }
        var size = 0;
        for (var _ in headers) {
            size++;
        }
        if (size > 0) {
            stream.writeByte(72 /* TagHeader */);
            writer.serialize(headers);
            writer.reset();
        }
        if (result instanceof Error) {
            stream.writeByte(69 /* TagError */);
            writer.serialize(this.debug ? result.stack ? result.stack : result.message : result.message);
        }
        else {
            stream.writeByte(82 /* TagResult */);
            writer.serialize(result);
        }
        stream.writeByte(122 /* TagEnd */);
        return stream.takeBytes();
    };
    DefaultServiceCodec.prototype.decodeMethod = function (name, context) {
        var service = context.service;
        var method = service.get(name);
        if (method === undefined) {
            throw new Error('Can\'t find this method ' + name + '().');
        }
        context.method = method;
        return method;
    };
    DefaultServiceCodec.prototype.decodeArguments = function (method, reader, context) {
        var stream = reader.stream;
        var tag = stream.readByte();
        if (method.missing) {
            if (tag === 97 /* TagList */) {
                reader.reset();
                return reader.read(tag, Array);
            }
            return [];
        }
        var args = [];
        if (tag === 97 /* TagList */) {
            reader.reset();
            var count = io_1.ValueReader.readCount(stream);
            var paramTypes = method.paramTypes;
            if (paramTypes === undefined) {
                paramTypes = new Array(count).fill(this.nullType);
            }
            else {
                paramTypes.length = count;
                for (var i = 0; i < count; ++i) {
                    if (paramTypes[i] === undefined) {
                        paramTypes[i] = this.nullType;
                    }
                }
            }
            args = new Array(count);
            reader.addReference(args);
            for (var i = 0; i < count; ++i) {
                args[i] = reader.deserialize(paramTypes[i]);
            }
            stream.readByte();
        }
        return args;
    };
    DefaultServiceCodec.prototype.decode = function (request, context) {
        if (request.length === 0) {
            this.decodeMethod('~', context);
            return ['~', []];
        }
        var stream = new io_1.ByteStream(request);
        var reader = new io_1.Reader(stream, false);
        reader.longType = this.longType;
        reader.dictType = this.dictType;
        var tag = stream.readByte();
        if (tag === 72 /* TagHeader */) {
            var headers = reader.deserialize(this.nullType);
            for (var name_1 in headers) {
                context.requestHeaders[name_1] = headers[name_1];
            }
            reader.reset();
            tag = stream.readByte();
        }
        switch (tag) {
            case 67 /* TagCall */:
                if (context.requestHeaders.simple) {
                    reader.simple = true;
                }
                var name_2 = reader.deserialize(String);
                var args = this.decodeArguments(this.decodeMethod(name_2, context), reader, context);
                return [name_2, args];
            case 122 /* TagEnd */:
                this.decodeMethod('~', context);
                return ['~', []];
            default:
                throw new Error('Invalid request:\r\n' + stream.toString());
        }
    };
    DefaultServiceCodec.instance = new DefaultServiceCodec();
    return DefaultServiceCodec;
}());
exports.DefaultServiceCodec = DefaultServiceCodec;
//# sourceMappingURL=ServiceCodec.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceContext.js":
/*!*************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/ServiceContext.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| ServiceContext.ts                                        |
|                                                          |
| ServiceContext for TypeScript.                           |
|                                                          |
| LastModified: Dec 30, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Context_1 = __webpack_require__(/*! ./Context */ "./real-server/node_modules/@hprose/rpc-core/lib/Context.js");
var ServiceContext = /** @class */ (function (_super) {
    __extends(ServiceContext, _super);
    function ServiceContext(service) {
        var _this = _super.call(this) || this;
        _this.service = service;
        return _this;
    }
    return ServiceContext;
}(Context_1.Context));
exports.ServiceContext = ServiceContext;
//# sourceMappingURL=ServiceContext.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/TimeoutError.js":
/*!***********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/TimeoutError.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| TimeoutError.ts                                          |
|                                                          |
| TimeoutError for TypeScript.                             |
|                                                          |
| LastModified: Dec 26, 2018                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(message) {
        if (message === void 0) { message = 'timeout'; }
        return _super.call(this, message) || this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=TimeoutError.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/Utils.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/Utils.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| Utils.ts                                                 |
|                                                          |
| Utils for TypeScript.                                    |
|                                                          |
| LastModified: Jan 9, 2019                                |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
function parseURI(uri) {
    var pattern = new RegExp('^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?');
    var matches = uri.match(pattern);
    if (matches) {
        var host = matches[4].split(':', 2);
        return {
            protocol: matches[1],
            host: matches[4],
            hostname: host[0],
            port: parseInt(host[1], 10) || 0,
            path: matches[5],
            query: matches[7],
            fragment: matches[9]
        };
    }
    throw new Error('Invalid URI');
}
exports.parseURI = parseURI;
function normalize(functions) {
    var root = [Object.create(null)];
    for (var i = 0, n = functions.length; i < n; ++i) {
        var func = functions[i].split('_');
        var n_1 = func.length - 1;
        if (n_1 > 0) {
            var node = root;
            for (var j = 0; j < n_1; j++) {
                var f = func[j];
                if (node[0][f] === undefined) {
                    node[0][f] = [Object.create(null)];
                }
                node = node[0][f];
            }
            node.push(func[n_1]);
        }
        root.push(functions[i]);
    }
    return root;
}
exports.normalize = normalize;
function getCallback(resolve, reject) {
    return function () {
        switch (arguments.length) {
            case 1:
                var arg = arguments[0];
                if (arg instanceof Error) {
                    reject(arg);
                }
                else {
                    resolve(arg);
                }
                break;
            case 2:
                var arg1 = arguments[0];
                var arg2 = arguments[1];
                if (arg1 instanceof Error) {
                    reject(arg1);
                }
                else if (arg2 instanceof Error) {
                    reject(arg2);
                }
                else if (arg1 === undefined) {
                    resolve(arg2);
                }
                else {
                    resolve(arg1);
                }
                break;
        }
    };
}
function promisify(fn, thisArg) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            args.push(getCallback(resolve, reject));
            try {
                fn.apply(thisArg, args);
            }
            catch (error) {
                reject(error);
            }
        });
    };
}
exports.promisify = promisify;
var CRC32TABLE = [
    0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
    0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
    0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
    0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
    0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
    0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
    0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
    0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
    0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
    0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
    0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
    0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
    0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
    0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
    0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
    0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
    0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
    0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
    0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
    0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
    0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
    0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
    0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
    0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
    0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
    0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
    0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
    0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
    0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
    0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
    0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
    0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D
];
function crc32(data, crc) {
    if (crc === void 0) { crc = 0; }
    crc = crc ^ (-1);
    for (var i = 0, n = data.length; i < n; ++i) {
        crc = (crc >>> 8) ^ CRC32TABLE[(crc ^ data[i]) & 0xFF];
    }
    return crc ^ (-1);
}
exports.crc32 = crc32;
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-core/lib/index.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-core/lib/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| index.ts                                                 |
|                                                          |
| @hprose/rpc-core for TypeScript.                         |
|                                                          |
| LastModified: Feb 16, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = __webpack_require__(/*! ./Client */ "./real-server/node_modules/@hprose/rpc-core/lib/Client.js");
exports.Client = Client_1.Client;
var ClientCodec_1 = __webpack_require__(/*! ./ClientCodec */ "./real-server/node_modules/@hprose/rpc-core/lib/ClientCodec.js");
exports.DefaultClientCodec = ClientCodec_1.DefaultClientCodec;
var ClientContext_1 = __webpack_require__(/*! ./ClientContext */ "./real-server/node_modules/@hprose/rpc-core/lib/ClientContext.js");
exports.ClientContext = ClientContext_1.ClientContext;
var Context_1 = __webpack_require__(/*! ./Context */ "./real-server/node_modules/@hprose/rpc-core/lib/Context.js");
exports.Context = Context_1.Context;
var CookieManager_1 = __webpack_require__(/*! ./CookieManager */ "./real-server/node_modules/@hprose/rpc-core/lib/CookieManager.js");
exports.getCookie = CookieManager_1.getCookie;
exports.setCookie = CookieManager_1.setCookie;
var Deferred_1 = __webpack_require__(/*! ./Deferred */ "./real-server/node_modules/@hprose/rpc-core/lib/Deferred.js");
exports.defer = Deferred_1.defer;
var PluginManager_1 = __webpack_require__(/*! ./PluginManager */ "./real-server/node_modules/@hprose/rpc-core/lib/PluginManager.js");
exports.PluginManager = PluginManager_1.PluginManager;
var InvokeManager_1 = __webpack_require__(/*! ./InvokeManager */ "./real-server/node_modules/@hprose/rpc-core/lib/InvokeManager.js");
exports.InvokeManager = InvokeManager_1.InvokeManager;
var IOManager_1 = __webpack_require__(/*! ./IOManager */ "./real-server/node_modules/@hprose/rpc-core/lib/IOManager.js");
exports.IOManager = IOManager_1.IOManager;
var Method_1 = __webpack_require__(/*! ./Method */ "./real-server/node_modules/@hprose/rpc-core/lib/Method.js");
exports.Method = Method_1.Method;
var MethodManager_1 = __webpack_require__(/*! ./MethodManager */ "./real-server/node_modules/@hprose/rpc-core/lib/MethodManager.js");
exports.MethodManager = MethodManager_1.MethodManager;
var TimeoutError_1 = __webpack_require__(/*! ./TimeoutError */ "./real-server/node_modules/@hprose/rpc-core/lib/TimeoutError.js");
exports.TimeoutError = TimeoutError_1.TimeoutError;
var Utils_1 = __webpack_require__(/*! ./Utils */ "./real-server/node_modules/@hprose/rpc-core/lib/Utils.js");
exports.parseURI = Utils_1.parseURI;
exports.normalize = Utils_1.normalize;
exports.promisify = Utils_1.promisify;
exports.crc32 = Utils_1.crc32;
var Service_1 = __webpack_require__(/*! ./Service */ "./real-server/node_modules/@hprose/rpc-core/lib/Service.js");
exports.Service = Service_1.Service;
var ServiceCodec_1 = __webpack_require__(/*! ./ServiceCodec */ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceCodec.js");
exports.DefaultServiceCodec = ServiceCodec_1.DefaultServiceCodec;
var ServiceContext_1 = __webpack_require__(/*! ./ServiceContext */ "./real-server/node_modules/@hprose/rpc-core/lib/ServiceContext.js");
exports.ServiceContext = ServiceContext_1.ServiceContext;
var MockHandler_1 = __webpack_require__(/*! ./MockHandler */ "./real-server/node_modules/@hprose/rpc-core/lib/MockHandler.js");
exports.MockServer = MockHandler_1.MockServer;
exports.MockHandler = MockHandler_1.MockHandler;
var MockTransport_1 = __webpack_require__(/*! ./MockTransport */ "./real-server/node_modules/@hprose/rpc-core/lib/MockTransport.js");
exports.MockTransport = MockTransport_1.MockTransport;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/HttpHandler.js":
/*!**********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/HttpHandler.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| HttpHandler.ts                                           |
|                                                          |
| HttpHandler for TypeScript.                              |
|                                                          |
| LastModified: Mar 29, 2020                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(__webpack_require__(/*! http */ "http"));
var https = __importStar(__webpack_require__(/*! https */ "https"));
var net_1 = __webpack_require__(/*! net */ "net");
var fs = __importStar(__webpack_require__(/*! fs */ "fs"));
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var lastModified = (new Date()).toUTCString();
var etag = '"' + Math.floor(Math.random() * 2147483647).toString(16) +
    ':' + Math.floor(Math.random() * 2147483647).toString(16) + '"';
var HttpHandler = /** @class */ (function () {
    function HttpHandler(service) {
        var _this = this;
        this.service = service;
        this.p3p = true;
        this.get = true;
        this.crossDomain = true;
        this.timeout = 30000;
        this.httpHeaders = Object.create(null);
        this.origins = Object.create(null);
        this.originCount = 0;
        this._crossDomainXmlFile = '';
        this._crossDomainXmlContent = Buffer.alloc(0);
        this._clientAccessPolicyXmlFile = '';
        this._clientAccessPolicyXmlContent = Buffer.alloc(0);
        this.handler = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var context, size;
            var _this = this;
            return __generator(this, function (_a) {
                context = new rpc_core_1.ServiceContext(this.service);
                context.request = request;
                context.response = response;
                context.remoteAddress = {
                    'family': request.socket.remoteFamily,
                    'address': request.socket.remoteAddress,
                    'port': request.socket.remotePort
                };
                context.localAddress = {
                    'family': net_1.isIPv6(request.socket.localAddress) ? 'IPv6' : 'IPv4',
                    'address': request.socket.localAddress,
                    'port': request.socket.localPort
                };
                context.handler = this;
                context['httpRequestHeaders'] = request.headers;
                size = Number(request.headers['content-length']);
                if (size > this.service.maxRequestLength) {
                    response.statusCode = 413;
                    response.statusMessage = 'Request Entity Too Large';
                    response.end();
                    return [2 /*return*/, Promise.resolve()];
                }
                if (this.timeout > 0) {
                    request.setTimeout(this.timeout, function () {
                        request.destroy(new rpc_core_1.TimeoutError());
                    });
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var instream = size ? new io_1.ByteStream(size) : new io_1.ByteStream();
                        var ondata = function (chunk) {
                            if (instream.length + chunk.length > size) {
                                request.off('data', ondata);
                                response.statusCode = 413;
                                response.statusMessage = 'Request Entity Too Large';
                                response.end();
                                return resolve();
                            }
                            instream.write(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.length));
                        };
                        request.on('data', ondata);
                        request.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (request.method === 'GET') {
                                            if (this._clientAccessPolicyXmlContent.length > 0
                                                && this.clientAccessPolicyXmlHandler(request, response)) {
                                                return [2 /*return*/, resolve()];
                                            }
                                            if (this._crossDomainXmlContent.length > 0
                                                && this.crossDomainXmlHandler(request, response)) {
                                                return [2 /*return*/, resolve()];
                                            }
                                            if (!this.get) {
                                                response.statusCode = 403;
                                                response.statusMessage = 'Forbidden';
                                                return [2 /*return*/, resolve()];
                                            }
                                        }
                                        return [4 /*yield*/, this.service.handle(instream.takeBytes(), context)];
                                    case 1:
                                        result = _a.sent();
                                        try {
                                            this.sendHeader(request, response, context);
                                        }
                                        catch (e) {
                                            return [2 /*return*/, reject(e)];
                                        }
                                        this.end(result, response);
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        request.on('error', function (error) {
                            if (_this.onerror)
                                _this.onerror(error);
                            reject(error);
                        });
                        request.on('close', function () {
                            if (_this.onclose)
                                _this.onclose(request);
                            reject();
                        });
                    })];
            });
        }); };
    }
    HttpHandler.prototype.bind = function (server) {
        var _this = this;
        server.on('request', this.handler);
        server.on('error', function (error) {
            if (_this.onerror)
                _this.onerror(error);
        });
    };
    HttpHandler.prototype.crossDomainXmlHandler = function (request, response) {
        if (request.url && request.url.toLowerCase().endsWith('/crossdomain.xml')) {
            if (request.headers['if-modified-since'] === lastModified &&
                request.headers['if-none-match'] === etag) {
                response.statusCode = 304;
            }
            else {
                response.setHeader('Last-Modified', lastModified);
                response.setHeader('Etag', etag);
                response.setHeader('Content-Type', 'text/xml');
                response.setHeader('Content-Length', this._crossDomainXmlContent.length);
                response.write(this._crossDomainXmlContent);
            }
            response.end();
            return true;
        }
        return false;
    };
    HttpHandler.prototype.clientAccessPolicyXmlHandler = function (request, response) {
        if (request.url && request.url.toLowerCase().endsWith('/clientaccesspolicy.xml')) {
            if (request.headers['if-modified-since'] === lastModified &&
                request.headers['if-none-match'] === etag) {
                response.statusCode = 304;
            }
            else {
                response.setHeader('Last-Modified', lastModified);
                response.setHeader('Etag', etag);
                response.setHeader('Content-Type', 'text/xml');
                response.setHeader('Content-Length', this._clientAccessPolicyXmlContent.length);
                response.write(this._clientAccessPolicyXmlContent);
            }
            response.end();
            return true;
        }
        return false;
    };
    HttpHandler.prototype.setHeader = function (response, headers) {
        if (headers) {
            for (var name_1 in headers) {
                var value = headers[name_1];
                if (value !== undefined) {
                    response.setHeader(name_1, value);
                }
            }
        }
    };
    HttpHandler.prototype.sendHeader = function (request, response, context) {
        if ('httpStatusCode' in context) {
            response.statusCode = Number(context['httpStatusCode']);
        }
        else {
            response.statusCode = 200;
        }
        response.setHeader('Content-Type', 'text/plain');
        if (this.p3p) {
            response.setHeader('P3P', 'CP="CAO DSP COR CUR ADM DEV TAI PSA PSD IVAi IVDi ' +
                'CONi TELo OTPi OUR DELi SAMi OTRi UNRi PUBi IND PHY ONL ' +
                'UNI PUR FIN COM NAV INT DEM CNT STA POL HEA PRE GOV"');
        }
        if (this.crossDomain) {
            var origin_1 = request.headers['origin'];
            if (typeof origin_1 === 'string' && origin_1 !== 'null') {
                if (this.originCount === 0 || this.origins[origin_1]) {
                    response.setHeader('Access-Control-Allow-Origin', origin_1);
                    response.setHeader('Access-Control-Allow-Credentials', 'true');
                }
            }
            else {
                response.setHeader('Access-Control-Allow-Origin', '*');
            }
        }
        this.setHeader(response, this.httpHeaders);
        this.setHeader(response, context['httpResponseHeaders']);
    };
    HttpHandler.prototype.end = function (data, response) {
        response.setHeader('Content-Length', data.length);
        response.end(Buffer.from(data.buffer, data.byteOffset, data.length));
    };
    HttpHandler.prototype.addAccessControlAllowOrigin = function (origin) {
        if (!this.origins[origin]) {
            this.origins[origin] = true;
            this.originCount++;
        }
    };
    HttpHandler.prototype.removeAccessControlAllowOrigin = function (origin) {
        if (this.origins[origin]) {
            delete this.origins[origin];
            this.originCount--;
        }
    };
    Object.defineProperty(HttpHandler.prototype, "crossDomainXmlFile", {
        get: function () {
            return this._crossDomainXmlFile;
        },
        set: function (value) {
            this._crossDomainXmlFile = value;
            this._crossDomainXmlContent = fs.readFileSync(this._crossDomainXmlFile);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpHandler.prototype, "crossDomainXmlContent", {
        get: function () {
            return this._crossDomainXmlContent;
        },
        set: function (value) {
            this._crossDomainXmlFile = '';
            this._crossDomainXmlContent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpHandler.prototype, "clientAccessPolicyXmlFile", {
        get: function () {
            return this._clientAccessPolicyXmlFile;
        },
        set: function (value) {
            this._clientAccessPolicyXmlFile = value;
            this._clientAccessPolicyXmlContent = fs.readFileSync(this._clientAccessPolicyXmlFile);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpHandler.prototype, "clientAccessPolicyXmlContent", {
        get: function () {
            return this._clientAccessPolicyXmlContent;
        },
        set: function (value) {
            this._clientAccessPolicyXmlFile = '';
            this._clientAccessPolicyXmlContent = value;
        },
        enumerable: true,
        configurable: true
    });
    HttpHandler.serverTypes = [http.Server, https.Server];
    return HttpHandler;
}());
exports.HttpHandler = HttpHandler;
rpc_core_1.Service.register('http', HttpHandler);
//# sourceMappingURL=HttpHandler.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/HttpTransport.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/HttpTransport.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| HttpTransport.ts                                         |
|                                                          |
| HttpTransport for TypeScript.                            |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __webpack_require__(/*! url */ "url");
var http = __importStar(__webpack_require__(/*! http */ "http"));
var https = __importStar(__webpack_require__(/*! https */ "https"));
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var HttpTransport = /** @class */ (function () {
    function HttpTransport() {
        this.counter = 0;
        this.requests = Object.create(null);
        this.keepAlive = true;
        this.httpAgent = new http.Agent({ keepAlive: true });
        this.httpsAgent = new https.Agent({ keepAlive: true });
        this.options = Object.create(null);
        this.httpRequestHeaders = Object.create(null);
    }
    HttpTransport.prototype.getRequestHeader = function (httpRequestHeaders) {
        var headers = Object.create(null);
        for (var name_1 in this.httpRequestHeaders) {
            headers[name_1] = this.httpRequestHeaders[name_1];
        }
        if (httpRequestHeaders) {
            for (var name_2 in httpRequestHeaders) {
                headers[name_2] = httpRequestHeaders[name_2];
            }
        }
        return headers;
    };
    HttpTransport.prototype.transport = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var options, client, secure, key, httpContext, cookie;
            var _this = this;
            return __generator(this, function (_a) {
                options = url_1.parse(context.uri);
                switch (options.protocol) {
                    case 'http:':
                        client = http;
                        secure = false;
                        options.agent = this.httpAgent;
                        break;
                    case 'https:':
                        client = https;
                        secure = true;
                        options.agent = this.httpsAgent;
                        break;
                    default:
                        throw new Error('unsupported ' + options.protocol + 'protocol');
                }
                for (key in this.options) {
                    if (!this.options.hasOwnProperty || this.options.hasOwnProperty(key)) {
                        options[key] = this.options[key];
                    }
                }
                httpContext = context;
                options.method = 'POST';
                options.headers = this.getRequestHeader(httpContext.httpRequestHeaders);
                options.headers['Content-Length'] = request.length;
                cookie = rpc_core_1.getCookie(options.host, options.path, secure);
                if (cookie) {
                    options.headers['Cookie'] = cookie;
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var index = _this.counter++;
                        var req = client.request(options, function (res) {
                            var size = res.headers['content-length'];
                            var instream = size ? new io_1.ByteStream(parseInt(size, 10)) : new io_1.ByteStream();
                            res.on('data', function (chunk) {
                                instream.write(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.length));
                            });
                            res.on('end', function () {
                                delete _this.requests[index];
                                httpContext.httpStatusCode = res.statusCode;
                                httpContext.httpStatusText = res.statusMessage;
                                if (res.statusCode) {
                                    if (res.statusCode >= 200 && res.statusCode < 300) {
                                        httpContext.httpResponseHeaders = res.headers;
                                        rpc_core_1.setCookie(res.headers, options.host);
                                        resolve(instream.takeBytes());
                                    }
                                    else {
                                        reject(new Error(res.statusCode + ':' + res.statusMessage));
                                        req.socket.end();
                                    }
                                }
                                else {
                                    reject(new Error(instream.toString()));
                                    req.socket.end();
                                }
                            });
                            res.on('error', function (err) {
                                delete _this.requests[index];
                                reject(err);
                            });
                        });
                        _this.requests[index] = req;
                        req.shouldKeepAlive = _this.keepAlive;
                        req.setTimeout(context.timeout, function () {
                            delete _this.requests[index];
                            reject(new rpc_core_1.TimeoutError());
                            req.abort();
                        });
                        req.on('error', function (err) {
                            delete _this.requests[index];
                            reject(err);
                        });
                        req.on('abort', function () {
                            delete _this.requests[index];
                            reject(new Error('transport abort'));
                        });
                        req.end(Buffer.from(request.buffer, 0, request.length));
                    })];
            });
        });
    };
    HttpTransport.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var index, request;
            return __generator(this, function (_a) {
                for (index in this.requests) {
                    request = this.requests[index];
                    delete this.requests[index];
                    if (request) {
                        request.abort();
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    HttpTransport.schemes = ['http', 'https'];
    return HttpTransport;
}());
exports.HttpTransport = HttpTransport;
rpc_core_1.Client.register('http', HttpTransport);
//# sourceMappingURL=HttpTransport.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/SocketHandler.js":
/*!************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/SocketHandler.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| SocketHandler.ts                                         |
|                                                          |
| SocketHandler for TypeScript.                            |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(__webpack_require__(/*! net */ "net"));
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var SocketHandler = /** @class */ (function () {
    function SocketHandler(service) {
        var _this = this;
        this.service = service;
        this.handler = function (socket) {
            socket.unref();
            try {
                if (_this.onaccept)
                    _this.onaccept(socket);
            }
            catch (e) {
                socket.destroy(e);
                return;
            }
            socket.on('close', function () {
                if (_this.onclose)
                    _this.onclose(socket);
            });
            socket.on('error', function (error) {
                if (_this.onerror)
                    _this.onerror(error);
            });
            _this.receive(socket);
        };
    }
    SocketHandler.prototype.bind = function (server) {
        var _this = this;
        server.on('connection', this.handler);
        server.on('error', function (error) {
            if (_this.onerror)
                _this.onerror(error);
        });
    };
    SocketHandler.prototype.send = function (socket, response, index) {
        var n = response.length;
        var header = Buffer.allocUnsafe(12);
        header.writeInt32BE(n | 0x80000000, 4);
        header.writeInt32BE(index, 8);
        var crc = rpc_core_1.crc32(header.subarray(4, 12));
        header.writeInt32BE(crc, 0);
        socket.write(header);
        socket.write(Buffer.from(response.buffer, response.byteOffset, response.length));
    };
    SocketHandler.prototype.run = function (socket, request, index) {
        return __awaiter(this, void 0, void 0, function () {
            var context, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = new rpc_core_1.ServiceContext(this.service);
                        context.socket = socket;
                        context.remoteAddress = {
                            'family': socket.remoteFamily,
                            'address': socket.remoteAddress,
                            'port': socket.remotePort
                        };
                        context.localAddress = {
                            'family': net.isIPv6(socket.localAddress) ? 'IPv6' : 'IPv4',
                            'address': socket.localAddress,
                            'port': socket.localPort
                        };
                        context.handler = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.service.handle(request, context)];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        index |= 0x80000000;
                        response = (new io_1.ByteStream(e_1.message)).bytes;
                        return [3 /*break*/, 4];
                    case 4:
                        this.send(socket, response, index);
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketHandler.prototype.receive = function (socket) {
        var _this = this;
        var instream = new io_1.ByteStream();
        var headerLength = 12;
        var bodyLength = -1;
        var index = 0;
        var ondata = function (data) {
            var chunk = new Uint8Array(data.buffer, data.byteOffset, data.length);
            instream.write(chunk);
            while (true) {
                if ((bodyLength < 0) && (instream.length >= headerLength)) {
                    var crc = instream.readInt32BE();
                    instream.mark();
                    var header = instream.read(8);
                    if (rpc_core_1.crc32(header) !== crc || (header[0] & 0x80) === 0 || (header[4] & 0x80) !== 0) {
                        socket.removeListener('data', ondata);
                        socket.destroy(new Error('Invalid request'));
                        return;
                    }
                    instream.reset();
                    bodyLength = instream.readInt32BE() & 0x7FFFFFFF;
                    index = instream.readInt32BE();
                    if (bodyLength > _this.service.maxRequestLength) {
                        socket.removeListener('data', ondata);
                        _this.send(socket, (new io_1.ByteStream('Request entity too large')).bytes, index | 0x80000000);
                        socket.end();
                        return;
                    }
                }
                if ((bodyLength >= 0) && ((instream.length - headerLength) >= bodyLength)) {
                    var request = instream.read(bodyLength);
                    instream.trunc();
                    bodyLength = -1;
                    _this.run(socket, request, index);
                }
                else {
                    break;
                }
            }
        };
        socket.on('data', ondata);
    };
    SocketHandler.serverTypes = [net.Server];
    return SocketHandler;
}());
exports.SocketHandler = SocketHandler;
rpc_core_1.Service.register('socket', SocketHandler);
//# sourceMappingURL=SocketHandler.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/SocketTransport.js":
/*!**************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/SocketTransport.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| SocketTransport.ts                                       |
|                                                          |
| SocketTransport for TypeScript.                          |
|                                                          |
| LastModified: Dec 18, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(__webpack_require__(/*! net */ "net"));
var tls = __importStar(__webpack_require__(/*! tls */ "tls"));
var url_1 = __webpack_require__(/*! url */ "url");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var SocketTransport = /** @class */ (function () {
    function SocketTransport() {
        this.counter = 0;
        this.results = new Map();
        this.sockets = Object.create(null);
        this.noDelay = true;
        this.keepAlive = true;
        this.options = Object.create(null);
    }
    SocketTransport.prototype.connect = function (uri) {
        var _a;
        var parser = url_1.parse(uri);
        var protocol = parser.protocol;
        switch (protocol) {
            case 'tcp:':
            case 'tcp4:':
            case 'tcp6:':
            case 'tls:':
            case 'tls4:':
            case 'tls6:':
            case 'ssl:':
            case 'ssl4:':
            case 'ssl6:': {
                var options = Object.create(null);
                options.host = (_a = parser.hostname, (_a !== null && _a !== void 0 ? _a : undefined));
                options.port = parser.port ? parseInt(parser.port, 10) : 8412;
                switch (protocol) {
                    case 'tcp4:':
                    case 'tls4:':
                    case 'ssl4:': {
                        options.family = 4;
                        break;
                    }
                    case 'tcp6:':
                    case 'tls6:':
                    case 'ssl6:': {
                        options.family = 6;
                        break;
                    }
                }
                switch (protocol) {
                    case 'tcp:':
                    case 'tcp4:':
                    case 'tcp6:': {
                        return net.connect(options);
                    }
                    default: {
                        var tlsOptions = options;
                        for (var key in this.options) {
                            if (!this.options.hasOwnProperty || this.options.hasOwnProperty(key)) {
                                tlsOptions[key] = this.options[key];
                            }
                        }
                        return tls.connect(tlsOptions);
                    }
                }
            }
            case 'unix:': {
                var options = Object.create(null);
                if (parser.path) {
                    options.path = parser.path;
                }
                else {
                    throw new Error('invalid unix path');
                }
                return net.connect(options);
            }
            default:
                throw new Error('unsupported ' + protocol + ' protocol');
        }
    };
    SocketTransport.prototype.receive = function (uri, socket) {
        var _this = this;
        var instream = new io_1.ByteStream();
        var headerLength = 12;
        var bodyLength = -1;
        var index = 0;
        var ondata = function (data) {
            var chunk = new Uint8Array(data.buffer, data.byteOffset, data.length);
            instream.write(chunk);
            while (true) {
                if ((bodyLength < 0) && (instream.length >= headerLength)) {
                    var crc = instream.readInt32BE();
                    instream.mark();
                    var header = instream.read(8);
                    if (rpc_core_1.crc32(header) !== crc || (header[0] & 0x80) === 0) {
                        socket.removeListener('data', ondata);
                        socket.destroy(new Error('invalid response'));
                        return;
                    }
                    instream.reset();
                    bodyLength = instream.readInt32BE() & 0x7FFFFFFF;
                    index = instream.readInt32BE();
                }
                if ((bodyLength >= 0) && ((instream.length - headerLength) >= bodyLength)) {
                    var response = instream.read(bodyLength);
                    instream.trunc();
                    bodyLength = -1;
                    var has_error = (index & 0x80000000) !== 0;
                    index &= 0x7FFFFFFF;
                    var results = _this.results.get(socket);
                    if (results) {
                        var result = results[index];
                        delete results[index];
                        if (has_error) {
                            if (result) {
                                result.reject(new Error(io_1.fromUint8Array(response)));
                            }
                            socket.removeListener('data', ondata);
                            socket.end();
                            return;
                        }
                        else if (result) {
                            result.resolve(response);
                        }
                    }
                }
                else {
                    break;
                }
            }
        };
        socket.on('data', ondata);
    };
    SocketTransport.prototype.getSocket = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var socket, conn, onerror;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sockets[uri]];
                    case 1:
                        socket = _a.sent();
                        if (socket !== undefined && !socket.destroyed) {
                            return [2 /*return*/, socket];
                        }
                        conn = rpc_core_1.defer();
                        socket = this.connect(uri);
                        socket.unref();
                        socket.setNoDelay(this.noDelay);
                        socket.setKeepAlive(this.keepAlive);
                        socket.on('connect', function () {
                            conn.resolve(socket);
                        });
                        this.receive(uri, socket);
                        onerror = function (error) { return __awaiter(_this, void 0, void 0, function () {
                            var results, index, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        results = this.results.get(socket);
                                        if (results) {
                                            for (index in results) {
                                                result = results[index];
                                                result.reject(error);
                                                delete results[index];
                                            }
                                        }
                                        return [4 /*yield*/, this.sockets[uri]];
                                    case 1:
                                        if (!((_a.sent()) === socket)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.sockets[uri]];
                                    case 2:
                                        (_a.sent()).destroy();
                                        delete this.sockets[uri];
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        socket.on('error', onerror);
                        socket.on('close', function (had_error) {
                            if (had_error)
                                return;
                            onerror(new Error('connection closed'));
                        });
                        this.sockets[uri] = conn.promise;
                        return [2 /*return*/, conn.promise];
                }
            });
        });
    };
    SocketTransport.prototype.transport = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, index, result, socket, results, timeoutId_1, n, header, crc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = context.uri;
                        index = (this.counter < 0x7FFFFFFF) ? ++this.counter : this.counter = 0;
                        result = rpc_core_1.defer();
                        return [4 /*yield*/, this.getSocket(uri)];
                    case 1:
                        socket = _a.sent();
                        if (this.results.get(socket) === undefined) {
                            this.results.set(socket, Object.create(null));
                        }
                        results = this.results.get(socket);
                        results[index] = result;
                        if (context.timeout > 0) {
                            timeoutId_1 = setTimeout(function () {
                                delete results[index];
                                result.reject(new rpc_core_1.TimeoutError());
                            }, context.timeout);
                            result.promise.then(function () {
                                clearTimeout(timeoutId_1);
                            }, function () {
                                clearTimeout(timeoutId_1);
                            });
                        }
                        n = request.length;
                        header = Buffer.allocUnsafe(12);
                        header.writeInt32BE(n | 0x80000000, 4);
                        header.writeInt32BE(index, 8);
                        crc = rpc_core_1.crc32(header.subarray(4, 12));
                        header.writeInt32BE(crc, 0);
                        socket.write(header);
                        socket.write(Buffer.from(request.buffer, request.byteOffset, request.length));
                        return [2 /*return*/, result.promise];
                }
            });
        });
    };
    SocketTransport.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, uri, socket;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.sockets)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        uri = _a[_i];
                        socket = this.sockets[uri];
                        delete this.sockets[uri];
                        if (!socket) return [3 /*break*/, 3];
                        return [4 /*yield*/, socket];
                    case 2:
                        (_c.sent()).end();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SocketTransport.schemes = ['tcp', 'tcp4', 'tcp6', 'tls', 'tls4', 'tls6', 'ssl', 'ssl4', 'ssl6', 'unix'];
    return SocketTransport;
}());
exports.SocketTransport = SocketTransport;
rpc_core_1.Client.register('socket', SocketTransport);
//# sourceMappingURL=SocketTransport.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/UdpHandler.js":
/*!*********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/UdpHandler.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| UdpHandler.ts                                            |
|                                                          |
| UdpHandler for TypeScript.                               |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = __importStar(__webpack_require__(/*! dgram */ "dgram"));
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var UdpHandler = /** @class */ (function () {
    function UdpHandler(service) {
        var _this = this;
        this.service = service;
        this.handler = function (socket) {
            socket.on('message', function (msg, rinfo) { return __awaiter(_this, void 0, void 0, function () {
                var crc, header, bodyLength, index, request, context, response, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            crc = msg.readInt32BE(0);
                            header = msg.subarray(4, 8);
                            if (rpc_core_1.crc32(header) !== crc)
                                return [2 /*return*/];
                            bodyLength = msg.readUInt16BE(4);
                            index = msg.readUInt16BE(6);
                            if (bodyLength !== msg.length - 8 || (index & 0x8000) !== 0)
                                return [2 /*return*/];
                            if (bodyLength > this.service.maxRequestLength) {
                                this.send(socket, Buffer.from('Request entity too large'), index | 0x8000, rinfo);
                                return [2 /*return*/];
                            }
                            request = new Uint8Array(msg.buffer, msg.byteOffset + 8, bodyLength);
                            context = new rpc_core_1.ServiceContext(this.service);
                            context.socket = socket;
                            context.remoteAddress = {
                                'family': rinfo.family,
                                'address': rinfo.address,
                                'port': rinfo.port
                            };
                            context.localAddress = socket.address();
                            context.handler = this;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.service.handle(request, context)];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            index |= 0x8000;
                            response = (new io_1.ByteStream(e_1.message)).bytes;
                            return [3 /*break*/, 4];
                        case 4:
                            this.send(socket, Buffer.from(response.buffer, response.byteOffset, response.length), index, rinfo);
                            return [2 /*return*/];
                    }
                });
            }); });
            socket.on('close', function () {
                if (_this.onclose)
                    _this.onclose(socket);
            });
            socket.on('error', function (error) {
                if (_this.onerror)
                    _this.onerror(error);
            });
        };
    }
    UdpHandler.prototype.send = function (socket, body, index, rinfo) {
        var _this = this;
        var n = body.length;
        var header = Buffer.allocUnsafe(8);
        header.writeUInt16BE(n, 4);
        header.writeUInt16BE(index, 6);
        var crc = rpc_core_1.crc32(new Uint8Array(header.buffer, header.byteOffset + 4, 4));
        header.writeInt32BE(crc, 0);
        socket.send([header, body], rinfo.port, rinfo.address, function (error) {
            if (error && _this.onerror)
                _this.onerror(error);
        });
    };
    UdpHandler.prototype.bind = function (socket) {
        this.handler(socket);
    };
    UdpHandler.serverTypes = [dgram.Socket];
    return UdpHandler;
}());
exports.UdpHandler = UdpHandler;
rpc_core_1.Service.register('udp', UdpHandler);
//# sourceMappingURL=UdpHandler.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/UdpTransport.js":
/*!***********************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/UdpTransport.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| UdpTransport.ts                                          |
|                                                          |
| UdpTransport for TypeScript.                             |
|                                                          |
| LastModified: Dec 18, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = __importStar(__webpack_require__(/*! dgram */ "dgram"));
var url_1 = __webpack_require__(/*! url */ "url");
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var UdpTransport = /** @class */ (function () {
    function UdpTransport() {
        this.counter = 0;
        this.results = new Map();
        this.sockets = Object.create(null);
    }
    UdpTransport.prototype.getSocket = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var socket, udp, parser, protocol, type, onerror;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sockets[uri]];
                    case 1:
                        socket = _a.sent();
                        if (socket !== undefined) {
                            return [2 /*return*/, socket];
                        }
                        udp = rpc_core_1.defer();
                        parser = url_1.parse(uri);
                        protocol = parser.protocol;
                        type = 'udp4';
                        switch (protocol) {
                            case 'udp:':
                            case 'udp4:':
                                break;
                            case 'udp6:':
                                type = 'udp6';
                                break;
                            default:
                                throw new Error('unsupported ' + protocol + ' protocol');
                        }
                        socket = dgram.createSocket(type);
                        socket.unref();
                        socket.on('listening', function () {
                            udp.resolve(socket);
                        });
                        socket.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                            var crc, header, bodyLength, index, has_error, response, results, result;
                            return __generator(this, function (_a) {
                                crc = msg.readInt32BE(0);
                                header = msg.subarray(4, 8);
                                if (rpc_core_1.crc32(header) !== crc)
                                    return [2 /*return*/];
                                bodyLength = msg.readUInt16BE(4);
                                if (bodyLength !== msg.length - 8)
                                    return [2 /*return*/];
                                index = msg.readUInt16BE(6);
                                has_error = (index & 0x8000) !== 0;
                                index &= 0x7FFF;
                                response = new Uint8Array(msg.buffer, msg.byteOffset + 8, bodyLength);
                                results = this.results.get(socket);
                                if (results) {
                                    result = results[index];
                                    delete results[index];
                                    if (result) {
                                        if (has_error) {
                                            result.reject(new Error(io_1.fromUint8Array(response)));
                                        }
                                        else {
                                            result.resolve(response);
                                        }
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        onerror = function (error) { return __awaiter(_this, void 0, void 0, function () {
                            var results, index, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        results = this.results.get(socket);
                                        if (results) {
                                            for (index in results) {
                                                result = results[index];
                                                result.reject(error);
                                                delete results[index];
                                            }
                                        }
                                        return [4 /*yield*/, this.sockets[uri]];
                                    case 1:
                                        if ((_a.sent()) === socket) {
                                            delete this.sockets[uri];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        socket.on('error', onerror);
                        socket.on('close', function () { return onerror(new Error('closed')); });
                        socket.bind();
                        this.sockets[uri] = udp.promise;
                        return [2 /*return*/, udp.promise];
                }
            });
        });
    };
    UdpTransport.prototype.transport = function (request, context) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var uri, index, result, socket, results, timeoutId_1, parser, n, header, crc, body;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (request.length > 65499) {
                            throw new Error('request too large');
                        }
                        uri = context.uri;
                        index = (this.counter < 0x7FFF) ? ++this.counter : this.counter = 0;
                        result = rpc_core_1.defer();
                        return [4 /*yield*/, this.getSocket(uri)];
                    case 1:
                        socket = _b.sent();
                        if (this.results.get(socket) === undefined) {
                            this.results.set(socket, Object.create(null));
                        }
                        results = this.results.get(socket);
                        results[index] = result;
                        if (context.timeout > 0) {
                            timeoutId_1 = setTimeout(function () {
                                delete results[index];
                                result.reject(new rpc_core_1.TimeoutError());
                            }, context.timeout);
                            result.promise.then(function () {
                                clearTimeout(timeoutId_1);
                            }, function () {
                                clearTimeout(timeoutId_1);
                            });
                        }
                        parser = url_1.parse(uri);
                        n = request.length;
                        header = Buffer.allocUnsafe(8);
                        header.writeUInt16BE(n, 4);
                        header.writeUInt16BE(index, 6);
                        crc = rpc_core_1.crc32(new Uint8Array(header.buffer, header.byteOffset + 4, 4));
                        header.writeInt32BE(crc, 0);
                        body = Buffer.from(request.buffer, request.byteOffset, request.length);
                        socket.send([header, body], parser.port ? parseInt(parser.port, 10) : 8412, (_a = parser.hostname, (_a !== null && _a !== void 0 ? _a : undefined)), function (error) {
                            if (error) {
                                delete results[index];
                                result.reject(error);
                            }
                        });
                        return [2 /*return*/, result.promise];
                }
            });
        });
    };
    UdpTransport.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, uri, socket;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.sockets)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        uri = _a[_i];
                        socket = this.sockets[uri];
                        delete this.sockets[uri];
                        if (!socket) return [3 /*break*/, 3];
                        return [4 /*yield*/, socket];
                    case 2:
                        (_c.sent()).close();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UdpTransport.schemes = ['udp', 'udp4', 'udp6'];
    return UdpTransport;
}());
exports.UdpTransport = UdpTransport;
rpc_core_1.Client.register('udp', UdpTransport);
//# sourceMappingURL=UdpTransport.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/WebSocketHandler.js":
/*!***************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/WebSocketHandler.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| WebSocketHandler.ts                                      |
|                                                          |
| WebSocketHandler for TypeScript.                         |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(__webpack_require__(/*! ws */ "ws"));
var http = __importStar(__webpack_require__(/*! http */ "http"));
var https = __importStar(__webpack_require__(/*! https */ "https"));
var net_1 = __webpack_require__(/*! net */ "net");
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var WebSocketHandler = /** @class */ (function () {
    function WebSocketHandler(service) {
        var _this = this;
        this.service = service;
        this.compress = false;
        this.handler = function (websocket, request) {
            try {
                websocket.protocol = 'hprose';
                websocket.binaryType = 'arraybuffer';
                if (_this.onaccept)
                    _this.onaccept(websocket);
            }
            catch (_a) {
                websocket.terminate();
                return;
            }
            websocket.on('close', function () {
                if (_this.onclose)
                    _this.onclose(websocket);
            });
            websocket.on('error', function (error) {
                if (_this.onerror)
                    _this.onerror(error);
            });
            websocket.on('message', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var instream, index, context, response, e_1, header;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            instream = new io_1.ByteStream(data);
                            index = instream.readInt32BE();
                            context = new rpc_core_1.ServiceContext(this.service);
                            context.websocket = websocket;
                            context.request = request;
                            context.remoteAddress = {
                                'family': request.socket.remoteFamily,
                                'address': request.socket.remoteAddress,
                                'port': request.socket.remotePort
                            };
                            context.localAddress = {
                                'family': net_1.isIPv6(request.socket.localAddress) ? 'IPv6' : 'IPv4',
                                'address': request.socket.localAddress,
                                'port': request.socket.localPort
                            };
                            context.handler = this;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.service.handle(instream.remains, context)];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            index |= 0x80000000;
                            response = (new io_1.ByteStream(e_1.message)).bytes;
                            return [3 /*break*/, 4];
                        case 4:
                            header = new Uint8Array(4);
                            io_1.writeInt32BE(header, 0, index);
                            websocket.send(header, {
                                binary: true,
                                compress: this.compress,
                                fin: false
                            }, function (error) {
                                if (error) {
                                    if (_this.onerror)
                                        _this.onerror(error);
                                }
                            });
                            websocket.send(response, {
                                binary: true,
                                compress: this.compress,
                            }, function (error) {
                                if (error) {
                                    if (_this.onerror)
                                        _this.onerror(error);
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        };
    }
    WebSocketHandler.prototype.bind = function (server) {
        var _this = this;
        if (server instanceof http.Server || server instanceof https.Server) {
            server = new ws_1.default.Server({ server: server });
        }
        server.options.perMessageDeflate = false;
        server.options.maxPayload = this.service.maxRequestLength + 4;
        server.on('connection', this.handler);
        server.on('error', function (error) {
            if (_this.onerror)
                _this.onerror(error);
        });
    };
    WebSocketHandler.serverTypes = [http.Server, https.Server, ws_1.default.Server];
    return WebSocketHandler;
}());
exports.WebSocketHandler = WebSocketHandler;
rpc_core_1.Service.register('websocket', WebSocketHandler);
//# sourceMappingURL=WebSocketHandler.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/WebSocketTransport.js":
/*!*****************************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/WebSocketTransport.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| WebSocketTransport.ts                                    |
|                                                          |
| WebSocketTransport for TypeScript.                       |
|                                                          |
| LastModified: Dec 17, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(__webpack_require__(/*! http */ "http"));
var https = __importStar(__webpack_require__(/*! https */ "https"));
var ws_1 = __importDefault(__webpack_require__(/*! ws */ "ws"));
var rpc_core_1 = __webpack_require__(/*! @hprose/rpc-core */ "./real-server/node_modules/@hprose/rpc-core/lib/index.js");
var io_1 = __webpack_require__(/*! @hprose/io */ "./real-server/node_modules/@hprose/io/lib/index.js");
var WebSocketTransport = /** @class */ (function () {
    function WebSocketTransport() {
        this.counter = 0;
        this.results = new Map();
        this.websockets = Object.create(null);
        this.httpAgent = new http.Agent({ keepAlive: true });
        this.httpsAgent = new https.Agent({ keepAlive: true });
        this.options = Object.create(null);
        this.compress = false;
    }
    WebSocketTransport.prototype.connect = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var websocket, ws, onerror;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.websockets[uri]];
                    case 1:
                        websocket = _a.sent();
                        if (websocket !== undefined
                            && websocket.readyState !== ws_1.default.CLOSING
                            && websocket.readyState !== ws_1.default.CLOSED) {
                            return [2 /*return*/, websocket];
                        }
                        ws = rpc_core_1.defer();
                        this.options.perMessageDeflate = false;
                        this.options.protocol = 'hprose';
                        if (this.options.agent === undefined) {
                            if (uri.toLowerCase().startsWith('https://')) {
                                this.options.agent = this.httpsAgent;
                            }
                            else {
                                this.options.agent = this.httpAgent;
                            }
                        }
                        websocket = new ws_1.default(uri, this.options);
                        websocket.binaryType = 'arraybuffer';
                        websocket.on('open', function () {
                            ws.resolve(websocket);
                        });
                        websocket.on('message', function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var instream, index, response, has_error, results, result;
                            return __generator(this, function (_a) {
                                instream = new io_1.ByteStream(data);
                                index = instream.readInt32BE();
                                response = instream.remains;
                                has_error = (index & 0x80000000) !== 0;
                                index &= 0x7FFFFFFF;
                                results = this.results.get(websocket);
                                if (results) {
                                    result = results[index];
                                    delete results[index];
                                    if (has_error) {
                                        if (result) {
                                            result.reject(new Error(io_1.fromUint8Array(response)));
                                        }
                                        websocket.close();
                                    }
                                    else if (result) {
                                        result.resolve(response);
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        onerror = function (error) { return __awaiter(_this, void 0, void 0, function () {
                            var results, index, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        results = this.results.get(websocket);
                                        if (results) {
                                            for (index in results) {
                                                result = results[index];
                                                result.reject(error);
                                                delete results[index];
                                            }
                                        }
                                        return [4 /*yield*/, this.websockets[uri]];
                                    case 1:
                                        if ((_a.sent()) === websocket) {
                                            delete this.websockets[uri];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        websocket.on('error', onerror);
                        websocket.on('close', function (code, reason) {
                            if (reason) {
                                onerror(new Error(code + ":" + reason));
                            }
                            else {
                                onerror(new Error("" + code));
                            }
                        });
                        this.websockets[uri] = ws.promise;
                        return [2 /*return*/, ws.promise];
                }
            });
        });
    };
    WebSocketTransport.prototype.transport = function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, index, result, websocket, results, timeoutId_1, header;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = context.uri;
                        index = (this.counter < 0x7FFFFFFF) ? ++this.counter : this.counter = 0;
                        result = rpc_core_1.defer();
                        return [4 /*yield*/, this.connect(uri)];
                    case 1:
                        websocket = _a.sent();
                        if (this.results.get(websocket) === undefined) {
                            this.results.set(websocket, Object.create(null));
                        }
                        results = this.results.get(websocket);
                        results[index] = result;
                        if (context.timeout > 0) {
                            timeoutId_1 = setTimeout(function () {
                                delete results[index];
                                result.reject(new rpc_core_1.TimeoutError());
                            }, context.timeout);
                            result.promise.then(function () {
                                clearTimeout(timeoutId_1);
                            }, function () {
                                clearTimeout(timeoutId_1);
                            });
                        }
                        header = new Uint8Array(4);
                        io_1.writeInt32BE(header, 0, index);
                        websocket.send(header, {
                            binary: true,
                            compress: this.compress,
                            fin: false,
                        }, function (error) {
                            if (error) {
                                result.reject(error);
                                delete results[index];
                            }
                        });
                        websocket.send(request, {
                            binary: true,
                            compress: this.compress
                        }, function (error) {
                            if (error) {
                                result.reject(error);
                                delete results[index];
                            }
                        });
                        return [2 /*return*/, result.promise];
                }
            });
        });
    };
    WebSocketTransport.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, uri, websocket;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.websockets)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        uri = _a[_i];
                        websocket = this.websockets[uri];
                        delete this.websockets[uri];
                        if (!websocket) return [3 /*break*/, 3];
                        return [4 /*yield*/, websocket];
                    case 2:
                        (_c.sent()).close(1000);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebSocketTransport.schemes = ['ws', 'wss'];
    return WebSocketTransport;
}());
exports.WebSocketTransport = WebSocketTransport;
rpc_core_1.Client.register('websocket', WebSocketTransport);
//# sourceMappingURL=WebSocketTransport.js.map

/***/ }),

/***/ "./real-server/node_modules/@hprose/rpc-node/lib/index.js":
/*!****************************************************************!*\
  !*** ./real-server/node_modules/@hprose/rpc-node/lib/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*--------------------------------------------------------*\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: https://hprose.com                     |
|                                                          |
| index.ts                                                 |
|                                                          |
| @hprose/rpc-node for TypeScript.                         |
|                                                          |
| LastModified: Feb 27, 2019                               |
| Author: Ma Bingyao <andot@hprose.com>                    |
|                                                          |
\*________________________________________________________*/
Object.defineProperty(exports, "__esModule", { value: true });
var HttpTransport_1 = __webpack_require__(/*! ./HttpTransport */ "./real-server/node_modules/@hprose/rpc-node/lib/HttpTransport.js");
exports.HttpTransport = HttpTransport_1.HttpTransport;
var WebSocketTransport_1 = __webpack_require__(/*! ./WebSocketTransport */ "./real-server/node_modules/@hprose/rpc-node/lib/WebSocketTransport.js");
exports.WebSocketTransport = WebSocketTransport_1.WebSocketTransport;
var SocketTransport_1 = __webpack_require__(/*! ./SocketTransport */ "./real-server/node_modules/@hprose/rpc-node/lib/SocketTransport.js");
exports.SocketTransport = SocketTransport_1.SocketTransport;
var UdpTransport_1 = __webpack_require__(/*! ./UdpTransport */ "./real-server/node_modules/@hprose/rpc-node/lib/UdpTransport.js");
exports.UdpTransport = UdpTransport_1.UdpTransport;
var HttpHandler_1 = __webpack_require__(/*! ./HttpHandler */ "./real-server/node_modules/@hprose/rpc-node/lib/HttpHandler.js");
exports.HttpHandler = HttpHandler_1.HttpHandler;
var WebSocketHandler_1 = __webpack_require__(/*! ./WebSocketHandler */ "./real-server/node_modules/@hprose/rpc-node/lib/WebSocketHandler.js");
exports.WebSocketHandler = WebSocketHandler_1.WebSocketHandler;
var SocketHandler_1 = __webpack_require__(/*! ./SocketHandler */ "./real-server/node_modules/@hprose/rpc-node/lib/SocketHandler.js");
exports.SocketHandler = SocketHandler_1.SocketHandler;
var UdpHandler_1 = __webpack_require__(/*! ./UdpHandler */ "./real-server/node_modules/@hprose/rpc-node/lib/UdpHandler.js");
exports.UdpHandler = UdpHandler_1.UdpHandler;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./real-server/node_modules/lodash/core.js":
/*!*************************************************!*\
  !*** ./real-server/node_modules/lodash/core.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash core -o ./dist/lodash.core.js`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.15';

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_PARTIAL_FLAG = 32;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      stringTag = '[object String]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"']/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports =  true && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /*--------------------------------------------------------------------------*/

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    array.push.apply(array, values);
    return array;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return baseMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to generate unique IDs. */
  var idCounter = 0;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Used to restore the original `_` reference in `_.noConflict`. */
  var oldDash = root._;

  /** Built-in value references. */
  var objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsFinite = root.isFinite,
      nativeKeys = overArg(Object.keys, Object),
      nativeMax = Math.max;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit method
   * chain sequences. Methods that operate on and return arrays, collections,
   * and functions can be chained together. Methods that retrieve a single value
   * or may return a primitive value will automatically end the chain sequence
   * and return the unwrapped value. Otherwise, the value must be unwrapped
   * with `_#value`.
   *
   * Explicit chain sequences, which must be unwrapped with `_#value`, may be
   * enabled using `_.chain`.
   *
   * The execution of chained methods is lazy, that is, it's deferred until
   * `_#value` is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion.
   * Shortcut fusion is an optimization to merge iteratee calls; this avoids
   * the creation of intermediate arrays and can greatly reduce the number of
   * iteratee executions. Sections of a chain sequence qualify for shortcut
   * fusion if the section is applied to an array and iteratees accept only
   * one argument. The heuristic for whether a section qualifies for shortcut
   * fusion is subject to change.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
   * `zipObject`, `zipObjectDeep`, and `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
   * `upperFirst`, `value`, and `words`
   *
   * @name _
   * @constructor
   * @category Seq
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // Returns an unwrapped value.
   * wrapped.reduce(_.add);
   * // => 6
   *
   * // Returns a wrapped value.
   * var squares = wrapped.map(square);
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash(value) {
    return value instanceof LodashWrapper
      ? value
      : new LodashWrapper(value);
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * The base constructor for creating `lodash` wrapper objects.
   *
   * @private
   * @param {*} value The value to wrap.
   * @param {boolean} [chainAll] Enable explicit method chain sequences.
   */
  function LodashWrapper(value, chainAll) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__chain__ = !!chainAll;
  }

  LodashWrapper.prototype = baseCreate(lodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;

  /*------------------------------------------------------------------------*/

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    object[key] = value;
  }

  /**
   * The base implementation of `_.delay` and `_.defer` which accepts `args`
   * to provide to `func`.
   *
   * @private
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {Array} args The arguments to provide to `func`.
   * @returns {number|Object} Returns the timer id or timeout object.
   */
  function baseDelay(func, wait, args) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return setTimeout(function() { func.apply(undefined, args); }, wait);
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * The base implementation of `_.every` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`
   */
  function baseEvery(collection, predicate) {
    var result = true;
    baseEach(collection, function(value, index, collection) {
      result = !!predicate(value, index, collection);
      return result;
    });
    return result;
  }

  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? (current === current && !false)
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.filter` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection) {
      if (predicate(value, index, collection)) {
        result.push(value);
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.functions` which creates an array of
   * `object` function property names filtered from `props`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The property names to filter.
   * @returns {Array} Returns the function names.
   */
  function baseFunctions(object, props) {
    return baseFilter(props, function(key) {
      return isFunction(object[key]);
    });
  }

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    return objectToString(value);
  }

  /**
   * The base implementation of `_.gt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is greater than `other`,
   *  else `false`.
   */
  function baseGt(value, other) {
    return value > other;
  }

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  var baseIsArguments = noop;

  /**
   * The base implementation of `_.isDate` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
   */
  function baseIsDate(value) {
    return isObjectLike(value) && baseGetTag(value) == dateTag;
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag : baseGetTag(object),
        othTag = othIsArr ? arrayTag : baseGetTag(other);

    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;

    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

    stack || (stack = []);
    var objStack = find(stack, function(entry) {
      return entry[0] == object;
    });
    var othStack = find(stack, function(entry) {
      return entry[0] == other;
    });
    if (objStack && othStack) {
      return objStack[1] == other;
    }
    stack.push([object, other]);
    stack.push([other, object]);
    if (isSameTag && !objIsObj) {
      var result = (objIsArr)
        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      stack.pop();
      return result;
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        var result = equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        stack.pop();
        return result;
      }
    }
    if (!isSameTag) {
      return false;
    }
    var result = equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    stack.pop();
    return result;
  }

  /**
   * The base implementation of `_.isRegExp` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */
  function baseIsRegExp(value) {
    return isObjectLike(value) && baseGetTag(value) == regexpTag;
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(func) {
    if (typeof func == 'function') {
      return func;
    }
    if (func == null) {
      return identity;
    }
    return (typeof func == 'object' ? baseMatches : baseProperty)(func);
  }

  /**
   * The base implementation of `_.lt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   */
  function baseLt(value, other) {
    return value < other;
  }

  /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var props = nativeKeys(source);
    return function(object) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length];
        if (!(key in object &&
              baseIsEqual(source[key], object[key], COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG)
            )) {
          return false;
        }
      }
      return true;
    };
  }

  /**
   * The base implementation of `_.pick` without support for individual
   * property identifiers.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @returns {Object} Returns the new object.
   */
  function basePick(object, props) {
    object = Object(object);
    return reduce(props, function(result, key) {
      if (key in object) {
        result[key] = object[key];
      }
      return result;
    }, {});
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source) {
    return baseSlice(source, 0, source.length);
  }

  /**
   * The base implementation of `_.some` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function baseSome(collection, predicate) {
    var result;

    baseEach(collection, function(value, index, collection) {
      result = predicate(value, index, collection);
      return !result;
    });
    return !!result;
  }

  /**
   * The base implementation of `wrapperValue` which returns the result of
   * performing a sequence of actions on the unwrapped `value`, where each
   * successive action is supplied the return value of the previous.
   *
   * @private
   * @param {*} value The unwrapped value.
   * @param {Array} actions Actions to perform to resolve the unwrapped value.
   * @returns {*} Returns the resolved value.
   */
  function baseWrapperValue(value, actions) {
    var result = value;
    return reduce(actions, function(result, action) {
      return action.func.apply(action.thisArg, arrayPush([result], action.args));
    }, result);
  }

  /**
   * Compares values to sort them in ascending order.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsDefined = value !== undefined,
          valIsNull = value === null,
          valIsReflexive = value === value,
          valIsSymbol = false;

      var othIsDefined = other !== undefined,
          othIsNull = other === null,
          othIsReflexive = other === other,
          othIsSymbol = false;

      if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
          (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
          (valIsNull && othIsDefined && othIsReflexive) ||
          (!valIsDefined && othIsReflexive) ||
          !valIsReflexive) {
        return 1;
      }
      if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
          (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
          (othIsNull && valIsDefined && valIsReflexive) ||
          (!othIsDefined && valIsReflexive) ||
          !othIsReflexive) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * Creates a function that produces an instance of `Ctor` regardless of
   * whether it was invoked as part of a `new` expression or by `call` or `apply`.
   *
   * @private
   * @param {Function} Ctor The constructor to wrap.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCtor(Ctor) {
    return function() {
      // Use a `switch` statement to work with class constructors. See
      // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
      // for more details.
      var args = arguments;
      var thisBinding = baseCreate(Ctor.prototype),
          result = Ctor.apply(thisBinding, args);

      // Mimic the constructor's `return` behavior.
      // See https://es5.github.io/#x13.2.2 for more details.
      return isObject(result) ? result : thisBinding;
    };
  }

  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike(collection)) {
        var iteratee = baseIteratee(predicate, 3);
        collection = keys(collection);
        predicate = function(key) { return iteratee(iterable[key], key, iterable); };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }

  /**
   * Creates a function that wraps `func` to invoke it with the `this` binding
   * of `thisArg` and `partials` prepended to the arguments it receives.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to
   *  the new function.
   * @returns {Function} Returns the new wrapped function.
   */
  function createPartial(func, bitmask, thisArg, partials) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var isBind = bitmask & WRAP_BIND_FLAG,
        Ctor = createCtor(func);

    function wrapper() {
      var argsIndex = -1,
          argsLength = arguments.length,
          leftIndex = -1,
          leftLength = partials.length,
          args = Array(leftLength + argsLength),
          fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return fn.apply(isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? [] : undefined;

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      var compared;
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!baseSome(other, function(othValue, othIndex) {
              if (!indexOf(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )) {
        result = false;
        break;
      }
    }
    return result;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {

      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var result = true;

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      var compared;
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    return result;
  }

  /**
   * A specialized version of `baseRest` which flattens the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @returns {Function} Returns the new function.
   */
  function flatRest(func) {
    return setToString(overRest(func, undefined, flatten), func + '');
  }

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray(value) || isArguments(value);
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return func.apply(this, otherArgs);
    };
  }

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = identity;

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array with all falsey values removed. The values `false`, `null`,
   * `0`, `""`, `undefined`, and `NaN` are falsey.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to compact.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    return baseFilter(array, Boolean);
  }

  /**
   * Creates a new array concatenating `array` with any additional arrays
   * and/or values.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to concatenate.
   * @param {...*} [values] The values to concatenate.
   * @returns {Array} Returns the new concatenated array.
   * @example
   *
   * var array = [1];
   * var other = _.concat(array, 2, [3], [[4]]);
   *
   * console.log(other);
   * // => [1, 2, 3, [4]]
   *
   * console.log(array);
   * // => [1]
   */
  function concat() {
    var length = arguments.length;
    if (!length) {
      return [];
    }
    var args = Array(length - 1),
        array = arguments[0],
        index = length;

    while (index--) {
      args[index - 1] = arguments[index];
    }
    return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
  }

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return baseFindIndex(array, baseIteratee(predicate, 3), index);
  }

  /**
   * Flattens `array` a single level deep.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, [3, [4]], 5]]);
   * // => [1, 2, [3, [4]], 5]
   */
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }

  /**
   * Recursively flattens `array`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, [3, [4]], 5]]);
   * // => [1, 2, 3, 4, 5]
   */
  function flattenDeep(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, INFINITY) : [];
  }

  /**
   * Gets the first element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias first
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the first element of `array`.
   * @example
   *
   * _.head([1, 2, 3]);
   * // => 1
   *
   * _.head([]);
   * // => undefined
   */
  function head(array) {
    return (array && array.length) ? array[0] : undefined;
  }

  /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the
   * offset from the end of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // Search from the `fromIndex`.
   * _.indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   */
  function indexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (typeof fromIndex == 'number') {
      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
    } else {
      fromIndex = 0;
    }
    var index = (fromIndex || 0) - 1,
        isReflexive = value === value;

    while (++index < length) {
      var other = array[index];
      if ((isReflexive ? other === value : other !== other)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
  }

  /**
   * Creates a slice of `array` from `start` up to, but not including, `end`.
   *
   * **Note:** This method is used instead of
   * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
   * returned.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function slice(array, start, end) {
    var length = array == null ? 0 : array.length;
    start = start == null ? 0 : +start;
    end = end === undefined ? length : +end;
    return length ? baseSlice(array, start, end) : [];
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` wrapper instance that wraps `value` with explicit method
   * chain sequences enabled. The result of such sequences must be unwrapped
   * with `_#value`.
   *
   * @static
   * @memberOf _
   * @since 1.3.0
   * @category Seq
   * @param {*} value The value to wrap.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36 },
   *   { 'user': 'fred',    'age': 40 },
   *   { 'user': 'pebbles', 'age': 1 }
   * ];
   *
   * var youngest = _
   *   .chain(users)
   *   .sortBy('age')
   *   .map(function(o) {
   *     return o.user + ' is ' + o.age;
   *   })
   *   .head()
   *   .value();
   * // => 'pebbles is 1'
   */
  function chain(value) {
    var result = lodash(value);
    result.__chain__ = true;
    return result;
  }

  /**
   * This method invokes `interceptor` and returns `value`. The interceptor
   * is invoked with one argument; (value). The purpose of this method is to
   * "tap into" a method chain sequence in order to modify intermediate results.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Seq
   * @param {*} value The value to provide to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {*} Returns `value`.
   * @example
   *
   * _([1, 2, 3])
   *  .tap(function(array) {
   *    // Mutate input array.
   *    array.pop();
   *  })
   *  .reverse()
   *  .value();
   * // => [2, 1]
   */
  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }

  /**
   * This method is like `_.tap` except that it returns the result of `interceptor`.
   * The purpose of this method is to "pass thru" values replacing intermediate
   * results in a method chain sequence.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Seq
   * @param {*} value The value to provide to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {*} Returns the result of `interceptor`.
   * @example
   *
   * _('  abc  ')
   *  .chain()
   *  .trim()
   *  .thru(function(value) {
   *    return [value];
   *  })
   *  .value();
   * // => ['abc']
   */
  function thru(value, interceptor) {
    return interceptor(value);
  }

  /**
   * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
   *
   * @name chain
   * @memberOf _
   * @since 0.1.0
   * @category Seq
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // A sequence without explicit chaining.
   * _(users).head();
   * // => { 'user': 'barney', 'age': 36 }
   *
   * // A sequence with explicit chaining.
   * _(users)
   *   .chain()
   *   .head()
   *   .pick('user')
   *   .value();
   * // => { 'user': 'barney' }
   */
  function wrapperChain() {
    return chain(this);
  }

  /**
   * Executes the chain sequence to resolve the unwrapped value.
   *
   * @name value
   * @memberOf _
   * @since 0.1.0
   * @alias toJSON, valueOf
   * @category Seq
   * @returns {*} Returns the resolved unwrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperValue() {
    return baseWrapperValue(this.__wrapped__, this.__actions__);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `predicate` returns truthy for **all** elements of `collection`.
   * Iteration is stopped once `predicate` returns falsey. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * **Note:** This method returns `true` for
   * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
   * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
   * elements of empty collections.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.every(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.every(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.every(users, 'active');
   * // => false
   */
  function every(collection, predicate, guard) {
    predicate = guard ? undefined : predicate;
    return baseEvery(collection, baseIteratee(predicate));
  }

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * **Note:** Unlike `_.remove`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   * @see _.reject
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, function(o) { return !o.active; });
   * // => objects for ['fred']
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, { 'age': 36, 'active': true });
   * // => objects for ['barney']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, ['active', false]);
   * // => objects for ['fred']
   *
   * // The `_.property` iteratee shorthand.
   * _.filter(users, 'active');
   * // => objects for ['barney']
   */
  function filter(collection, predicate) {
    return baseFilter(collection, baseIteratee(predicate));
  }

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */
  var find = createFind(findIndex);

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */
  function forEach(collection, iteratee) {
    return baseEach(collection, baseIteratee(iteratee));
  }

  /**
   * Creates an array of values by running each element in `collection` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * _.map([4, 8], square);
   * // => [16, 64]
   *
   * _.map({ 'a': 4, 'b': 8 }, square);
   * // => [16, 64] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee) {
    return baseMap(collection, baseIteratee(iteratee));
  }

  /**
   * Reduces `collection` to a value which is the accumulated result of running
   * each element in `collection` thru `iteratee`, where each successive
   * invocation is supplied the return value of the previous. If `accumulator`
   * is not given, the first element of `collection` is used as the initial
   * value. The iteratee is invoked with four arguments:
   * (accumulator, value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.reduce`, `_.reduceRight`, and `_.transform`.
   *
   * The guarded methods are:
   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
   * and `sortBy`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @returns {*} Returns the accumulated value.
   * @see _.reduceRight
   * @example
   *
   * _.reduce([1, 2], function(sum, n) {
   *   return sum + n;
   * }, 0);
   * // => 3
   *
   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   *   return result;
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
   */
  function reduce(collection, iteratee, accumulator) {
    return baseReduce(collection, baseIteratee(iteratee), accumulator, arguments.length < 3, baseEach);
  }

  /**
   * Gets the size of `collection` by returning its length for array-like
   * values or the number of own enumerable string keyed properties for objects.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @returns {number} Returns the collection size.
   * @example
   *
   * _.size([1, 2, 3]);
   * // => 3
   *
   * _.size({ 'a': 1, 'b': 2 });
   * // => 2
   *
   * _.size('pebbles');
   * // => 7
   */
  function size(collection) {
    if (collection == null) {
      return 0;
    }
    collection = isArrayLike(collection) ? collection : nativeKeys(collection);
    return collection.length;
  }

  /**
   * Checks if `predicate` returns truthy for **any** element of `collection`.
   * Iteration is stopped once `predicate` returns truthy. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var users = [
   *   { 'user': 'barney', 'active': true },
   *   { 'user': 'fred',   'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.some(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.some(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.some(users, 'active');
   * // => true
   */
  function some(collection, predicate, guard) {
    predicate = guard ? undefined : predicate;
    return baseSome(collection, baseIteratee(predicate));
  }

  /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in a collection thru each iteratee. This method
   * performs a stable sort, that is, it preserves the original sort order of
   * equal elements. The iteratees are invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {...(Function|Function[])} [iteratees=[_.identity]]
   *  The iteratees to sort by.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 },
   *   { 'user': 'barney', 'age': 34 }
   * ];
   *
   * _.sortBy(users, [function(o) { return o.user; }]);
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
   *
   * _.sortBy(users, ['user', 'age']);
   * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
   */
  function sortBy(collection, iteratee) {
    var index = 0;
    iteratee = baseIteratee(iteratee);

    return baseMap(baseMap(collection, function(value, key, collection) {
      return { 'value': value, 'index': index++, 'criteria': iteratee(value, key, collection) };
    }).sort(function(object, other) {
      return compareAscending(object.criteria, other.criteria) || (object.index - other.index);
    }), baseProperty('value'));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery(element).on('click', _.before(5, addContactToList));
   * // => Allows adding up to 4 contacts to the list.
   */
  function before(n, func) {
    var result;
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function() {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }
      if (n <= 1) {
        func = undefined;
      }
      return result;
    };
  }

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and `partials` prepended to the arguments it receives.
   *
   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
   * may be used as a placeholder for partially applied arguments.
   *
   * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
   * property of bound functions.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * function greet(greeting, punctuation) {
   *   return greeting + ' ' + this.user + punctuation;
   * }
   *
   * var object = { 'user': 'fred' };
   *
   * var bound = _.bind(greet, object, 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * // Bound with placeholders.
   * var bound = _.bind(greet, object, _, '!');
   * bound('hi');
   * // => 'hi fred!'
   */
  var bind = baseRest(function(func, thisArg, partials) {
    return createPartial(func, WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG, thisArg, partials);
  });

  /**
   * Defers invoking the `func` until the current call stack has cleared. Any
   * additional arguments are provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to defer.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.defer(function(text) {
   *   console.log(text);
   * }, 'deferred');
   * // => Logs 'deferred' after one millisecond.
   */
  var defer = baseRest(function(func, args) {
    return baseDelay(func, 1, args);
  });

  /**
   * Invokes `func` after `wait` milliseconds. Any additional arguments are
   * provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.delay(function(text) {
   *   console.log(text);
   * }, 1000, 'later');
   * // => Logs 'later' after one second.
   */
  var delay = baseRest(function(func, wait, args) {
    return baseDelay(func, toNumber(wait) || 0, args);
  });

  /**
   * Creates a function that negates the result of the predicate `func`. The
   * `func` predicate is invoked with the `this` binding and arguments of the
   * created function.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {Function} predicate The predicate to negate.
   * @returns {Function} Returns the new negated function.
   * @example
   *
   * function isEven(n) {
   *   return n % 2 == 0;
   * }
   *
   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
   * // => [1, 3, 5]
   */
  function negate(predicate) {
    if (typeof predicate != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function() {
      var args = arguments;
      return !predicate.apply(this, args);
    };
  }

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first invocation. The `func` is
   * invoked with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // => `createApplication` is invoked once
   */
  function once(func) {
    return before(2, func);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a shallow clone of `value`.
   *
   * **Note:** This method is loosely based on the
   * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
   * and supports cloning arrays, array buffers, booleans, date objects, maps,
   * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
   * arrays. The own enumerable properties of `arguments` objects are cloned
   * as plain objects. An empty object is returned for uncloneable values such
   * as error objects, functions, DOM nodes, and WeakMaps.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to clone.
   * @returns {*} Returns the cloned value.
   * @see _.cloneDeep
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var shallow = _.clone(objects);
   * console.log(shallow[0] === objects[0]);
   * // => true
   */
  function clone(value) {
    if (!isObject(value)) {
      return value;
    }
    return isArray(value) ? copyArray(value) : copyObject(value, nativeKeys(value));
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if `value` is classified as a boolean primitive or object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
   * @example
   *
   * _.isBoolean(false);
   * // => true
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false ||
      (isObjectLike(value) && baseGetTag(value) == boolTag);
  }

  /**
   * Checks if `value` is classified as a `Date` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   *
   * _.isDate('Mon April 23 2012');
   * // => false
   */
  var isDate = baseIsDate;

  /**
   * Checks if `value` is an empty object, collection, map, or set.
   *
   * Objects are considered empty if they have no own enumerable string keyed
   * properties.
   *
   * Array-like values such as `arguments` objects, arrays, buffers, strings, or
   * jQuery-like collections are considered empty if they have a `length` of `0`.
   * Similarly, maps and sets are considered empty if they have a `size` of `0`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */
  function isEmpty(value) {
    if (isArrayLike(value) &&
        (isArray(value) || isString(value) ||
          isFunction(value.splice) || isArguments(value))) {
      return !value.length;
    }
    return !nativeKeys(value).length;
  }

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are compared by strict equality, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }

  /**
   * Checks if `value` is a finite primitive number.
   *
   * **Note:** This method is based on
   * [`Number.isFinite`](https://mdn.io/Number/isFinite).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
   * @example
   *
   * _.isFinite(3);
   * // => true
   *
   * _.isFinite(Number.MIN_VALUE);
   * // => true
   *
   * _.isFinite(Infinity);
   * // => false
   *
   * _.isFinite('3');
   * // => false
   */
  function isFinite(value) {
    return typeof value == 'number' && nativeIsFinite(value);
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is `NaN`.
   *
   * **Note:** This method is based on
   * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
   * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
   * `undefined` and other non-number values.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // An `NaN` primitive is the only value that is not equal to itself.
    // Perform the `toStringTag` check first to avoid errors with some
    // ActiveX objects in IE.
    return isNumber(value) && value != +value;
  }

  /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(void 0);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
   * classified as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(3);
   * // => true
   *
   * _.isNumber(Number.MIN_VALUE);
   * // => true
   *
   * _.isNumber(Infinity);
   * // => true
   *
   * _.isNumber('3');
   * // => false
   */
  function isNumber(value) {
    return typeof value == 'number' ||
      (isObjectLike(value) && baseGetTag(value) == numberTag);
  }

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  var isRegExp = baseIsRegExp;

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */
  function isUndefined(value) {
    return value === undefined;
  }

  /**
   * Converts `value` to an array.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * _.toArray({ 'a': 1, 'b': 2 });
   * // => [1, 2]
   *
   * _.toArray('abc');
   * // => ['a', 'b', 'c']
   *
   * _.toArray(1);
   * // => []
   *
   * _.toArray(null);
   * // => []
   */
  function toArray(value) {
    if (!isArrayLike(value)) {
      return values(value);
    }
    return value.length ? copyArray(value) : [];
  }

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  var toInteger = Number;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  var toNumber = Number;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : (value + '');
  }

  /*------------------------------------------------------------------------*/

  /**
   * Assigns own enumerable string keyed properties of source objects to the
   * destination object. Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assignIn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assign({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3 }
   */
  var assign = createAssigner(function(object, source) {
    copyObject(source, nativeKeys(source), object);
  });

  /**
   * This method is like `_.assign` except that it iterates over own and
   * inherited source properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @alias extend
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assign
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assignIn({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
   */
  var assignIn = createAssigner(function(object, source) {
    copyObject(source, nativeKeysIn(source), object);
  });

  /**
   * Creates an object that inherits from the `prototype` object. If a
   * `properties` object is given, its own enumerable string keyed properties
   * are assigned to the created object.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Object
   * @param {Object} prototype The object to inherit from.
   * @param {Object} [properties] The properties to assign to the object.
   * @returns {Object} Returns the new object.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * function Circle() {
   *   Shape.call(this);
   * }
   *
   * Circle.prototype = _.create(Shape.prototype, {
   *   'constructor': Circle
   * });
   *
   * var circle = new Circle;
   * circle instanceof Circle;
   * // => true
   *
   * circle instanceof Shape;
   * // => true
   */
  function create(prototype, properties) {
    var result = baseCreate(prototype);
    return properties == null ? result : assign(result, properties);
  }

  /**
   * Assigns own and inherited enumerable string keyed properties of source
   * objects to the destination object for all destination properties that
   * resolve to `undefined`. Source objects are applied from left to right.
   * Once a property is set, additional values of the same property are ignored.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.defaultsDeep
   * @example
   *
   * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
   * // => { 'a': 1, 'b': 2 }
   */
  var defaults = baseRest(function(object, sources) {
    object = Object(object);

    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      length = 1;
    }

    while (++index < length) {
      var source = sources[index];
      var props = keysIn(source);
      var propsIndex = -1;
      var propsLength = props.length;

      while (++propsIndex < propsLength) {
        var key = props[propsIndex];
        var value = object[key];

        if (value === undefined ||
            (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
          object[key] = source[key];
        }
      }
    }

    return object;
  });

  /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': 2 } };
   * var other = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b');
   * // => true
   *
   * _.has(object, ['a', 'b']);
   * // => true
   *
   * _.has(other, 'a');
   * // => false
   */
  function has(object, path) {
    return object != null && hasOwnProperty.call(object, path);
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = nativeKeys;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  var keysIn = nativeKeysIn;

  /**
   * Creates an object composed of the picked `object` properties.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [paths] The property paths to pick.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pick(object, ['a', 'c']);
   * // => { 'a': 1, 'c': 3 }
   */
  var pick = flatRest(function(object, paths) {
    return object == null ? {} : basePick(object, paths);
  });

  /**
   * This method is like `_.get` except that if the resolved value is a
   * function it's invoked with the `this` binding of its parent object and
   * its result is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to resolve.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
   *
   * _.result(object, 'a[0].b.c1');
   * // => 3
   *
   * _.result(object, 'a[0].b.c2');
   * // => 4
   *
   * _.result(object, 'a[0].b.c3', 'default');
   * // => 'default'
   *
   * _.result(object, 'a[0].b.c3', _.constant('default'));
   * // => 'default'
   */
  function result(object, path, defaultValue) {
    var value = object == null ? undefined : object[path];
    if (value === undefined) {
      value = defaultValue;
    }
    return isFunction(value) ? value.call(object) : value;
  }

  /**
   * Creates an array of the own enumerable string keyed property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */
  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
   * corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function that invokes `func` with the arguments of the created
   * function. If `func` is a property name, the created function returns the
   * property value for a given element. If `func` is an array or object, the
   * created function returns `true` for elements that contain the equivalent
   * source properties, otherwise it returns `false`.
   *
   * @static
   * @since 4.0.0
   * @memberOf _
   * @category Util
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
   * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, _.iteratee(['user', 'fred']));
   * // => [{ 'user': 'fred', 'age': 40 }]
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, _.iteratee('user'));
   * // => ['barney', 'fred']
   *
   * // Create custom iteratee shorthands.
   * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
   *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
   *     return func.test(string);
   *   };
   * });
   *
   * _.filter(['abc', 'def'], /ef/);
   * // => ['def']
   */
  var iteratee = baseIteratee;

  /**
   * Creates a function that performs a partial deep comparison between a given
   * object and `source`, returning `true` if the given object has equivalent
   * property values, else `false`.
   *
   * **Note:** The created function is equivalent to `_.isMatch` with `source`
   * partially applied.
   *
   * Partial comparisons will match empty array and empty object `source`
   * values against any array or object value, respectively. See `_.isEqual`
   * for a list of supported value comparisons.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Util
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   * @example
   *
   * var objects = [
   *   { 'a': 1, 'b': 2, 'c': 3 },
   *   { 'a': 4, 'b': 5, 'c': 6 }
   * ];
   *
   * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
   * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
   */
  function matches(source) {
    return baseMatches(assign({}, source));
  }

  /**
   * Adds all own enumerable string keyed function properties of a source
   * object to the destination object. If `object` is a function, then methods
   * are added to its prototype as well.
   *
   * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
   * avoid conflicts caused by modifying the original.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {Function|Object} [object=lodash] The destination object.
   * @param {Object} source The object of functions to add.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
   * @returns {Function|Object} Returns `object`.
   * @example
   *
   * function vowels(string) {
   *   return _.filter(string, function(v) {
   *     return /[aeiou]/i.test(v);
   *   });
   * }
   *
   * _.mixin({ 'vowels': vowels });
   * _.vowels('fred');
   * // => ['e']
   *
   * _('fred').vowels().value();
   * // => ['e']
   *
   * _.mixin({ 'vowels': vowels }, { 'chain': false });
   * _('fred').vowels();
   * // => ['e']
   */
  function mixin(object, source, options) {
    var props = keys(source),
        methodNames = baseFunctions(source, props);

    if (options == null &&
        !(isObject(source) && (methodNames.length || !props.length))) {
      options = source;
      source = object;
      object = this;
      methodNames = baseFunctions(source, keys(source));
    }
    var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
        isFunc = isFunction(object);

    baseEach(methodNames, function(methodName) {
      var func = source[methodName];
      object[methodName] = func;
      if (isFunc) {
        object.prototype[methodName] = function() {
          var chainAll = this.__chain__;
          if (chain || chainAll) {
            var result = object(this.__wrapped__),
                actions = result.__actions__ = copyArray(this.__actions__);

            actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
            result.__chain__ = chainAll;
            return result;
          }
          return func.apply(object, arrayPush([this.value()], arguments));
        };
      }
    });

    return object;
  }

  /**
   * Reverts the `_` variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */
  function noConflict() {
    if (root._ === this) {
      root._ = oldDash;
    }
    return this;
  }

  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */
  function noop() {
    // No operation performed.
  }

  /**
   * Generates a unique ID. If `prefix` is given, the ID is appended to it.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {string} [prefix=''] The value to prefix the ID with.
   * @returns {string} Returns the unique ID.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   *
   * _.uniqueId();
   * // => '105'
   */
  function uniqueId(prefix) {
    var id = ++idCounter;
    return toString(prefix) + id;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Computes the maximum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * _.max([]);
   * // => undefined
   */
  function max(array) {
    return (array && array.length)
      ? baseExtremum(array, identity, baseGt)
      : undefined;
  }

  /**
   * Computes the minimum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => undefined
   */
  function min(array) {
    return (array && array.length)
      ? baseExtremum(array, identity, baseLt)
      : undefined;
  }

  /*------------------------------------------------------------------------*/

  // Add methods that return wrapped values in chain sequences.
  lodash.assignIn = assignIn;
  lodash.before = before;
  lodash.bind = bind;
  lodash.chain = chain;
  lodash.compact = compact;
  lodash.concat = concat;
  lodash.create = create;
  lodash.defaults = defaults;
  lodash.defer = defer;
  lodash.delay = delay;
  lodash.filter = filter;
  lodash.flatten = flatten;
  lodash.flattenDeep = flattenDeep;
  lodash.iteratee = iteratee;
  lodash.keys = keys;
  lodash.map = map;
  lodash.matches = matches;
  lodash.mixin = mixin;
  lodash.negate = negate;
  lodash.once = once;
  lodash.pick = pick;
  lodash.slice = slice;
  lodash.sortBy = sortBy;
  lodash.tap = tap;
  lodash.thru = thru;
  lodash.toArray = toArray;
  lodash.values = values;

  // Add aliases.
  lodash.extend = assignIn;

  // Add methods to `lodash.prototype`.
  mixin(lodash, lodash);

  /*------------------------------------------------------------------------*/

  // Add methods that return unwrapped values in chain sequences.
  lodash.clone = clone;
  lodash.escape = escape;
  lodash.every = every;
  lodash.find = find;
  lodash.forEach = forEach;
  lodash.has = has;
  lodash.head = head;
  lodash.identity = identity;
  lodash.indexOf = indexOf;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isBoolean = isBoolean;
  lodash.isDate = isDate;
  lodash.isEmpty = isEmpty;
  lodash.isEqual = isEqual;
  lodash.isFinite = isFinite;
  lodash.isFunction = isFunction;
  lodash.isNaN = isNaN;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isUndefined = isUndefined;
  lodash.last = last;
  lodash.max = max;
  lodash.min = min;
  lodash.noConflict = noConflict;
  lodash.noop = noop;
  lodash.reduce = reduce;
  lodash.result = result;
  lodash.size = size;
  lodash.some = some;
  lodash.uniqueId = uniqueId;

  // Add aliases.
  lodash.each = forEach;
  lodash.first = head;

  mixin(lodash, (function() {
    var source = {};
    baseForOwn(lodash, function(func, methodName) {
      if (!hasOwnProperty.call(lodash.prototype, methodName)) {
        source[methodName] = func;
      }
    });
    return source;
  }()), { 'chain': false });

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type {string}
   */
  lodash.VERSION = VERSION;

  // Add `Array` methods to `lodash.prototype`.
  baseEach(['pop', 'join', 'replace', 'reverse', 'split', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
    var func = (/^(?:replace|split)$/.test(methodName) ? String.prototype : arrayProto)[methodName],
        chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
        retUnwrapped = /^(?:pop|join|replace|shift)$/.test(methodName);

    lodash.prototype[methodName] = function() {
      var args = arguments;
      if (retUnwrapped && !this.__chain__) {
        var value = this.value();
        return func.apply(isArray(value) ? value : [], args);
      }
      return this[chainName](function(value) {
        return func.apply(isArray(value) ? value : [], args);
      });
    };
  });

  // Add chain sequence methods to the `lodash` wrapper.
  lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return lodash;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else {}
}.call(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "dgram":
/*!************************!*\
  !*** external "dgram" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dgram");

/***/ }),

/***/ "fcnode":
/*!*************************!*\
  !*** external "fcnode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fcnode");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "guid-typescript":
/*!**********************************!*\
  !*** external "guid-typescript" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("guid-typescript");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ })

/******/ })));