const CategoryModel = require("../models/category");
const Locals = (req, res, next) => {
    CategoryModel.find({is_nav:1}).sort({sort:'desc'}).then(doc=>{
        res.locals.category_List = doc;
        res.locals.error = req.flash('error');
        res.locals.loginUser = req.session.loginUser;
        next();
    });
}
module.exports = Locals;