import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';
import Band from './src/models/band.model.js';
import Concert from './src/models/concerts.model.js';
import Review from './src/models/review.model.js';

import config from './src/config.js';
import { loggers } from 'winston';
import logger from './src/utils/logger.js';


const locations = [
  'Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Granada', 'Málaga', 'Zaragoza',
  'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'L Hospitalet de Llobregat', 'La Coruña',
  'Vitoria-Gasteiz', 'Elche', 'Oviedo', 'Santa Cruz de Tenerife', 'Badalona', 'Cartagena', 'Tarragona',
  'Jerez de la Frontera', 'Sabadell', 'Móstoles', 'Alcalá de Henares', 'Pamplona', 'Fuenlabrada',
  'Almería', 'San Sebastián', 'Leganés', 'Santander', 'Castellón de la Plana', 'Burgos', 'Albacete',
  'Getafe', 'Salamanca', 'Huelva', 'Logroño', 'Badajoz', 'San Cristóbal de La Laguna', 'León',
  'Torrejón de Ardoz', 'Lérida', 'Marbella', 'Dos Hermanas', 'Parla', 'Mataró', 'Santa Coloma de Gramenet',
  'Algeciras', 'Cádiz', 'Jaén', 'Reus', 'Barakaldo', 'Telde', 'Ourense', 'Girona', 'Santiago de Compostela',
  'Lugo', 'San Fernando', 'Roquetas de Mar', 'Cáceres', 'Melilla', 'Las Rozas de Madrid', 'Torrevieja',
  'San Cugat del Vallés', 'Ceuta', 'Pontevedra', 'Rivas-Vaciamadrid', 'Toledo', 'El Puerto de Santa María',
  'Mérida', 'Fuengirola', 'Manresa', 'Benidorm', 'Avilés', 'Zamora', 'Benalmádena', 'Torremolinos',
  'Orihuela', 'Sanlúcar de Barrameda', 'Villareal', 'Cuenca', 'Elda', 'Ferrol', 'Palencia', 'Arrecife',
  'Granollers', 'Chiclana de la Frontera', 'Collado Villalba', 'Talavera de la Reina', 'Vélez-Málaga',
  'Segovia', 'Viladecans', 'Ibiza', 'Motril', 'Paterna', 'Alcoy', 'Puertollano', 'Gandía', 'Aranjuez',
  'Estepona', 'Majadahonda', 'Ronda', 'Ciudad Real', 'Linares', 'Irún', 'Coslada', 'Alcázar de San Juan'
];

const reviewMessages = [
  '¡Increíble concierto! La banda estuvo espectacular. 🤘',
  'La organización fue buena, pero el sonido pudo ser mejor.',
  'Me encantó la energía del público, repetiría sin dudarlo.',
  'Un concierto brutal, aunque eché en falta más temas clásicos.',
  'Gran actuación, pero el lugar estaba demasiado lleno.',
  'Buena experiencia, aunque el precio de las entradas fue alto.',
  'Los efectos de luces hicieron la experiencia aún mejor.',
  'El vocalista estuvo impresionante, una noche para recordar.'
];

