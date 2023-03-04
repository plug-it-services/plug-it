import { MDBSpinner } from 'mdb-react-ui-kit';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center">
      <MDBSpinner role="status">
        <span className="visually-hidden">Loading...</span>
      </MDBSpinner>
    </div>
  );
}
