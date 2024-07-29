import React, { useEffect, useState } from 'react';

import { SortableList } from '../sortable-list.jsx';
import { __, getRandomString } from '../helpers.jsx';

import style from './list.module.scss';

const getElementId = index => `solidie-item-${index}`;

function ItemSingle({ payload, list_item, renameStage, deleteItem, updateChildren, addChild, has_sibling}) {
	
	const {
		id_key, 
		label_key, 
		onEdit,
		rename=true,
		nested=false,
		permalink_key
	} = payload;
	
	const {children=[]} = list_item;
	const item_id       = list_item[id_key];
	const item_label    = list_item[label_key];
	const permalink     = list_item[permalink_key];

    return <>
		<div
			className={
				'd-flex align-items-center column-gap-10 border-radius-10 border-1 b-color-text-30 padding-horizontal-10 padding-vertical-5'.classNames() +
				'single'.classNames(style)
			}
			onClick={e=>e.stopPropagation()}
			onMouseDown={e=>e.stopPropagation()}
		>
			<div className={'flex-1 d-flex align-items-center'.classNames()}>

				{
					!has_sibling ? null :
					<i className={'sicon sicon-drag font-size-18 color-text-50 interactive'.classNames()}></i>
				}

				<div className={'flex-1 color-text-80'.classNames()}>
					{
						!rename ? item_label : 
						<input
							id={getElementId(item_id)}
							type="text"
							value={item_label}
							disabled={!renameStage}
							className={'text-field-flat margin-left-5 color-text-80'.classNames()}
							onChange={(e) => {
								if (renameStage) {
									renameStage(item_id, e.currentTarget.value);
								}
							}}
						/>
					}
				</div>
			</div>

			<i
				className={
					'sicon sicon-trash font-size-18 color-error interactive cursor-pointer'.classNames() +
					'action-icon'.classNames(style)
				}
				title={__('Delete')}
				onClick={()=>deleteItem(item_id)}
			></i>

			{
				!onEdit ? null :
				<i
					className={
						'sicon sicon-edit-2 font-size-18 color-material interactive cursor-pointer'.classNames() +
						'action-icon'.classNames(style)
					}
					title={__('Edit')}
					onClick={() =>onEdit(list_item)}
				></i>
			}

			{
				!nested ? null :
				<i
					className={
						'sicon sicon-add-circle font-size-24 color-material interactive cursor-pointer'.classNames() +
						'action-icon'.classNames(style)
					}
					onClick={addChild}
					title={__('Add child')}
				></i>
			}

			{
				!permalink ? null :
				<a 
					href={permalink}
					target='_blank'
					title={__('Visit')}
					className={
						'sicon sicon-arrow-up-right font-size-18 color-material interactive cursor-pointer'.classNames() +
						'action-icon'.classNames(style)
					}
				></a>
			}
		</div>

		{
			!children.length ? null : 
			<ListManager 
				{...payload}
				list={children}
				onChange={list=>updateChildren(item_id, list)}
				className={'margin-left-15 margin-top-15 border-left-1 b-color-text-40'.classNames()}
				style={{paddingLeft: '15px'}}
				addButton={false}
			/>
		}
	</>
}

export function ListManager(props) {
    const {
        list,
        id_key = 'id',
        label_key = 'label',
        mode,
        className = '',
		onAdd,
        onChange,
        deleteItem,
        addText = __('Add New'),
		style: cssStyle={},
		addButton=true
    } = props;
    const is_queue = mode === 'queue';

    const [state, setState] = useState({
        last_id: null,
        exclude_focus: list.map((s) => s[id_key])
    });

    const addStage = (append_to=null) => {
		
        const id = getRandomString();

        // Keep track of last id to focus
        setState({
            ...state,
            last_id: id
        });

        // Build array
        let item = { 
			[id_key]: id, 
			[label_key]: __('Untitled')
		};

		let _list = [...list];
		if ( append_to ) {
			const index = _list.findIndex(l=>l[id_key]==append_to);
			if ( index>-1 ) {
				_list[index].children = [...(_list[index].children || []), item];
			}
		} else {
			_list = is_queue ? [...list, item] : [item, ...list];
		}

        // Send the changes to parent component
        onChange(_list);
    };

    const renameStage = (id, label) => {
        const { list = [] } = props;
        const index = list.findIndex((s) => s[id_key] == id);
        list[index][label_key] = label;

        // Send the renamed list to parent
        onChange(list);
    };

	const updateChildren=(id, children)=>{
		const {list=[]} = props;
        const index = list.findIndex((s) => s[id_key] == id);
		list[index].children = children;
		onChange(list);
	}

    const deleteInternaly = (id) => {
        const { list = [] } = props;

        if (id !== null) {
            const index = list.findIndex((s) => s[id_key] === id);
            list.splice(index, 1);
        }

        // Send the updated list to parent
        onChange(list);
    };

    useEffect(() => {
        const { last_id, exclude_focus } = state;
        if (!last_id || exclude_focus.indexOf(last_id) > -1) {
            return;
        }

        const input = document.getElementById(getElementId(last_id));

        if (input) {
            input.focus();
            input.select();

            setState({
                ...state,
                exclude_focus: [...exclude_focus, last_id]
            });
        }
    }, [list]);

    return (
        <div
            className={
                'list-manager'.classNames(style) +
                `d-flex row-gap-15 ${
                    is_queue ? 'flex-direction-column' : 'flex-direction-column-reverse'
                }`.classNames() +
                className
            }
			style={cssStyle}
        >
            <SortableList
                className={'row-gap-15'.classNames()}
                onReorder={(list) => onChange(list)}
                items={list.map((list_item) => {
                    return {
                        ...list_item,
                        id: list_item[id_key], // Just to make sure it requires ID.
                        rendered: (
                            <ItemSingle
                                {...{
                                    list_item,
									payload: props,
									has_sibling: list.length>1,
									updateChildren,
									addChild: ()=>addStage(list_item[props.id_key]),
                                    renameStage,
                                    deleteItem: deleteItem || deleteInternaly
                                }}
                            />
                        )
                    };
                })}
            />
			
			{
				!addButton ? null :
				<div
					className={
						'd-flex align-items-center darken-on-hover--8'.classNames() +
						'add-stage'.classNames(style)
					}
					data-cylector="add-list-item"
					onClick={()=>onAdd ? onAdd() : addStage()}
				>
					<i className={'sicon sicon-add-circle font-size-24'.classNames()}></i>
					<div className={'flex-1 font-size-15 font-weight-500 margin-left-10'.classNames()}>
						{addText}
					</div>
				</div>
			}
            
        </div>
    );
}
