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
/******/ 	return __webpack_require__(__webpack_require__.s = "./data-server/bin/www.js");
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

/***/ "./data-server/app.js":
/*!****************************!*\
  !*** ./data-server/app.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Koa = __webpack_require__(/*! koa */ "koa")
const app = new Koa()
const json = __webpack_require__(/*! koa-json */ "koa-json")
const onerror = __webpack_require__(/*! koa-onerror */ "koa-onerror")
const logger = __webpack_require__(/*! koa-logger */ "koa-logger")
const jwt = __webpack_require__(/*! koa-jwt */ "koa-jwt")
const cors = __webpack_require__(/*! koa-cors */ "koa-cors");
const koaBody = __webpack_require__(/*! koa-body */ "koa-body");
const path = __webpack_require__(/*! path */ "path");
//路由文件
const index = __webpack_require__(/*! ./routes/index */ "./data-server/routes/index.js");
const users = __webpack_require__(/*! ./routes/users */ "./data-server/routes/users.js");
const files = __webpack_require__(/*! ./routes/files */ "./data-server/routes/files.js");

// error handler
onerror(app)
//跨域访问
app.use(cors());

app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

app.use(koaBody({
	multipart: true,
	formidable: {
		maxFileSize: 500 * 1024 * 1024    // 设置上传文件大小最大限制，默认5M
	}
}));

app.use(json())
app.use(logger())
global.fileDirectory;
if (__debug) {
	//调试启动时，因deamon和data-server隶属两个文件夹，目录有所调整
	fileDirectory = path.join(process.cwd(), '../daemon/upload/');
}else{
	//发布运行时，上传到同级目录
	fileDirectory = path.join(process.cwd(), 'upload/');
}

app.use(__webpack_require__(/*! koa-static */ "koa-static")(fileDirectory))
//app.use(require('koa-static')(__dirname + '/upload/'))
app.use(files.routes(), files.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});
module.exports = app


/***/ }),

/***/ "./data-server/bin/www.js":
/*!********************************!*\
  !*** ./data-server/bin/www.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//daemon全局配置
global.daemonConfig = __webpack_require__(/*! ../../daemon/config/default-config.json */ "../../daemon/config/default-config.json");
//debug
global.__debug = false;
if (process.argv[2] && process.argv[2] === "debug") {
  __debug = true;
}

const app = __webpack_require__(/*! ../app */ "./data-server/app.js");
const debug = __webpack_require__(/*! debug */ "debug")('demo:server');
const http = __webpack_require__(/*! http */ "http");
const communicate = __webpack_require__(/*! ../communicate */ "./data-server/communicate.js");

//data-server配置
let startConfigJson = {};
if (__debug) {
  startConfigJson = __webpack_require__(/*! ../config/default-config.json */ "../../daemon/config/default-config.json");
} else {
  if (process.argv[2]) {
    var jsonStr = new Buffer.from(process.argv[2], 'base64').toString();
    try{
      startConfigJson = JSON.parse(jsonStr);
    }catch(e){
      console.log("错误的配置参数");
      startConfigJson = {
        "name": "data-server"
      }
    }
    
  } else {
    startConfigJson = {
      "name": "data-server"
    }
  }
}

var start = async function() {
  try {
    //初始端口
    let startPort = await communicate.getPort();
    //启动
    if(startPort && startPort.port){
        chkPortAndStart(startPort.port, 1);
    }else{
      console.log(`[DATA-SERVER] 未找到主服务的链接端口,5秒后重试`);
      setTimeout(()=>{
        start();
      },5000);
    }
  } catch (error) {
    console.log(`[DATA-SERVER] ${error}`);
  }
}
start();

/**
 * @description 检测可用端口，并启动server
 * @param {number} port 端口
 * @param {number} curChkTime 当前检测次数 最大检测次数是500
 */
let chkPortAndStart = async (port, curChkTime) => {
  //最大端口检测次数
  const MAX_CHK_TIMES = 500;
  let server = await http.createServer(app.callback());
  server.listen(port, () => {
    console.log(`[DATA-SERVER] 服务器启动:${port}`);
    console.log(`[DATA-SERVER] 名称:${startConfigJson.name}`);
    console.log(`[DATA-SERVER] 服务进程id:${process.pid}`);
  });
  //处理错误
  server.on('error', error => {
    if (error.syscall !== 'listen') {
      console.log(`[DATA-SERVER] error.code:${error.syscall}`);
    }

    let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    //处理特殊的错误事件监听
    switch (error.code) {
      case 'EACCES':
        console.log(`[DATA-SERVER] requires elevated privileges`);
        break;
      case 'EADDRINUSE': //端口占用错误，就一直递归到没有占用的接口
        if (curChkTime <= MAX_CHK_TIMES) {
          chkPortAndStart(port + 1, curChkTime + 1);
          return;
        }
        console.log(`[DATA-SERVER] 端口：${port}被占用，并且端口检测已到最大次数`);
        break;
      default:
        console.log(`[DATA-SERVER] error.code:${error.syscall}`);
    }
  });
  server.on('listening', async () => {
    let addr = server.address();
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
    //向daemon报告当前使用端口
    await communicate.report(port);
  });
}


/***/ }),

