import { INTERNAL_LINK_QUERY } from "@/components/InternalLink/InternalLink.query";
import groq from "groq";

export const FULL_PROSE_QUERY = groq`
  ...,
  markDefs[]{
    ...,
    ${INTERNAL_LINK_QUERY},
  },
`;
