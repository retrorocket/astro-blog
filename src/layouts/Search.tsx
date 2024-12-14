import config from "@config/config.json";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  Hits,
  type SearchBoxProps,
} from "react-instantsearch";
import React from "react";

const algoliaClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APPID,
  import.meta.env.PUBLIC_ALGOLIA_APIKEY,
);

const searchClient = {
  ...algoliaClient,
  search(requests: any) {
    if (requests.every(({ params }: any) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

const { summary_length } = config.settings;
const tagLength = 6;
const sliceLength = 30;

// FIXME JavaScript Client v5 対応。型の定義がおかしいので全部anyにしている
const HitCompoment = ({ hit }: any) => {
  const parser = new DOMParser();

  // ヒットしたキーワードの周辺の文字列を切り出す
  const contentStr = hit._highlightResult?.content?.value ?? "";
  const searchResult = contentStr.search(/<mark>/);
  // FIXME markタグを途中でsliceしてしまった場合は<以降を削除する。要リファクタリング
  const tempSlicedStr = contentStr
    .substring(searchResult - sliceLength)
    .slice(0, Number(summary_length) + tagLength);
  const removeTagStr = tempSlicedStr.slice(-1 * tagLength).replace(/<.*/, "");
  const slicedStr = tempSlicedStr.slice(0, -1 * tagLength) + removeTagStr;

  return (
    <div className="card mb-12 break-words border-b border-border pb-[30px] dark:border-border-dark">
      <h3 className="h4 pb-[10px]">
        <a
          href={`${hit.slug}`}
          className="block font-normal text-primary hover:underline dark:text-primary-dark"
        >
          {[
            ...parser.parseFromString(
              hit._highlightResult?.title?.value ?? "",
              "text/html",
            ).body.childNodes,
          ].map((child, i) => {
            if (child.nodeName.toLowerCase() === "mark")
              return (
                <mark
                  className="bg-primary bg-opacity-20 text-primary dark:text-primary-dark"
                  key={i}
                >
                  {child.textContent}
                </mark>
              );
            return <React.Fragment key={i}>{child.textContent}</React.Fragment>;
          })}
        </a>
      </h3>
      <p className="text-lg text-text dark:text-text-dark">
        {searchResult >= 1 && <>... </>}
        {[
          ...parser.parseFromString(slicedStr, "text/html").body.childNodes,
        ].map((child, i) => {
          if (child.nodeName.toLowerCase() === "mark")
            return (
              <mark
                className="bg-primary bg-opacity-20 text-text dark:text-text-dark"
                key={i}
              >
                {child.textContent}
              </mark>
            );
          return <React.Fragment key={i}>{child.textContent}</React.Fragment>;
        })}
        <> ...</>
      </p>
      <a
        className="mt-3 inline-block border-b border-primary py-1 text-[15px] leading-[22px] text-primary dark:border-primary-dark dark:text-primary-dark"
        href={`${hit.slug}`}
      >
        <span className="sr-only">この記事の</span>続きを読む
      </a>
    </div>
  );
};

// https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/react/#turn-off-search-as-you-type
// https://www.algolia.com/doc/api-reference/widgets/search-box/react/#widget-param-queryhook
let timerId: number;

const queryHook: SearchBoxProps["queryHook"] = (query, search) => {
  if (timerId) {
    window.clearTimeout(timerId);
  }
  timerId = window.setTimeout(() => search(query), 500);
};

const AlgoliaSearchBox = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="blog_retrorocket"
      stalledSearchDelay={10}
    >
      <div className="form-input mb-[30px] flex items-center justify-between align-middle">
        <SearchBox
          queryHook={queryHook}
          placeholder="Search"
          autoFocus
          classNames={{
            root: "w-full items-center align-middle justify-between",
            input:
              "w-[calc(100%-30px)] border-none focus:ring-transparent dark:bg-black",
            submit: "hidden",
            reset: "hidden",
            submitIcon: "hidden",
            resetIcon: "hidden",
            loadingIndicator: "w-[30px]",
            loadingIcon: "inline-block mx-1 mb-1 w-[20px] h-[20px]",
          }}
          translations={{
            submitButtonTitle: "",
            resetButtonTitle: "",
          }}
        />
        <PoweredBy
          classNames={{
            root: "w-[150px] mx-3",
          }}
        />
      </div>
      <div>
        <Hits hitComponent={HitCompoment} />
      </div>
    </InstantSearch>
  );
};

export default AlgoliaSearchBox;