/***/ "./data-server/communicate.js":
/*!************************************!*\
  !*** ./data-server/communicate.js ***!
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
            let url = `http://${this.ip}:${this.port}${this.prefix}/data`;
            this.requestPost(url, { "type": "getPort", "serverType": "dataServer" }, (err, data) => {
                if (err) {
                    console.log(`[DATA-SERVER] ${err}`);
                }
                resolve(data);
            })
        })
    }

    /**
     * 登录成功向daemon报告服务使用的端口
     * @param {*} curUsePort 当前使用的端口
     */
    async report(curUsePort) {
        return new Promise((resolve, reject) => {
            let url = `http://${this.ip}:${this.port}${this.prefix}/data`;
            this.requestPost(url, { "type": "report", curUsePort, "serverType": "dataServer", "serverName": "文件服务" }, (err, data) => {
                if (err) {
                    console.log(`[DATA-SERVER] ${err}`);
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

/***/ "./data-server/routes/files.js":
/*!*************************************!*\
  !*** ./data-server/routes/files.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const Router = __webpack_require__(/*! koa-router */ "koa-router");
const sizeOf = __webpack_require__(/*! image-size */ "image-size");
const resizeImg = __webpack_require__(/*! resize-img */ "resize-img");
const router = new Router({
	prefix: '/api/v2'
});

//创建缩略图
async function createImageThumb(fileData,filePath){	
	//缩略图支持类别
	const formats = [".BMP",".CUR",".GIF",".ICNS",".ICO",".JPG",".JPEG",".KTX",".PNG",".PNM",".PAM",".PBM",".PFM",".PGM",".PPM",".PSD",".SVG",".TIFF",".WebP"];
	const fileInfo = path.parse(filePath);
	const fileSuffix = 	fileInfo.ext.toUpperCase();
	let isSupport = formats.some((name) => {
		return name == fileSuffix;
	});
	if (isSupport) {
		let dimensions = sizeOf(fileData);
		console.log(dimensions);
		switch (fileSuffix) {
			case ".GIF":

				break;
			case ".SVG":
				break;			
			default://其他图片类型
				//保持横纵比
				let width = 160;
				let height = 120;
				if (dimensions.width >= width || dimensions.height > height) {
					//图片大于基准，缩放处理
					let percentage = dimensions.width / dimensions.height;
					if (dimensions.width >= dimensions.height) {		
						height = width / percentage;
					}else{
						width = percentage * height;
					}	
				}else{
					//小于基准
					width = dimensions.width;
					height = dimensions.height;
				}
				//缩放图片，拼接目录，为缩略图做准备
				const buf = await resizeImg(fileData, {width: width, height: height});	
				let thumbFileName = fileInfo.dir + path.sep + "thumb_" + fileInfo.base;
				fs.writeFileSync(thumbFileName, buf);
				break;
		}
	}
}
//生成文件
async function generateFile(fileTempPath,filePath){
	return new Promise((resolve, reject) => {
		let reader = fs.createReadStream(fileTempPath);
		let upStream = fs.createWriteStream(filePath);
		upStream.on('error', (err) => {
			console.log(err);
			reject();
		});
		upStream.on('close', () => {
			resolve();
		});
		let readData = [];
		reader.on('data', function(chunk) {
			readData.push(chunk);
		});
		reader.on('end', async function() {
			const fildData = Buffer.concat(readData);
			await createImageThumb(fildData,filePath)
			upStream.write(fildData);
			upStream.end();
		});
	});
}

router.post('/uploadfiles', async (ctx, next) => {
	let companyId = ctx.request.body.companyId;	
	let uploadFileList = JSON.parse(ctx.request.body.uploadFileList);
	let fileDirectory;
	if (__debug) {
		//调试启动时，因deamon和data-server隶属两个文件夹，目录有所调整
		fileDirectory = path.join(process.cwd(), '../daemon/upload/', companyId);
	}else{
		//发布运行时，上传到同级目录
		fileDirectory = path.join(process.cwd(), 'upload/', companyId);
	}
	if (!fs.existsSync(fileDirectory)) {
		//目录不存在创建，递归创建，nodejs 10版本以后 支持递归
		fs.mkdirSync(fileDirectory, {
			recursive: true
		});
	}
	for (let key in ctx.request.files) {
		const file = ctx.request.files[key];
		if (typeof file == "object" && file.length > 0) {
			for (var i = 0; i < file.length; i++) {
				var tempFile = file[i];
				let upFile = uploadFileList.find(upFile => upFile.file.toLowerCase() == tempFile.name.toLowerCase());
            	if (upFile) {
					let fileName = upFile.isRename ? upFile.reNameFile : upFile.file;
					let filePath = fileDirectory + `/${fileName}`;
					await generateFile(tempFile.path,filePath);
				}
			}
		} else {
			let upFile = uploadFileList.find(upFile => upFile.file.toLowerCase() == file.name.toLowerCase());
            if (upFile) {
				//重命名判断
				let fileName = upFile.isRename ? upFile.reNameFile : upFile.file;
				let filePath = fileDirectory + `/${fileName}`;
				await generateFile(file.path,filePath);
			}			
		}
	}
	return ctx.body = "上传成功！";
});
//不可增加方法，不能触发（原因未知）
module.exports = router

/***/ }),

/***/ "./data-server/routes/index.js":
/*!*************************************!*\
  !*** ./data-server/routes/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Router = __webpack_require__(/*! koa-router */ "koa-router");

const router = new Router({
  prefix: '/api/v1'
})

router.get('/isConnected', (ctx, next) => {
  console.log(".............")
  return ctx.body = true;
})

module.exports = router


/***/ }),

/***/ "./data-server/routes/users.js":
/*!*************************************!*\
  !*** ./data-server/routes/users.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const Router = __webpack_require__(/*! koa-router */ "koa-router");
const resizeImg = __webpack_require__(/*! resize-img */ "resize-img");
const bodyParser = __webpack_require__(/*! koa-bodyparser */ "koa-bodyparser");

const router = new Router({
	prefix: '/api/v2'
});

router.get('/test', function (ctx, next) {
	ctx.body = '用户认证服务'
})

router.post('/createImageThumb', async (ctx, next) => {
	const { companyId, fileName, size } = ctx.request.body;
	//保持横纵比
	let width = 160;
	let height = 120;
	if (size.width >= width || size.height > height) {
		//图片大于基准，缩放处理
		let percentage = size.width / size.height;
		if (size.width >= size.height) {
			height = width / percentage;
		} else {
			width = percentage * height;
		}
	} else {
		//小于基准
		width = size.width;
		height = size.height;
	}

	let fileDirectory = path.join(process.cwd(), 'upload/', companyId, '/');
	const buf = await resizeImg(fs.readFileSync(fileDirectory + fileName), { width: width, height: height });
	let thumbFileName = fileDirectory + "thumb_" + fileName;
	fs.writeFileSync(thumbFileName, buf);
	return ctx.body = "上传成功！";
});
//大文件访问路由
router.get('/video/*', (ctx, next) => {
	let file = ctx.url.replace(/^\/api\/v2\/video/, '');
	let filePath = `${fileDirectory}${file}`;
	//处理返回headers等
	let resHred = readFile(ctx.headers.range, filePath);
	ctx.status = resHred.code
	ctx.set(resHred.head);
	//创建流对象
	let stream = fs.createReadStream(filePath, resHred.code == 200 ? {} : { start: resHred.start, end: resHred.end });
	stream.pipe(ctx.res);
	ctx.respond = false;
});
//单独使用koa-bodyParser中间件，不可与koa-body混用
router.post('/deletefiles', bodyParser(), async (ctx, next) => {
	const { companyId, fileNames } = ctx.request.body;
	fileNames.map((fileName) => {
		let filePath;
		let fileThumbPath;
		if (__debug) {
			//调试启动时，因deamon和data-server隶属两个文件夹，目录有所调整
			filePath = path.join(process.cwd(), '../daemon/upload/', companyId, '/', fileName);
			fileThumbPath = path.join(process.cwd(), '../daemon/upload/', companyId, '/', 'thumb_' + fileName);
		} else {
			//发布运行时，上传到同级目录
			filePath = path.join(process.cwd(), 'upload/', companyId, '/', fileName);
			fileThumbPath = path.join(process.cwd(), 'upload/', companyId, '/', 'thumb_' + fileName);
		}
		if (fs.existsSync(filePath)) {
			//先同步调用
			fs.unlinkSync(filePath);
		}
		// 有些类型没有缩略图
		if (fs.existsSync(fileThumbPath)) {
			fs.unlinkSync(fileThumbPath);
		}
	})
	return ctx.body = "文件删除成功";
	//ctx.status = 200 ctx.status直接设置响应200

});

