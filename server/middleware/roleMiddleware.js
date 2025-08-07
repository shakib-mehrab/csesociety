const asyncHandler = require('express-async-handler');

// This is a placeholder for role-specific logic if needed beyond authorizeRoles
const roleMiddleware = asyncHandler(async (req, res, next) => {
    // Example: You might have more complex role-based logic here
    console.log(`User role: ${req.user.role}`);
    next();
});

module.exports = roleMiddleware;
