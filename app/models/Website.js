import validator from "validator";
import slugify from "slugify";
import client from "../database.js";

class Website {

  #id;
  #title;
  #slug;
  #description;
  #address;
  #device;
  #level;

  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.slug = slugify(config.title, {
      lower: true,
      strict: true,
    });
    this.description = config.description;
    this.address = config.address;
    this.device = config.device;
    this.level = config.level;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get slug() {
    return this.#slug;
  }

  get description() {
    return this.#description;
  }

  get address() {
    return this.#address;
  }

  get device() {
    return this.#device;
  }

  get level() {
    return this.#level;
  }

  set id(value) {
    if (typeof value !== 'number' && typeof value !== 'undefined') {
      throw new Error('Id incorrect');
    }
    this.#id = value;
  }

  set title(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Titre incorrect');
    }
    this.#title = value.trim();
  }

  set slug(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Slug incorrect');
    }
    this.#slug = value.trim();
  }

  set description(value) {
    this.#description = value;
  }

  set address(value) {
    if (!validator.isURL(value)) {
      throw new Error('Adresse incorrecte');
    }
    this.#address = value;
  }

  set device(value) {
    const allowedValues = ['Mobile', 'Ordinateur', 'Lecteur d\'écran'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#device = value;
  }

  set level(value) {
    const allowedValues = ['Bloquant', 'Gênant', 'Casse-tête'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#level = value;
  }

  async create() {
    const text = `
      INSERT INTO website ("title", "slug", "description", "address", "device", "level")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    const values = [this.title, this.slug, this.description, this.address, this.device, this.level];
    const result = await client.query(text, values);
    this.#id = result.rows[0].id;
  }

  static async read(id) {
    const text = `
      SELECT * FROM website
      WHERE id = $1;
    `;
    const values = [id];
    const result = await client.query(text, values);
    if (result.rowCount > 0) {
      return new Website(result.rows[0]);
    }
    else {
      throw new Error('Website non trouvé');
    }
  }
  static async readID() {
    const text = await client.query(`SELECT * FROM website ORDER BY id DESC LIMIT 3`);
    console.log(text);
    const websiteRows = text.rows;
    const websitesObj = [];
    // Pour chaque site contenu dans la bdd
    for (const websiteRow of websiteRows) {
      // J'instancie un nouvel objet grace a ma classe
      websitesObj.push(new Website(websiteRow));
    }
    return websitesObj;
  }

static async slugAff(slug){
try{
    const text = `SELECT * FROM website WHERE "slug" = $1`;
    const values = [slug];
    const result = await client.query(text, values);
    if(result.rows.length>0) {
    return new Website(result.rows[0]);
    } 
  } catch (error){
  console.log(error);
  res.render('error',message='Site non trouvé');
}
}

  async update() {
    const text = `
      UPDATE website 
      SET 
        "title" = $1,
        "slug" = $2,
        "description" = $3,
        "address" = $4,
        "device" = $5,
        "level" = $6
      WHERE id = $7;
    `;
    const values = [this.name, this.slug, this.description, this.address, this.device, this.level, this.id];
    client.query(text, values);
  }

  async updateUserID(){
    client.query('UPDATE website SET user_id = $1 WHERE id =$2'), [userId,this.id]
  }
  async delete() {
    const text = `
      DELETE FROM website 
      WHERE id = $1;
    `;
    const values = [this.id];
    client.query(text, values);
  }

}

export default Website;
