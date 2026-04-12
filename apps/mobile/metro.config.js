const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// NOTE: disableHierarchicalLookup is intentionally NOT set (defaults to false).
// pnpm overrides in root package.json pin react-native@0.76.3 and react@18.3.1
// across all packages, eliminating phantom react-native@0.85.0 virtual store instances
// that Metro might otherwise pick up via hierarchical traversal.
module.exports = config;
