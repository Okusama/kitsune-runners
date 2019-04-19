const escapeHtml = (string, ...options) => {

    let map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#039;'
    };

    if(options.length > 0) {
        for(let option of options){
            switch (option){
                case "NO_AMPERSAND": map["&"] = "&"; break;
                case "NO_LESS_THAN": map["<"] = "<"; break;
                case "NO_GREATER_THAN": map[">"] = ">"; break;
                case "NO_QUOTES": map["'"] = "'"; break;
                case "NO_DBL_QUOTES": map['"'] = '"'; break;
                default: break;
            }
        }
    }

    return string.replace(/[&<>"']/g, m => map[m]);

};
escapeHtml("lalalal", ["NO_AMPERSAND", "NO_LESS_THAN"])
exports.escapeHtml = escapeHtml;