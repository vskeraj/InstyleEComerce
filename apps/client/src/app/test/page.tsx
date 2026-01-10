import { auth } from "@clerk/nextjs/server";

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const productResponse = await fetch("http://localhost:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const productData = await productResponse.json();
  console.log(productData);

  const ordersResponse = await fetch("http://localhost:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const ordersData = await ordersResponse.json();
  console.log(ordersData);

  const paymentResponse = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const paymentData = await paymentResponse.json();
  console.log(paymentData);

  return <div>TestPage</div>;
};

export default TestPage;
