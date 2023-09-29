import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ICommentPopulatedDocument,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import TicketComments from "../../components/TicketComments";
import TicketMain from "../../components/TicketMain";
import TicketSidebar from "../../components/TicketSidebar";
import useFetch from "../../hooks/useFetch";
import useValidation from "../../hooks/useValidation";
import Row from "../../layout/Row";
import {
  TICKETS_BASE_API_URL,
  getDeleteTicketOptions,
  getPostTicketOptions,
} from "../../routes";

type PartialDocument = Partial<ITicketPopulatedDocument>;

const TicketDetails = () => {
  const params = useParams();
  const ticketId = params.ticketId;
  const {
    data: ticketInfo,
    loading,
    error,
    sendRequest,
  } = useFetch<{
    ticket: ITicketPopulatedDocument;
    comments: ICommentPopulatedDocument[];
  } | null>();

  const formDataShape: PartialDocument = {
    title: ticketInfo?.ticket?.title,
    description: ticketInfo?.ticket?.description,
    attachments: ticketInfo?.ticket?.attachments,
    assignee: ticketInfo?.ticket?.assignee,
    reporter: ticketInfo?.ticket?.reporter,
    status: ticketInfo?.ticket?.status,
    priority: ticketInfo?.ticket?.priority,
    assignToTeam: ticketInfo?.ticket?.assignToTeam,
    ticketType: ticketInfo?.ticket?.ticketType,
    estimatedTime: ticketInfo?.ticket?.estimatedTime,
    deadline: ticketInfo?.ticket?.deadline,
    isSubtask: ticketInfo?.ticket?.isSubtask,
    parentTask: ticketInfo?.ticket?.parentTask,
  };
  const [initialFormData] = useState<PartialDocument>(formDataShape);
  const [formData, setFormData] = useState<PartialDocument>(formDataShape);
  const [changedFormData, setChangedFormData] = useState<PartialDocument>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();

  const getTicketInfo = useCallback(() => {
    sendRequest({ url: `${TICKETS_BASE_API_URL}/${ticketId}` });
  }, [ticketId, sendRequest]);

  const requestDelete = () => {
    sendRequest({
      url: `${TICKETS_BASE_API_URL}/${ticketId}`,
      options: getDeleteTicketOptions(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    setFormData({
      ...formData!,
      [target.name]: target.value,
    });

    validateField({
      target,
      setErrors,
    });
  };

  const handleSave = async () => {
    const options = getPostTicketOptions(changedFormData);
    await sendRequest({ url: `${TICKETS_BASE_API_URL}/${ticketId}`, options });
    getTicketInfo();
  };

  const handleDelete = () => {
    requestDelete();
  };

  useEffect(() => getTicketInfo(), [getTicketInfo]);

  useEffect(() => {
    const changes: PartialDocument = {};

    for (const key in formData) {
      if (
        formData[key as keyof ITicketPopulatedDocument] !==
        initialFormData[key as keyof ITicketPopulatedDocument]
      ) {
        changes[key as keyof ITicketPopulatedDocument] =
          formData[key as keyof ITicketPopulatedDocument];
      }
    }
    setChangedFormData(changes);
  }, [formData, initialFormData]);

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
      <Row className="grid gap-8 grid-cols-1fr md:grid-cols-[2fr_minmax(max-content,_1fr)]">
        <TicketMain
          ticket={ticketInfo.ticket}
          onChange={handleChange}
          onSave={handleSave}
          errors={errors}
          setErrors={setErrors}
        />
        <TicketSidebar
          ticket={ticketInfo.ticket}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onDelete={handleDelete}
          errors={errors}
          setErrors={setErrors}
        />
        <TicketComments comments={ticketInfo.comments} />
      </Row>
    )
  );
};

export default TicketDetails;
