module.exports = (req, res, next) => {
    if (req.user.userType !== "eabdb") {
        req.session.redirectTo = req.url;
        return res.redirect('/dashboard');
    }
    next();
}