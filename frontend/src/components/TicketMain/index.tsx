import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ICommentPopulatedDocument,
  ITicket,
} from "../../../../shared/interfaces";
import Comment from "../Comment";

interface ITicketMainProps {
  ticket: ITicket & { _id: string };
  comments: ICommentPopulatedDocument[];
}

const TicketMain = ({ ticket, comments }: ITicketMainProps) => {
  const [loading, setLoading] = useState(false);
  const [formattedComments, setFormattedComments] = useState<
    | {
        comment: ICommentPopulatedDocument;
      }[]
    | []
  >([]);

  const noComments = useMemo(
    () => formattedComments?.length === 0,
    [formattedComments]
  );

  const handleAddComment = () => {
    console.log("Add Comment");
  };

  const loadFormattedComments = useCallback(async () => {
    if (!comments || comments.length === 0) return;
    const newComments = comments.map((comment) => ({
      comment,
    }));

    setFormattedComments(newComments);
    setLoading(false);
  }, [comments]);

  useEffect(() => {
    loadFormattedComments();
  }, [loadFormattedComments]);

  return (
    <>
      <main>
        <h1>{ticket.title}</h1>
        <h2>Description</h2>
        <p>{ticket.description}</p>
        {/* TODO: Add attachments
        {<h2>Attachments</h2>} */}
        {/* TODO: Populate subtasks
        {<h2>Subtasks</h2>} */}
      </main>
      <aside>
        <h2>Comments</h2>
        {noComments ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {!loading &&
              formattedComments.map((item) => (
                <Comment
                  key={
                    typeof item.comment._id === "string"
                      ? item.comment._id
                      : item.comment._id.toString()
                  }
                  comment={item.comment}
                />
              ))}
          </ul>
        )}
        <div>
          <button onClick={handleAddComment}>Add comment</button>
        </div>
      </aside>
    </>
  );
};

export default TicketMain;
