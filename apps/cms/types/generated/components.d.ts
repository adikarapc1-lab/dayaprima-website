import type { Schema, Struct } from '@strapi/strapi';

export interface ProjectFacility extends Struct.ComponentSchema {
  collectionName: 'components_project_facilities';
  info: {
    displayName: 'Facility';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectFaq extends Struct.ComponentSchema {
  collectionName: 'components_project_faqs';
  info: {
    description: 'Pertanyaan yang sering diajukan untuk perumahan ini';
    displayName: 'FAQ';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectHouseFeature extends Struct.ComponentSchema {
  collectionName: 'components_project_house_features';
  info: {
    displayName: 'House Feature';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectHouseType extends Struct.ComponentSchema {
  collectionName: 'components_project_house_types';
  info: {
    description: 'Unit type and commercial details';
    displayName: 'House Type';
  };
  attributes: {
    bathrooms: Schema.Attribute.Integer;
    bedrooms: Schema.Attribute.Integer;
    carport: Schema.Attribute.Integer;
    description: Schema.Attribute.RichText;
    features: Schema.Attribute.Component<'project.house-feature', true>;
    floorPlanImage: Schema.Attribute.Media<'images'>;
    floors: Schema.Attribute.Integer;
    gallery: Schema.Attribute.Media<'images', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'project.facility': ProjectFacility;
      'project.faq': ProjectFaq;
      'project.house-feature': ProjectHouseFeature;
      'project.house-type': ProjectHouseType;
      'shared.social-link': SharedSocialLink;
    }
  }
}
