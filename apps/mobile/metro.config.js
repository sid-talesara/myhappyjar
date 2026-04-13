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

// Force singleton resolution for native modules that must not be duplicated.
// Any import of these packages — regardless of which workspace package issues
// it — resolves to the single canonical copy in apps/mobile/node_modules (or
// the root node_modules when that's where pnpm hoisted them).
const SINGLETON_NATIVE_MODULES = [
  'react-native-svg',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const pkg of SINGLETON_NATIVE_MODULES) {
    if (moduleName === pkg || moduleName.startsWith(pkg + '/')) {
      // Resolve from the canonical root: prefer apps/mobile/node_modules,
      // fall back to workspaceRoot/node_modules.
      const sub = moduleName.slice(pkg.length); // '' or '/...'
      const candidatePaths = [
        path.resolve(projectRoot, 'node_modules', pkg + sub),
        path.resolve(workspaceRoot, 'node_modules', pkg + sub),
      ];
      for (const candidate of candidatePaths) {
        try {
          // Verify it exists before handing to Metro
          require.resolve(candidate.endsWith('/') ? candidate.slice(0, -1) : candidate);
          return context.resolveRequest(
            { ...context, originModulePath: candidate },
            moduleName,
            platform,
          );
        } catch (_) {
          // Not found at this candidate — try next
        }
      }
    }
  }
  // Default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
