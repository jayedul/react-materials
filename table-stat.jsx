import React from "react";

import {LoadingIcon} from './loading-icon/loading-icon.jsx';
import { __ } from "./helpers.jsx";

export function TableStat({empty, loading, message, children}) {
	return (!empty && !loading) ? null : <tr className={'empty-state'.classNames()}>
		<td colSpan="100%">
			{
				loading ? 
				<div className={'padding-vertical-20'.classNames()}>
					<LoadingIcon show={loading} center={true}/>
				</div>
				:
				(
					children || <div className={'text-align-center padding-vertical-20'.classNames()}>
						<strong className={'font-weight-500'.classNames()}>
							{message || __('No result!')}
						</strong>
					</div>
				)
			}
		</td>
	</tr>
}