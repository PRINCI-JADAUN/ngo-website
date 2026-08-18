import { NavLink } from "react-router-dom";

function PageBanner({ title }) {
  return (
    <div className="page-nav no-margin row">
      <div className="container">
        <div className="row justify-content-center">
          <h2>{title}</h2>
          <ul>
            <li>
              <NavLink to="/">
                <i className="fas fa-home" /> Home
              </NavLink>
            </li>
            <li>
              <i className="fas fa-angle-double-right" />
              {title}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PageBanner;