//处理大文件断点续传
function readFile(range, filePath, chunkSize = 499999 * 2) {
	//mime类型
	const mime = {
		"css": "text/css",
		"gif": "image/gif",
		"html": "text/html",
		"ico": "image/x-icon",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"js": "text/javascript",
		"json": "application/json",
		"pdf": "application/pdf",
		"png": "image/png",
		"svg": "image/svg+xml",
		"swf": "application/x-shockwave-flash",
		"tiff": "image/tiff",
		"txt": "text/plain",
		"mp3": "audio/mp3",
		"wav": "audio/x-wav",
		"wma": "audio/x-ms-wma",
		"wmv": "video/x-ms-wmv",
		"xml": "text/xml",
		"mp4": "video/mp4"
	};
	// 获取后缀名
	let ext = path.extname(filePath);
	ext = ext ? ext.slice(1) : 'unknown';
	//未知的类型一律用"text/plain"类型
	let contentType = mime[ext.toLowerCase()];

	//建立流对象，读文件
	let stat = fs.statSync(filePath)
	let fileSize = stat.size;
	let head = {
		code: 200,
		head: {
			'Content-Length': fileSize,
			'content-type': contentType,
		}

	};
	if (range) {
		// 大文件分片
		let parts = range.replace(/bytes=/, "").split("-");
		let start = parseInt(parts[0], 10);
		let end = parts[1] ? parseInt(parts[1], 10) : start + chunkSize;
		end = end > fileSize - 1 ? fileSize - 1 : end;
		chunkSize = (end - start) + 1;
		head = {
			code: 206,
			filePath,
			start,
			end,
			head: {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'content-type': contentType,
				'Content-Length': chunkSize,
				'Accept-Ranges': 'bytes'
			}
		}

	}
	return head;
}
module.exports = router


/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

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

/***/ "image-size":
/*!*****************************!*\
  !*** external "image-size" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("image-size");

/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "koa-body":
/*!***************************!*\
  !*** external "koa-body" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-body");

/***/ }),

/***/ "koa-bodyparser":
/*!*********************************!*\
  !*** external "koa-bodyparser" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),

/***/ "koa-cors":
/*!***************************!*\
  !*** external "koa-cors" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-cors");

/***/ }),

/***/ "koa-json":
/*!***************************!*\
  !*** external "koa-json" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-json");

/***/ }),

