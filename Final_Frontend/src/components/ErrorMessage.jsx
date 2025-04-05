// Currently not used - in case we want to make fancier error message
import { Alert } from "react-bootstrap";

export default function ErrorMessage({ message }) {
  return <Alert variant="danger" className="text-center">{message}</Alert>;
}