const bandsData = [
  { bandName: 'Metallica', genre: 'Heavy Metal', description: 'Banda icónica de heavy metal.', email: 'metallica@gmail.com', status: 'approved' },
  { bandName: 'Linkin Park', genre: 'Nu Metal', description: 'Banda revolucionaria del nu metal.', email: 'linkinpark@gmail.com', status: 'approved' },
  { bandName: 'Iron Maiden', genre: 'Heavy Metal', description: 'Leyenda del heavy metal británico.', email: 'ironmaiden@gmail.com', status: 'approved' },
  { bandName: 'Slayer', genre: 'Thrash Metal', description: 'Banda legendaria del thrash metal.', email: 'slayer@gmail.com', status: 'approved' },
  { bandName: 'AC/DC', genre: 'Hard Rock', description: 'Iconos del hard rock australiano.', email: 'acdc@gmail.com', status: 'approved' },
  { bandName: 'Pantera', genre: 'Groove Metal', description: 'Revolucionarios del groove metal.', email: 'pantera@gmail.com', status: 'approved' },
  { bandName: 'Megadeth', genre: 'Thrash Metal', description: 'Pioneros del thrash con riffs veloces.', email: 'megadeth@gmail.com', status: 'approved' },
  { bandName: 'Judas Priest', genre: 'Heavy Metal', description: 'Los dioses del metal británico.', email: 'judaspriest@gmail.com', status: 'approved' },
  { bandName: 'Black Sabbath', genre: 'Doom Metal', description: 'Creadores del heavy metal oscuro.', email: 'blacksabbath@gmail.com', status: 'approved' },
  { bandName: 'Dream Theater', genre: 'Progressive Metal', description: 'Maestros de la complejidad musical.', email: 'dreamtheater@gmail.com', status: 'approved' },
  { bandName: 'Opeth', genre: 'Progressive Death Metal', description: 'Fusionan la brutalidad con lo melódico.', email: 'opeth@gmail.com', status: 'approved' },
  { bandName: 'Nightwish', genre: 'Symphonic Metal', description: 'Pioneros del metal sinfónico moderno.', email: 'nightwish@gmail.com', status: 'approved' },
  { bandName: 'Children of Bodom', genre: 'Melodic Death Metal', description: 'Innovadores del metal melódico extremo.', email: 'cobodom@gmail.com', status: 'approved' },
  { bandName: 'Behemoth', genre: 'Blackened Death Metal', description: 'Oscuridad y brutalidad en su máxima expresión.', email: 'behemoth@gmail.com', status: 'approved' },
  { bandName: 'Lamb of God', genre: 'Groove Metal', description: 'Fuerza y agresividad en cada riff.', email: 'lambofgod@gmail.com', status: 'approved' },
  { bandName: 'System of a Down', genre: 'Alternative Metal', description: 'Metal alternativo con influencias étnicas.', email: 'soad@gmail.com', status: 'approved' },
  { bandName: 'Disturbed', genre: 'Alternative Metal', description: 'Éxitos que combinan potencia y melodía.', email: 'disturbed@gmail.com', status: 'approved' },
  { bandName: 'Slipknot', genre: 'Nu Metal', description: 'Energía brutal con una puesta en escena única.', email: 'slipknot@gmail.com', status: 'approved' },
  { bandName: 'Gojira', genre: 'Progressive Death Metal', description: 'Conciencia ecológica con riffs demoledores.', email: 'gojira@gmail.com', status: 'approved' },
  { bandName: 'Mastodon', genre: 'Sludge Metal', description: 'Narrativas épicas con técnica impecable.', email: 'mastodon@gmail.com', status: 'approved' },
  { bandName: 'Korn', genre: 'Nu Metal', description: 'Fundadores del sonido nu metal moderno.', email: 'korn@gmail.com', status: 'approved' },
  { bandName: 'Sepultura', genre: 'Thrash Metal', description: 'Poder sudamericano en el metal extremo.', email: 'sepultura@gmail.com', status: 'approved' },
  { bandName: 'Deftones', genre: 'Alternative Metal', description: 'Metal atmosférico con influencias shoegaze.', email: 'deftones@gmail.com', status: 'approved' },
  { bandName: 'Tool', genre: 'Progressive Metal', description: 'Misticismo, arte y polirritmos complejos.', email: 'tool@gmail.com', status: 'approved' },
  { bandName: 'The Beatles', genre: 'Rock', description: 'Los pioneros del rock moderno con una influencia inigualable.', email: 'beatles@gmail.com', status: 'approved' },
  { bandName: 'The Rolling Stones', genre: 'Rock', description: 'Energía y rebeldía en estado puro.', email: 'rollingstones@gmail.com', status: 'approved' },
  { bandName: 'Pink Floyd', genre: 'Progressive Rock', description: 'Los maestros de los paisajes sonoros psicodélicos.', email: 'pinkfloyd@gmail.com', status: 'approved' },
  { bandName: 'Led Zeppelin', genre: 'Hard Rock', description: 'Los pioneros del hard rock con himnos inmortales.', email: 'ledzeppelin@gmail.com', status: 'approved' },
  { bandName: 'Queen', genre: 'Rock', description: 'Innovación y espectáculo en cada nota.', email: 'queen@gmail.com', status: 'approved' },
  { bandName: 'The Doors', genre: 'Psychedelic Rock', description: 'Letras poéticas y atmósferas hipnóticas.', email: 'thedoors@gmail.com', status: 'approved' },
  { bandName: 'Deep Purple', genre: 'Hard Rock', description: 'Potencia y virtuosismo con riffs inolvidables.', email: 'deeppurple@gmail.com', status: 'approved' },
  { bandName: 'The Who', genre: 'Rock', description: 'Rebeldía y óperas rock que marcaron una época.', email: 'thewho@gmail.com', status: 'approved' },
  { bandName: 'Radiohead', genre: 'Alternative Rock', description: 'Expresión emocional y experimentación sónica.', email: 'radiohead@gmail.com', status: 'approved' },
  { bandName: 'Nirvana', genre: 'Grunge', description: 'La banda que definió una generación con su sonido crudo.', email: 'nirvana@gmail.com', status: 'approved' },
  { bandName: 'Pearl Jam', genre: 'Grunge', description: 'Pasión y letras profundas que marcaron el grunge.', email: 'pearljam@gmail.com', status: 'approved' },
  { bandName: 'Foo Fighters', genre: 'Alternative Rock', description: 'Himnos modernos del rock con energía desbordante.', email: 'foofighters@gmail.com', status: 'approved' },
  { bandName: 'Red Hot Chili Peppers', genre: 'Funk Rock', description: 'Fusionan el rock con funk y un estilo único.', email: 'rhcp@gmail.com', status: 'approved' },
  { bandName: 'Green Day', genre: 'Punk Rock', description: 'Iconos del punk rock de los 90.', email: 'greenday@gmail.com', status: 'approved' },
  { bandName: 'The Offspring', genre: 'Punk Rock', description: 'Punk enérgico con letras pegajosas.', email: 'theoffspring@gmail.com', status: 'approved' },
  { bandName: 'Blink-182', genre: 'Pop Punk', description: 'El sonido irreverente del pop punk.', email: 'blink182@gmail.com', status: 'approved' },
  { bandName: 'Muse', genre: 'Alternative Rock', description: 'Rock épico con influencias electrónicas y progresivas.', email: 'muse@gmail.com', status: 'approved' },
  { bandName: 'The Killers', genre: 'Alternative Rock', description: 'Pop rock con un sonido indie y letras nostálgicas.', email: 'thekillers@gmail.com', status: 'approved' },
  { bandName: 'The Black Keys', genre: 'Blues Rock', description: 'Rock con raíces profundas en el blues.', email: 'theblackkeys@gmail.com', status: 'approved' },
  { bandName: 'Arctic Monkeys', genre: 'Indie Rock', description: 'Riffs pegajosos y actitud indie.', email: 'arcticmonkeys@gmail.com', status: 'approved' }
];

