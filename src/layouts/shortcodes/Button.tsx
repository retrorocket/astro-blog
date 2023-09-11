const Button = ({
  href,
  style,
  rel,
  title,
}: {
  href: string;
  style?: string;
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
      className={`btn mb-4 me-4 h-auto ${
        style === "outline" ? "btn-outline-primary" : "btn-primary"
      } border-primary hover:text-white hover:no-underline`}
    >
      {title}
    </a>
  );
};

export default Button;
