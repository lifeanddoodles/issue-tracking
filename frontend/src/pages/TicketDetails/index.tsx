import TicketMain from "frontend/src/components/TicketMain";
import TicketSidebar from "frontend/src/components/TicketSidebar";
import { Priority, Status } from "shared/interfaces";

const ticketInfo = {
  ticket: {
    _id: "64eec35406a517b31fb7f010",
    title: "Fix broken links in documentation",
    description:
      "Several links in the documentation are broken. Update the links to the correct URLs.",
    assignee: {
      _id: "64eda7140a3e527cbe48b45c",
      firstName: "Jason",
      lastName: "Schultz",
    },
    reporter: {
      _id: "64edaaac9225a02d87486654",
      firstName: "Keith",
      lastName: "Gottlieb",
    },
    status: Status.IN_PROGRESS,
    priority: Priority.LOW,
    moveToDevSprint: true,
    isSubtask: false,
    parentTask: null,
    deadline: "2023-08-30T04:19:32.405Z",
    createdAt: "2023-08-30T04:19:32.405Z",
    lastModifiedAt: "2023-08-30T04:19:32.405Z",
  },
  comments: [
    {
      _id: "64f11434f13bd520d237f15d",
      author: {
        _id: "64edaaac9225a02d87486654",
        firstName: "Keith",
        lastName: "Gottlieb",
      },
      message: "Got it, thanks for the update!",
      ticketId: "64eec35406a517b31fb7f010",
      isEdited: false,
    },
    {
      _id: "64f11407a934f6fa8160d5fb",
      author: {
        _id: "64eda7140a3e527cbe48b45c",
        firstName: "Jason",
        lastName: "Schultz",
      },
      message: "Update: Links fixed, will deploy soon.",
      ticketId: "64eec35406a517b31fb7f010",
      isEdited: false,
    },
  ],
};

const TicketDetails = () => {
  return (
    <>
      <TicketMain ticket={ticketInfo.ticket} comments={ticketInfo.comments} />
      <TicketSidebar ticket={ticketInfo.ticket} />
    </>
  );
};

export default TicketDetails;