const usersData = [
  { username: 'alice', email: 'alice@gmail.com' },
  { username: 'bob', email: 'bob@gmail.com' },
  { username: 'charlie', email: 'charlie@gmail.com' },
  { username: 'david', email: 'david@gmail.com' },
  { username: 'emily', email: 'emily@gmail.com' },
  { username: 'frank', email: 'frank@gmail.com' },
  { username: 'grace', email: 'grace@gmail.com' },
  { username: 'harry', email: 'harry@gmail.com' },
  { username: 'isabel', email: 'isabel@gmail.com' },
  { username: 'jack', email: 'jack@gmail.com' },
  { username: 'karen', email: 'karen@gmail.com' },
  { username: 'leo', email: 'leo@gmail.com' },
  { username: 'mia', email: 'mia@gmail.com' },
  { username: 'nathan', email: 'nathan@gmail.com' },
  { username: 'olivia', email: 'olivia@gmail.com' },
  { username: 'paul', email: 'paul@gmail.com' },
  { username: 'quinn', email: 'quinn@gmail.com' },
  { username: 'rachel', email: 'rachel@gmail.com' },
  { username: 'steven', email: 'steven@gmail.com' },
  { username: 'tina', email: 'tina@gmail.com' },
  { username: 'ulysses', email: 'ulysses@gmail.com' },
  { username: 'victor', email: 'victor@gmail.com' },
  { username: 'wendy', email: 'wendy@gmail.com' },
  { username: 'xavier', email: 'xavier@gmail.com' },
  { username: 'yasmine', email: 'yasmine@gmail.com' },
  { username: 'zane', email: 'zane@gmail.com' },
  { username: 'brandon', email: 'brandon@gmail.com' },
  { username: 'carla', email: 'carla@gmail.com' },
  { username: 'diego', email: 'diego@gmail.com' },
  { username: 'elena', email: 'elena@gmail.com' },
  { username: 'felix', email: 'felix@gmail.com' },
  { username: 'gina', email: 'gina@gmail.com' },
  { username: 'henry', email: 'henry@gmail.com' },
  { username: 'isaac', email: 'isaac@gmail.com' },
  { username: 'julia', email: 'julia@gmail.com' },
  { username: 'kevin', email: 'kevin@gmail.com' },
  { username: 'luna', email: 'luna@gmail.com' },
  { username: 'mark', email: 'mark@gmail.com' },
  { username: 'nora', email: 'nora@gmail.com' },
  { username: 'oscar', email: 'oscar@gmail.com' },
  { username: 'peter', email: 'peter@gmail.com' },
  { username: 'quincy', email: 'quincy@gmail.com' },
  { username: 'robert', email: 'robert@gmail.com' },
  { username: 'sophia', email: 'sophia@gmail.com' },
  { username: 'tom', email: 'tom@gmail.com' },
  { username: 'ursula', email: 'ursula@gmail.com' },
  { username: 'violet', email: 'violet@gmail.com' },
  { username: 'walter', email: 'walter@gmail.com' },
  { username: 'xenia', email: 'xenia@gmail.com' },
  { username: 'yuri', email: 'yuri@gmail.com' },
  { username: 'zoe', email: 'zoe@gmail.com' },
  { username: 'aaron', email: 'aaron@gmail.com' },
  { username: 'beth', email: 'beth@gmail.com' },
  { username: 'cameron', email: 'cameron@gmail.com' },
  { username: 'denise', email: 'denise@gmail.com' },
  { username: 'edgar', email: 'edgar@gmail.com' },
  { username: 'fiona', email: 'fiona@gmail.com' },
  { username: 'george', email: 'george@gmail.com' },
  { username: 'hannah', email: 'hannah@gmail.com' },
  { username: 'ivan', email: 'ivan@gmail.com' },
  { username: 'jessica', email: 'jessica@gmail.com' },
  { username: 'kyle', email: 'kyle@gmail.com' },
  { username: 'laura', email: 'laura@gmail.com' },
  { username: 'mason', email: 'mason@gmail.com' },
  { username: 'nicole', email: 'nicole@gmail.com' },
  { username: 'owen', email: 'owen@gmail.com' },
  { username: 'paige', email: 'paige@gmail.com' },
  { username: 'quentin', email: 'quentin@gmail.com' },
  { username: 'ryan', email: 'ryan@gmail.com' },
  { username: 'samantha', email: 'samantha@gmail.com' },
  { username: 'tyler', email: 'tyler@gmail.com' },
  { username: 'uma', email: 'uma@gmail.com' },
  { username: 'vincent', email: 'vincent@gmail.com' },
  { username: 'whitney', email: 'whitney@gmail.com' },
  { username: 'xander', email: 'xander@gmail.com' },
  { username: 'yasmin', email: 'yasmin@gmail.com' },
  { username: 'zeke', email: 'zeke@gmail.com' },
  { username: 'amber', email: 'amber@gmail.com' },
  { username: 'bruce', email: 'bruce@gmail.com' },
  { username: 'claire', email: 'claire@gmail.com' },
  { username: 'damon', email: 'damon@gmail.com' },
  { username: 'ella', email: 'ella@gmail.com' },
  { username: 'francis', email: 'francis@gmail.com' },
  { username: 'gloria', email: 'gloria@gmail.com' },
  { username: 'howard', email: 'howard@gmail.com' },
  { username: 'inez', email: 'inez@gmail.com' },
  { username: 'jonathan', email: 'jonathan@gmail.com' },
  { username: 'kimberly', email: 'kimberly@gmail.com' },
  { username: 'lance', email: 'lance@gmail.com' },
  { username: 'miranda', email: 'miranda@gmail.com' },
  { username: 'neil', email: 'neil@gmail.com' },
  { username: 'octavia', email: 'octavia@gmail.com' },
  { username: 'patrick', email: 'patrick@gmail.com' },
  { username: 'queen', email: 'queen@gmail.com' },
  { username: 'raymond', email: 'raymond@gmail.com' },
  { username: 'sylvia', email: 'sylvia@gmail.com' },
  { username: 'travis', email: 'travis@gmail.com' },
  { username: 'ursula2', email: 'ursula2@gmail.com' },
  { username: 'vance', email: 'vance@gmail.com' },
  { username: 'wanda', email: 'wanda@gmail.com' }
];

