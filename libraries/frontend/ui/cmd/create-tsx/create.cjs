// create-component.js
const fs = require('fs');
const path = require('path');

const componentDirectory = process.argv[2];
const componentName = process.argv[3];

if (!componentName) {
  console.error('Please supply a valid component name');
  process.exit(1);
}

const rootDirectory = `/src`;

if (fs.existsSync(`${rootDirectory}/${componentDirectory}/${componentName}`)) {
  console.error(`Component ${componentName} already exists.`);
  process.exit(1);
}
//
const template = fs.readFileSync(path.resolve(__dirname, 'component'), { encoding: 'utf-8' });
var content = template.replace(/ComponentName/g, componentName).replace(/ComponentDirectory/g, componentDirectory);
fs.writeFileSync(`.${rootDirectory}/${componentDirectory}/${componentName}.tsx`, content, 'utf8');
console.log(`Component ${componentName} was created successfully.`);
