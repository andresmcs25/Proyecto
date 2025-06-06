export const renderIngresos = async (req, res) => {
    const userId = req.session.userId;


    res.render("ingresos", {
        pageTitle: "Ingresos - NeoPOS",
        user: req.session.user, 
        activeMenu: { ingresos: true }
    });
};