exports.getManageProductCategoriesPage = (req, res) => {
    const settings = res.locals.settings;
    const title = 'MANAGE PRODUCT CATEGORIE - ' + settings.text_footer;
    const your_page = 'Manage_Product_Categories';
    const error = req.flash('error');
    const success = req.flash('success');
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const countQuery = `
        SELECT COUNT(*) as total
        FROM Categories
        WHERE 
            cat_id LIKE ? 
            OR cat_name_main LIKE ? 
            OR cat_name_sub LIKE ?
    `;

    const dataQuery = `
        SELECT 
            cat_id, 
            cat_name_main,
            cat_name_sub
        FROM 
            Categories 
        WHERE
            cat_id LIKE ?
            OR cat_name_main LIKE ?
            OR cat_name_sub LIKE ?
        ORDER BY 
            cat_name_main ASC,
            time_order DESC
        LIMIT ? OFFSET ?
    `;

    const searchQuery = `%${search}%`;

    db.query(countQuery, [searchQuery, searchQuery, searchQuery], (err, countResult) => {
        if (err) {
            console.error('Error executing data query:', err);
            res.redirect('/');
            return;
        } else {
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            db.query(dataQuery, [searchQuery, searchQuery, searchQuery, limit, offset], (err, result) => {
                if (err) {
                    res.redirect('/');
                } else {
                    res.render('Role/Cashier/Manage_Product_Categories', {
                        title, 
                        your_page,
                        error: error[0], 
                        success: success[0],
                        product_cats: result,
                        currentPage: page,
                        totalRecords,
                        totalPages,
                        search
                    });
                }
            });
        }
    });
};