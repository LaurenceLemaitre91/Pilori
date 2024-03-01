import User from '../models/User.js'
const userController = {
  
  profil: async function(req, res) {
    const createUser = await User.read(req.session.userId);
    res.render('profil', { user: createUser });
  },

};

export default userController;
