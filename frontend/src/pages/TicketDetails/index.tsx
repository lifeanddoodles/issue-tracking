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
  getDeleteOptions,
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

  const [initialFormData, setInitialFormData] =
    useState<PartialDocument | null>(null);
  const [formData, setFormData] = useState<PartialDocument | null>(null);
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
      options: getDeleteOptions(),
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
      [target.name]:
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value !== "" && target.value
          ? target.value
          : null,
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
    if (ticketInfo && !loading) {
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
      setInitialFormData(formDataShape);
      setFormData(formDataShape);
    }
  }, [loading, ticketInfo]);

  useEffect(() => {
    const changes: PartialDocument = {};

    for (const key in formData) {
      if (
        initialFormData &&
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
    !loading &&
    formData && (
      <Row className="grid gap-8 grid-cols-1fr md:grid-rows-[minmax(0px,_max-content)] md:grid-cols-[1fr_1fr] lg:grid-cols-[3fr_2fr]">
        <TicketMain
          ticket={ticketInfo.ticket}
          onChange={handleChange}
          onSave={handleSave}
          errors={errors}
          setErrors={setErrors}
        />
        <TicketSidebar
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
