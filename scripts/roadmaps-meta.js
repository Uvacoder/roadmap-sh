const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(__dirname, '../content');
const ROADMAPS_PATH = path.join(__dirname, '../content/roadmaps');
const META_FILE_PATH = path.join(__dirname, '../content/roadmaps.json');

const roadmapDirs = fs.readdirSync(ROADMAPS_PATH);
console.log(`[x] ${roadmapDirs.length} roadmaps found`);

const roadmapsMeta = roadmapDirs.reduce((metaAcc, roadmapDirName) => {
  const roadmapSlug = roadmapDirName.replace(/^\d+-/, '');
  const roadmapDir = path.join(ROADMAPS_PATH, roadmapDirName);
  const roadmapMeta = require(path.join(roadmapDir, 'meta.json'));

  // We can't use the absolute path in the build e.g. ~/Users/user/where-build-is-running/content
  // So, we remove it and use the path relative to content directory
  let contentPath = roadmapMeta.contentPath;
  if (contentPath) {
    contentPath = path.join(roadmapDir.replace(STORAGE_PATH, ''), roadmapMeta.contentPath);
  }

  let resourcesPath = roadmapMeta.resourcesPath;
  if (resourcesPath) {
    resourcesPath = path.join(roadmapDir.replace(STORAGE_PATH, ''), roadmapMeta.resourcesPath);
  }

  console.log(`----------------------------`);
  console.log(`[#] Roadmap: ${roadmapMeta.title}`);
  console.log(`[x] Generating sidebar`);

  return [
    ...metaAcc,
    {
      ...roadmapMeta,
      id: roadmapSlug,
      contentPath: contentPath,
      resourcesPath: resourcesPath,
      isUpcoming: roadmapMeta.isUpcoming || false
    }
  ];
}, []);

console.log(`----------------------------`);
console.log(`[x] Meta generated for ${roadmapsMeta.length} roadmaps`);
console.log(`[x] Writing file ${META_FILE_PATH}`);
fs.writeFileSync(META_FILE_PATH, JSON.stringify(roadmapsMeta, null, 2));
console.log(`[x] Wrote file with content`);
console.log(JSON.stringify(roadmapsMeta, null, 2));
