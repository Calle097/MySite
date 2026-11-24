import { LANG_KEY, type Lang } from './index';

/**
 * The language redirect each root layout runs before the page paints. Both
 * keep the query and #fragment, and leave demo pages alone (each playground
 * frames its own language's demos, with #embed).
 *
 * English tree: an Italian browser with no saved choice, or a saved 'it',
 * goes to /it. It skips /it paths: this layout also renders the 404, which
 * Caddy serves under any mistyped path, /it/… included, and redirecting
 * those would loop.
 *
 * Italian tree: a saved 'en' goes to the English page.
 */
export const LOCALE_SCRIPT: Record<Lang, string> = {
  en: `(function(){try{
var path=location.pathname;
if(path.indexOf('/demos')===0||path==='/it'||path.indexOf('/it/')===0)return;
var p=localStorage.getItem('${LANG_KEY}');
if(p==='it'||(!p&&(navigator.language||'').toLowerCase().indexOf('it')===0)){
location.replace('/it'+(path==='/'?'/':path)+location.search+location.hash);}
}catch(e){}})();`,
  it: `(function(){try{
var path=location.pathname;
if(path.indexOf('/it/demos')===0)return;
if(localStorage.getItem('${LANG_KEY}')==='en'){
var n=path.replace(/^\\/it(\\/|$)/,'/');
location.replace((n||'/')+location.search+location.hash);}
}catch(e){}})();`,
};
