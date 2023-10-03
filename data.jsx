import { tz } from 'moment-timezone';
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

export const time_formats = {
    _12: __('12 Hours'),
    _24: __('24 Hours')
};

export const timezones_array = tz.names().map((z) => {
	return { id: z, label: z };
});

export const date_formats = ['DD MMM, YYYY', 'Y-MM-D', 'MM/D/Y', 'D/MM/Y'];

export const attendance_types = {
	on_site: __('On-Site'),
    remote: __('Fully Remote'),
    hybrid: __('Hybrid')
};

// Prepare country data
const _countries_array = [];
const _countries_object = {};
const A = 65;
const Z = 90;
const countryName = new Intl.DisplayNames(['en'], { type: 'region' });
for (let i = A; i <= Z; ++i) {
	for (let j = A; j <= Z; ++j) {
		let code = String.fromCharCode(i) + String.fromCharCode(j);
		let name = countryName.of(code);
		if (code !== name) {

			_countries_array.push({
				id: code,
				label: name
			});

			_countries_object[code] = name;
		}
	}
}
export const countries_array = _countries_array;
export const countries_object = _countries_object;
