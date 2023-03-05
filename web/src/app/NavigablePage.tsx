import { MDBContainer } from 'mdb-react-ui-kit';
import Header from '../components/Header';

// eslint-disable-next-line import/prefer-default-export
export function NavigablePage({ page }: { page: JSX.Element }) {
  return (
    <>
      <Header title="Plug-It" area="Services" />
      <MDBContainer>{page}</MDBContainer>
    </>
  );
}
