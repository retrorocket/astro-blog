import config from "@config/config.json";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  Hits,
  UseSearchBoxProps,
} from "react-instantsearch";
import React, { useRef } from "react";
import type {
  MultipleQueriesQuery,
  MultipleQueriesResponse,
  Hit as AlgoliaHit,
} from "@algolia/client-search";

type HitProps = {
  hit: AlgoliaHit<{
    content: string;
    slug: string;
    title: string;
  }>;
};

const { summary_length } = config.settings;

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
  const parser = new DOMParser();
  return (
    <div className="card mb-12 break-words border-b border-border pb-[30px]">
      <h3 className="h4 pb-[10px]">
        <a
          href={`${hit.slug}`}
          className="block font-normal text-primary hover:underline"
        >
          {hit.title}
        </a>
      </h3>
      <p className="text-lg text-text">
        {parser.parseFromString(
          hit.content?.slice(0, Number(summary_length)),
          "text/html"
        ).documentElement.textContent + " ... "}
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
  // 参考： https://swfz.hatenablog.com/entry/2022/08/08/194100
  const timerId = useRef<ReturnType<typeof setTimeout>>();
  const queryHook: UseSearchBoxProps["queryHook"] = (query, search) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => search(query), 300);
  };

  return (
    <div>
      <InstantSearch searchClient={searchClient} indexName="blog_retrorocket">
        <SearchBox
          queryHook={queryHook}
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
          <PoweredBy className="w-[150px] pb-2" />
        </div>
      </InstantSearch>
    </div>
  );
};

export default AlgoliaSearchBox;
