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
/******/ 	return __webpack_require__(__webpack_require__.s = "./postgre-sql/bin/www.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./postgre-sql/bin/www.js":
/*!********************************!*\
  !*** ./postgre-sql/bin/www.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var {exec,execFile} = __webpack_require__(/*! child_process */ "child_process");
var path = __webpack_require__(/*! path */ "path");
var __debug = false;
let os = __webpack_require__(/*! path */ "path");
const workerLogs = __webpack_require__(/*! ../../utils/server-log */ "./utils/server-log/index.js");
workerLogs.attach();
if(process.argv[2]){
    __debug = process.argv[2] == "debug" ? true : false;  
}

var start = async function(){
    var cmdPath;
    switch(process.platform){
        case "win32":
        case "darwin":
            if(process.arch == "ia32"){
                await stopPostgrest();
                cmdPath = __debug ? path.join(__dirname,"/../x64/") : __dirname;
            }else{
                await stopPostgrest();
                cmdPath = __debug ? path.join(__dirname,"/../x64/") : __dirname;
            }
            break;
        case "linux":
        case "aix":
        case "freebsd":
        case "openbsd":
        case "sunos":
            throw new Error(`暂不支持:${process.platform}`);
            break;
    }
    const build = exec("postgrest defaultServer.conf",{cwd : cmdPath},function(err,stdout,stderr){
        console.dlog("工程服务器重启:",{type : "start"});
        if(err){
            console.dlog(err,{type : "error"});
        }
        if(stderr){
            console.dlog(stderr,{type : "error"});
        }
        delayedStart();
    })

    build.stdout.on('data',(data)=>{
        console.dlog(data,{type : "log"})
    })
}

// 不论 postgrest.exe 是否正在运行。都执行一次停止
var stopPostgrest= async function(){
    return new Promise((resolve, reject)=>{
        let cmd = "";
        switch(process.platform){
            case "win32":
            case "darwin":
                cmd = "taskkill /f /im postgrest.exe";
                break;
            case "linux":
                cmd = "killall postgrest";
            case "aix":
            case "freebsd":
            case "openbsd":
            case "sunos":
                throw new Error(`暂不支持:${process.platform}`);
                break;
        }
        exec(cmd, function(err,stdout,stderr){
            resolve();
        })
    });
   
}

var delayedStart = function(){
    setTimeout(()=>{
        start();
    },2000)
}

start();

/***/ }),

/***/ "./utils/server-log/index.js":
/*!***********************************!*\
  !*** ./utils/server-log/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const write = __webpack_require__(/*! ./lib/write */ "./utils/server-log/lib/write.js");
const read = __webpack_require__(/*! ./lib/read */ "./utils/server-log/lib/read.js");
class serverLog {
    constructor(){
        this.write = write;
        this.read = read;
    }
    config(postion){
        write.config(postion);
        read.config(postion);
    }
    logAndWrite(text,postion){
        write.writeToFile(text,postion);
        console.log("\r\n" + text);
    }
    attach(){
        console.dlog = this.logAndWrite.bind(this);
    }
}
module.exports = new serverLog();


/***/ }),

/***/ "./utils/server-log/lib/read.js":
/*!**************************************!*\
  !*** ./utils/server-log/lib/read.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const low = __webpack_require__(/*! lowdb */ "lowdb");
const FileSync = __webpack_require__(/*! lowdb/adapters/FileSync */ "./utils/server-log/node_modules/lowdb/adapters/FileSync.js");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const EventEmitter = __webpack_require__(/*! events */ "events");
const writeEmitter = new EventEmitter();
class read {
    constructor(){
        this.rootPath = process.cwd();
        this.mainName = "未命名";
        this.db = this._createDB(new Date());
        this.oldSize = 0;
    }
    _createDB(time){
        var year = time.getFullYear().toString();
        var month = (parseInt(time.getMonth()) + 1).toString();
        var filePath = path.join(this.rootPath,"logs",this.mainName,year,month);
        if (fs.existsSync(filePath)) {
            var fileName = path.join(filePath,time.getDate() + ".json");
            const adapter = new FileSync(fileName);
            var tdb = low(adapter);
            if(tdb.get("logs").value()){
                this.oldSize = tdb.get("logs").value().length;
            }else{
                this.oldSize = 0;
            }
            return tdb;
        }
        return null;
    }
    config(postion){
        this.rootPath = postion.rootPath ? postion.rootPath : process.cwd();
        this.mainName = postion.name ? postion.name : "未命名";
        var time = postion.startTime ? new Date(postion.startTime) : new Date();
        this.db = this._createDB(time);
    }
    readFile(startTime){
        var tempDb;
        if(startTime){
            var time = new Date(startTime);
            tempDb = this._createDB(time);
            return tempDb != null ? tempDb.get("logs").value() : false;
        }else{
            return this.db != null ? this.db.get("logs").value() : false;
        }
    }
    on(signal,func){
        this.changeId = setInterval(this.onChange.bind(this),1000);
        writeEmitter.on(signal,func);
    }
    unon(){
        clearInterval(this.changeId);
    }
    onChange(){
        if(this.db){
            this.db.read();
            var vs = this.db.get("logs").value()
            var len = vs.length;
            if(parseInt(this.oldSize) != len){
                var arr = [];
                for(var i = this.oldSize; i < len;i++){
                    arr.push(vs[i]);
                }
                writeEmitter.emit('change',arr);
                this.oldSize = len;
            }
        }
    }
}

