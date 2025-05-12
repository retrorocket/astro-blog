const Button = ({
  href,
  rel,
  title,
}: {
  href: string;
  rel?: string;
  title: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel={`noopener noreferrer ${
        rel ? (rel === "follow" ? "" : rel) : "nofollow"
      }`}
      className={`btn btn-primary border-primary me-4 mb-4 h-auto hover:text-white hover:no-underline`}
    >
      {title}
    </a>
  );
};

export default Button;
