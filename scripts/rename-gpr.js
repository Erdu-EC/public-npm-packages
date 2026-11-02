#!/usr/bin/env node
// General script to rename a package for GitHub Packages publishing
// Usage: node scripts/rename-gpr.js <path-to-package.json>
// Example: node scripts/rename-gpr.js dotnet-shared/typescript-utils/package.json
// Changes @erdu.dev/<name> -> @erdu-ec/<name>

const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(process.argv[2]);

if (!pkgPath) {
  console.error('Usage: node scripts/rename-gpr.js <path-to-package.json>');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const gprName = pkg.name.replace(/^@erdu\.dev\//, '@erdu-ec/');

if (gprName === pkg.name) {
  console.error(`Warning: package name "${pkg.name}" does not start with @erdu.dev/`);
  process.exit(1);
}

pkg.name = gprName;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Renamed package to: ${gprName}`);
