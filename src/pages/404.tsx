import React, { FunctionComponent } from 'react';
import {Link} from "react-router-dom";

interface OwnProps {}

type Props = OwnProps;

const _404Page: FunctionComponent<Props> = (props) => {

  return (
      <div>
          <h1>Not Found</h1>
          <i>Requested url NOT found</i>
          <ul>
              <li>
                  <Link to={"/"}>Go Home</Link>
              </li>
          </ul>
      </div>
  );
};

export default _404Page;
