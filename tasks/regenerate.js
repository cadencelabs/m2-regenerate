/**
 * This Grunt task will attempt to watch the magento 2 filesystem.
 * If it encounters a change to:
 * - any di.xml
 * - app/etc/config.php
 * - any php file in app/code/...
 *
 * It will attempt to either surgically remove a specific interceptor or factory instance,
 * or it will delete the entire directory if it's a change to a di.xml file or config.php file.
 */
module.exports = function(grunt) {
    grunt.registerTask("cadence:regenerate", "Regenerate files in var/generation", function(a,b,c){
        /**
         * action = added|changed|deleted
         * filepath = path of changed file relative to Gruntfile.js
         */
        grunt.event.on('watch', _handleFileChange);
        grunt.task.run('watch:app');
    });

    var fs = require('fs');
    var path = require('path');

    function _handleFileChange(action, filepath) {
        var globalConifg = grunt.config.get('path.app') + '/etc/config.php';

        if (filepath == globalConifg) {
            grunt.log.writeln("Detected change to global config.php: " + filepath + " - regenerating all files.");
            _regenerateAllFiles();
            return;
        }

        grunt.log.writeln("Observed file: " + filepath + " was " + action);
        var basename = path.basename(filepath);

        switch (basename) {
            case 'di.xml':
                grunt.log.writeln("Detected change to di.xml: " + filepath + " - regenerating all files.");
                _regenerateAllFiles();
                break;
            default:
                grunt.log.writeln("Detected change to php file: " + filepath + " - regenerating factories and interceptors for file.");
                _regenerateFile(filepath.replace(grunt.config.get('path.modules') + '/', ''));
                break;
        }
    }

    function _regenerateFile(regenerate) {
        grunt.log.writeln("Attempting to remove factories and interceptors for: " + regenerate);
        var interceptorPath = grunt.config.get('path.generation') + '/' + regenerate.replace('.php', '') + '/Interceptor.php';
        var factoryPath = grunt.config.get('path.generation') + '/' + regenerate.replace('.php', 'Factory.php');
        if (fs.existsSync(interceptorPath)) {
            grunt.log.writeln("Removing interceptor found at: " + interceptorPath);
            fs.unlink(interceptorPath);
        }
        if (fs.existsSync(factoryPath)) {
            grunt.log.writeln("Removing factory found at: " + interceptorPath);
            fs.unlink(factoryPath);
        }
    }

    function _regenerateAllFiles() {
        var generationPath = grunt.config.get('path.generation');
        grunt.log.writeln("Removing entire generation directory at: " + generationPath);
        _removeDir(generationPath);
    }

    function _removeDir(dirPath, removeSelf) {
        if (removeSelf === undefined) {
            removeSelf = false;
        }
        try {
            var files = fs.readdirSync(dirPath);
        }
        catch(e) {
            return;
        }
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
                else {
                    _removeDir(filePath, true);
                }
            }
        if (removeSelf) {
            fs.rmdirSync(dirPath);
        }
    };
};