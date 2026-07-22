const { getDefaultConfig } = require('@expo/metro-config');
const projectRoot = __dirname;

module.exports = (async () => {
  const config = await getDefaultConfig(projectRoot);

  // Block watching deeply nested package manager folders to reduce inotify usage
  // assign an array of RegExp to blockList to avoid importing internal helpers
  config.resolver.blockList = [
    /node_modules[\\/]\.pnpm[\\/].*/,
    /node_modules[\\/]\.cache[\\/].*/,
  ];

  // Keep default watchFolders but avoid adding extra ones
  config.watchFolders = [];

  // Add zip extension to assets
  config.resolver.assetExts.push('zip');

  return config;
})();
