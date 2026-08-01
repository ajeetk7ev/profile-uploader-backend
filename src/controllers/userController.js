import * as userService from '../services/userService.js';

/**
 * Get all users
 * GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * GET /api/users/:id
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: `User with ID ${req.params.id} not found` },
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a user
 * POST /api/users
 */
export const createUser = async (req, res, next) => {
  try {
    const existing = await userService.getUserByEmail(req.body.email);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'A user with this email address already exists.' },
      });
    }

    const newUser = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await userService.getUserById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: `User with ID ${id} not found` },
      });
    }

    // Check duplicate email
    const emailCheck = await userService.getUserByEmail(req.body.email, id);
    if (emailCheck) {
      return res.status(400).json({
        success: false,
        error: { message: 'Another user is already using this email address.' },
      });
    }

    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: { message: `User with ID ${id} not found` },
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile deleted successfully',
      data: { id: parseInt(id, 10) },
    });
  } catch (error) {
    next(error);
  }
};
