import React, { useContext, useRef, useState, useEffect } from "react";

import { TextField } from "./text-field/text-field.jsx";
import { __, isEmpty, sprintf } from "./helpers.jsx";
import { CoverImage } from "./image/image.jsx";
import { DropDownUnmanaged } from "./dropdown/dropdown.jsx";
import { request } from "./request.jsx";
import { ContextToast } from "./toast/toast.jsx";
import { Conditional } from "./conditional.jsx";
import { LoadingIcon } from "./loading-icon/loading-icon.jsx";

export function InstantSearch(props) {

	const {
		onAdd, 
		exclude=[],
		placeholder,
		support_pattern=null,
		no_result_message=__('No result!')
	} = props;

	const search_ref = useRef();
	const {ajaxToast} = useContext(ContextToast);

	const [fetching, setFetching] = useState(false);
	const [results, setResults] = useState([]);
	const [keyWord, setKeyword] = useState('');

	const searchResults=()=>{

		const empty_keyword = isEmpty(keyWord);

		// Clear results array if the keyword is empty
		if ( empty_keyword ) {
			setResults([]);
			return;
		}

		setFetching(true);
		request('instantSearch', {args: {...props.args, keyword: keyWord}}, resp=>{

			const {success, data:{results=[]}} = resp;
			
			setFetching(false);

			if ( !success ) {
				ajaxToast(resp);
				return;
			}

			setResults(results);
		});
	}

	const dispatchResult=(result)=>{
		onAdd(result);
		setKeyword('');
	}

	const addPatternSupported=()=>{
		dispatchResult({
			label: keyWord,
			unique_name: keyWord
		});
	}

	useEffect(()=>searchResults(), [keyWord]);

	const renderSuggestion=()=>{

		const className = 'margin-top-6 padding-vertical-5 padding-horizontal-20 border-radius-10 bg-color-white'.classNames();
		const cssStyle = search_ref.current ? {width: search_ref.current.clientWidth+'px'} : {};
		cssStyle.boxShadow = '0px 3px 20px 7px rgba(16, 39, 68, 0.1)';

		if ( fetching && keyWord !== '' ) {
			return <div className={className} style={cssStyle}>
				<div className={'text-align-center padding-vertical-10'.classNames()}>
					<LoadingIcon show={true}/>
				</div>
			</div>

		} else if ( !fetching && keyWord !== '' ) {
			return !results.length ? <div className={className} style={cssStyle}>
				<div className={'text-align-center padding-vertical-10'.classNames()}>
					{no_result_message}
				</div>
				<Conditional show={support_pattern && support_pattern.test(keyWord) && exclude.indexOf(keyWord)===-1}>
					<div className={'margin-top-10 cursor-pointer hover-underline'.classNames()} onClick={addPatternSupported}>
						{sprintf(__('Add "%s"'), keyWord)}
					</div>
				</Conditional>
			</div> 
			:
			<div className={className} style={cssStyle}>
				{results.map((result, index)=>{
					const {thumbnail_url, label, unique_name, id} = result;
					return <div 
						key={id} 
						className={`d-flex align-items-center padding-vertical-10 cursor-pointer ${index<results.length-1 ? 'border-bottom-1 b-color-text-40' : ''}`.classNames()}
						onClick={()=>dispatchResult({...result})}
					>
						{
							!thumbnail_url ? null :
							<div className={'margin-right-10'.classNames()}>
								<CoverImage src={thumbnail_url} circle={true} width={32}/>
							</div>
						}
						
						<div className={'flex-1'.classNames()}>
							<span className={'d-block font-size-15 font-weight-500 line-height-24 letter-spacing--15 color-text margin-bottom-2'.classNames()}>
								{label}
							</span>
							{
								!unique_name ? null :
								<span className={'d-block font-size-13 font-weight-400 line-height-24 letter-spacing--13 color-text-50'.classNames()}>
									{unique_name}
								</span>
							}
							
						</div>
					</div>
				})}
			</div>
			
		} else {
			return null;
		}
	}

	return <DropDownUnmanaged 
		onClose={()=>setKeyword('')}
		rendered={renderSuggestion()} 
		position="bottom left"
	>
		<div ref={search_ref}>
			<TextField 
				placeholder={placeholder}
				iconClass={'sicon sicon-search-normal-1'.classNames()}
				icon_position="right"
				className={'border-1 border-radius-10 b-color-text-40 padding-vertical-12 padding-horizontal-20'.classNames()}
				inputClassName={'font-size-15 font-weight-400 line-height-25 color-text-50'.classNames()}
				onChange={txt => setKeyword((txt || '').trim())}
				autofocus={true}/>
		</div>
	</DropDownUnmanaged>
}