const generateRandomDate = (isFuture) => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 180) + 1;
  return isFuture
    ? new Date(today.setDate(today.getDate() + randomDays))
    : new Date(today.setDate(today.getDate() - randomDays));
};

const generateRandomReview = () => {
  return {
    rating: Math.floor(Math.random() * 5) + 1, 
    comment: reviewMessages[Math.floor(Math.random() * reviewMessages.length)]
  };
};

const generateData = async () => {
  try {
    await mongoose.connect(config.database.MONGO_URI);
    loggers.info('✅ Conectado a MongoDB');

    await User.deleteMany();
    await Band.deleteMany();
    await Concert.deleteMany();
    await Review.deleteMany();

    for (const band of bandsData) {
      band.password = await bcrypt.hash(band.bandName.toLowerCase() + '123', 10);
    }
    const createdBands = await Band.insertMany(bandsData);

    const createdUsers = await User.insertMany(usersData.map(user => ({
      ...user,
      password: bcrypt.hashSync('123456', 10),
    })));

    for (const user of createdUsers) {
      const numSubscriptions = Math.floor(Math.random() * (bandsData.length - 1)) + 1;
      const randomBands = createdBands.sort(() => 0.5 - Math.random()).slice(0, numSubscriptions);

      user.subscribedBands = randomBands.map(band => band._id);
      await user.save();

      randomBands.forEach(band => band.subscribers.push(user._id));
    }

    await Promise.all(createdBands.map(band => band.save()));

    const concertsData = [];
    for (const band of createdBands) {
      for (let i = 0; i < 3; i++) {
        concertsData.push({
          title: `Live in ${locations[i]} - ${band.bandName}`,
          description: `Un concierto espectacular de ${band.bandName}.`,
          date: generateRandomDate(true), 
          location: locations[i],
          band: band._id
        });
        concertsData.push({
          title: `Past Tour - ${band.bandName}`,
          description: `Revive el increíble concierto de ${band.bandName}.`,
          date: generateRandomDate(false), 
          location: locations[i + 3],
          band: band._id
        });
      }
    }
    const createdConcerts = await Concert.insertMany(concertsData);

    const reviewsData = [];
    for (const user of createdUsers) {
      const reviewedConcerts = createdConcerts.filter(c => c.date < new Date()); // 
      const numReviews = Math.floor(Math.random() * 3) + 1; 

      reviewedConcerts.sort(() => 0.5 - Math.random()).slice(0, numReviews).forEach(concert => {
        reviewsData.push({
          user: user._id,
          concert: concert._id,
          ...generateRandomReview()
        });
      });
    }
    await Review.insertMany(reviewsData);

    logger.info('✅ Datos insertados correctamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    process.exit(1);
  }
};

generateData();
