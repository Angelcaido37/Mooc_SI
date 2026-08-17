import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const platform=fs.readFileSync('public/course/platform-local.js','utf8');
const backend=fs.readFileSync('backend/app.py','utf8');
const docker=fs.readFileSync('Dockerfile','utf8');
const pages=fs.readFileSync('.github/workflows/deploy-pages.yml','utf8');
const hf=fs.readFileSync('.github/workflows/deploy-huggingface.yml','utf8');

test('frontend acepta API remota configurable',()=>{
  assert.match(platform,/NEXUS_CONFIG/);
  assert.match(platform,/apiBase/);
});
test('backend habilita CORS configurable',()=>{
  assert.match(backend,/CORSMiddleware/);
  assert.match(backend,/NEXUS_ALLOWED_ORIGINS/);
});
test('backend admite directorio de datos configurable',()=>{
  assert.match(backend,/NEXUS_DATA_DIR/);
});
test('Docker escucha en puerto 7860',()=>{
  assert.match(docker,/7860/);
  assert.match(docker,/uvicorn/);
});
test('GitHub Pages exige NEXUS_API_BASE',()=>{
  assert.match(pages,/NEXUS_API_BASE/);
  assert.match(pages,/runtime-config\.js/);
});
test('GitHub puede sincronizar el Space',()=>{
  assert.match(hf,/HF_TOKEN/);
  assert.match(hf,/HF_SPACE_ID/);
  assert.match(hf,/upload_folder/);
});
