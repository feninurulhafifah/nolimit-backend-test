const request = require('supertest');
const app = require('../app');
const { sequelize, User, Post } = require('../models');

let tokenUser1;
let tokenUser2;
let postUser1Id;

beforeAll(async () => {
  
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('=== TEST API BLOG ===', () => {
  
  // 1. Test Registrasi & Login
  describe('Authentication Endpoints', () => {
    it('Should register User 1 successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Satu',
          email: 'user1@nolimit.id',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
    });

    it('Should register User 2 successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Dua',
          email: 'user2@nolimit.id',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(201);
    });

    it('Should login User 1 and receive token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user1@nolimit.id',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      tokenUser1 = res.body.token;
    });

    it('Should login User 2 and receive token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user2@nolimit.id',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      tokenUser2 = res.body.token;
    });
  });

  // 2. Test Post Management
  describe('Post Endpoints', () => {
    it('Should create a new post (authenticated)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          content: 'Ini adalah postingan pertama saya di NoLimit.'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.post).toHaveProperty('id');
      postUser1Id = res.body.post.id;
    });

    it('Should fail to create post if unauthorized', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ content: 'Postingan tanpa auth.' });
      expect(res.statusCode).toEqual(401);
    });

    it('Should get all posts (public)', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('Should get post by ID (public)', async () => {
      const res = await request(app).get(`/api/posts/${postUser1Id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.content).toBe('Ini adalah postingan pertama saya di NoLimit.');
    });

    it('Should allow author (User 1) to update their own post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postUser1Id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ content: 'Postingan NoLimit yang telah di-update.' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.post.content).toBe('Postingan NoLimit yang telah di-update.');
    });

    it('Should block other user (User 2) from updating User 1 post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postUser1Id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send({ content: 'Mencoba meretas postingan user 1.' });
      expect(res.statusCode).toEqual(403);
    });

    it('Should block other user (User 2) from deleting User 1 post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postUser1Id}`)
        .set('Authorization', `Bearer ${tokenUser2}`);
      expect(res.statusCode).toEqual(403);
    });

    it('Should allow author (User 1) to delete their own post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postUser1Id}`)
        .set('Authorization', `Bearer ${tokenUser1}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});