module.exports = new read();

/***/ }),

/***/ "./utils/server-log/lib/write.js":
/*!***************************************!*\
  !*** ./utils/server-log/lib/write.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const low = __webpack_require__(/*! lowdb */ "lowdb");
const FileSync = __webpack_require__(/*! lowdb/adapters/FileSync */ "./utils/server-log/node_modules/lowdb/adapters/FileSync.js");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
Date.prototype.Format = function(fmt){ 
    var o = {   
      "M+" : this.getMonth()+1,                 //月份   
      "d+" : this.getDate(),                    //日   
      "h+" : this.getHours(),                   //小时   
      "m+" : this.getMinutes(),                 //分   
      "s+" : this.getSeconds(),                 //秒   
      "q+" : Math.floor((this.getMonth()+3)/3), //季度   
      "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
      if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
}
class write {
    constructor(){
        this.rootPath = process.cwd();
        this.mainName = "未命名";
    }
    config(postion){
        this.rootPath = postion.rootPath ? postion.rootPath : process.cwd();
        this.mainName = postion.name ? postion.name : "未命名";
    }

    writeToFile(text,postion){
        var _create = function(text,postion){
            var message = {
    
            }
            for(var p in postion){
                message[p] = postion[p]
            }
            message.text = text;
            if(message.type == undefined){
                message.type = "未设置"
            }
            if(message.time == undefined){
                message.time = new Date();
            }
            if(message.user == undefined){
                message.user = "未设置"
            }
            if(message.link == undefined){
                message.link = "未设置"
            }
            return message
        }
        var time = new Date();
        var year = time.getFullYear().toString();
        var day = (parseInt(time.getMonth()) + 1).toString();

        var filePath = path.join(this.rootPath,"logs",this.mainName,year,day);
        if (!fs.existsSync(filePath)) {
            var versionArray = process.version.split(".");
            var v = parseInt(versionArray[0].substring(1));
            if(v <= 10){
                this.mkdirSync(filePath);
            }else{
                //目录不存在创建，递归创建，nodejs 10版本以后 支持递归
                fs.mkdirSync(filePath,{recursive: true});
            }
            
        }
        var fileName = path.join(filePath,time.getDate() + ".json");
        const adapter = new FileSync(fileName);
        var db = low(adapter);
        if(db.get("logs").value()){
            db.get("logs").push(_create(text,postion)).write()
        }else{
            db.defaults({ logs: []}).write()
        }
        //db.set(time.Format("hh:mm:ss:S"),_create(text,postion)).write(); 
    }
    
    mkdirSync(filePath){
        var paths = filePath.split("\\");
        for(var i = 1; i < paths.length;i++){
            var mkdir = "";
            for(var j = 0; j < i + 1;j++){
                if(mkdir != ""){
                    mkdir += "\\";
                }
                mkdir += paths[j];
            }
            if (fs.existsSync(mkdir)) {
                continue;
            }else{
                fs.mkdirSync(mkdir,{recursive: true});
            }
        }
    }
}

module.exports = new write();


/***/ }),

/***/ "./utils/server-log/node_modules/lowdb/adapters/Base.js":
/*!**************************************************************!*\
  !*** ./utils/server-log/node_modules/lowdb/adapters/Base.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stringify = __webpack_require__(/*! ./_stringify */ "./utils/server-log/node_modules/lowdb/adapters/_stringify.js");

var Base = function Base(source) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === undefined ? {} : _ref$defaultValue,
      _ref$serialize = _ref.serialize,
      serialize = _ref$serialize === undefined ? stringify : _ref$serialize,
      _ref$deserialize = _ref.deserialize,
      deserialize = _ref$deserialize === undefined ? JSON.parse : _ref$deserialize;

  _classCallCheck(this, Base);

  this.source = source;
  this.defaultValue = defaultValue;
  this.serialize = serialize;
  this.deserialize = deserialize;
};

module.exports = Base;

/***/ }),

/***/ "./utils/server-log/node_modules/lowdb/adapters/FileSync.js":
/*!******************************************************************!*\
  !*** ./utils/server-log/node_modules/lowdb/adapters/FileSync.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs");
var Base = __webpack_require__(/*! ./Base */ "./utils/server-log/node_modules/lowdb/adapters/Base.js");

