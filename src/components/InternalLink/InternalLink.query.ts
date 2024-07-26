import groq from "groq";

export const INTERNAL_LINK_QUERY = groq`
  _type == "InternalLink" => {
    "page": @.internalUID->,
  }
`;
