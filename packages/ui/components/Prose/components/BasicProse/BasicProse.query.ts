import { INTERNAL_LINK_QUERY } from "@/components/InternalLink/InternalLink.query";
import groq from "groq";

export const BASIC_PROSE_QUERY = groq`
  ...,
  markDefs[]{
    ...,
    ${INTERNAL_LINK_QUERY},
  },
`;