var readFile = fs.readFileSync;
var writeFile = fs.writeFileSync;

// Same code as in FileAsync, minus `await`

var FileSync = function (_Base) {
  _inherits(FileSync, _Base);

  function FileSync() {
    _classCallCheck(this, FileSync);

    return _possibleConstructorReturn(this, (FileSync.__proto__ || Object.getPrototypeOf(FileSync)).apply(this, arguments));
  }

  _createClass(FileSync, [{
    key: 'read',
    value: function read() {
      // fs.exists is deprecated but not fs.existsSync
      if (fs.existsSync(this.source)) {
        // Read database
        try {
          var data = readFile(this.source, 'utf-8').trim();
          // Handle blank file
          return data ? this.deserialize(data) : this.defaultValue;
        } catch (e) {
          if (e instanceof SyntaxError) {
            e.message = `Malformed JSON in file: ${this.source}\n${e.message}`;
          }
          throw e;
        }
      } else {
        // Initialize
        writeFile(this.source, this.serialize(this.defaultValue));
        return this.defaultValue;
      }
    }
  }, {
    key: 'write',
    value: function write(data) {
      return writeFile(this.source, this.serialize(data));
    }
  }]);

  return FileSync;
}(Base);

module.exports = FileSync;

/***/ }),

/***/ "./utils/server-log/node_modules/lowdb/adapters/_stringify.js":
/*!********************************************************************!*\
  !*** ./utils/server-log/node_modules/lowdb/adapters/_stringify.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Pretty stringify
module.exports = function stringify(obj) {
  return JSON.stringify(obj, null, 2);
};

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graceful-fs":
/*!******************************!*\
  !*** external "graceful-fs" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graceful-fs");

/***/ }),

