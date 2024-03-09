import React from "react";

import {LoadingIcon} from './loading-icon/loading-icon.jsx';
import { __ } from "./helpers.jsx";

export function TableStat({empty, loading, message}) {
	return (!empty && !loading) ? null : <tr>
		<td colSpan="100%">
			<div className={'text-align-center padding-vertical-20'.classNames()}>
				{
					loading ? 
						<LoadingIcon show={loading} center={true}/> : 
						<strong className={'font-weight-500'.classNames()}>
							{message || __('No result!')}
						</strong>
				}
			</div>
		</td>
	</tr>
}