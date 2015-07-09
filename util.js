module.exports = function () {
    var _glob = require('glob');
    var _fs = require('fs');
    var FILE_ENCODING = 'utf-8';
    var conf = require('./conf')()
    var exists = _fs.exists || require('path').exists;
    // ---
    // $1 = include start
    // $2 = file name
    // $3 = props
    // $4 = content
    // $5 = end include
    //
    var _reInc = /(^\s*<!--\s*\#include\s*file=["']([^"']+)["']\s*(.+)?\s*-->\s*$)/gm;
    var _reInc_virtual = /(^\s*<!--\s*\#include\s*virtual=["']([^"']+)["']\s*(.+)?\s*-->\s*$)/gm;
    var _reAPIHOST = /app_api_host\s*=\s["']([^"']+)["']/m;
    // $1 = prop name
    // $2 = value
    var _reProp = /([-_\w]+)\s*=\s*["']([^"']+)["']/g;

    // mustache-like syntax
    var _reStache = /\{\{([-_\w]+)\}\}/g;
    function errorHandler(errorName,res){
        switch(errorName){
            case "notFound":
                res.send("notFound")
                break;
        }
    }
    function glob(filename,callback){
        exists(filename,function(exist){
            if (!exist) return  callback && callback("notFound")
            _glob(filename, function(err, files){
                if (err) throw err;
                files.forEach(function(filePath){
                    _fs.readFile(filePath, FILE_ENCODING, function(err, data){
                        if (err) throw err;
                        if(filename.match(/main.js/ig)){
                            _fs.writeFileSync(filename,replaceAPIHOST(data));
                        }else{
                            callback && callback(err,renderData(data))
                        }
                    });
                });

            });
        })

    }

    function replaceAPIHOST(data){
        var _data= ""
        data = data.replace(_reAPIHOST, function(match, includeStart, fileName){
            return "app_api_host = '" + conf.API_HOST + "'"
        });
        return data;
    }
    function replaceProcess (data,regexp){
        var _data= ""
        data = data.replace(regexp, function(match, includeStart, fileName){
            _data = _fs.readFileSync(conf.APP_FOLDER + "/" + fileName, FILE_ENCODING);
            return _data
        });
        return data;
    }

    function replaceInclude(data){
        var _data = ""

        if(data.match(_reInc)){
            _data = replaceProcess(data,_reInc);
        }
        if(data.match(_reInc_virtual)){
            _data = replaceProcess(data,_reInc_virtual);
        }

        return _data
    }

    function renderData(data){
        var _data = ""
        _data = replaceInclude(data)
        if(_data.match(_reInc) || _data.match(_reInc_virtual)){
            _data = replaceInclude(_data)
        }
        return _data;
    }


    return {glob:glob,errorHandler:errorHandler}
}


