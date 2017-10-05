let _ = require("lodash");
let path = require("path");
let resolveFrom = require("resolve-from");
let callerPath = require("caller-path");

export default class RequireClean{

    deleteMod = function (mod) {
        return delete require.cache[mod.id];
    };

    constructor(name, deep = null) {
        var cp;
        if (deep == null) {
            deep = true;
        }
        if (!_.isString(name)) {
            throw new TypeError("requireClean expects a moduleId String");
        }
        cp = callerPath();
        this.searchCache(name, cp, deep, this.deleteMod);
        return require(resolveFrom(path.dirname(cp), name));
    }

    clean = function (name, deep) {
        if (deep == null) {
            deep = true;
        }
        if (_.isUndefined(name)) {
            return _.each(require.cache, function (v, key) {
                return delete require.cache[key];
            });
        } else {
            if (!_.isString(name)) {
                throw new TypeError("requireClean.clean Expects a moduleId String");
            }
            return this.searchCache(name, callerPath(), deep, this.deleteMod);
        }
    };

    searchCache = function (name, calledFrom, deep, callback) {
        var mod, run;
        mod = resolveFrom(path.dirname(calledFrom), name);
        if (mod && (mod = require.cache[mod]) !== void 0) {
            return (run = function (mod) {
                if (deep) {
                    mod.children.forEach(function (child) {
                        return run(child);
                    });
                }
                return callback(mod);
            })(mod);
        }
    };
}

;