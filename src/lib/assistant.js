import { SYS } from '../i18n';

// La maquette appelait window.claude.complete, qui n'existe que dans l'environnement Claude.
// shortcut: hors de cet environnement l'appel échoue et le chat affiche le message d'erreur ; brancher une route API serveur (clé jamais côté navigateur) pour la production.
export async function askAssistant(messages, lang) {
  if (!window.claude?.complete) throw new Error('assistant indisponible');
  return window.claude.complete({ system: SYS + ' Default language: ' + lang + '.', messages, max_tokens: 400 });
}
