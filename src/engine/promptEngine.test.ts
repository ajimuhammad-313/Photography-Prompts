import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CONFIG,
  PHOTOGRAPHY_PRESETS,
  PHOTOGRAPHY_STYLES,
} from '../data/catalog';
import { evaluateCompatibility } from './compatibility';
import { enhanceDescription } from './enhancer';
import {
  formatPromptAsJson,
  formatPromptAsTxt,
  generateNegativePrompt,
  generatePrompts,
} from './promptGenerator';
import { generateCompatibleRandomConfig } from './randomizer';

test('catalog has 20 photography styles and 15 presets', () => {
  assert.equal(PHOTOGRAPHY_STYLES.length, 20);
  assert.equal(PHOTOGRAPHY_PRESETS.length, 15);
});

test('compatibility engine warns on macro with wide-angle lens and patch resolves it', () => {
  const broken = {
    ...DEFAULT_CONFIG,
    style: 'Macro Photography',
    lens: '16mm Ultra Wide',
    focusDistance: 'Hyperfocal / Infinity',
  };
  const issues = evaluateCompatibility(broken);
  assert.ok(issues.some((i) => i.id === 'macro-lens'));

  const patched = issues.reduce((acc, issue) => ({ ...acc, ...issue.patch }), broken);
  const afterIssues = evaluateCompatibility(patched);
  assert.equal(afterIssues.filter((i) => i.severity === 'warning').length, 0);
});

test('compatibility engine warns on aperture vs depth of field contradiction', () => {
  const conflict = {
    ...DEFAULT_CONFIG,
    style: 'Portrait Photography',
    aperture: 'f/16',
    depthOfField: 'Ultra Shallow Bokeh',
  };
  const issues = evaluateCompatibility(conflict);
  assert.ok(issues.some((i) => i.severity === 'warning'));
});

test('enhancer enriches English and Indonesian descriptions without duplicating clauses', () => {
  const en = enhanceDescription(
    'craftsman shaping wet clay',
    'wooden studio table',
    { ...DEFAULT_CONFIG, style: 'Portrait Photography', lighting: 'Window Light', useEnhancer: true },
    'en'
  );
  assert.ok(en.subject.includes('craftsman shaping wet clay'));
  assert.ok(en.subject.includes('optical compression'));
  assert.ok(en.background.includes('wooden studio table'));

  // Calling again on already enhanced text should not double-append
  const enAgain = enhanceDescription(
    en.subject,
    en.background,
    { ...DEFAULT_CONFIG, style: 'Portrait Photography', lighting: 'Window Light', useEnhancer: true },
    'en'
  );
  assert.equal(enAgain.subject, en.subject);

  const id = enhanceDescription(
    'perajin keramik di meja kayu',
    'ruang studio hangat',
    { ...DEFAULT_CONFIG, style: 'Portrait Photography', lighting: 'Window Light', useEnhancer: true },
    'id'
  );
  assert.ok(id.subject.includes('kompresi optik'));
});

test('prompt generator builds coherent English and Indonesian outputs and omits human traits on product shots', () => {
  const enPrompts = generatePrompts(DEFAULT_CONFIG, 'en');
  assert.ok(enPrompts.naturalLanguage.includes('Portrait Photography'));
  assert.ok(enPrompts.naturalLanguage.includes('85mm Portrait'));
  assert.ok(enPrompts.naturalLanguage.includes('an eye-level perspective'));
  assert.ok(enPrompts.naturalLanguage.includes('Kodak Portra inspired'));
  assert.ok(enPrompts.structured.includes('Camera & Sensor:'));
  assert.ok(enPrompts.negativePrompt.includes('airbrushed waxy skin'));

  const idPrompts = generatePrompts(DEFAULT_CONFIG, 'id');
  assert.ok(idPrompts.naturalLanguage.includes('Fotografi Potret'));
  assert.ok(idPrompts.structured.includes('Gaya Fotografi:'));
  assert.ok(idPrompts.negativePrompt.includes('kulit plastik'));

  const productConfig = {
    ...DEFAULT_CONFIG,
    style: 'Product Photography',
    subjectCategory: 'Product',
    customSubject: 'matte black espresso grinder',
    lighting: 'Studio Softbox Lighting',
    aperture: 'f/8',
    depthOfField: 'Edge-to-Edge Sharpness',
    humanDetails: ['Visible Skin Pores'],
  };
  const productPrompts = generatePrompts(productConfig, 'en');
  assert.equal(productPrompts.naturalLanguage.includes('Visible Skin Pores'), false);
  assert.equal(productPrompts.negativePrompt.includes('extra fingers'), false);
  assert.ok(productPrompts.negativePrompt.includes('warped straight lines'));
});

test('TXT and JSON exports serialize cleanly', () => {
  const prompts = generatePrompts(DEFAULT_CONFIG, 'en');
  const txt = formatPromptAsTxt(DEFAULT_CONFIG, prompts, 'natural');
  assert.ok(txt.includes('LENSCRAFT AI'));
  assert.ok(txt.includes('NEGATIVE PROMPT'));

  const jsonStr = formatPromptAsJson(DEFAULT_CONFIG, prompts);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.application, 'LensCraft AI');
  assert.equal(parsed.configuration.style, DEFAULT_CONFIG.style);
});

test('logical randomizer produces compatible configurations across 25 samples', () => {
  for (let i = 0; i < 25; i++) {
    const cfg = generateCompatibleRandomConfig();
    const warnings = evaluateCompatibility(cfg).filter((issue) => issue.severity === 'warning');
    assert.equal(
      warnings.length,
      0,
      `Unexpected warning for style ${cfg.style}: ${warnings.map((w) => w.title).join(', ')}`
    );
    const out = generatePrompts(cfg, i % 2 === 0 ? 'en' : 'id');
    assert.ok(out.naturalLanguage.length > 40);
    assert.ok(generateNegativePrompt(cfg, 'en').length > 20);
  }
});
