import { useState } from "react";
import { clsx } from "clsx";

const Accordion = ({
  title,
  children,
  className,
}: {
  title: string;
  children: any;
  className?: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={clsx(
        "border",
        "border-border",
        "dark:border-border-dark",
        className,
      )}
    >
      <button
        className="bg-theme-light text-dark dark:bg-theme-dark dark:text-light relative block w-full cursor-pointer px-4 py-3 text-left"
        onClick={() => setShow(!show)}
      >
        {title}
        <svg
          className={clsx(
            "absolute",
            "right-4",
            "top-1/2",
            "m-0",
            "h-4",
            "w-4",
            "-translate-y-1/2",
            show && "rotate-180",
          )}
          x="0px"
          y="0px"
          viewBox="0 0 512.011 512.011"
          xmlSpace="preserve"
        >
          <path
            fill="currentColor"
            d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
          />
        </svg>
      </button>
      <div className={clsx("px-4", "py-3", !show && "hidden")}>{children}</div>
    </div>
  );
};

export default Accordion;
