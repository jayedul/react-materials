import React, { useContext, useRef, useState, useEffect } from "react";

import { TextField } from "./text-field/text-field.jsx";
import { __, isEmpty, sprintf } from "./helpers.jsx";
import { CoverImage } from "./image/image.jsx";
import { DropDownUnmanaged } from "./dropdown/dropdown.jsx";
import { request } from "./request.jsx";
import { ContextToast } from "./toast/toast.jsx";
import { Conditional } from "./conditional.jsx";
import { patterns } from "./data.jsx";

export function UserSearch(props) {

	const {
		onAdd, 
		exclude=[],
		placeholder,
		support_email_only=false,
		no_user_message=__('No user found!')
	} = props;

	const search_ref = useRef();
	const {ajaxToast} = useContext(ContextToast);

	const [fetching, setFetching] = useState(false);
	const [users, setUsers] = useState([]);
	const [keyWord, setKeyword] = useState('');

	const searchUsers=()=>{

		const empty_keyword = isEmpty(keyWord);

		// Clear user array if the keyword is empty
		if ( empty_keyword ) {
			setUsers([]);
			return;
		}

		const payload = {
			keyword: keyWord, 
			exclude: exclude.map(e=>e.user_id).filter(id=>!isNaN(id))
		}
		
		setFetching(true);
		request('searchUser', payload, resp=>{

			const {success, data:{users=[]}} = resp;
			
			setFetching(false);

			if ( !success ) {
				ajaxToast(resp);
				return;
			}

			setUsers(users);
		});
	}

	const addUser=(user)=>{
		onAdd(user);
		searchUsers('');
	}

	const addEmailAsGuest=()=>{
		addUser({
			attendee_name: keyWord,
			email: keyWord
		});
	}

	useEffect(()=>searchUsers(), [keyWord]);

	const renderSuggestion=()=>{

		const className = 'margin-top-6 box-shadow-thick padding-vertical-5 padding-horizontal-20 border-radius-10 bg-color-white'.classNames();
		const cssStyle = search_ref.current ? {width: search_ref.current.clientWidth+'px'} : {};

		if ( !users.length && !fetching ) {
			return isEmpty(keyWord) ? null : <div className={className} style={cssStyle}>
				<div className={'text-align-center'.classNames()}>
					{no_user_message}
				</div>
				<Conditional show={support_email_only && patterns.email.test(keyWord) && !exclude.find(e=>e.email && e.email===keyWord)}>
					<div className={'margin-top-10 cursor-pointer hover-underline'.classNames()} onClick={addEmailAsGuest}>
						{sprintf(__('Add "%s"'), keyWord)}
					</div>
				</Conditional>
			</div>
		}
		
		return <div className={className} style={cssStyle}>
			{users.map((user, index)=>{
				const {avatar_url, display_name, email, user_id} = user;
				return <div 
					key={user_id} 
					className={`d-flex align-items-center padding-vertical-10 cursor-pointer ${index<users.length-1 ? 'border-bottom-1 b-color-tertiary' : ''}`.classNames()}
					onClick={()=>addUser({...user, attendee_name: display_name})}
				>
					<div className={'margin-right-10'.classNames()}>
						<CoverImage src={avatar_url} circle={true} width={32}/>
					</div>
					<div className={'flex-1'}>
						<span className={'d-block font-size-15 font-weight-500 line-height-24 letter-spacing--15 color-text margin-bottom-2'.classNames()}>
							{display_name}
						</span>
						<span className={'d-block font-size-13 font-weight-400 line-height-24 letter-spacing--13 color-text-light'.classNames()}>
							{email}
						</span>
					</div>
				</div>
			})}
		</div>
	}

	return <DropDownUnmanaged rendered={renderSuggestion()} position="bottom left">
		<TextField 
			placeholder={placeholder}
			icon="ch-icon ch-icon-search-normal-1"
			icon_position="right"
			className={'border-1-5 border-radius-10 b-color-tertiary padding-vertical-12 padding-horizontal-20'.classNames()}
			inputClassName={'font-size-15 font-weight-400 line-height-25 color-text-light'.classNames()}
			onChange={setKeyword}
			autofocus={true}/>
	</DropDownUnmanaged>
}
