import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../models/index.js';

describe('Campus Hub API Unit Tests', () => {
  before(async () => {
    // Force sync database to initialize in-memory SQLite tables
    await sequelize.sync({ force: true });
  });

  let studentToken = '';
  let adminToken = '';
  let adminUserId = '';
  let studentUserId = '';

  describe('User Registration & Authentication (POST /users)', () => {
    test('Should reject registration if required fields are missing', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'No Email or Role' });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.error, /Missing required fields/);
    });

    test('Should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Alice', email: 'alice-invalid', role: 'student' });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.error, /provide a valid email/);
    });

    test('Should successfully register a new student user and return a JWT token', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Alice Student', email: 'alice@campus.edu', role: 'student' });

      assert.strictEqual(res.status, 201);
      assert.ok(res.body.token);
      assert.ok(res.body.user.id);
      assert.strictEqual(res.body.user.email, 'alice@campus.edu');
      assert.strictEqual(res.body.user.role, 'student');
      studentToken = res.body.token;
      studentUserId = res.body.user.id;
    });

    test('Should reject duplicate email registrations', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Alice Duplicate', email: 'alice@campus.edu', role: 'admin' });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.error, /is already registered/);
    });

    test('Should successfully register an admin user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Bob Admin', email: 'bob@campus.edu', role: 'admin' });

      assert.strictEqual(res.status, 201);
      assert.ok(res.body.token);
      adminToken = res.body.token;
      adminUserId = res.body.user.id;
    });
  });

  describe('User Login (POST /users/login)', () => {
    test('Should fail login for unregistered email', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: 'fake@campus.edu' });

      assert.strictEqual(res.status, 404);
      assert.match(res.body.error, /is not registered/);
    });

    test('Should login registered user and return JWT', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: 'alice@campus.edu' });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.name, 'Alice Student');
    });
  });

  describe('Event Creation Constraints (POST /events)', () => {
    test('Should reject event creation if no authorization token is supplied', async () => {
      const res = await request(app)
        .post('/events')
        .send({
          title: 'Unauth Event',
          description: 'No token',
          category: 'Sports',
          venue: 'Gym',
          startTime: '2026-07-01T10:00:00Z',
          endTime: '2026-07-01T12:00:00Z',
          organizer: 'Athletics'
        });

      assert.strictEqual(res.status, 401);
      assert.match(res.body.error, /Access token is missing/);
    });

    test('Should reject event creation if user is a student', async () => {
      const res = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Attempted Event',
          description: 'No permission',
          category: 'Sports',
          venue: 'Gym',
          startTime: '2026-07-01T10:00:00Z',
          endTime: '2026-07-01T12:00:00Z',
          organizer: 'Alice'
        });

      assert.strictEqual(res.status, 403);
      assert.match(res.body.error, /Requires administrative privileges/);
    });

    test('Should reject event creation with invalid chronological date order', async () => {
      const res = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Bad Date Event',
          description: 'Ends before it starts',
          category: 'Academic',
          venue: 'Seminar Room',
          startTime: '2026-07-01T15:00:00Z',
          endTime: '2026-07-01T12:00:00Z', // 3 hours before start
          organizer: 'Academic Board'
        });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.error, /Event 'startTime' must come before/);
    });

    test('Should successfully create event when requests are valid and user is admin', async () => {
      const res = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Hackathon 2026',
          description: 'Code all night long',
          category: 'Workshop',
          venue: 'Tech Incubator',
          startTime: '2026-07-05T10:00:00Z',
          endTime: '2026-07-06T18:00:00Z',
          organizer: 'DevClub'
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.title, 'Hackathon 2026');
    });
  });

  describe('Notice Creation Constraints (POST /notices)', () => {
    test('Should reject notice if postedBy UUID does not exist', async () => {
      const res = await request(app)
        .post('/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Ghost Notice',
          content: 'No real poster',
          category: 'Academic',
          postedBy: '00000000-0000-0000-0000-000000000000'
        });

      assert.strictEqual(res.status, 400);
      assert.match(res.body.error, /User with ID .* does not exist/);
    });

    test('Should reject notice if user role is student', async () => {
      const res = await request(app)
        .post('/notices')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student notice attempt',
          content: 'I want to speak!',
          category: 'Student Activities',
          postedBy: studentUserId
        });

      assert.strictEqual(res.status, 403);
      assert.match(res.body.error, /Requires administrative privileges/);
    });

    test('Should successfully create notice when poster exists and user is admin', async () => {
      const res = await request(app)
        .post('/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Mid-Terms Canceled',
          content: 'Just kidding, study hard.',
          category: 'Academic',
          postedBy: adminUserId
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.title, 'Mid-Terms Canceled');
      assert.strictEqual(res.body.author.name, 'Bob Admin');
    });
  });

  describe('Get Lists with Pagination & Filters (GET /notices & GET /events)', () => {
    test('Should return paginated notice list', async () => {
      const res = await request(app)
        .get('/notices')
        .query({ limit: 1, offset: 0 });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.count);
      assert.strictEqual(res.body.limit, 1);
      assert.strictEqual(res.body.offset, 0);
      assert.strictEqual(res.body.results.length, 1);
      assert.strictEqual(res.body.results[0].title, 'Mid-Terms Canceled');
    });

    test('Should filter notices by category', async () => {
      const res = await request(app)
        .get('/notices')
        .query({ category: 'Academic' });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.results[0].category, 'Academic');
    });

    test('Should search events by keyword', async () => {
      const res = await request(app)
        .get('/events')
        .query({ keyword: 'hack' });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.results[0].title, 'Hackathon 2026');
    });
  });
});
