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

export interface ProjectHouseType extends Struct.ComponentSchema {
  collectionName: 'components_project_house_types';
  info: {
    description: 'Unit type and commercial details';
    displayName: 'House Type';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.String & Schema.Attribute.Required;
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
      'project.house-type': ProjectHouseType;
      'shared.social-link': SharedSocialLink;
    }
  }
}
