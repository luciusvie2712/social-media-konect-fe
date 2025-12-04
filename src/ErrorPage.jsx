import { useState } from "react";
import Alert from "react-bootstrap/Alert";
const Pagebanned = () => {
  const [show, setShow] = useState(true);
  return (
    <>
      <Alert variant="danger my-5 w-50 mx-auto text-center h-40">
        <Alert.Heading style={{ fontSize: "30px" }}>403 ERROR</Alert.Heading>
        <p style={{ fontSize: "20px", fontWeight: "500" }}>
          You do not have permission to access this resource.
        </p>
        <i className="fa-solid fa-rocket" style={{ fontSize: "40px" }}></i>
      </Alert>
    </>
  );
};
export default Pagebanned;
