import React, { FunctionComponent } from 'react';
import {Link} from "react-router-dom";

interface OwnProps {}

type Props = OwnProps;

const HomePage: FunctionComponent<Props> = (props) => {

  return (
      <div>
          <h1>React Image File Input Compression</h1>
          <ul>
              <li>
                  <Link to={"native"}>Native</Link>
              </li>
          </ul>
      </div>
  );
};

export default HomePage;
