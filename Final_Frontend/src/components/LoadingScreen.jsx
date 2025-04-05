// Currently not used - in case we want to make fancier loading screen
import { Spinner } from "react-bootstrap";

export default function LoadingScreen() {
  return (
    <div className="d-flex flex-column align-items-center">
      <Spinner animation="border" variant="primary" />
      <p>Processing your donation...</p>
    </div>
  );
}
