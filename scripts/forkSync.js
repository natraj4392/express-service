const execSync = require('child_process').execSync;


execSync('git fetch upstream && git checkout ' +process.argv[2]+' && git merge upstream/'+process.argv[2]+' && git push -f origin '+process.argv[2], { stdio:[0,1,2] });