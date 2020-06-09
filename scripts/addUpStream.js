const execSync = require('child_process').execSync;

execSync('git remote add upstream ' +process.argv[2], { stdio:[0,1,2] });