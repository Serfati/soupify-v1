function Paginator(data, page, limit) {

    let page_num = page || 1,
        per_page = limit || 5,
        offset = (page - 1) * per_page,
        paginatedData = data.slice(offset).slice(0, per_page),
        total_pages = Math.ceil(data.length / per_page);

    return {
        Pagination: {
            page: page_num,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page_num) ? page_num + 1 : null,
            total: data.length,
            total_pages: total_pages
        },
        data: paginatedData
    };
}

module.exports = Paginator