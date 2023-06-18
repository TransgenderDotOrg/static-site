import * as React from "react";

export interface LinkProps {
  url: string;
  title: string;
  description: string;
};

export const Link = ({url, title, description}: LinkProps): JSX.Element => {
  return (
    <div>
      <h4>
        <a href={url}>{title}</a>
      </h4>
      {description}
      <br />
      <br />
    </div>
  );
};
