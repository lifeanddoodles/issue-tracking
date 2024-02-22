import { ObjectId } from "mongoose";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  DepartmentTeam,
  ICommentPopulatedDocument,
  IPersonInfo,
  ITicketPopulatedDocument,
  Priority,
  Status,
  TicketType,
} from "../../../../../../shared/interfaces";
import Heading from "../../../../components/Heading";
import TicketComments from "../../../../components/TicketComments";
import TicketMain from "../../../../components/TicketMain";
import TicketSidebar from "../../../../components/TicketSidebar";
import useForm from "../../../../hooks/useForm";
import useValidation from "../../../../hooks/useValidation";
import Row from "../../../../layout/Row";
import { TICKETS_BASE_API_URL } from "../../../../routes";
import { objValuesAreFalsy, traverseAndUpdateObject } from "../../../../utils";

type TicketFormData = Partial<ITicketPopulatedDocument>;

type TicketDetailsResponse = {
  ticket: ITicketPopulatedDocument;
  comments: ICommentPopulatedDocument[];
};

const TicketDetails = () => {
  const params = useParams();
  const ticketId = params.ticketId;
  const { validateField } = useValidation();
  const formShape: TicketFormData = useMemo(
    () => ({
      title: "",
      description: "",
      attachments: [],
      assignee: "" as (string | ObjectId | Record<string, unknown>) &
        IPersonInfo,
      reporter: "" as (string | ObjectId | Record<string, unknown>) &
        IPersonInfo,
      status: "" as Status,
      priority: "" as Priority,
      assignToTeam: "" as DepartmentTeam,
      ticketType: "" as TicketType,
      estimatedTime: "" as unknown as number,
      deadline: "",
      isSubtask: "" as unknown as boolean,
      parentTask: "" as unknown as ObjectId | Record<string, unknown>,
    }),
    []
  );
  const {
    setObjectShape,
    formData,
    setFormData,
    errors,
    setErrors,
    changedFormData,
    data: ticketInfo,
    loading,
    error,
    requestGetResource,
    requestUpdateResource,
    requestDeleteResource,
  } = useForm({});

  const objShape = useMemo(
    () =>
      traverseAndUpdateObject<
        typeof formShape,
        Partial<ITicketPopulatedDocument>
      >(formShape, (ticketInfo as TicketDetailsResponse)?.ticket),
    [ticketInfo, formShape]
  );

  const formDataShape = useMemo(
    () => (objValuesAreFalsy(objShape) ? null : objShape),
    [objShape]
  );

  const getTicketInfo = useCallback(async () => {
    await requestGetResource({
      url: `${TICKETS_BASE_API_URL}/${ticketId}`,
    });
  }, [ticketId, requestGetResource]);

  const handleChange = useCallback(
    (
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
    },
    [formData, setErrors, setFormData, validateField]
  );

  const handleSave = useCallback(async () => {
    await requestUpdateResource({
      url: `${TICKETS_BASE_API_URL}/${ticketId}`,
      body: changedFormData,
    });
    getTicketInfo();
  }, [changedFormData, getTicketInfo, requestUpdateResource, ticketId]);

  const handleDelete = useCallback(async () => {
    await requestDeleteResource({
      url: `${TICKETS_BASE_API_URL}/${ticketId}`,
    });
  }, [requestDeleteResource, ticketId]);

  useEffect(() => {
    if (formDataShape && formDataShape !== null) {
      setObjectShape(formDataShape);
    }
  }, [formDataShape, setObjectShape]);

  useEffect(() => {
    const fetchData = async () => {
      await getTicketInfo();
    };

    fetchData();
  }, [getTicketInfo]);

  if (loading) {
    return <Heading text="Loading..." level={1} role="status" />;
  }

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  if (!ticketInfo) {
    return <Heading text="Ticket not found" level={1} role="status" />;
  }

  return (
    ticketInfo !== null &&
    formData && (
      <Row className="grid gap-8 grid-cols-1fr md:grid-rows-[minmax(0px,_max-content)] md:grid-cols-[1fr_1fr] lg:grid-cols-[3fr_2fr]">
        <TicketMain
          ticket={(ticketInfo as TicketDetailsResponse).ticket}
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
        <TicketComments
          comments={(ticketInfo as TicketDetailsResponse).comments}
        />
      </Row>
    )
  );
};

export default TicketDetails;
