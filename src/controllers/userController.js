import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';

/**
 * Get all users.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function fetchAll(req, res, next) {
  const span = tracer.startSpan("User Controller -Fetch all",req.header);

  span.setTag("api/users", req.query);
  log.info("Controller - Fetch Started");
  try{
    const data = await userService.getAllUsers();
    log.info("On FetchAll response");
    span.finish();
    res.json({ message: data });
  }catch(err){
    log.error(err,span);
    span.finish();
    next(err);
  }
}

/**
 * Get a user by its id.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function fetchById(req, res, next) {
  try{
    const data = await userService.getUser(req.params.id);
    res.json({ message: data }); 
  }catch(err){
    next(err);
  }
}

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function create(req, res, next) {
  try{
    const data = await userService.createUser(req.body);
    res.status(HttpStatus.CREATED).json({ message: data });
  }catch(err){
    next(err);
  }

}

/**
 * Update a user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function update(req, res, next) {
  try{
     const data = await userService.updateUser(req.params.id, req.body);
     res.json({ message: data });
  }catch(err){
     next(err);
  }
}

/**
 * Delete a user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function deleteUser(req, res, next) {
  try{
     const data = await userService.deleteUser(req.params.id);
     res.status(HttpStatus.OK).json({ message: data });
  }catch(err){
     next(err);
  }
}
