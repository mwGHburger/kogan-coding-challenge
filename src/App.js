import React from "react";

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      totalQuantity: 0,
      totalCubicWeight: 0,
    };
  }

  componentDidMount() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const URL = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com";
    // let endpoint = "/api/products/1";

    // fetch(proxyurl + URL + endpoint)
    //   .then((res) => res.json())
    //   .then((data) => console.log(data.objects));

    const callAPI = (endpoint) => {
      fetch(proxyurl + URL + endpoint)
        .then((res) => res.json())
        .then((data) => {
          data.objects.forEach((product) => {
            const { width, length, height } = product.size;
            if (product.category === "Air Conditioners") {
              // calculate cubic metres
              const cubicMetres = (width * length * height) / 100 ** 3;
              console.log("cubicMetres");
              console.log(cubicMetres);
              // calculate cubic weight
              const cubicWeight = cubicMetres * 250;
              console.log("cubicWeight");
              console.log(cubicWeight);
              // setState
              this.setState({
                totalQuantity: this.state.totalQuantity + 1,
                totalCubicWeight: this.state.totalCubicWeight + cubicWeight,
              });
              console.log(this.state);
            }
          });

          if (data.next) {
            console.log(data.next);
            callAPI(data.next);
            console.log("final");
            console.log(this.state);
          }
        });
    };
    callAPI("/api/products/1");
  }

  render() {
    return <div>APP</div>;
  }
}
