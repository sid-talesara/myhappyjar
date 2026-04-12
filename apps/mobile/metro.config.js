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

// Force Metro to resolve react-native-svg and react-native-gesture-handler
// to the single hoisted copy in the mobile app's node_modules.
// This prevents the RNSVGCircle duplicate-view-name invariant violation
// caused by pnpm's virtual store having multiple peer-resolved copies.
config.resolver.extraNodeModules = {
  'react-native-svg': path.resolve(projectRoot, 'node_modules/react-native-svg'),
  'react-native-gesture-handler': path.resolve(projectRoot, 'node_modules/react-native-gesture-handler'),
};

module.exports = config;
