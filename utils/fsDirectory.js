/*
 * ===============================
 * 创建文件路径
 * @DATE 2018-5-29 15:41
 * @AUTHOR daiyunzhou
 * linux 下 "/"不需要转义 如："./logs/error/info"
 * windows 下的 "\" 需要转义为"\\" 如："asdfa\\asdf\\asfs\\"
 * 使用方法：
 *     mkdirsSync(path.join(__dirname, '../logs/localLogger/info'));
 *     mkdirsSync(路径);
 * ===============================
 */
const fs = require("fs");
const path = require("path");

let mkdirsSync = (dirpath) => {
    try {
        if (!fs.existsSync(dirpath)) {
            let pathtmp = "/";
            // /sdf/sdf/sdf\\sdf\\sdf".split(/[/\\]/)
            dirpath.split(/[/\\]/).forEach(function (dirname) {
                pathtmp = path.join(pathtmp, dirname);
                if(!fs.existsSync(pathtmp)){
                    fs.mkdirSync(pathtmp)
                }
            });
        }
        return true;
    } catch (e) {
        console.warn("create director fail! path=" + dirpath + " errorMsg:" + e);
        return false;
    }
}
module.exports = mkdirsSync;