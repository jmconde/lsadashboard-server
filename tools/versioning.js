const semver = require('semver');
const path = require('path');
const { AutoComplete, Input, Confirm} = require('enquirer');
const packagePath = path.join(process.cwd(), 'package.json');
const fs = require('fs-extra');
const chalk = require('chalk');


const first = new AutoComplete({
    name: 'level',
    message: 'Which version level (patch)?',
    limit: 10,
    initial: 2,
    choices: [
        'major',
        'minor',
        'patch',
        'premajor',
        'preminor',
        'prepatch',
        'prerelease',
    ]
});

const second = new Input({
    message: 'Type the pre-id',
    initial: 'beta'
});

// prompt.run()
//   .then(answer => console.log('Answer:', answer));
// })

async function ask() {
    let version;
    try {
        const package = fs.readJsonSync(packagePath);

        version = package.version;
        console.log(chalk `Actual version is {yellow ${version}}`);
        const level = await first.run();
        let preid;
        if (level.startsWith("pre")) {
            preid = await second.run();
        }
        const nextver = semver.inc(version, level, preid);

        const confirmation = await new Confirm({
            name: 'question',
            message: `Confirm next version '${nextver}'?`
          }).run();

          if (confirmation) {
            package.version = nextver;
            fs.writeJSONSync(packagePath, package, { spaces: 2 });
        }
    } catch (err) {
        if (typeof err === 'string' && !err) {
            console.log(chalk `{yellow skipping...}`);
        } else {
            console.error(err);
        }

    }
}

ask()

// readline.question('Which level? (patch)', level => {
//     console.log('level :>> ', level);
//     inc(level.trim() || 'patch');
//     readline.close();
// });

// module.exports = ask;