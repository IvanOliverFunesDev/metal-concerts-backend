import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { markFavoriteConcerts, markSubscribeBands } from '../../../src/utils/concertsUtils.js';
import User from '../../../src/models/user.model.js';

// Mockeamos User.findById para que NO haga consultas reales a la base de datos.
jest.mock('../../../src/models/user.model.js', () => ({
  findById: jest.fn(),
}));

describe('concertsUtils', () => {
  let mockConcert;
  let mockUserWithFavorites;
  let mockBand;
  let mockUserWithSubscriptions;

  beforeEach(() => {
    // Datos de prueba
    mockConcert = {
      _id: 'concert123',
      title: 'Rock Festival',
      description: 'Un festival de rock increíble',
      date: '2025-06-20',
      location: 'Madrid',
      image: 'rock-festival.jpg',
      band: 'Metallica',
    };

    mockUserWithFavorites = {
      _id: 'user123',
      favoriteConcerts: ['concert123'], // 🎸 El usuario tiene este concierto como favorito
    };

    mockBand = {
      _id: 'band456',
      bandName: 'AC/DC',
      genre: 'Rock',
      image: 'acdc.jpg',
      averageRating: 5,
    };

    mockUserWithSubscriptions = {
      _id: 'user123',
      subscribedBands: ['band456'], // 🎶 Usuario suscrito a esta banda
    };

    // Reiniciamos los mocks antes de cada test
    User.findById.mockReset();

    // Mockeamos User.findById para que incluya el método select()
    User.findById.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUserWithFavorites),
    }));
  });

  // ✅ Test para markFavoriteConcerts
  describe('markFavoriteConcerts', () => {
    test('Debe marcar un concierto como favorito si el usuario lo tiene en su lista', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUserWithFavorites),
      }));

      const result = await markFavoriteConcerts(mockConcert, 'user123');

      expect(result.isFavorite).toBe(true);
    });

    test('No debe marcar el concierto como favorito si el usuario NO lo tiene en su lista', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({ _id: 'user123', favoriteConcerts: [] }),
      }));

      const result = await markFavoriteConcerts(mockConcert, 'user123');

      expect(result.isFavorite).toBe(false);
    });

    test('Si el userId es null, ningún concierto debe estar en favoritos', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      const result = await markFavoriteConcerts(mockConcert, null);

      expect(result.isFavorite).toBe(false);
    });
  });

  // ✅ Test para markSubscribeBands
  describe('markSubscribeBands', () => {
    test('Debe marcar una banda como suscrita si el usuario está suscrito', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUserWithSubscriptions),
      }));

      const result = await markSubscribeBands(mockBand, 'user123');

      expect(result.isSubscribed).toBe(true);
    });

    test('No debe marcar la banda como suscrita si el usuario NO está suscrito', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({ _id: 'user123', subscribedBands: [] }),
      }));

      const result = await markSubscribeBands(mockBand, 'user123');

      expect(result.isSubscribed).toBe(false);
    });

    test('Si el userId es null, ninguna banda debe estar suscrita', async () => {
      User.findById.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      const result = await markSubscribeBands(mockBand, null);

      expect(result.isSubscribed).toBe(false);
    });
  });
});
