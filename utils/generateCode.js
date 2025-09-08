/**
 * Génère un code de réservation unique
 * @param {string} prefix - Préfixe du code (par défaut 'RL')
 * @returns {string} Code généré au format PREFIX-XXXXXX
 */
function generateCode(prefix = 'RL') {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += charset[Math.floor(Math.random() * charset.length)];
  }
  return `${prefix}-${token}`;
}

module.exports = { generateCode };
