import React, { useEffect, useRef, useState } from 'react';

import { Popup } from '../popup/index.jsx';
import { __, isEmpty } from '../helpers.jsx';

import * as style from './dropdown.module.scss';

const content_style = {
    padding: '0px',
    border: 'none'
};

const list_class = 'padding-vertical-10 padding-horizontal-15 cursor-pointer font-size-15 font-weight-400 color-text-80'.classNames();

export function DropDown(props) {
    const {
        value: selected_value,
        nested = false,
        options = [],
        onChange,
        transparent,
        tabindex,
        textClassName = 'font-size-15 font-weight-400 color-text'.classNames(),
        position = 'center top',
        placeholder = __('Select'),
        addText,
        onAddClick,
		disabled,
		required=false,
        style: cssStyle={},
		showErrorsAlways=false,
		clearable=true,
        iconSizeClass = 'font-size-20'.classNames()
    } = props;

    const ref = useRef();

    const [searchState, setSearchState] = useState('');
	const [errorState, setErrorState] = useState(null);

	const highlightError=()=>{
		setErrorState(required && isEmpty(selected_value));
	}

	useEffect(()=>{
		// Do not set as true on first mount
		if ( errorState === null ) {
			setErrorState(false);
			return;
		}
		highlightError();

	}, [selected_value]);

	useEffect(()=>{
		if( showErrorsAlways ) {
			highlightError();
		}
	}, [showErrorsAlways]);

    const triggerPoint = (search = false) => {
        const _placeholder = placeholder;
        return <div
			tabIndex={tabindex}
			className={
				`select-dropdown ${transparent ? 'transparent' : ''}`.classNames(style) +
				'cursor-pointer d-flex align-items-center border-radius-10 column-gap-8'.classNames() +
				`border-1 ${!errorState ? 'b-color-text-20' : 'b-color-error'} width-p-100 d-block font-size-15 font-weight-400 line-height-25 color-text`.classNames()
			}
			style={{padding: '0 15px', height: '40px'}}
			data-cylector="trigger-point"
		>
			<div className={'flex-1 white-space-nowrap font-size-15 font-weight-400 overflow-hidden text-overflow-ellipsis'.classNames() + textClassName}>
				{
					!search ? 
						(
							selected_value !== undefined
								? options.find((o) => o.id === selected_value)?.label || _placeholder
								: _placeholder
						)
						:
						<input
							className={'text-field-flat font-size-15 font-weight-400'.classNames()}
							placeholder={__('Search..')}
							onChange={(e) => setSearchState(e.currentTarget.value)}
						/>
				}
			</div>
			<i 
				className={
					`sicon 
					${(!clearable || disabled || !selected_value) ? 'sicon-arrow-down' : 'sicon-times'} 
					${disabled ? 'color-text-40 cursor-not-allowed' : 'color-text-50'}`.classNames() +
					iconSizeClass
				}
				onClick={e=>{
					if ( clearable && selected_value ) {
						e.stopPropagation();
						onChange('');
					}
				}}></i>
		</div>
    };

    const closeDropdown = (callback) => {
        setSearchState('');

        if (callback) {
            callback();
        }
    };

    return <div ref={ref}>
		<Popup
			position={position}
			on="click"
			disabled={disabled}
			closeOnDocumentClick={true}
			mouseLeaveDelay={300}
			mouseEnterDelay={0}
			contentStyle={{ ...content_style, ...cssStyle }}
			arrow={false}
			nested={nested}
			trigger={triggerPoint()}
			onClose={() => closeDropdown()}
		>
			{(close) => {
				// Determine border width, color and radius from the class name to sync the popup accordingly
				let popup_styles = ref.current ? { minWidth: ref.current.clientWidth + 'px' } : {};

				return (
					<div
						className={
							'select-dropdown-popup'.classNames(style) +
							`box-shadow-thick border-radius-10 border-1 b-color-text-40 bg-color-white white-space-nowrap box-shadow-thin`.classNames()
						}
						style={popup_styles}
					>
						<div className={'trigger-point'.classNames(style)}>
							{triggerPoint(options.length > 8)}
						</div>
						<div className={'list-wrapper'.classNames(style)} data-cylector="options-wrapper">
							{options
								.filter(
									(o) =>
										!searchState ||
										o.label
											.toLowerCase()
											.indexOf(searchState.toLowerCase()) > -1
								)
								.map((option) => {
									let { id, label } = option;
									let classes = `list-item ${
										id == selected_value ? 'active' : ''
									}`;
									return <div
										key={id}
										data-cylector={id}
										className={classes.classNames(style) + list_class}
										onClick={() => {
											onChange(id);
											closeDropdown(close);
										}}
									>
										{label}
									</div>
								})}
						</div>

						{addText && (
							<div
								className={'add-item'.classNames(style) + list_class}
								style={{ paddingTop: '10px', paddingBottom: '10px' }}
								onClick={() => {
									closeDropdown(close);
									onAddClick();
								}}
							>
								<i
									className={'sicon sicon-add-square vertical-align-middle d-inline-block margin-right-10'.classNames()}
								></i>
								<span className={'vertical-align-middle'.classNames()}>
									{addText}
								</span>
							</div>
						)}
					</div>
				);
			}}
		</Popup>
	</div>
}

export function Options(props) {
    const {
        options,
        onClick,
        className = '',
        position = 'bottom right',
        style: cssStyle = {},
        children
    } = props;

    return (
        <Popup
            position={position}
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{ ...content_style, ...cssStyle }}
            arrow={false}
            trigger={
                <div
                    className={'d-inline-block cursor-pointer'.classNames() + className}
                >
                    {children}
                </div>
            }
        >
            {(close) => {
                return (
                    <div
                        className={
                            'options-popup'.classNames(style) +
                            'box-shadow-thick border-radius-10 border-1 b-color-text-40 bg-color-white'.classNames()
                        }
                    >
                        <div className={'list-wrapper'.classNames(style)}>
                            {options.map((option) => {
                                let { id, label, icon } = option;
                                return (
                                    <div
                                        key={id}
                                        className={
                                            'd-flex align-items-center'.classNames() +
                                            'list-item'.classNames(style) +
                                            list_class
                                        }
                                        onClick={() => {
                                            onClick(id);
                                            close();
                                        }}
                                    >
										{
											!icon ? null :
											<i
                                                className={icon + 'margin-right-10'.classNames()}
                                            ></i>
										}
										
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }}
        </Popup>
    );
}

export function DropDownUnmanaged(props) {
    const {
        className = '',
        position = 'bottom right',
        children,
        rendered,
		closeOnDocumentClick=true,
		onClose=()=>{},
        style: cssStyle = {}
    } = props;

    return <Popup
		position={position}
		closeOnDocumentClick={closeOnDocumentClick}
		onClose={onClose}
		on={[]}
		arrow={false}
		open={rendered ? true : false}
		darken={false}
		contentStyle={{ ...content_style, ...cssStyle }}
		trigger={<div className={className}>{children}</div>}
	>
		{rendered}
	</Popup>
}