/***/ "koa-jwt":
/*!**************************!*\
  !*** external "koa-jwt" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-jwt");

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

/***/ "resize-img":
/*!*****************************!*\
  !*** external "resize-img" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("resize-img");

/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiLi9jb25maWcuanNvblwiIiwid2VicGFjazovLy8uL2RhdGEtc2VydmVyL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9kYXRhLXNlcnZlci9iaW4vd3d3LmpzIiwid2VicGFjazovLy8uL2RhdGEtc2VydmVyL2NvbW11bmljYXRlLmpzIiwid2VicGFjazovLy8uL2RhdGEtc2VydmVyL3JvdXRlcy9maWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9kYXRhLXNlcnZlci9yb3V0ZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vZGF0YS1zZXJ2ZXIvcm91dGVzL3VzZXJzLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImRlYnVnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaW1hZ2Utc2l6ZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1ib2R5XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hLWJvZHlwYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2EtY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1qc29uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwia29hLWp3dFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1sb2dnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2Etb25lcnJvclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImtvYS1yb3V0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJrb2Etc3RhdGljXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlcXVlc3RcIiIsIndlYnBhY2s6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OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLDJDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHVDIiwiZmlsZSI6ImRhdGEtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9kYXRhLXNlcnZlci9iaW4vd3d3LmpzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9jb25maWcuanNvblwiKTsiLCJjb25zdCBLb2EgPSByZXF1aXJlKCdrb2EnKVxuY29uc3QgYXBwID0gbmV3IEtvYSgpXG5jb25zdCBqc29uID0gcmVxdWlyZSgna29hLWpzb24nKVxuY29uc3Qgb25lcnJvciA9IHJlcXVpcmUoJ2tvYS1vbmVycm9yJylcbmNvbnN0IGxvZ2dlciA9IHJlcXVpcmUoJ2tvYS1sb2dnZXInKVxuY29uc3Qgand0ID0gcmVxdWlyZSgna29hLWp3dCcpXG5jb25zdCBjb3JzID0gcmVxdWlyZSgna29hLWNvcnMnKTtcbmNvbnN0IGtvYUJvZHkgPSByZXF1aXJlKCdrb2EtYm9keScpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbi8v6Lev55Sx5paH5Lu2XG5jb25zdCBpbmRleCA9IHJlcXVpcmUoJy4vcm91dGVzL2luZGV4Jyk7XG5jb25zdCB1c2VycyA9IHJlcXVpcmUoJy4vcm91dGVzL3VzZXJzJyk7XG5jb25zdCBmaWxlcyA9IHJlcXVpcmUoJy4vcm91dGVzL2ZpbGVzJyk7XG5cbi8vIGVycm9yIGhhbmRsZXJcbm9uZXJyb3IoYXBwKVxuLy/ot6jln5/orr/pl65cbmFwcC51c2UoY29ycygpKTtcblxuYXBwLnVzZShpbmRleC5yb3V0ZXMoKSwgaW5kZXguYWxsb3dlZE1ldGhvZHMoKSk7XG5hcHAudXNlKHVzZXJzLnJvdXRlcygpLCB1c2Vycy5hbGxvd2VkTWV0aG9kcygpKTtcblxuYXBwLnVzZShrb2FCb2R5KHtcblx0bXVsdGlwYXJ0OiB0cnVlLFxuXHRmb3JtaWRhYmxlOiB7XG5cdFx0bWF4RmlsZVNpemU6IDUwMCAqIDEwMjQgKiAxMDI0ICAgIC8vIOiuvue9ruS4iuS8oOaWh+S7tuWkp+Wwj+acgOWkp+mZkOWItu+8jOm7mOiupDVNXG5cdH1cbn0pKTtcblxuYXBwLnVzZShqc29uKCkpXG5hcHAudXNlKGxvZ2dlcigpKVxuZ2xvYmFsLmZpbGVEaXJlY3Rvcnk7XG5pZiAoX19kZWJ1Zykge1xuXHQvL+iwg+ivleWQr+WKqOaXtu+8jOWboGRlYW1vbuWSjGRhdGEtc2VydmVy6Zq25bGe5Lik5Liq5paH5Lu25aS577yM55uu5b2V5pyJ5omA6LCD5pW0XG5cdGZpbGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4uL2RhZW1vbi91cGxvYWQvJyk7XG59ZWxzZXtcblx0Ly/lj5HluIPov5DooYzml7bvvIzkuIrkvKDliLDlkIznuqfnm67lvZVcblx0ZmlsZURpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAndXBsb2FkLycpO1xufVxuXG5hcHAudXNlKHJlcXVpcmUoJ2tvYS1zdGF0aWMnKShmaWxlRGlyZWN0b3J5KSlcbi8vYXBwLnVzZShyZXF1aXJlKCdrb2Etc3RhdGljJykoX19kaXJuYW1lICsgJy91cGxvYWQvJykpXG5hcHAudXNlKGZpbGVzLnJvdXRlcygpLCBmaWxlcy5hbGxvd2VkTWV0aG9kcygpKVxuLy8gZXJyb3ItaGFuZGxpbmdcbmFwcC5vbignZXJyb3InLCAoZXJyLCBjdHgpID0+IHtcblx0Y29uc29sZS5lcnJvcignc2VydmVyIGVycm9yJywgZXJyLCBjdHgpXG59KTtcbm1vZHVsZS5leHBvcnRzID0gYXBwXG4iLCIvL2RhZW1vbuWFqOWxgOmFjee9rlxuZ2xvYmFsLmRhZW1vbkNvbmZpZyA9IHJlcXVpcmUoJy4uLy4uL2RhZW1vbi9jb25maWcvZGVmYXVsdC1jb25maWcuanNvbicpO1xuLy9kZWJ1Z1xuZ2xvYmFsLl9fZGVidWcgPSBmYWxzZTtcbmlmIChwcm9jZXNzLmFyZ3ZbMl0gJiYgcHJvY2Vzcy5hcmd2WzJdID09PSBcImRlYnVnXCIpIHtcbiAgX19kZWJ1ZyA9IHRydWU7XG59XG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdkZW1vOnNlcnZlcicpO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbmNvbnN0IGNvbW11bmljYXRlID0gcmVxdWlyZSgnLi4vY29tbXVuaWNhdGUnKTtcblxuLy9kYXRhLXNlcnZlcumFjee9rlxubGV0IHN0YXJ0Q29uZmlnSnNvbiA9IHt9O1xuaWYgKF9fZGVidWcpIHtcbiAgc3RhcnRDb25maWdKc29uID0gcmVxdWlyZSgnLi4vY29uZmlnL2RlZmF1bHQtY29uZmlnLmpzb24nKTtcbn0gZWxzZSB7XG4gIGlmIChwcm9jZXNzLmFyZ3ZbMl0pIHtcbiAgICB2YXIganNvblN0ciA9IG5ldyBCdWZmZXIuZnJvbShwcm9jZXNzLmFyZ3ZbMl0sICdiYXNlNjQnKS50b1N0cmluZygpO1xuICAgIHRyeXtcbiAgICAgIHN0YXJ0Q29uZmlnSnNvbiA9IEpTT04ucGFyc2UoanNvblN0cik7XG4gICAgfWNhdGNoKGUpe1xuICAgICAgY29uc29sZS5sb2coXCLplJnor6/nmoTphY3nva7lj4LmlbBcIik7XG4gICAgICBzdGFydENvbmZpZ0pzb24gPSB7XG4gICAgICAgIFwibmFtZVwiOiBcImRhdGEtc2VydmVyXCJcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH0gZWxzZSB7XG4gICAgc3RhcnRDb25maWdKc29uID0ge1xuICAgICAgXCJuYW1lXCI6IFwiZGF0YS1zZXJ2ZXJcIlxuICAgIH1cbiAgfVxufVxuXG52YXIgc3RhcnQgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvL+WIneWni+err+WPo1xuICAgIGxldCBzdGFydFBvcnQgPSBhd2FpdCBjb21tdW5pY2F0ZS5nZXRQb3J0KCk7XG4gICAgLy/lkK/liqhcbiAgICBpZihzdGFydFBvcnQgJiYgc3RhcnRQb3J0LnBvcnQpe1xuICAgICAgICBjaGtQb3J0QW5kU3RhcnQoc3RhcnRQb3J0LnBvcnQsIDEpO1xuICAgIH1lbHNle1xuICAgICAgY29uc29sZS5sb2coYFtEQVRBLVNFUlZFUl0g5pyq5om+5Yiw5Li75pyN5Yqh55qE6ZO+5o6l56uv5Y+jLDXnp5LlkI7ph43or5VgKTtcbiAgICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgc3RhcnQoKTtcbiAgICAgIH0sNTAwMCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdICR7ZXJyb3J9YCk7XG4gIH1cbn1cbnN0YXJ0KCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIOajgOa1i+WPr+eUqOerr+WPo++8jOW5tuWQr+WKqHNlcnZlclxuICogQHBhcmFtIHtudW1iZXJ9IHBvcnQg56uv5Y+jXG4gKiBAcGFyYW0ge251bWJlcn0gY3VyQ2hrVGltZSDlvZPliY3mo4DmtYvmrKHmlbAg5pyA5aSn5qOA5rWL5qyh5pWw5pivNTAwXG4gKi9cbmxldCBjaGtQb3J0QW5kU3RhcnQgPSBhc3luYyAocG9ydCwgY3VyQ2hrVGltZSkgPT4ge1xuICAvL+acgOWkp+err+WPo+ajgOa1i+asoeaVsFxuICBjb25zdCBNQVhfQ0hLX1RJTUVTID0gNTAwO1xuICBsZXQgc2VydmVyID0gYXdhaXQgaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwLmNhbGxiYWNrKCkpO1xuICBzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgW0RBVEEtU0VSVkVSXSDmnI3liqHlmajlkK/liqg6JHtwb3J0fWApO1xuICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdIOWQjeensDoke3N0YXJ0Q29uZmlnSnNvbi5uYW1lfWApO1xuICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdIOacjeWKoei/m+eoi2lkOiR7cHJvY2Vzcy5waWR9YCk7XG4gIH0pO1xuICAvL+WkhOeQhumUmeivr1xuICBzZXJ2ZXIub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuICAgIGlmIChlcnJvci5zeXNjYWxsICE9PSAnbGlzdGVuJykge1xuICAgICAgY29uc29sZS5sb2coYFtEQVRBLVNFUlZFUl0gZXJyb3IuY29kZToke2Vycm9yLnN5c2NhbGx9YCk7XG4gICAgfVxuXG4gICAgbGV0IGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZydcbiAgICAgID8gJ1BpcGUgJyArIHBvcnRcbiAgICAgIDogJ1BvcnQgJyArIHBvcnQ7XG5cbiAgICAvL+WkhOeQhueJueauiueahOmUmeivr+S6i+S7tuebkeWQrFxuICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgICAgY29uc29sZS5sb2coYFtEQVRBLVNFUlZFUl0gcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlc2ApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0VBRERSSU5VU0UnOiAvL+err+WPo+WNoOeUqOmUmeivr++8jOWwseS4gOebtOmAkuW9kuWIsOayoeacieWNoOeUqOeahOaOpeWPo1xuICAgICAgICBpZiAoY3VyQ2hrVGltZSA8PSBNQVhfQ0hLX1RJTUVTKSB7XG4gICAgICAgICAgY2hrUG9ydEFuZFN0YXJ0KHBvcnQgKyAxLCBjdXJDaGtUaW1lICsgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdIOerr+WPo++8miR7cG9ydH3ooqvljaDnlKjvvIzlubbkuJTnq6/lj6Pmo4DmtYvlt7LliLDmnIDlpKfmrKHmlbBgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZyhgW0RBVEEtU0VSVkVSXSBlcnJvci5jb2RlOiR7ZXJyb3Iuc3lzY2FsbH1gKTtcbiAgICB9XG4gIH0pO1xuICBzZXJ2ZXIub24oJ2xpc3RlbmluZycsIGFzeW5jICgpID0+IHtcbiAgICBsZXQgYWRkciA9IHNlcnZlci5hZGRyZXNzKCk7XG4gICAgbGV0IGJpbmQgPSB0eXBlb2YgYWRkciA9PT0gJ3N0cmluZydcbiAgICAgID8gJ3BpcGUgJyArIGFkZHJcbiAgICAgIDogJ3BvcnQgJyArIGFkZHIucG9ydDtcbiAgICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKTtcbiAgICAvL+WQkWRhZW1vbuaKpeWRiuW9k+WJjeS9v+eUqOerr+WPo1xuICAgIGF3YWl0IGNvbW11bmljYXRlLnJlcG9ydChwb3J0KTtcbiAgfSk7XG59XG4iLCIvKipcclxuICog5LiOZGFlbW9u6YCa6K6v55qEYXBpXHJcbiAqL1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuY2xhc3MgQ29tbXVuaWNhdGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pcCA9ICcxMjcuMC4wLjEnO1xyXG4gICAgICAgIHRoaXMucG9ydCA9IGRhZW1vbkNvbmZpZy5wb3J0O1xyXG4gICAgICAgIC8v6K+35rGC6Lev5b6E5YmN57yAXHJcbiAgICAgICAgdGhpcy5wcmVmaXggPSAnL3NlcnZpY2UnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RHZXQodXJsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJlcXVlc3QuZ2V0KHsgdXJsLCBqc29uOiB0cnVlIH0sIChlcnIsIHJlc3BvbmNlLCBib2R5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25jZSAmJiByZXNwb25jZS5zdGF0dXNDb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJvZHkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhib2R5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RQb3N0KHVybCwgcGFyYW0sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmVxdWVzdC5wb3N0KHsgdXJsLCBqc29uOiB0cnVlLCBib2R5OiBwYXJhbSB9LCAoZXJyLCByZXNwb25jZSwgYm9keSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSBjYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uY2UgJiYgcmVzcG9uY2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBib2R5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soYm9keSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5pyN5Yqh6KaB5L2/55So55qE5Yid5aeL56uv5Y+jXHJcbiAgICAgKi9cclxuICAgIGdldFBvcnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGBodHRwOi8vJHt0aGlzLmlwfToke3RoaXMucG9ydH0ke3RoaXMucHJlZml4fS9kYXRhYDtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UG9zdCh1cmwsIHsgXCJ0eXBlXCI6IFwiZ2V0UG9ydFwiLCBcInNlcnZlclR5cGVcIjogXCJkYXRhU2VydmVyXCIgfSwgKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdICR7ZXJyfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55m75b2V5oiQ5Yqf5ZCRZGFlbW9u5oql5ZGK5pyN5Yqh5L2/55So55qE56uv5Y+jXHJcbiAgICAgKiBAcGFyYW0geyp9IGN1clVzZVBvcnQg5b2T5YmN5L2/55So55qE56uv5Y+jXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlcG9ydChjdXJVc2VQb3J0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGBodHRwOi8vJHt0aGlzLmlwfToke3RoaXMucG9ydH0ke3RoaXMucHJlZml4fS9kYXRhYDtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UG9zdCh1cmwsIHsgXCJ0eXBlXCI6IFwicmVwb3J0XCIsIGN1clVzZVBvcnQsIFwic2VydmVyVHlwZVwiOiBcImRhdGFTZXJ2ZXJcIiwgXCJzZXJ2ZXJOYW1lXCI6IFwi5paH5Lu25pyN5YqhXCIgfSwgKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbREFUQS1TRVJWRVJdICR7ZXJyfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG4vL+WNleS+i+aooeW8j1xyXG5sZXQgY29tbXVuaWNhdGUgPSBudWxsO1xyXG5pZiAoY29tbXVuaWNhdGUgPT09IG51bGwpIHtcclxuICAgIGNvbW11bmljYXRlID0gbmV3IENvbW11bmljYXRlKCk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBjb21tdW5pY2F0ZTsiLCJjb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBSb3V0ZXIgPSByZXF1aXJlKCdrb2Etcm91dGVyJyk7XG5jb25zdCBzaXplT2YgPSByZXF1aXJlKCdpbWFnZS1zaXplJyk7XG5jb25zdCByZXNpemVJbWcgPSByZXF1aXJlKCdyZXNpemUtaW1nJyk7XG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcblx0cHJlZml4OiAnL2FwaS92Midcbn0pO1xuXG4vL+WIm+W7uue8qeeVpeWbvlxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlSW1hZ2VUaHVtYihmaWxlRGF0YSxmaWxlUGF0aCl7XHRcblx0Ly/nvKnnlaXlm77mlK/mjIHnsbvliKtcblx0Y29uc3QgZm9ybWF0cyA9IFtcIi5CTVBcIixcIi5DVVJcIixcIi5HSUZcIixcIi5JQ05TXCIsXCIuSUNPXCIsXCIuSlBHXCIsXCIuSlBFR1wiLFwiLktUWFwiLFwiLlBOR1wiLFwiLlBOTVwiLFwiLlBBTVwiLFwiLlBCTVwiLFwiLlBGTVwiLFwiLlBHTVwiLFwiLlBQTVwiLFwiLlBTRFwiLFwiLlNWR1wiLFwiLlRJRkZcIixcIi5XZWJQXCJdO1xuXHRjb25zdCBmaWxlSW5mbyA9IHBhdGgucGFyc2UoZmlsZVBhdGgpO1xuXHRjb25zdCBmaWxlU3VmZml4ID0gXHRmaWxlSW5mby5leHQudG9VcHBlckNhc2UoKTtcblx0bGV0IGlzU3VwcG9ydCA9IGZvcm1hdHMuc29tZSgobmFtZSkgPT4ge1xuXHRcdHJldHVybiBuYW1lID09IGZpbGVTdWZmaXg7XG5cdH0pO1xuXHRpZiAoaXNTdXBwb3J0KSB7XG5cdFx0bGV0IGRpbWVuc2lvbnMgPSBzaXplT2YoZmlsZURhdGEpO1xuXHRcdGNvbnNvbGUubG9nKGRpbWVuc2lvbnMpO1xuXHRcdHN3aXRjaCAoZmlsZVN1ZmZpeCkge1xuXHRcdFx0Y2FzZSBcIi5HSUZcIjpcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIuU1ZHXCI6XG5cdFx0XHRcdGJyZWFrO1x0XHRcdFxuXHRcdFx0ZGVmYXVsdDovL+WFtuS7luWbvueJh+exu+Wei1xuXHRcdFx0XHQvL+S/neaMgeaoque6teavlFxuXHRcdFx0XHRsZXQgd2lkdGggPSAxNjA7XG5cdFx0XHRcdGxldCBoZWlnaHQgPSAxMjA7XG5cdFx0XHRcdGlmIChkaW1lbnNpb25zLndpZHRoID49IHdpZHRoIHx8IGRpbWVuc2lvbnMuaGVpZ2h0ID4gaGVpZ2h0KSB7XG5cdFx0XHRcdFx0Ly/lm77niYflpKfkuo7ln7rlh4bvvIznvKnmlL7lpITnkIZcblx0XHRcdFx0XHRsZXQgcGVyY2VudGFnZSA9IGRpbWVuc2lvbnMud2lkdGggLyBkaW1lbnNpb25zLmhlaWdodDtcblx0XHRcdFx0XHRpZiAoZGltZW5zaW9ucy53aWR0aCA+PSBkaW1lbnNpb25zLmhlaWdodCkge1x0XHRcblx0XHRcdFx0XHRcdGhlaWdodCA9IHdpZHRoIC8gcGVyY2VudGFnZTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHdpZHRoID0gcGVyY2VudGFnZSAqIGhlaWdodDtcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0Ly/lsI/kuo7ln7rlh4Zcblx0XHRcdFx0XHR3aWR0aCA9IGRpbWVuc2lvbnMud2lkdGg7XG5cdFx0XHRcdFx0aGVpZ2h0ID0gZGltZW5zaW9ucy5oZWlnaHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly/nvKnmlL7lm77niYfvvIzmi7zmjqXnm67lvZXvvIzkuLrnvKnnlaXlm77lgZrlh4blpIdcblx0XHRcdFx0Y29uc3QgYnVmID0gYXdhaXQgcmVzaXplSW1nKGZpbGVEYXRhLCB7d2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH0pO1x0XG5cdFx0XHRcdGxldCB0aHVtYkZpbGVOYW1lID0gZmlsZUluZm8uZGlyICsgcGF0aC5zZXAgKyBcInRodW1iX1wiICsgZmlsZUluZm8uYmFzZTtcblx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYyh0aHVtYkZpbGVOYW1lLCBidWYpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cbi8v55Sf5oiQ5paH5Lu2XG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUZpbGUoZmlsZVRlbXBQYXRoLGZpbGVQYXRoKXtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRsZXQgcmVhZGVyID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlVGVtcFBhdGgpO1xuXHRcdGxldCB1cFN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVQYXRoKTtcblx0XHR1cFN0cmVhbS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0cmVqZWN0KCk7XG5cdFx0fSk7XG5cdFx0dXBTdHJlYW0ub24oJ2Nsb3NlJywgKCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHRcdGxldCByZWFkRGF0YSA9IFtdO1xuXHRcdHJlYWRlci5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG5cdFx0XHRyZWFkRGF0YS5wdXNoKGNodW5rKTtcblx0XHR9KTtcblx0XHRyZWFkZXIub24oJ2VuZCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZmlsZERhdGEgPSBCdWZmZXIuY29uY2F0KHJlYWREYXRhKTtcblx0XHRcdGF3YWl0IGNyZWF0ZUltYWdlVGh1bWIoZmlsZERhdGEsZmlsZVBhdGgpXG5cdFx0XHR1cFN0cmVhbS53cml0ZShmaWxkRGF0YSk7XG5cdFx0XHR1cFN0cmVhbS5lbmQoKTtcblx0XHR9KTtcblx0fSk7XG59XG5cbnJvdXRlci5wb3N0KCcvdXBsb2FkZmlsZXMnLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG5cdGxldCBjb21wYW55SWQgPSBjdHgucmVxdWVzdC5ib2R5LmNvbXBhbnlJZDtcdFxuXHRsZXQgdXBsb2FkRmlsZUxpc3QgPSBKU09OLnBhcnNlKGN0eC5yZXF1ZXN0LmJvZHkudXBsb2FkRmlsZUxpc3QpO1xuXHRsZXQgZmlsZURpcmVjdG9yeTtcblx0aWYgKF9fZGVidWcpIHtcblx0XHQvL+iwg+ivleWQr+WKqOaXtu+8jOWboGRlYW1vbuWSjGRhdGEtc2VydmVy6Zq25bGe5Lik5Liq5paH5Lu25aS577yM55uu5b2V5pyJ5omA6LCD5pW0XG5cdFx0ZmlsZURpcmVjdG9yeSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi4vZGFlbW9uL3VwbG9hZC8nLCBjb21wYW55SWQpO1xuXHR9ZWxzZXtcblx0XHQvL+WPkeW4g+i/kOihjOaXtu+8jOS4iuS8oOWIsOWQjOe6p+ebruW9lVxuXHRcdGZpbGVEaXJlY3RvcnkgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3VwbG9hZC8nLCBjb21wYW55SWQpO1xuXHR9XG5cdGlmICghZnMuZXhpc3RzU3luYyhmaWxlRGlyZWN0b3J5KSkge1xuXHRcdC8v55uu5b2V5LiN5a2Y5Zyo5Yib5bu677yM6YCS5b2S5Yib5bu677yMbm9kZWpzIDEw54mI5pys5Lul5ZCOIOaUr+aMgemAkuW9klxuXHRcdGZzLm1rZGlyU3luYyhmaWxlRGlyZWN0b3J5LCB7XG5cdFx0XHRyZWN1cnNpdmU6IHRydWVcblx0XHR9KTtcblx0fVxuXHRmb3IgKGxldCBrZXkgaW4gY3R4LnJlcXVlc3QuZmlsZXMpIHtcblx0XHRjb25zdCBmaWxlID0gY3R4LnJlcXVlc3QuZmlsZXNba2V5XTtcblx0XHRpZiAodHlwZW9mIGZpbGUgPT0gXCJvYmplY3RcIiAmJiBmaWxlLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgdGVtcEZpbGUgPSBmaWxlW2ldO1xuXHRcdFx0XHRsZXQgdXBGaWxlID0gdXBsb2FkRmlsZUxpc3QuZmluZCh1cEZpbGUgPT4gdXBGaWxlLmZpbGUudG9Mb3dlckNhc2UoKSA9PSB0ZW1wRmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgXHRpZiAodXBGaWxlKSB7XG5cdFx0XHRcdFx0bGV0IGZpbGVOYW1lID0gdXBGaWxlLmlzUmVuYW1lID8gdXBGaWxlLnJlTmFtZUZpbGUgOiB1cEZpbGUuZmlsZTtcblx0XHRcdFx0XHRsZXQgZmlsZVBhdGggPSBmaWxlRGlyZWN0b3J5ICsgYC8ke2ZpbGVOYW1lfWA7XG5cdFx0XHRcdFx0YXdhaXQgZ2VuZXJhdGVGaWxlKHRlbXBGaWxlLnBhdGgsZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCB1cEZpbGUgPSB1cGxvYWRGaWxlTGlzdC5maW5kKHVwRmlsZSA9PiB1cEZpbGUuZmlsZS50b0xvd2VyQ2FzZSgpID09IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIGlmICh1cEZpbGUpIHtcblx0XHRcdFx0Ly/ph43lkb3lkI3liKTmlq1cblx0XHRcdFx0bGV0IGZpbGVOYW1lID0gdXBGaWxlLmlzUmVuYW1lID8gdXBGaWxlLnJlTmFtZUZpbGUgOiB1cEZpbGUuZmlsZTtcblx0XHRcdFx0bGV0IGZpbGVQYXRoID0gZmlsZURpcmVjdG9yeSArIGAvJHtmaWxlTmFtZX1gO1xuXHRcdFx0XHRhd2FpdCBnZW5lcmF0ZUZpbGUoZmlsZS5wYXRoLGZpbGVQYXRoKTtcblx0XHRcdH1cdFx0XHRcblx0XHR9XG5cdH1cblx0cmV0dXJuIGN0eC5ib2R5ID0gXCLkuIrkvKDmiJDlip/vvIFcIjtcbn0pO1xuLy/kuI3lj6/lop7liqDmlrnms5XvvIzkuI3og73op6blj5HvvIjljp/lm6DmnKrnn6XvvIlcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyIiwiY29uc3QgUm91dGVyID0gcmVxdWlyZSgna29hLXJvdXRlcicpO1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcbiAgcHJlZml4OiAnL2FwaS92MSdcbn0pXG5cbnJvdXRlci5nZXQoJy9pc0Nvbm5lY3RlZCcsIChjdHgsIG5leHQpID0+IHtcbiAgY29uc29sZS5sb2coXCIuLi4uLi4uLi4uLi4uXCIpXG4gIHJldHVybiBjdHguYm9keSA9IHRydWU7XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlclxuIiwiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgUm91dGVyID0gcmVxdWlyZSgna29hLXJvdXRlcicpO1xuY29uc3QgcmVzaXplSW1nID0gcmVxdWlyZSgncmVzaXplLWltZycpO1xuY29uc3QgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2tvYS1ib2R5cGFyc2VyJyk7XG5cbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuXHRwcmVmaXg6ICcvYXBpL3YyJ1xufSk7XG5cbnJvdXRlci5nZXQoJy90ZXN0JywgZnVuY3Rpb24gKGN0eCwgbmV4dCkge1xuXHRjdHguYm9keSA9ICfnlKjmiLforqTor4HmnI3liqEnXG59KVxuXG5yb3V0ZXIucG9zdCgnL2NyZWF0ZUltYWdlVGh1bWInLCBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG5cdGNvbnN0IHsgY29tcGFueUlkLCBmaWxlTmFtZSwgc2l6ZSB9ID0gY3R4LnJlcXVlc3QuYm9keTtcblx0Ly/kv53mjIHmqKrnurXmr5Rcblx0bGV0IHdpZHRoID0gMTYwO1xuXHRsZXQgaGVpZ2h0ID0gMTIwO1xuXHRpZiAoc2l6ZS53aWR0aCA+PSB3aWR0aCB8fCBzaXplLmhlaWdodCA+IGhlaWdodCkge1xuXHRcdC8v5Zu+54mH5aSn5LqO5Z+65YeG77yM57yp5pS+5aSE55CGXG5cdFx0bGV0IHBlcmNlbnRhZ2UgPSBzaXplLndpZHRoIC8gc2l6ZS5oZWlnaHQ7XG5cdFx0aWYgKHNpemUud2lkdGggPj0gc2l6ZS5oZWlnaHQpIHtcblx0XHRcdGhlaWdodCA9IHdpZHRoIC8gcGVyY2VudGFnZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2lkdGggPSBwZXJjZW50YWdlICogaGVpZ2h0O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvL+Wwj+S6juWfuuWHhlxuXHRcdHdpZHRoID0gc2l6ZS53aWR0aDtcblx0XHRoZWlnaHQgPSBzaXplLmhlaWdodDtcblx0fVxuXG5cdGxldCBmaWxlRGlyZWN0b3J5ID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd1cGxvYWQvJywgY29tcGFueUlkLCAnLycpO1xuXHRjb25zdCBidWYgPSBhd2FpdCByZXNpemVJbWcoZnMucmVhZEZpbGVTeW5jKGZpbGVEaXJlY3RvcnkgKyBmaWxlTmFtZSksIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9KTtcblx0bGV0IHRodW1iRmlsZU5hbWUgPSBmaWxlRGlyZWN0b3J5ICsgXCJ0aHVtYl9cIiArIGZpbGVOYW1lO1xuXHRmcy53cml0ZUZpbGVTeW5jKHRodW1iRmlsZU5hbWUsIGJ1Zik7XG5cdHJldHVybiBjdHguYm9keSA9IFwi5LiK5Lyg5oiQ5Yqf77yBXCI7XG59KTtcbi8v5aSn5paH5Lu26K6/6Zeu6Lev55SxXG5yb3V0ZXIuZ2V0KCcvdmlkZW8vKicsIChjdHgsIG5leHQpID0+IHtcblx0bGV0IGZpbGUgPSBjdHgudXJsLnJlcGxhY2UoL15cXC9hcGlcXC92MlxcL3ZpZGVvLywgJycpO1xuXHRsZXQgZmlsZVBhdGggPSBgJHtmaWxlRGlyZWN0b3J5fSR7ZmlsZX1gO1xuXHQvL+WkhOeQhui/lOWbnmhlYWRlcnPnrYlcblx0bGV0IHJlc0hyZWQgPSByZWFkRmlsZShjdHguaGVhZGVycy5yYW5nZSwgZmlsZVBhdGgpO1xuXHRjdHguc3RhdHVzID0gcmVzSHJlZC5jb2RlXG5cdGN0eC5zZXQocmVzSHJlZC5oZWFkKTtcblx0Ly/liJvlu7rmtYHlr7nosaFcblx0bGV0IHN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZVBhdGgsIHJlc0hyZWQuY29kZSA9PSAyMDAgPyB7fSA6IHsgc3RhcnQ6IHJlc0hyZWQuc3RhcnQsIGVuZDogcmVzSHJlZC5lbmQgfSk7XG5cdHN0cmVhbS5waXBlKGN0eC5yZXMpO1xuXHRjdHgucmVzcG9uZCA9IGZhbHNlO1xufSk7XG4vL+WNleeLrOS9v+eUqGtvYS1ib2R5UGFyc2Vy5Lit6Ze05Lu277yM5LiN5Y+v5LiOa29hLWJvZHnmt7fnlKhcbnJvdXRlci5wb3N0KCcvZGVsZXRlZmlsZXMnLCBib2R5UGFyc2VyKCksIGFzeW5jIChjdHgsIG5leHQpID0+IHtcblx0Y29uc3QgeyBjb21wYW55SWQsIGZpbGVOYW1lcyB9ID0gY3R4LnJlcXVlc3QuYm9keTtcblx0ZmlsZU5hbWVzLm1hcCgoZmlsZU5hbWUpID0+IHtcblx0XHRsZXQgZmlsZVBhdGg7XG5cdFx0bGV0IGZpbGVUaHVtYlBhdGg7XG5cdFx0aWYgKF9fZGVidWcpIHtcblx0XHRcdC8v6LCD6K+V5ZCv5Yqo5pe277yM5ZugZGVhbW9u5ZKMZGF0YS1zZXJ2ZXLpmrblsZ7kuKTkuKrmlofku7blpLnvvIznm67lvZXmnInmiYDosIPmlbRcblx0XHRcdGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuLi9kYWVtb24vdXBsb2FkLycsIGNvbXBhbnlJZCwgJy8nLCBmaWxlTmFtZSk7XG5cdFx0XHRmaWxlVGh1bWJQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuLi9kYWVtb24vdXBsb2FkLycsIGNvbXBhbnlJZCwgJy8nLCAndGh1bWJfJyArIGZpbGVOYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly/lj5HluIPov5DooYzml7bvvIzkuIrkvKDliLDlkIznuqfnm67lvZVcblx0XHRcdGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICd1cGxvYWQvJywgY29tcGFueUlkLCAnLycsIGZpbGVOYW1lKTtcblx0XHRcdGZpbGVUaHVtYlBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3VwbG9hZC8nLCBjb21wYW55SWQsICcvJywgJ3RodW1iXycgKyBmaWxlTmFtZSk7XG5cdFx0fVxuXHRcdGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuXHRcdFx0Ly/lhYjlkIzmraXosIPnlKhcblx0XHRcdGZzLnVubGlua1N5bmMoZmlsZVBhdGgpO1xuXHRcdH1cblx0XHQvLyDmnInkupvnsbvlnovmsqHmnInnvKnnlaXlm75cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhmaWxlVGh1bWJQYXRoKSkge1xuXHRcdFx0ZnMudW5saW5rU3luYyhmaWxlVGh1bWJQYXRoKTtcblx0XHR9XG5cdH0pXG5cdHJldHVybiBjdHguYm9keSA9IFwi5paH5Lu25Yig6Zmk5oiQ5YqfXCI7XG5cdC8vY3R4LnN0YXR1cyA9IDIwMCBjdHguc3RhdHVz55u05o6l6K6+572u5ZON5bqUMjAwXG5cbn0pO1xuXG4vL+WkhOeQhuWkp+aWh+S7tuaWreeCuee7reS8oFxuZnVuY3Rpb24gcmVhZEZpbGUocmFuZ2UsIGZpbGVQYXRoLCBjaHVua1NpemUgPSA0OTk5OTkgKiAyKSB7XG5cdC8vbWltZeexu+Wei1xuXHRjb25zdCBtaW1lID0ge1xuXHRcdFwiY3NzXCI6IFwidGV4dC9jc3NcIixcblx0XHRcImdpZlwiOiBcImltYWdlL2dpZlwiLFxuXHRcdFwiaHRtbFwiOiBcInRleHQvaHRtbFwiLFxuXHRcdFwiaWNvXCI6IFwiaW1hZ2UveC1pY29uXCIsXG5cdFx0XCJqcGVnXCI6IFwiaW1hZ2UvanBlZ1wiLFxuXHRcdFwianBnXCI6IFwiaW1hZ2UvanBlZ1wiLFxuXHRcdFwianNcIjogXCJ0ZXh0L2phdmFzY3JpcHRcIixcblx0XHRcImpzb25cIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG5cdFx0XCJwZGZcIjogXCJhcHBsaWNhdGlvbi9wZGZcIixcblx0XHRcInBuZ1wiOiBcImltYWdlL3BuZ1wiLFxuXHRcdFwic3ZnXCI6IFwiaW1hZ2Uvc3ZnK3htbFwiLFxuXHRcdFwic3dmXCI6IFwiYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2hcIixcblx0XHRcInRpZmZcIjogXCJpbWFnZS90aWZmXCIsXG5cdFx0XCJ0eHRcIjogXCJ0ZXh0L3BsYWluXCIsXG5cdFx0XCJtcDNcIjogXCJhdWRpby9tcDNcIixcblx0XHRcIndhdlwiOiBcImF1ZGlvL3gtd2F2XCIsXG5cdFx0XCJ3bWFcIjogXCJhdWRpby94LW1zLXdtYVwiLFxuXHRcdFwid212XCI6IFwidmlkZW8veC1tcy13bXZcIixcblx0XHRcInhtbFwiOiBcInRleHQveG1sXCIsXG5cdFx0XCJtcDRcIjogXCJ2aWRlby9tcDRcIlxuXHR9O1xuXHQvLyDojrflj5blkI7nvIDlkI1cblx0bGV0IGV4dCA9IHBhdGguZXh0bmFtZShmaWxlUGF0aCk7XG5cdGV4dCA9IGV4dCA/IGV4dC5zbGljZSgxKSA6ICd1bmtub3duJztcblx0Ly/mnKrnn6XnmoTnsbvlnovkuIDlvovnlKhcInRleHQvcGxhaW5cIuexu+Wei1xuXHRsZXQgY29udGVudFR5cGUgPSBtaW1lW2V4dC50b0xvd2VyQ2FzZSgpXTtcblxuXHQvL+W7uueri+a1geWvueixoe+8jOivu+aWh+S7tlxuXHRsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKGZpbGVQYXRoKVxuXHRsZXQgZmlsZVNpemUgPSBzdGF0LnNpemU7XG5cdGxldCBoZWFkID0ge1xuXHRcdGNvZGU6IDIwMCxcblx0XHRoZWFkOiB7XG5cdFx0XHQnQ29udGVudC1MZW5ndGgnOiBmaWxlU2l6ZSxcblx0XHRcdCdjb250ZW50LXR5cGUnOiBjb250ZW50VHlwZSxcblx0XHR9XG5cblx0fTtcblx0aWYgKHJhbmdlKSB7XG5cdFx0Ly8g5aSn5paH5Lu25YiG54mHXG5cdFx0bGV0IHBhcnRzID0gcmFuZ2UucmVwbGFjZSgvYnl0ZXM9LywgXCJcIikuc3BsaXQoXCItXCIpO1xuXHRcdGxldCBzdGFydCA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG5cdFx0bGV0IGVuZCA9IHBhcnRzWzFdID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSA6IHN0YXJ0ICsgY2h1bmtTaXplO1xuXHRcdGVuZCA9IGVuZCA+IGZpbGVTaXplIC0gMSA/IGZpbGVTaXplIC0gMSA6IGVuZDtcblx0XHRjaHVua1NpemUgPSAoZW5kIC0gc3RhcnQpICsgMTtcblx0XHRoZWFkID0ge1xuXHRcdFx0Y29kZTogMjA2LFxuXHRcdFx0ZmlsZVBhdGgsXG5cdFx0XHRzdGFydCxcblx0XHRcdGVuZCxcblx0XHRcdGhlYWQ6IHtcblx0XHRcdFx0J0NvbnRlbnQtUmFuZ2UnOiBgYnl0ZXMgJHtzdGFydH0tJHtlbmR9LyR7ZmlsZVNpemV9YCxcblx0XHRcdFx0J2NvbnRlbnQtdHlwZSc6IGNvbnRlbnRUeXBlLFxuXHRcdFx0XHQnQ29udGVudC1MZW5ndGgnOiBjaHVua1NpemUsXG5cdFx0XHRcdCdBY2NlcHQtUmFuZ2VzJzogJ2J5dGVzJ1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cdHJldHVybiBoZWFkO1xufVxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRlYnVnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW1hZ2Utc2l6ZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2FcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLWJvZHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLWJvZHlwYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLWNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLWpzb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLWp3dFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJrb2EtbG9nZ2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtvYS1vbmVycm9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImtvYS1yb3V0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwia29hLXN0YXRpY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlcXVlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVzaXplLWltZ1wiKTsiXSwic291cmNlUm9vdCI6IiJ9