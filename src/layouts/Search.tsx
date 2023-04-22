import config from "@config/config.json";
const { summary_length } = config.settings;
import type {
  MultipleQueriesQuery,
  MultipleQueriesResponse,
} from "@algolia/client-search";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  Hits,
} from "react-instantsearch-hooks-web";
import type { SearchClient, Hit as AlgoliaHit } from "instantsearch.js";
import { plainify } from "@lib/utils/textConverter";

type HitProps = {
  hit: AlgoliaHit<{
    excerpt: string;
    slug: string;
    title: string;
  }>;
};

const algoliaClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APPID,
  import.meta.env.PUBLIC_ALGOLIA_APIKEY
);

const searchClient: SearchClient = {
  ...algoliaClient,
  search: <SearchResponse,>(requests: Readonly<MultipleQueriesQuery[]>) => {
    if (
      requests.every(({ params }) => !params?.query || params?.query.length < 2)
    ) {
      return Promise.resolve<MultipleQueriesResponse<SearchResponse>>({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: true,
          query: "",
          params: "",
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

const HitCompoment = ({ hit }: HitProps) => {
  return (
    <div className="card mb-12 border-b border-border pb-[30px]">
      <h3 className="h4 pb-[10px]">
        <a
          href={`${hit.slug}`}
          className="block font-normal text-primary hover:underline"
        >
          {hit.title}
        </a>
      </h3>
      <p className="text-lg text-text">
        {plainify(hit.excerpt?.slice(0, Number(summary_length)))}
      </p>
      <a
        className="mt-3 inline-block border-b border-primary py-1 text-[15px] leading-[22px] text-primary"
        href={`${hit.slug}`}
      >
        Read More
      </a>
    </div>
  );
};

const AlgoliaSearchBox = () => {
  return (
    <div className="min-h-[45vh]">
      <InstantSearch searchClient={searchClient} indexName="Pages">
        <SearchBox
          placeholder="Search"
          autoFocus
          classNames={{
            root: "pb-[30px]",
            input: "form-input w-full",
            submit: "hidden",
            reset: "hidden",
            loadingIndicator: "hidden",
            submitIcon: "hidden",
            resetIcon: "hidden",
            loadingIcon: "hidden",
          }}
          translations={{
            submitButtonTitle: "",
            resetButtonTitle: "",
          }}
        />
        <Hits hitComponent={HitCompoment} />
        <div className="flex flex-row justify-end">
          <PoweredBy className="w-[150px] pt-3" />
        </div>
      </InstantSearch>
    </div>
  );
};

export default AlgoliaSearchBox;
