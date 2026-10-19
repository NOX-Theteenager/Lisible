/* Contexte de la requête en cours, lisible depuis n'importe quelle consigne d'IA sans le faire
   passer de fonction en fonction. track : 'job' (recherche d'emploi) ou 'study' (candidature à une formation). */
import { AsyncLocalStorage } from 'node:async_hooks';

export const reqCtx = new AsyncLocalStorage();
export const track = () => (reqCtx.getStore() || {}).track || 'job';
export const isStudy = () => track() === 'study';
