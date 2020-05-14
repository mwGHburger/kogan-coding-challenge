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
    // Causes request to be made through a proxy
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const URL = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com";
    const callAPI = (endpoint) => {
      fetch(proxyurl + URL + endpoint)
        .then((res) => res.json())
        .then((data) => {
          data.objects.forEach((product) => {
            const { width, length, height } = product.size;
            if (product.category === "Air Conditioners") {
              // calculate cubic metres
              const cubicMetres = (width * length * height) / 100 ** 3;

              // calculate cubic weight
              const cubicWeight = cubicMetres * 250;

              // setState
              this.setState({
                totalQuantity: this.state.totalQuantity + 1,
                totalCubicWeight: this.state.totalCubicWeight + cubicWeight,
              });
            }
          });
          if (data.next) {
            callAPI(data.next);
          }
        })
        .catch((err) => console.log(err));
    };
    callAPI("/api/products/1");
  }

  render() {
    return (
      <div className="results-page">
        <div className="results-container">
          <p className="result-text">
            The <span style={{ fontWeight: "bold" }}>average cubic weight</span>{" "}
            for all products in the "
            <span style={{ fontWeight: "bold" }}>Air Conditioners</span>"
            category is...
          </p>
          <div className="result">
            {this.state.totalCubicWeight / this.state.totalQuantity
              ? `${Math.round(
                  this.state.totalCubicWeight / this.state.totalQuantity
                )}kg`
              : "loading"}
          </div>
        </div>
      </div>
    );
  }
}
