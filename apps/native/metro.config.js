const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Block Vite temp dirs and sibling app node_modules from Metro's watcher.
// Vite creates/destroys .vite/deps_ssr_temp_* rapidly, crashing Metro.
config.resolver.blockList = [
  /apps\/web\/node_modules\/\.vite\/.*/,
  /apps\/server\/node_modules\/.*/,
];

module.exports = config;
