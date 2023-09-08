import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ICommentPopulatedDocument,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import TicketMain from "../../components/TicketMain";
import TicketSidebar from "../../components/TicketSidebar";
import { getTicketInfo } from "../../routes";

const TicketDetails = () => {
  const [loading, setLoading] = useState(true);
  const [ticketInfo, setTicketInfo] = useState<{
    ticket: ITicketPopulatedDocument;
    comments: ICommentPopulatedDocument[];
  } | null>(null);
  const params = useParams();
  const ticketId = params.ticketId;

  useEffect(() => {
    getTicketInfo(ticketId!).then((data) => {
      setTicketInfo(data);
      setLoading(false);
    });
  }, [ticketId]);

  if (loading) {
    return <h1 role="status">Loading...</h1>;
  }

  if (!ticketInfo) {
    return <h1 role="status">Ticket not found</h1>;
  }

  return (
    ticketInfo &&
    !loading && (
      <>
        <TicketMain ticket={ticketInfo.ticket} comments={ticketInfo.comments} />
        <TicketSidebar ticket={ticketInfo.ticket} />
      </>
    )
  );
};

export default TicketDetails;
