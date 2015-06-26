module.exports = function () {

	var conf = {
		APP_FOLDER : process.env.folder ||  "www5",
		API_JS_FILE : (process.env.folder ||  "www5" ) + "/static/script/main.js",
		API_HOST : process.env.api_host || "api.yeahmobi.com"
	}
    return conf
}
