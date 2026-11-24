import { LANG_KEY, type Lang } from './index';

/**
 * The language redirect each root layout runs in <head>, before the page
 * paints. Both leave the demo pages alone: each playground embeds its own
 * language's demos, and a redirect would drop the #embed fragment those
 * iframes rely on. Both keep the query and the #fragment.
 *
 * English tree: a first visit with an Italian browser (and no saved choice),
 * or a saved 'it', goes to the /it mirror. The `/it` guard is load-bearing,
 * not defensive: this tree's layout also renders the 404 page, which Caddy
 * serves under the path the visitor asked for; without it, an Italian
 * visitor hitting /it/typo/ would be sent to /it/it/typo/, another 404,
 * another redirect, forever.
 *
 * Italian tree: a saved 'en' goes back to the English page; otherwise anyone
 * landing on /it stays.
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
