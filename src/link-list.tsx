import * as React from "react";
import { Link, LinkProps } from "./link";

export interface LinkListProps {
  links: Array<LinkProps>;
};

export const LinkList = ({ links }: LinkListProps): JSX.Element => {
  const listItems = links.map((link, index) => {
    return (
      <Link key={index} url={link.url} title={link.title} description={link.description} />
    );
  });
  return (
    <div>
      {listItems}
    </div>
  );
};
