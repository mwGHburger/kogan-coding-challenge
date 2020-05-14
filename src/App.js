// react
import React from "react";
// styles
import "./App.css";

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      totalQuantity: 0,
      totalCubicWeight: 0,
    };
  }

  componentDidMount() {
    // causes request to be made through a proxy
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const URL = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com";
    const firstEndPoint = "/api/products/1";
    const cubicWeightConversion = 250;

    const fetchPaginatedAPI = (endpoint) => {
      fetch(proxyurl + URL + endpoint)
        .then((res) => res.json())
        .then((data) => {
          data.objects.forEach((product) => {
            // destructuring assignment
            const { width, length, height } = product.size;
            if (product.category === "Air Conditioners") {
              // calculate cubic metres
              const cubicMetres = (width * length * height) / 100 ** 3;
              // calculate cubic weight
              const cubicWeight = cubicMetres * cubicWeightConversion;
              // setState
              this.setState({
                totalQuantity: this.state.totalQuantity + 1,
                totalCubicWeight: this.state.totalCubicWeight + cubicWeight,
              });
            }
          });
          // check for pagination
          if (data.next) {
            // recursion
            fetchPaginatedAPI(data.next);
          }
        })
        // error handling
        .catch((err) => console.log(`Error occurred - ${err}`));
    };
    fetchPaginatedAPI(firstEndPoint);
  }

  render() {
    const averageCubicWeight =
      this.state.totalCubicWeight / this.state.totalQuantity;

    return (
      <div className="results-page">
        <div className="results-container">
          <p className="results-text">
            The <span style={{ fontWeight: "bold" }}>average cubic weight</span>{" "}
            for all products in the "
            <span style={{ fontWeight: "bold" }}>Air Conditioners</span>"
            category is:
          </p>
          <div className="result">
            {averageCubicWeight
              ? `${Math.round(averageCubicWeight)} kg`
              : "loading..."}
          </div>
        </div>
      </div>
    );
  }
}
