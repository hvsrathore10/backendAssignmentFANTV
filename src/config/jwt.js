module.exports = {
  secret: process.env.JWT_SECRET || 'notgoingtousethissecret',
  expiresIn: '7d'
};