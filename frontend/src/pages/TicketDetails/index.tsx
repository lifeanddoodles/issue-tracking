import { useParams } from "react-router-dom";
import {
  ICommentPopulatedDocument,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import TicketComments from "../../components/TicketComments";
import TicketMain from "../../components/TicketMain";
import TicketSidebar from "../../components/TicketSidebar";
import useFetch from "../../hooks/useFetch";
import Row from "../../layout/Row";
import { TICKETS_BASE_API_URL } from "../../routes";

const TicketDetails = () => {
  const params = useParams();
  const ticketId = params.ticketId;
  const {
    data: ticketInfo,
    loading,
    error,
  } = useFetch<{
    ticket: ITicketPopulatedDocument;
    comments: ICommentPopulatedDocument[];
  } | null>({ url: `${TICKETS_BASE_API_URL}/${ticketId}` });

  if (loading) {
    return <h1 role="status">Loading...</h1>;
  }

  if (error) {
    return <h1 role="status">{error.message}</h1>;
  }

  if (!ticketInfo) {
    return <h1 role="status">Ticket not found</h1>;
  }

  return (
    ticketInfo &&
    !loading && (
      <Row className="grid gap-8 grid-cols-[1fr_minmax(max-content,_24rem)]">
        <TicketMain ticket={ticketInfo.ticket} />
        <TicketSidebar ticket={ticketInfo.ticket} />
        <TicketComments comments={ticketInfo.comments} />
      </Row>
    )
  );
};

export default TicketDetails;
