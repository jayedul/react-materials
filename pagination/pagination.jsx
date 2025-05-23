import React from 'react';
import ReactPaginate from 'react-paginate';

import * as style from './pagination.module.scss';

export function Pagination({ onChange, pageNumber = 1, pageCount = 1}) {
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        onChange((event.selected ?? 0) + 1);
    };

	if ( pageCount <= 1 ) {
		return null;
	}

	return <ReactPaginate
			previousLabel={
				<i className={'sicon sicon-arrow-left-2 font-size-24'.classNames()}></i>
			}
			nextLabel={
				<i className={'sicon sicon-arrow-right-2 font-size-24'.classNames()}></i>
			}
			breakLabel={<span>...</span>}
			containerClassName={'container'.classNames(style) + 'd-flex column-gap-10'.classNames()}
			activeClassName={'active'.classNames(style)}
			disabledClassName={'disabled'.classNames(style)}
			pageLinkClassName={'font-size-15 font-weight-700 line-height-20'.classNames()}
			onPageChange={handlePageClick}
			pageRangeDisplayed={2}
			marginPagesDisplayed={2}
			pageCount={pageCount}
			forcePage={pageNumber - 1}
			renderOnZeroPageCount={null}
		/>
}
