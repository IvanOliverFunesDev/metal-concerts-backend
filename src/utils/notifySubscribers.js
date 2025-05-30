import User from '../models/user.model.js';
import { sendConcertNotificationEmail } from '../services/email.service.js';

export const notifySubscribers = async (band, subject, htmlContent) => {
  try {
    const subscribers = await User.find({ subscribedBands: band._id });

    if (!subscribers.length) return;

    for (const user of subscribers) {
      await sendConcertNotificationEmail(user.email, subject, htmlContent);
    }
  } catch (error) {
    console.error('❌ Error al notificar a suscriptores:', error.message);
  }
};