/***/ "lowdb":
/*!************************!*\
  !*** external "lowdb" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lowdb");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcG9zdGdyZS1zcWwvYmluL3d3dy5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9zZXJ2ZXItbG9nL2luZGV4LmpzIiwid2VicGFjazovLy8uL3V0aWxzL3NlcnZlci1sb2cvbGliL3JlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvc2VydmVyLWxvZy9saWIvd3JpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvc2VydmVyLWxvZy9ub2RlX21vZHVsZXMvbG93ZGIvYWRhcHRlcnMvQmFzZS5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9zZXJ2ZXItbG9nL25vZGVfbW9kdWxlcy9sb3dkYi9hZGFwdGVycy9GaWxlU3luYy5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9zZXJ2ZXItbG9nL25vZGVfbW9kdWxlcy9sb3dkYi9hZGFwdGVycy9fc3RyaW5naWZ5LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImNoaWxkX3Byb2Nlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdyYWNlZnVsLWZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG93ZGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxLQUFLLGNBQWMsR0FBRyxtQkFBTyxDQUFDLG9DQUFlO0FBQzdDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QjtBQUNBLFNBQVMsbUJBQU8sQ0FBQyxrQkFBTTtBQUN2QixtQkFBbUIsbUJBQU8sQ0FBQywyREFBd0I7QUFDbkQ7QUFDQTtBQUNBLHdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsaUJBQWlCO0FBQ3JEO0FBQ0E7QUFDQSx1REFBdUQsY0FBYztBQUNyRSxpQ0FBaUMsZUFBZTtBQUNoRDtBQUNBLDhCQUE4QixlQUFlO0FBQzdDO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDJCQUEyQixhQUFhO0FBQ3hDLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsaUJBQWlCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFE7Ozs7Ozs7Ozs7O0FDOUVBLGNBQWMsbUJBQU8sQ0FBQyxvREFBYTtBQUNuQyxhQUFhLG1CQUFPLENBQUMsa0RBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQkEsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGlCQUFpQixtQkFBTyxDQUFDLDJGQUF5QjtBQUNsRCxhQUFhLG1CQUFPLENBQUMsa0JBQU07QUFDM0IsV0FBVyxtQkFBTyxDQUFDLGNBQUk7QUFDdkIscUJBQXFCLG1CQUFPLENBQUMsc0JBQVE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Qjs7Ozs7Ozs7Ozs7QUN0RUEsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGlCQUFpQixtQkFBTyxDQUFDLDJGQUF5QjtBQUNsRCxhQUFhLG1CQUFPLENBQUMsa0JBQU07QUFDM0IsV0FBVyxtQkFBTyxDQUFDLGNBQUk7QUFDdkIsc0M7QUFDQSxhO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNO0FBQ0E7QUFDQSx1RjtBQUNBO0FBQ0E7QUFDQSw0RztBQUNBLGU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsdUNBQXVDLGdCQUFnQjtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QseUJBQXlCLFVBQVU7QUFDbkM7QUFDQSwwRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDO0FBQ0EsMEJBQTBCLFdBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2Isb0NBQW9DLGdCQUFnQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQ3BHYTs7QUFFYixpREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SixnQkFBZ0IsbUJBQU8sQ0FBQyxrRkFBYzs7QUFFdEM7QUFDQSxtRkFBbUY7QUFDbkY7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQjs7Ozs7Ozs7Ozs7O0FDdkJhOztBQUViLGdDQUFnQywyQ0FBMkMsZ0JBQWdCLGtCQUFrQixPQUFPLDJCQUEyQix3REFBd0QsZ0NBQWdDLHVEQUF1RCwyREFBMkQsRUFBRSxFQUFFLHlEQUF5RCxxRUFBcUUsNkRBQTZELG9CQUFvQixHQUFHLEVBQUU7O0FBRWpqQixpREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SixpREFBaUQsYUFBYSx1RkFBdUYsRUFBRSx1RkFBdUY7O0FBRTlPLDBDQUEwQywrREFBK0QscUdBQXFHLEVBQUUseUVBQXlFLGVBQWUseUVBQXlFLEVBQUUsRUFBRSx1SEFBdUg7O0FBRTVlLFNBQVMsbUJBQU8sQ0FBQyxnQ0FBYTtBQUM5QixXQUFXLG1CQUFPLENBQUMsc0VBQVE7O0FBRTNCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxtREFBbUQsWUFBWSxJQUFJLFVBQVU7QUFDN0U7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRCwwQjs7Ozs7Ozs7Ozs7O0FDM0RhOztBQUViO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7O0FDTEEsMEM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoicG9zdGdyZS1zcWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3Bvc3RncmUtc3FsL2Jpbi93d3cuanNcIik7XG4iLCJ2YXIge2V4ZWMsZXhlY0ZpbGV9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xyXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxudmFyIF9fZGVidWcgPSBmYWxzZTtcclxubGV0IG9zID0gcmVxdWlyZSgncGF0aCcpO1xyXG5jb25zdCB3b3JrZXJMb2dzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvc2VydmVyLWxvZycpO1xyXG53b3JrZXJMb2dzLmF0dGFjaCgpO1xyXG5pZihwcm9jZXNzLmFyZ3ZbMl0pe1xyXG4gICAgX19kZWJ1ZyA9IHByb2Nlc3MuYXJndlsyXSA9PSBcImRlYnVnXCIgPyB0cnVlIDogZmFsc2U7ICBcclxufVxyXG5cclxudmFyIHN0YXJ0ID0gYXN5bmMgZnVuY3Rpb24oKXtcclxuICAgIHZhciBjbWRQYXRoO1xyXG4gICAgc3dpdGNoKHByb2Nlc3MucGxhdGZvcm0pe1xyXG4gICAgICAgIGNhc2UgXCJ3aW4zMlwiOlxyXG4gICAgICAgIGNhc2UgXCJkYXJ3aW5cIjpcclxuICAgICAgICAgICAgaWYocHJvY2Vzcy5hcmNoID09IFwiaWEzMlwiKXtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHN0b3BQb3N0Z3Jlc3QoKTtcclxuICAgICAgICAgICAgICAgIGNtZFBhdGggPSBfX2RlYnVnID8gcGF0aC5qb2luKF9fZGlybmFtZSxcIi8uLi94NjQvXCIpIDogX19kaXJuYW1lO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHN0b3BQb3N0Z3Jlc3QoKTtcclxuICAgICAgICAgICAgICAgIGNtZFBhdGggPSBfX2RlYnVnID8gcGF0aC5qb2luKF9fZGlybmFtZSxcIi8uLi94NjQvXCIpIDogX19kaXJuYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJsaW51eFwiOlxyXG4gICAgICAgIGNhc2UgXCJhaXhcIjpcclxuICAgICAgICBjYXNlIFwiZnJlZWJzZFwiOlxyXG4gICAgICAgIGNhc2UgXCJvcGVuYnNkXCI6XHJcbiAgICAgICAgY2FzZSBcInN1bm9zXCI6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5pqC5LiN5pSv5oyBOiR7cHJvY2Vzcy5wbGF0Zm9ybX1gKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBjb25zdCBidWlsZCA9IGV4ZWMoXCJwb3N0Z3Jlc3QgZGVmYXVsdFNlcnZlci5jb25mXCIse2N3ZCA6IGNtZFBhdGh9LGZ1bmN0aW9uKGVycixzdGRvdXQsc3RkZXJyKXtcclxuICAgICAgICBjb25zb2xlLmRsb2coXCLlt6XnqIvmnI3liqHlmajph43lkK86XCIse3R5cGUgOiBcInN0YXJ0XCJ9KTtcclxuICAgICAgICBpZihlcnIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmRsb2coZXJyLHt0eXBlIDogXCJlcnJvclwifSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0ZGVycil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGxvZyhzdGRlcnIse3R5cGUgOiBcImVycm9yXCJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsYXllZFN0YXJ0KCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGJ1aWxkLnN0ZG91dC5vbignZGF0YScsKGRhdGEpPT57XHJcbiAgICAgICAgY29uc29sZS5kbG9nKGRhdGEse3R5cGUgOiBcImxvZ1wifSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIOS4jeiuuiBwb3N0Z3Jlc3QuZXhlIOaYr+WQpuato+WcqOi/kOihjOOAgumDveaJp+ihjOS4gOasoeWBnOatolxyXG52YXIgc3RvcFBvc3RncmVzdD0gYXN5bmMgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG4gICAgICAgIGxldCBjbWQgPSBcIlwiO1xyXG4gICAgICAgIHN3aXRjaChwcm9jZXNzLnBsYXRmb3JtKXtcclxuICAgICAgICAgICAgY2FzZSBcIndpbjMyXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJkYXJ3aW5cIjpcclxuICAgICAgICAgICAgICAgIGNtZCA9IFwidGFza2tpbGwgL2YgL2ltIHBvc3RncmVzdC5leGVcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGludXhcIjpcclxuICAgICAgICAgICAgICAgIGNtZCA9IFwia2lsbGFsbCBwb3N0Z3Jlc3RcIjtcclxuICAgICAgICAgICAgY2FzZSBcImFpeFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiZnJlZWJzZFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwib3BlbmJzZFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwic3Vub3NcIjpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5pqC5LiN5pSv5oyBOiR7cHJvY2Vzcy5wbGF0Zm9ybX1gKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyLHN0ZG91dCxzdGRlcnIpe1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICBcclxufVxyXG5cclxudmFyIGRlbGF5ZWRTdGFydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgc3RhcnQoKTtcclxuICAgIH0sMjAwMClcclxufVxyXG5cclxuc3RhcnQoKTsiLCJjb25zdCB3cml0ZSA9IHJlcXVpcmUoXCIuL2xpYi93cml0ZVwiKTtcclxuY29uc3QgcmVhZCA9IHJlcXVpcmUoXCIuL2xpYi9yZWFkXCIpO1xyXG5jbGFzcyBzZXJ2ZXJMb2cge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLndyaXRlID0gd3JpdGU7XHJcbiAgICAgICAgdGhpcy5yZWFkID0gcmVhZDtcclxuICAgIH1cclxuICAgIGNvbmZpZyhwb3N0aW9uKXtcclxuICAgICAgICB3cml0ZS5jb25maWcocG9zdGlvbik7XHJcbiAgICAgICAgcmVhZC5jb25maWcocG9zdGlvbik7XHJcbiAgICB9XHJcbiAgICBsb2dBbmRXcml0ZSh0ZXh0LHBvc3Rpb24pe1xyXG4gICAgICAgIHdyaXRlLndyaXRlVG9GaWxlKHRleHQscG9zdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXHJcXG5cIiArIHRleHQpO1xyXG4gICAgfVxyXG4gICAgYXR0YWNoKCl7XHJcbiAgICAgICAgY29uc29sZS5kbG9nID0gdGhpcy5sb2dBbmRXcml0ZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IHNlcnZlckxvZygpO1xyXG4iLCJjb25zdCBsb3cgPSByZXF1aXJlKCdsb3dkYicpO1xyXG5jb25zdCBGaWxlU3luYyA9IHJlcXVpcmUoJ2xvd2RiL2FkYXB0ZXJzL0ZpbGVTeW5jJyk7XHJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcclxuY29uc3Qgd3JpdGVFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5jbGFzcyByZWFkIHtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5yb290UGF0aCA9IHByb2Nlc3MuY3dkKCk7XHJcbiAgICAgICAgdGhpcy5tYWluTmFtZSA9IFwi5pyq5ZG95ZCNXCI7XHJcbiAgICAgICAgdGhpcy5kYiA9IHRoaXMuX2NyZWF0ZURCKG5ldyBEYXRlKCkpO1xyXG4gICAgICAgIHRoaXMub2xkU2l6ZSA9IDA7XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlREIodGltZSl7XHJcbiAgICAgICAgdmFyIHllYXIgPSB0aW1lLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAocGFyc2VJbnQodGltZS5nZXRNb250aCgpKSArIDEpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMucm9vdFBhdGgsXCJsb2dzXCIsdGhpcy5tYWluTmFtZSx5ZWFyLG1vbnRoKTtcclxuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gcGF0aC5qb2luKGZpbGVQYXRoLHRpbWUuZ2V0RGF0ZSgpICsgXCIuanNvblwiKTtcclxuICAgICAgICAgICAgY29uc3QgYWRhcHRlciA9IG5ldyBGaWxlU3luYyhmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgIHZhciB0ZGIgPSBsb3coYWRhcHRlcik7XHJcbiAgICAgICAgICAgIGlmKHRkYi5nZXQoXCJsb2dzXCIpLnZhbHVlKCkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRTaXplID0gdGRiLmdldChcImxvZ3NcIikudmFsdWUoKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRTaXplID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGRiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbmZpZyhwb3N0aW9uKXtcclxuICAgICAgICB0aGlzLnJvb3RQYXRoID0gcG9zdGlvbi5yb290UGF0aCA/IHBvc3Rpb24ucm9vdFBhdGggOiBwcm9jZXNzLmN3ZCgpO1xyXG4gICAgICAgIHRoaXMubWFpbk5hbWUgPSBwb3N0aW9uLm5hbWUgPyBwb3N0aW9uLm5hbWUgOiBcIuacquWRveWQjVwiO1xyXG4gICAgICAgIHZhciB0aW1lID0gcG9zdGlvbi5zdGFydFRpbWUgPyBuZXcgRGF0ZShwb3N0aW9uLnN0YXJ0VGltZSkgOiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZGIgPSB0aGlzLl9jcmVhdGVEQih0aW1lKTtcclxuICAgIH1cclxuICAgIHJlYWRGaWxlKHN0YXJ0VGltZSl7XHJcbiAgICAgICAgdmFyIHRlbXBEYjtcclxuICAgICAgICBpZihzdGFydFRpbWUpe1xyXG4gICAgICAgICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHN0YXJ0VGltZSk7XHJcbiAgICAgICAgICAgIHRlbXBEYiA9IHRoaXMuX2NyZWF0ZURCKHRpbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGVtcERiICE9IG51bGwgPyB0ZW1wRGIuZ2V0KFwibG9nc1wiKS52YWx1ZSgpIDogZmFsc2U7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRiICE9IG51bGwgPyB0aGlzLmRiLmdldChcImxvZ3NcIikudmFsdWUoKSA6IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uKHNpZ25hbCxmdW5jKXtcclxuICAgICAgICB0aGlzLmNoYW5nZUlkID0gc2V0SW50ZXJ2YWwodGhpcy5vbkNoYW5nZS5iaW5kKHRoaXMpLDEwMDApO1xyXG4gICAgICAgIHdyaXRlRW1pdHRlci5vbihzaWduYWwsZnVuYyk7XHJcbiAgICB9XHJcbiAgICB1bm9uKCl7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNoYW5nZUlkKTtcclxuICAgIH1cclxuICAgIG9uQ2hhbmdlKCl7XHJcbiAgICAgICAgaWYodGhpcy5kYil7XHJcbiAgICAgICAgICAgIHRoaXMuZGIucmVhZCgpO1xyXG4gICAgICAgICAgICB2YXIgdnMgPSB0aGlzLmRiLmdldChcImxvZ3NcIikudmFsdWUoKVxyXG4gICAgICAgICAgICB2YXIgbGVuID0gdnMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihwYXJzZUludCh0aGlzLm9sZFNpemUpICE9IGxlbil7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSB0aGlzLm9sZFNpemU7IGkgPCBsZW47aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh2c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3cml0ZUVtaXR0ZXIuZW1pdCgnY2hhbmdlJyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRTaXplID0gbGVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyByZWFkKCk7IiwiY29uc3QgbG93ID0gcmVxdWlyZSgnbG93ZGInKTtcclxuY29uc3QgRmlsZVN5bmMgPSByZXF1aXJlKCdsb3dkYi9hZGFwdGVycy9GaWxlU3luYycpO1xyXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuRGF0ZS5wcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24oZm10KXsgXHJcbiAgICB2YXIgbyA9IHsgICBcclxuICAgICAgXCJNK1wiIDogdGhpcy5nZXRNb250aCgpKzEsICAgICAgICAgICAgICAgICAvL+aciOS7vSAgIFxyXG4gICAgICBcImQrXCIgOiB0aGlzLmdldERhdGUoKSwgICAgICAgICAgICAgICAgICAgIC8v5pelICAgXHJcbiAgICAgIFwiaCtcIiA6IHRoaXMuZ2V0SG91cnMoKSwgICAgICAgICAgICAgICAgICAgLy/lsI/ml7YgICBcclxuICAgICAgXCJtK1wiIDogdGhpcy5nZXRNaW51dGVzKCksICAgICAgICAgICAgICAgICAvL+WIhiAgIFxyXG4gICAgICBcInMrXCIgOiB0aGlzLmdldFNlY29uZHMoKSwgICAgICAgICAgICAgICAgIC8v56eSICAgXHJcbiAgICAgIFwicStcIiA6IE1hdGguZmxvb3IoKHRoaXMuZ2V0TW9udGgoKSszKS8zKSwgLy/lraPluqYgICBcclxuICAgICAgXCJTXCIgIDogdGhpcy5nZXRNaWxsaXNlY29uZHMoKSAgICAgICAgICAgICAvL+avq+enkiAgIFxyXG4gICAgfTsgICBcclxuICAgIGlmKC8oeSspLy50ZXN0KGZtdCkpICAgXHJcbiAgICAgIGZtdD1mbXQucmVwbGFjZShSZWdFeHAuJDEsICh0aGlzLmdldEZ1bGxZZWFyKCkrXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7ICAgXHJcbiAgICBmb3IodmFyIGsgaW4gbykgICBcclxuICAgICAgaWYobmV3IFJlZ0V4cChcIihcIisgayArXCIpXCIpLnRlc3QoZm10KSkgICBcclxuICAgIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKFJlZ0V4cC4kMS5sZW5ndGg9PTEpID8gKG9ba10pIDogKChcIjAwXCIrIG9ba10pLnN1YnN0cigoXCJcIisgb1trXSkubGVuZ3RoKSkpOyAgIFxyXG4gICAgcmV0dXJuIGZtdDsgICBcclxufVxyXG5jbGFzcyB3cml0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucm9vdFBhdGggPSBwcm9jZXNzLmN3ZCgpO1xyXG4gICAgICAgIHRoaXMubWFpbk5hbWUgPSBcIuacquWRveWQjVwiO1xyXG4gICAgfVxyXG4gICAgY29uZmlnKHBvc3Rpb24pe1xyXG4gICAgICAgIHRoaXMucm9vdFBhdGggPSBwb3N0aW9uLnJvb3RQYXRoID8gcG9zdGlvbi5yb290UGF0aCA6IHByb2Nlc3MuY3dkKCk7XHJcbiAgICAgICAgdGhpcy5tYWluTmFtZSA9IHBvc3Rpb24ubmFtZSA/IHBvc3Rpb24ubmFtZSA6IFwi5pyq5ZG95ZCNXCI7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVUb0ZpbGUodGV4dCxwb3N0aW9uKXtcclxuICAgICAgICB2YXIgX2NyZWF0ZSA9IGZ1bmN0aW9uKHRleHQscG9zdGlvbil7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xyXG4gICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yKHZhciBwIGluIHBvc3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZVtwXSA9IHBvc3Rpb25bcF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXNzYWdlLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICBpZihtZXNzYWdlLnR5cGUgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UudHlwZSA9IFwi5pyq6K6+572uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihtZXNzYWdlLnRpbWUgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UudGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobWVzc2FnZS51c2VyID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlLnVzZXIgPSBcIuacquiuvue9rlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobWVzc2FnZS5saW5rID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlLmxpbmsgPSBcIuacquiuvue9rlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gdGltZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIGRheSA9IChwYXJzZUludCh0aW1lLmdldE1vbnRoKCkpICsgMSkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMucm9vdFBhdGgsXCJsb2dzXCIsdGhpcy5tYWluTmFtZSx5ZWFyLGRheSk7XHJcbiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xyXG4gICAgICAgICAgICB2YXIgdmVyc2lvbkFycmF5ID0gcHJvY2Vzcy52ZXJzaW9uLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHYgPSBwYXJzZUludCh2ZXJzaW9uQXJyYXlbMF0uc3Vic3RyaW5nKDEpKTtcclxuICAgICAgICAgICAgaWYodiA8PSAxMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1rZGlyU3luYyhmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgLy/nm67lvZXkuI3lrZjlnKjliJvlu7rvvIzpgJLlvZLliJvlu7rvvIxub2RlanMgMTDniYjmnKzku6XlkI4g5pSv5oyB6YCS5b2SXHJcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoZmlsZVBhdGgse3JlY3Vyc2l2ZTogdHJ1ZX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLmpvaW4oZmlsZVBhdGgsdGltZS5nZXREYXRlKCkgKyBcIi5qc29uXCIpO1xyXG4gICAgICAgIGNvbnN0IGFkYXB0ZXIgPSBuZXcgRmlsZVN5bmMoZmlsZU5hbWUpO1xyXG4gICAgICAgIHZhciBkYiA9IGxvdyhhZGFwdGVyKTtcclxuICAgICAgICBpZihkYi5nZXQoXCJsb2dzXCIpLnZhbHVlKCkpe1xyXG4gICAgICAgICAgICBkYi5nZXQoXCJsb2dzXCIpLnB1c2goX2NyZWF0ZSh0ZXh0LHBvc3Rpb24pKS53cml0ZSgpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGRiLmRlZmF1bHRzKHsgbG9nczogW119KS53cml0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZGIuc2V0KHRpbWUuRm9ybWF0KFwiaGg6bW06c3M6U1wiKSxfY3JlYXRlKHRleHQscG9zdGlvbikpLndyaXRlKCk7IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBta2RpclN5bmMoZmlsZVBhdGgpe1xyXG4gICAgICAgIHZhciBwYXRocyA9IGZpbGVQYXRoLnNwbGl0KFwiXFxcXFwiKTtcclxuICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDwgcGF0aHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBta2RpciA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBpICsgMTtqKyspe1xyXG4gICAgICAgICAgICAgICAgaWYobWtkaXIgIT0gXCJcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgbWtkaXIgKz0gXCJcXFxcXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBta2RpciArPSBwYXRoc1tqXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhta2RpcikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhta2Rpcix7cmVjdXJzaXZlOiB0cnVlfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IHdyaXRlKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vX3N0cmluZ2lmeScpO1xuXG52YXIgQmFzZSA9IGZ1bmN0aW9uIEJhc2Uoc291cmNlKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fSxcbiAgICAgIF9yZWYkZGVmYXVsdFZhbHVlID0gX3JlZi5kZWZhdWx0VmFsdWUsXG4gICAgICBkZWZhdWx0VmFsdWUgPSBfcmVmJGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkID8ge30gOiBfcmVmJGRlZmF1bHRWYWx1ZSxcbiAgICAgIF9yZWYkc2VyaWFsaXplID0gX3JlZi5zZXJpYWxpemUsXG4gICAgICBzZXJpYWxpemUgPSBfcmVmJHNlcmlhbGl6ZSA9PT0gdW5kZWZpbmVkID8gc3RyaW5naWZ5IDogX3JlZiRzZXJpYWxpemUsXG4gICAgICBfcmVmJGRlc2VyaWFsaXplID0gX3JlZi5kZXNlcmlhbGl6ZSxcbiAgICAgIGRlc2VyaWFsaXplID0gX3JlZiRkZXNlcmlhbGl6ZSA9PT0gdW5kZWZpbmVkID8gSlNPTi5wYXJzZSA6IF9yZWYkZGVzZXJpYWxpemU7XG5cbiAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2UpO1xuXG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgdGhpcy5zZXJpYWxpemUgPSBzZXJpYWxpemU7XG4gIHRoaXMuZGVzZXJpYWxpemUgPSBkZXNlcmlhbGl6ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi9CYXNlJyk7XG5cbnZhciByZWFkRmlsZSA9IGZzLnJlYWRGaWxlU3luYztcbnZhciB3cml0ZUZpbGUgPSBmcy53cml0ZUZpbGVTeW5jO1xuXG4vLyBTYW1lIGNvZGUgYXMgaW4gRmlsZUFzeW5jLCBtaW51cyBgYXdhaXRgXG5cbnZhciBGaWxlU3luYyA9IGZ1bmN0aW9uIChfQmFzZSkge1xuICBfaW5oZXJpdHMoRmlsZVN5bmMsIF9CYXNlKTtcblxuICBmdW5jdGlvbiBGaWxlU3luYygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVN5bmMpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChGaWxlU3luYy5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEZpbGVTeW5jKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRmlsZVN5bmMsIFt7XG4gICAga2V5OiAncmVhZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICAvLyBmcy5leGlzdHMgaXMgZGVwcmVjYXRlZCBidXQgbm90IGZzLmV4aXN0c1N5bmNcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHRoaXMuc291cmNlKSkge1xuICAgICAgICAvLyBSZWFkIGRhdGFiYXNlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSByZWFkRmlsZSh0aGlzLnNvdXJjZSwgJ3V0Zi04JykudHJpbSgpO1xuICAgICAgICAgIC8vIEhhbmRsZSBibGFuayBmaWxlXG4gICAgICAgICAgcmV0dXJuIGRhdGEgPyB0aGlzLmRlc2VyaWFsaXplKGRhdGEpIDogdGhpcy5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgICAgICBlLm1lc3NhZ2UgPSBgTWFsZm9ybWVkIEpTT04gaW4gZmlsZTogJHt0aGlzLnNvdXJjZX1cXG4ke2UubWVzc2FnZX1gO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbml0aWFsaXplXG4gICAgICAgIHdyaXRlRmlsZSh0aGlzLnNvdXJjZSwgdGhpcy5zZXJpYWxpemUodGhpcy5kZWZhdWx0VmFsdWUpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3dyaXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gd3JpdGUoZGF0YSkge1xuICAgICAgcmV0dXJuIHdyaXRlRmlsZSh0aGlzLnNvdXJjZSwgdGhpcy5zZXJpYWxpemUoZGF0YSkpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlU3luYztcbn0oQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsZVN5bmM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFByZXR0eSBzdHJpbmdpZnlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iaikge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhY2VmdWwtZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG93ZGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9