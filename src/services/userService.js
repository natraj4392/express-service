import Boom from 'boom';
import db from '../models/user';
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';
import * as api from '../utils/api';
import url from '../config/apiUrl';

/**
 * Get all users.
 *
 * @param {Object} parentSpan
 * @returns {Promise}
 */
export async function getAllUsers(parentSpan) {
  const span = tracer.startSpan("User service -Fetch all",parentSpan);
  // Bussiness Logic
  // Calling external system 
  //const response=await api.request("GET",url().getData)
  const data= new db('User').getAll();
  // -----------

  span.setTag("service-user-fetchall");
  log.info("Service - Fetch Started");
  span.finish();
  
  return data;
}

/**
 * Get a user.
 *
 * @param   {Number|String}  id
 * @returns {Promise}
 */
export async function getUser(id) {
  const user = new db('User').getUser(id)

  if (!user) {
      throw Boom.notFound('User not found');
  }
  return user;
}

/**
 * Create new user.
 *
 * @param   {Object}  user
 * @returns {Promise}
 */
export async function createUser(user) {
  return new db('User').create(user)
}

/**
 * Update a user.
 *
 * @param   {Number|String}  id
 * @param   {Object}         user
 * @returns {Promise}
 */
export async function updateUser(id, user) {
  return new db('User').update(id, user)
}

/**
 * Delete a user.
 *
 * @param   {Number|String}  id
 * @returns {Promise}
 */
export async function deleteUser(id) {
  return new db('User').delete(id)
}
