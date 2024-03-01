import Website from "../models/Website.js";

const mainController = {

  home: async function (req, res) {
    // Utilisation de readId() pour récupérer toutes les entrées de la base de données
    const websites = await Website.readID();
    res.render('home', {
      // Passage des données récupérées à la vue
      websites: websites
    });

  },
  legals: function (req, res) {
    res.render('coming-soon', {
      title: 'Mentions légales',
    });
  },

  plan: function (req, res) {
    res.render('coming-soon', {
      title: 'Plan du site',
    });
  },

  contact: function (req, res) {
    res.render('coming-soon', {
      title: 'Contact',
    });
  },

  notFound: function (req, res) {
    res.status(404).render('error', {
      message: 'La page demandée n\'a pas été trouvée.',
    });
  }

};

export default mainController;
