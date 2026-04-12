const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch workspace root so Metro can resolve packages like @myhappyjar/ui.
config.watchFolders = [workspaceRoot];

// With node-linker=hoisted in .npmrc, pnpm installs a flat layout so Metro's
// default resolution finds the single hoisted copy of every native module.
// We still list both roots so workspace symlinks resolve correctly.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
