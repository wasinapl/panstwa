import jwt from 'jsonwebtoken';
import db from '../db';

const Auth = {
  /**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users.user WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = rows[0];
      next();
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async adminAuth(req, res, next){
    if(req.user.role != 2)
    return res.status(400).send({ 'message': 'You dont have permision' });
    else
    next();
  }
}

export default Auth;