module.exports = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAdvisor = req.user ? req.user.isAdvisor : false;
    res.locals.isStudent = req.user ? req.user.isStudent : false;
    next();
}