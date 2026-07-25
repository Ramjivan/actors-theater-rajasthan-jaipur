const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

function inferType(value, key) {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object') {
      return { type: 'object', list: true, fields: inferFields(value[0]) };
    }
    return { type: 'list', fields: [{ type: 'string', name: 'item' }] }; // fallback
  } else if (typeof value === 'object' && value !== null) {
    return { type: 'object', fields: inferFields(value) };
  } else if (typeof value === 'string') {
    if (value.match(/\.(jpg|jpeg|png|gif|svg)$/i) || key === 'image' || key === 'src') return { type: 'image' };
    if (value.match(/^\d{4}-\d{2}-\d{2}/) || key === 'date') return { type: 'datetime' };
    if (value.includes('<') && value.includes('>')) return { type: 'text' }; // html content
    return { type: 'string' };
  } else if (typeof value === 'boolean') {
    return { type: 'boolean' };
  } else if (typeof value === 'number') {
    return { type: 'number' };
  }
  return { type: 'string' };
}

function inferFields(obj) {
  return Object.entries(obj).map(([key, value]) => {
    const inferred = inferType(value, key);
    return { name: key, label: key.charAt(0).toUpperCase() + key.slice(1), ...inferred };
  });
}

const contentDir = path.join(__dirname, 'content');
const srcContentPagesDir = path.join(__dirname, 'src', 'content', 'pages');

const jsonFiles = [];
function findJsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      findJsonFiles(fullPath);
    } else if (fullPath.endsWith('.json')) {
      jsonFiles.push(fullPath);
    }
  }
}

findJsonFiles(contentDir);
findJsonFiles(srcContentPagesDir);

const config = {
  media: { input: 'public/images', output: '/images' },
  content: []
};

for (const file of jsonFiles) {
  try {
    const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
    const name = path.basename(file, '.json');
    // For gallery and press, use collection if they are array roots, but they are objects.
    // Wait, gallery and press were already correctly defined in .pages.yml! We should preserve them or overwrite?
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    config.content.push({
      name: name,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      type: 'file',
      path: relativePath,
      format: 'json',
      fields: inferFields(data)
    });
  } catch(e) {
    console.error("Failed parsing", file, e);
  }
}

fs.writeFileSync('.pages.yml', yaml.stringify(config, { indent: 2 }));
console.log('Successfully generated .pages.yml');
