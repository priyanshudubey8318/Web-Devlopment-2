function App() {
  let pid = 1;

  switch (pid) {
    case 1:
      return (
        <div>
          <h1>Product Details</h1>
          <h2>Product ID: 1</h2>
          <p>Product Name: iPhone</p>
          <p>Price: ₹70,000</p>
        </div>
      );

    case 2:
      return (
        <div>
          <h1>Product Details</h1>
          <h2>Product ID: 2</h2>
          <p>Product Name: Samsung Galaxy</p>
          <p>Price: ₹60,000</p>
        </div>
      );

    case 3:
      return (
        <div>
          <h1>Product Details</h1>
          <h2>Product ID: 3</h2>
          <p>Product Name: OnePlus</p>
          <p>Price: ₹40,000</p>
        </div>
      );

    case 4:
      return (
        <div>
          <h1>Product Details</h1>
          <h2>Product ID: 4</h2>
          <p>Product Name: Google Pixel</p>
          <p>Price: ₹55,000</p>
        </div>
      );

    default:
      return (
        <div>
          <h1>Product Not Found</h1>
          <p>Invalid Product ID</p>
        </div>
      );
  }
}

export default App;