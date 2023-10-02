import { __ } from "./helpers.jsx";

export const genders = {
    male: __('Male'),
    female: __('Female'),
    other: __('Other'),
    decline: __('Decline to self Identity')
};

export const statuses = {
    publish: {
        color: '#73BF45',
        label: __('Published')
    },
    draft: {
        color: '#EE940D',
        label: __('Draft')
    },
    archive: {
        color: '#BBBFC3',
        label: __('Archived')
    },
    expired: {
        color: '#FF180A',
        label: __('Expired')
    }
};

export const attachment_formats = {
    pdf: {
		label: __('PDF'),
	},
	doc: {
		label: __('DOC')
	},
	docx: {
		label: __('DOCX')
	},
    audio: {
		label: __('Audio'),
		disabled: true
	},
    video: {
		label: __('Video'),
		disabled: true
	},
    image: {
		label: __('Image'),
		disabled: true
	},
    zip: {
		label: __('ZIP'),
		disabled: true
	},
    rar: {
		label: __('RAR'),
		disabled: true
	}
};


// Do not edit or delete keys. Only can add more.
export const business_types = {
    agriculture_naturalresources: __('Agriculture & Natural Resources'),
    extraction_mining: __('Extraction & Mining'),
    energy_utilities: __('Energy & Utilities'),
    construction_infrastructure: __('Construction & Infrastructure'),
    manufacturing_production: __('Manufacturing & Production'),
    wholesale_distribution: __('Wholesale & Distribution'),
    retail_consumergoods: __('Retail & Consumer Goods'),
    transportation_logistics: __('Transportation & Logistics'),
    technology_communication: __('Technology & Communication'),
    finance_insurance: __('Finance & Insurance'),
    realestate_property: __('Real Estate & Property'),
    professionalservices: __('Professional Services'),
    healthcare_wellness: __('Healthcare & Wellness'),
    entertainment_media: __('Entertainment & Media'),
    hospitality_tourism: __('Hospitality & Tourism'),
    education_training: __('Education & Training'),
    nonprofit_socialservices: __('Non-Profit & Social Services'),
    government_publicservices: __('Government & Public Services')
};

export const date_formats = ['DD MMM, YYYY', 'Y-MM-D', 'MM/D/Y', 'D/MM/Y'];